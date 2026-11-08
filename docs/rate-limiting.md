# Audify Resource Protection & Rate Limiting Architecture

Audify combines local-first browser audio computing with server-side API protection. This document details our defense-in-depth resource protection, rate limiting policies, and operational boundaries.

---

## 1. Architectural Model & Scope

| Vector | Environment | Mechanism | Default Quota | Rationale |
|---|---|---|---|---|
| **Contact Dispatch API** (`/api/contact`) | Next.js Server (Edge / Node) | Sliding-window IP bucket + `Retry-After` header | 5 requests / 10 minutes | Protects outbound developer inbox and server execution against bot floods. |
| **Client Form Submissions** | Browser Runtime | Client sliding-window limiter | 3 dispatches / 5 minutes | Prevents accidental double-submits or impatient repeated clicking before network completes. |
| **Audio File Ingestion** | Browser Runtime | MIME type check + strict size boundary | 10 MB per audio file | Audio files are decoded in-memory via `OfflineAudioContext`. Unbounded files risk browser tab OOM crashes, especially on iOS Safari. |
| **DSP Render Job Concurrency** | Browser Runtime | Atomic `renderInProgress` lock + task cancellation | 1 active render job | Prevents thread pool exhaustion and Web Audio memory buffer overlap during complex convolution rendering. |
| **Slider & Control Automation** | Browser Runtime | Reactive Zustand parameter updates (no network overhead) | Unlimited local FPS | Real-time parameter changes (gain, EQ, wet/dry) automate directly on local `AudioParam` nodes without server hops. |

---

## 2. Server-Side Protection (`/api/contact`)

### 2.1 Implementation Details
- **Endpoint:** `POST /api/contact`
- **Location:** `src/app/api/contact/route.ts`
- **Client IP Resolution:** Evaluates `x-forwarded-for` (first hop), falling back to `x-real-ip` and local loopback.
- **Sliding Window:**
  - Window size: 600,000 ms (10 minutes).
  - Maximum requests per window: 5 requests.
  - Exceeding the quota yields:
    - **HTTP Status:** `429 Too Many Requests`
    - **Header:** `Retry-After: <seconds_until_earliest_slot_frees>`
    - **Header:** `X-RateLimit-Limit: 5`
    - **Header:** `X-RateLimit-Remaining: 0`
    - **JSON Body:** `{ "error": "Too Many Requests", "message": "Dispatch rate limit exceeded..." }`

### 2.2 Payload Validation & Timeouts
- Strict schema validation enforced via **Zod**:
  - `name`: 2–80 characters, trimmed, stripped of illegal control characters.
  - `email`: RFC-compliant email, maximum 120 characters.
  - `topic`: Strict enum check (`"Bug Report / Issue"`, `"Audio DSP / Quality Feedback"`, `"New Preset Request"`, `"Browser Compatibility"`, `"Artist / Music Partnership (Xpert Melody)"`, `"General Inquiry"`).
  - `message`: 10–3000 characters.
  - `audioFormat`: Optional string, max 30 characters.
- Any request with invalid schema immediately terminates with `400 Bad Request` and structured field-level errors without triggering backend processing.

### 2.3 Rate Limiting Architecture & Serverless Boundaries
- The current implementation in `src/app/api/contact/route.ts` employs a **pure in-memory sliding-window bucket** (`ipBucketMap`) with automatic 60-second periodic stale eviction.
- **Operational Boundary:** In multi-instance or serverless environments (such as Vercel Serverless Functions), each function isolate maintains its own local in-memory bucket. While this effectively mitigates rapid single-host hammering and burst spam, limits are not shared across separate serverless instances without an external centralized key-value store. Maintainers requiring strict cross-instance quotas can wire `@upstash/ratelimit` into the endpoint.

---

## 3. Client-Side DSP Resource Safeguards

Because Audify processes audio 100% locally on the user's CPU, the client protection strategy focuses on memory constraints, audio thread safety, and thread starvation:

### 3.1 10 MB Ingestion Ceiling
- Decoded 32-bit floating point PCM audio consumes substantial memory:
  $$\text{Memory} = \text{Sample Rate} \times \text{Channels} \times 4\text{ bytes/sample} \times \text{Duration (seconds)}$$
  A 5-minute stereo track at 48 kHz consumes:
  $$48000 \times 2 \times 4 \times 300 = 115,200,000\text{ bytes} \approx 115.2\text{ MB RAM}$$
- Allowing multi-hundred megabyte uncompressed files in browser tabs leads to device slowdowns or mobile WebKit process termination. Audify enforces a hard 10 MB compressed file boundary on drop/upload, rejecting oversized inputs immediately.

### 3.2 Single Concurrent Render Pipeline
- Located in `src/lib/rate-limiter.ts` (`dspRenderLimiter`).
- Active render jobs require exclusivity. While a 32-bit float offline render or MP3 encoding run is in progress:
  - Export buttons display loading indicators and are disabled.
  - Premature duplicate exports are rejected with immediate user-facing notifications.
  - Pre-existing render jobs are cancelled cleanly if a new file is ingested.

### 3.3 Memory Reclamation
- All intermediate `AudioBuffer` and impulse response objects generated during offline rendering are unreferenced immediately after WAV/MP3 Blob serialization.
- Object URLs generated for audio preview downloads (`URL.createObjectURL`) are managed and revoked upon track replacement to eliminate memory leaks.
