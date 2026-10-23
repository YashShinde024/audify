# Audify — Professional In-Browser Audio DSP Workstation

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black.svg?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-138%20Passing-emerald.svg)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Audify by Nyxen × Xpert Melody**  
> Tagline: *Sound, reimagined.*  
> Developed by **Nyxen** · Music Partner: [**Xpert Melody**](https://www.youtube.com/@xpertmelody)  
> Production Platform: [https://audify.vercel.app](https://audify.vercel.app)

Audify is a high-performance, local-first browser audio workstation. It delivers 38 studio-grade DSP audio presets, parametric EQ, convolution reverb synthesis, real-time waveform visualization, BPM autocorrelation, and multi-format export (WAV 16/24/32-bit float, AIFF, and MP3 320kbps)—**all executed 100% inside your client browser with zero cloud file uploads**.

---

## Key Features

- **Local-First DSP Architecture:** Zero server file uploads. All decoding, biquad filtering, convolution reverb, and encoding run directly in browser memory using Web Audio API and `OfflineAudioContext`.
- **38 Studio-Grade Presets:**
  - *Trending & Spatial:* Slowed + Reverb, Nightcore, Daycore, 8D Audio (binaural orbital panning), Lo-Fi Tape saturation, 432 Hz historical Verdi tuning.
  - *Bass & Dynamics:* 4 calibrated tiers (Light +3.5dB, Moderate +7dB, Heavy +10.5dB, Extreme +15dB) with dynamic digital headroom management.
  - *Acoustic Rooms:* Bathroom, Small Room, Medium Room, Large Hall, Church Hall, Cathedral, Vocal Plate.
  - *Mixing & Mastering:* 3-band parametric EQ, Treble Air, Stereo Widener (Mid/Side matrix), Slapback Echo, Ping-Pong Delay, Telephone Bandpass, Underwater Filter, Vocal Clarity, De-Harsh, Sample-Peak Normalizer.
- **Precision Trimming & Slicing:** Interactive visual timeline with millisecond trimming and automatic 5ms edge anti-click fades.
- **Look-Ahead Sample-Peak Limiter:** Built-in sliding-window sample-peak limiter with look-ahead buffer ensuring a strict −0.3 dBFS ceiling to prevent sample clipping.
- **Live Reactive Visuals:** Single coordinated HTML5 Canvas harmonic wave field (`SonicCanvas`) reading genuine frequency data directly from Web Audio `AnalyserNode`, with dynamic `prefers-reduced-motion` compliance.
- **Calm, Editorial Workstation Aesthetic:** Restrained violet accent (`#8E7CC3`), deep matte canvas (`#111016`), structured surfaces (`#1B1A20` / `#292830`), crisp text contrast (WCAG AA/AAA compliant), and zero excessive neon glow washes.
- **Hardened Dispatch Endpoint:** Safe client IP resolution against proxy spoofing, 64 KB request size limits, honeypot spam protection, privacy-preserving logging, and honest delivery state reporting.

---

## Technology Stack & Architecture

- **Framework:** Next.js 16 (App Router with Turbopack)
- **UI & State:** React 19, Tailwind CSS v4, Zustand v5, Radix UI Primitives, Phosphor Icons
- **Animation:** Motion & HTML5 2D Canvas with single coordinated render loops
- **Audio Processing:** Native W3C Web Audio API (`AudioContext`, `OfflineAudioContext`, `BiquadFilterNode`, `ConvolverNode`, `StereoPannerNode`, `WaveShaperNode`)
- **Encoders:** Custom lossless binary RIFF WAV (16/24/32-bit float) & AIFF writers, `lamejs` MP3 (128/192/320kbps CBR) encoder
- **Validation & Security:** Zod schema validation, sliding-window rate limiting, honeypot spam traps
- **Testing:** Vitest v3 with comprehensive audio buffer, DSP math, and security test suites

### Folder Structure
```
src/
├── app/                      # App router pages, layouts, error boundaries, and API routes
│   ├── api/contact/route.ts  # Hardened contact dispatch endpoint with rate limiter & honeypot
│   ├── blog/                 # 38 in-depth educational preset engineering guides
│   ├── studio/               # Interactive Studio workstation
│   ├── layout.tsx            # Root layout with theme script injection
│   └── globals.css           # Design tokens, @theme inline, and utility classes
├── components/
│   ├── layout/               # Header, Footer, Logo, ThemeProvider, SidebarContext
│   ├── marketing/            # Hero, SonicCanvas, MacProcessWindow, FAQ, ContactForm
│   ├── editor/               # Studio rack, waveform visualizer, parameter controls, export
│   └── ui/                   # Accessible button, slider, switch, tabs, accordion primitives
├── config/                   # Site metadata, presets registry, effects registry
├── lib/
│   ├── audio-engine.ts       # Audio rendering, offline graph pipeline, file encoders
│   └── audio/                # dsp-plan, dsp-utils, and test suites
├── stores/                   # editor-store (Zustand client state)
docs/                         # Architecture, competitor benchmarks, preset inventory, SEO, rate limiting
scripts/                      # verify-audio.ts validation harness
```

---

## Prerequisites & Installation

### Prerequisites
- Node.js 18.17+ or 20+
- npm 9+ or pnpm 8+

### Installation
```bash
# Clone the repository
git clone https://github.com/YashShinde024/audify.git
cd audify

# Install dependencies
npm install
```

---

## Development, Testing & Build Commands

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Run all test suites (Vitest - 11 test files, 138 tests)
npm test

# Run TypeScript type check
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Run DSP & audio mathematical verification script
npx tsx scripts/verify-audio.ts

# Run Next.js production build
npm run build

# Start production server
npm start
```

---

## Environment Variables & Deployment Configuration

Create a `.env.local` file for production configuration:

```bash
# Production Site URL
NEXT_PUBLIC_SITE_URL=https://audify.vercel.app

# Optional Contact Delivery Provider (Resend API)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=team@nyxen.in
CONTACT_FROM_EMAIL=Audify Contact <onboarding@resend.dev>

# Optional Contact Webhook Destination
CONTACT_WEBHOOK_URL=https://your-webhook-endpoint.com/api/contact

# Optional Distributed Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxx
```

> **Note on Contact Delivery Honesty:** When no external delivery provider (`RESEND_API_KEY` or `CONTACT_WEBHOOK_URL`) is configured, the `/api/contact` endpoint responds honestly with `delivered: false, simulated: true` to prevent misleading users into believing emails were dispatched when running in standalone mode.

---

## Audio-Processing Design & Boundaries

### In-Memory Web Audio Pipeline
1. Ingested audio files (`.mp3`, `.wav`, `.flac`, `.aac`, `.m4a`, `.ogg`) are decoded into standard linear 32-bit float PCM buffers via `AudioContext.decodeAudioData()`.
2. Edits and parameter adjustments configure an immutable `DSPPlan` node topology.
3. Live playback streams through real-time nodes with 15ms exponential parameter smoothing.
4. Export renders via `OfflineAudioContext`, guaranteeing bit-exact deterministic outputs faster than real-time playback.

### Architectural Limitations & Disclosures
- **File Size Ceiling (10 MB):** To prevent mobile browser tab out-of-memory (OOM) crashes, ingestion is limited to 10 MB per file.
- **Varispeed vs Pitch-Preserving Resampling:** Audify explicitly couples pitch with tempo for natural vinyl/tape realism (Slowed, Nightcore, 432Hz). It does not use phase vocoders that introduce metallic comb-filtering artifacts.
- **Sample-Peak Limiting vs ITU-R BS.1770 LUFS:** Audify implements a true look-ahead sample-peak limiter with a −0.3 dBFS ceiling. It measures instantaneous sample peaks rather than oversampled inter-sample peaks (True Peak) or integrated LUFS loudness.
- **Noise Cleanup:** Audify's `noise-reducer` and `rumble-cut` presets utilize 80Hz/120Hz highpass filters for handling stage rumble and mic thumps. It does not claim general broadband spectral AI voice isolation.

---

## Privacy Guarantee

Audify is architected with a strict zero-server privacy contract:
- **Zero Cloud Storage:** Audio buffers reside solely within your browser tab's RAM sandbox.
- **Zero Audio Fingerprinting:** No audio files or telemetry are recorded, uploaded, or transmitted.
- **Client Preference Storage:** Local storage keys (`audify-theme`, `audify-sidebar-docked`, `audify-cookie-consent`) store only UI preferences and contain zero personally identifiable information (PII).

---

## Attribution & Music Partner

- **Product:** Audify
- **Tagline:** Sound, reimagined.
- **Creator & Lead Engineer:** [Nyxen](https://nyxen.in) (`hello@nyxen.in`)
- **Music Partner:** [Xpert Melody](https://www.youtube.com/@xpertmelody)

---

## License

This project is licensed under the [MIT License](LICENSE).
