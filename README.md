# Audify — Professional In-Browser Audio DSP Workstation

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black.svg?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-196%20Passing-emerald.svg)](https://vitest.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Audify by Nyxen × Xpert Melody**  
> Tagline: *Sound, reimagined.*  
> Developed by **Nyxen** (`hello@nyxen.in`) · Music Partner: [**Xpert Melody**](https://www.youtube.com/@xpertmelody)  
> Canonical Production Platform: [**https://audify.nyxen.in**](https://audify.nyxen.in)

Audify is a high-performance, local-first in-browser audio digital signal processing (DSP) workstation. It provides **62 studio-grade audio modules** (43 creative presets and 19 audio utilities), **15 standalone task-oriented audio tools**, parametric EQ, convolution reverb synthesis, real-time waveform visualization, BPM autocorrelation, and multi-format binary export (lossless WAV 16/24/32-bit float, broadcast AIFF, and MP3 up to 320 kbps)—**executed 100% inside your client browser with zero cloud file uploads**.

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture & Processing Model](#architecture--processing-model)
- [Supported Formats & Encoders](#supported-formats--encoders)
- [Technology Stack](#technology-stack)
- [Prerequisites & Installation](#prerequisites--installation)
- [Commands & Quality Assurance](#commands--quality-assurance)
- [Environment Configuration](#environment-configuration)
- [Documentation Index](#documentation-index)
- [Privacy & Security Guarantee](#privacy--security-guarantee)
- [Attribution & Credits](#attribution--credits)
- [License](#license)

---

## Key Features

- **100% Client-Side DSP Architecture:** Zero server file uploads. All decoding, biquad filtering, convolution reverb synthesis, and binary encoding run directly in browser memory using the W3C Web Audio API and `OfflineAudioContext`.
- **62 Studio-Grade Audio Modules:**
  - *Trending & Spatial:* Slowed + Reverb, Nightcore, Daycore, 8D Audio (sinusoidal orbital panning), Lo-Fi Tape saturation, 432 Hz sacred Verdi tuning.
  - *Bass & Dynamics:* 4 calibrated tiers (Light +3.5 dB, Moderate +7.0 dB, Heavy +10.5 dB, Extreme +15.0 dB) with dynamic digital headroom protection and pre-limiter trim staging.
  - *Acoustic Rooms & Halls:* Bathroom, Small Room, Medium Room, Large Hall, Church Hall, Cathedral, Vocal Plate.
  - *Mixing & Mastering:* 3-band parametric EQ, Treble Air, Balanced Stereo Widener (Haas effect with energy normalization), Slapback Echo, Ping-Pong Delay, Telephone Bandpass, Underwater Filter, Vocal Clarity, De-Harsh, Sample-Peak Normalizer.
- **Deterministic Export Filename Standardization:** All generated audio files follow the strict global naming pattern `Audify-{edit-type}-{song-name}.{extension}` (e.g. `Audify-Slowed-Reverb-Song.wav`, `Audify-Audio-Splitter-Track-Part-01.wav`) with sanitization and prefix deduplication.
- **15 Standalone Task-Oriented Audio Tools (`/tools/[slug]`):**
  - Audio Merger & Joiner (multi-track sequential stitching with custom silence gaps and automatic sample rate alignment)
  - Audio Splitter (parts-based and fixed-interval audio partitioner)
  - Audio Trimmer & Cutter (millisecond-accurate cropping with 5ms anti-click crossfades)
  - Audio Normalizer (peak and EBU R128 loudness normalization)
  - Sample Rate Converter (windowed-sinc resampling between 22.05, 32.0, 44.1, and 48.0 kHz)
  - Audio Metadata & Diagnostic Analyzer (sample rate, channel layout, peak amplitude, and RMS metrics with JSON export)
  - BPM Detector, Pitch Shifter, Tempo Changer, Vocal Remover, Audio Reverser, Volume Changer, Compressor, Fade In/Out, and Format Converter.
- **Look-Ahead Soft-Knee Peak Limiter:** Built-in sliding-window limiter enforcing a strict **−0.3 dBFS ceiling**, preventing sample clipping and inter-sample overshoot even under extreme EQ boosts.
- **Audition Deck with Dry/Wet A/B Comparison:** Instant toggling between the dry source audio and the wet mastered output without resetting playhead position.
- **Live Reactive Visuals:** Single coordinated HTML5 Canvas harmonic wave field reading genuine frequency data directly from Web Audio `AnalyserNode`, fully compliant with `prefers-reduced-motion`.
- **Quartz & Sonic Workstation Aesthetic:** Refined light mode (Quartz `#F8F7F5`) and dark mode (Sonic `#111016`) with high-contrast typography, rotating conic-gradient buttons (`.btn-gradient-primary`), and mobile-first responsive layout (verified from 320px to 1440px+).

---

## Architecture & Processing Model

Audify uses a local-first memory pipeline:

```text
[Audio File (MP3/WAV/FLAC/AAC)]
            │
            ▼
[decodeAudioData() -> 32-bit Float PCM Buffer in RAM]
            │
            ├─► [Real-Time Preview: AudioContext Graph -> AnalyserNode -> Output]
            │
            └─► [Offline Render: OfflineAudioContext -> DSPPlan -> Soft-Knee Limiter]
                        │
                        ▼
            [Binary Encoders: WAV (16/24/32-bit) / AIFF / MP3 (lamejs)]
                        │
                        ▼
            [Blob / Revocable Object URL -> Instant User Download]
```

### Architectural Limits & Disclosures
- **10 MB Memory Ceiling:** Ingestion is bounded to 10 MB per file (`siteConfig.maxFileSizeBytes`) to protect against browser tab Out-of-Memory (OOM) crashes on mobile devices.
- **Varispeed Coupling:** Pitch and playback speed are mathematically coupled (Varispeed) for pristine vinyl/tape realism without the phase-smearing artifacts introduced by time-domain phase vocoders.
- **Sample-Peak Limiting:** Limiting measures instantaneous sample peaks with a −0.3 dBFS ceiling rather than oversampled inter-sample true peaks (ITU-R BS.1770).

---

## Supported Formats & Encoders

| Format | Type | Specifications | Support |
| :--- | :--- | :--- | :---: |
| **WAV** | Lossless PCM | 16-bit Integer, 24-bit Integer, 32-bit Float (IEEE 754) | Export & Import |
| **AIFF** | Lossless PCM | 16-bit Integer, 24-bit Integer, 32-bit Float (Big-Endian) | Export & Import |
| **MP3** | Compressed MPEG | CBR 128 kbps, 192 kbps, 320 kbps (via `lamejs`) | Export & Import |
| **FLAC** | Lossless Compressed | Decompressed to 32-bit Float PCM | Import Only |
| **AAC / M4A / OGG** | Compressed Audio | Decompressed to 32-bit Float PCM | Import Only |

---

## Technology Stack

- **Framework:** Next.js 16.4.2 (App Router with Turbopack)
- **UI & State:** React 19.3, Tailwind CSS v4, Zustand v5, Radix UI Primitives, Phosphor Icons
- **Animation:** Motion & HTML5 2D Canvas with single coordinated render loops
- **Audio Processing:** Native W3C Web Audio API (`AudioContext`, `OfflineAudioContext`, `BiquadFilterNode`, `ConvolverNode`, `StereoPannerNode`, `WaveShaperNode`)
- **Encoders:** Custom lossless binary RIFF WAV & AIFF writers, `lamejs` MP3 CBR encoder
- **Validation & Security:** Zod schema validation, sliding-window rate limiting, honeypot bot traps
- **Testing:** Vitest v3.2.7 with 16 comprehensive test suites (196 tests)

---

## Prerequisites & Installation

### Prerequisites
- **Node.js:** `v20.x` or `v22.x` (LTS recommended)
- **npm:** `v9+` or `v10+`
- **Git**

### Installation
```bash
# Clone repository
git clone https://github.com/YashShinde024/audify.git
cd audify

# Install dependencies
npm install

# Copy environment template (optional)
cp .env.example .env.local
```

---

## Commands & Quality Assurance

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Run full Vitest test suite (16 suites, 196 tests)
npm test

# Run audio DSP & mathematical verification script
npx tsx scripts/verify-audio.ts

# Run TypeScript type check
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Build production bundle with Next.js Turbopack
npm run build

# Start local production preview
npm start
```

---

## Environment Configuration

Audify does not require any environment variables for local development or for running the browser DSP audio workstation. Optional external integrations can be configured in `.env.local`:

```bash
# Canonical Site URL (Used for SEO, OpenGraph metadata, and sitemaps)
NEXT_PUBLIC_SITE_URL=https://audify.nyxen.in

# Optional Contact Delivery Provider (Resend API)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=hello@nyxen.in
CONTACT_FROM_EMAIL=Audify Contact <onboarding@resend.dev>

# Optional Webhook Destination for Contact Submissions
CONTACT_WEBHOOK_URL=https://your-webhook-endpoint.com/api/contact
```

*Note: When no external email provider is configured, `/api/contact` safely logs submissions to stdout without PII and returns `{ delivered: false, simulated: true }`.*

---

## Documentation Index

Comprehensive technical documentation is maintained in the [`docs/`](./docs/README.md) directory:

- [**Documentation Hub**](./docs/README.md)
- [**Getting Started & Onboarding**](./docs/getting-started.md)
- [**System Architecture & Web Audio Pipeline**](./docs/architecture.md)
- [**Project Structure & Directory Map**](./docs/project-structure.md)
- [**Configuration & Environment Variables**](./docs/configuration.md)
- [**Routing, Pages & API Reference**](./docs/routing-and-pages.md)
- **Features:**
  - [Studio Workstation](./docs/features/studio.md)
  - [Presets & Effects Taxonomy](./docs/features/presets-and-effects.md)
  - [Audio Processing & DSP Architecture](./docs/features/audio-processing.md)
  - [Audio Encoders & Export](./docs/features/audio-encoders-and-export.md)
  - [Standalone Audio Tools](./docs/features/tools.md)
- **Development & QA:**
  - [Coding Conventions](./docs/development/coding-conventions.md)
  - [Testing Guide](./docs/development/testing.md)
  - [Troubleshooting](./docs/development/troubleshooting.md)
  - [Performance & Memory Budgets](./docs/development/performance.md)
- **Design & UX:**
  - [Design System: Quartz & Sonic](./docs/design/design-system.md)
  - [Responsive Design Standards](./docs/design/responsive-design.md)
  - [Accessibility Standards](./docs/design/accessibility.md)
- [**Deployment & Production Readiness**](./docs/deployment.md)
- [**Privacy & Security Model**](./docs/privacy-and-security.md)
- [**Architectural Decision Records (ADRs)**](./docs/decisions/README.md)
- [**Contribution Guidelines**](./CONTRIBUTING.md)
- [**Security Policy**](./SECURITY.md)

---

## Privacy & Security Guarantee

Audify is architected with a strict zero-server privacy contract:
- **Zero Cloud Storage:** Audio buffers reside solely within your browser tab's RAM sandbox.
- **Zero Audio Fingerprinting:** No audio files or telemetry are recorded, uploaded, or transmitted.
- **Client Preference Storage:** Local storage keys (`audify-theme`, `audify-cookie-consent`, `audify-custom-presets-v1`) store only non-sensitive UI preferences.
- **Endpoint Protection:** The `/api/contact` route enforces a 64 KB payload cap, sliding-window rate limiting (5 req / 10 min), and honeypot anti-spam traps.

---

## Attribution & Credits

- **Product:** Audify
- **Tagline:** Sound, reimagined.
- **Creator & Lead Architect:** [**Nyxen**](https://nyxen.in) (`hello@nyxen.in`)
- **Music Partner & Acoustic Curator:** [**Xpert Melody**](https://www.youtube.com/@xpertmelody)
- **Canonical Website:** [https://audify.nyxen.in](https://audify.nyxen.in)

---

## License

This project is licensed under the [MIT License](LICENSE).
