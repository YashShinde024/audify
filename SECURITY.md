# Security Policy

## Security & Privacy Overview

**Audify** is designed from the ground up as a **zero-server, local-first audio digital signal processing (DSP) platform**. 

Because audio files are processed directly inside your browser's Web Audio sandbox using `OfflineAudioContext`, no audio files, sample buffers, or acoustic fingerprints are ever transmitted to or stored on any server.

---

## Supported Versions

Security updates and patches are actively applied to the latest release on the `main` branch.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

We take the security and integrity of Audify and our users seriously. If you discover a potential vulnerability, security defect, or privacy concern, please report it responsibly:

1. **Email:** Send details to **`hello@nyxen.in`** with the subject `[Security Vulnerability] Audify`.
2. **Details to include:**
   - Description of the vulnerability and its potential impact.
   - Exact steps or minimal proof-of-concept to reproduce the behavior.
   - Affected browser(s), operating system, and Node.js version (if server-side).
   - Any proposed remediation or mitigation.
3. **Response time:** We will acknowledge receipt of your report within 48 hours and provide a timeline for triage and resolution.
4. **Public disclosure:** Please refrain from publicly disclosing or discussing the issue until a patch has been published and confirmed.

---

## Threat Model & Inherent Protections

### 1. In-Browser Audio Sandbox
- Audio buffers (`AudioBuffer`) reside solely within client tab volatile memory (RAM).
- Revocable Object URLs (`URL.createObjectURL` / `URL.revokeObjectURL`) are strictly used for audio previews and downloads, preventing memory leaks and cross-origin access.
- Ingestion ceiling is set to **10 MB** to protect against browser tab Out-of-Memory (OOM) crashes and DoS vulnerabilities on mobile devices.

### 2. Contact Endpoint Hardening (`/api/contact`)
- **Strict Size Bounds:** Incoming payloads are capped at 64 KB before JSON parsing.
- **Client IP Resolution:** Client IPs are resolved via trusted edge headers (`CF-Connecting-IP`, `X-Vercel-Forwarded-For`, `X-Real-IP`) to prevent proxy header spoofing.
- **Sliding-Window Rate Limiting:** Enforces a maximum of 5 requests per 10-minute window per IP.
- **Honeypot Anti-Spam:** An invisible field catches automated bot submissions and drops them silently.
- **Zero Telemetry / PII Leakage:** Log outputs mask client IPs (`192.168.*.*`) and omit names, message content, and email addresses from server stdout.

### 3. Client Storage Security
- Client storage (`localStorage`) is restricted strictly to non-sensitive UI configuration:
  - `audify-theme`: theme preference (`"dark"` or `"light"`).
  - `audify-cookie-consent`: GDPR privacy preference (`"all"`, `"reject"`, or granular JSON).
  - `audify-custom-presets-v1`: user-created DSP slider configurations.
- No access tokens, session identifiers, passwords, or PII are stored in client storage.
