# Audify — Professional In-Browser Audio DSP Workstation

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black.svg?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-Vitest%20Passing-emerald.svg)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Audify by Nyxen × Xpert Melody**  
> Developed by **Nyxen** · Music Partner: [**Xpert Melody**](https://www.youtube.com/@xpertmelody)  
> Production Platform: [https://audify.vercel.app](https://audify.vercel.app)

Audify is a high-performance, local-first browser audio workstation. It delivers 38 studio-grade DSP audio presets, parametric EQ, convolution reverb synthesis, real-time waveform visualization, BPM autocorrelation, and multi-format export (WAV 16/24/32-bit, AIFF, and MP3 320kbps)—**all executed 100% inside your client browser with zero cloud file uploads**.

---

## Key Features

- **Local-First DSP Architecture:** Zero server file uploads. All decoding, biquad filtering, convolution reverb, and encoding run directly in browser memory using Web Audio API and `OfflineAudioContext`.
- **38 Studio-Grade Presets:**
  - *Trending & Spatial:* Slowed + Reverb, Nightcore, Daycore, 8D Audio (orbital panning), Lo-Fi Tape saturation, 432 Hz historical tuning.
  - *Bass & Dynamics:* 4 calibrated tiers (Light +3.5dB, Moderate +7dB, Heavy +10.5dB, Extreme +15dB) with dynamic digital headroom management.
  - *Acoustic Rooms:* Bathroom, Small Room, Medium Room, Large Hall, Church Hall, Cathedral, Vocal Plate.
  - *Mixing & Mastering:* 3-band parametric EQ, Treble Air, Stereo Widener (Mid/Side matrix), Slapback Echo, Ping-Pong Delay, Telephone Bandpass, Underwater Filter, Vocal Clarity, De-Harsh, Sample-Peak Normalizer.
- **Precision Trimming & Slicing:** Interactive visual timeline with millisecond trimming and automatic 5ms edge anti-click fades.
- **Look-Ahead True Peak Limiter:** Built-in sliding-window sample limiter ensuring a strict −0.3 dBFS ceiling to prevent inter-sample overs.
- **Live Reactive Visuals:** HTML5 Canvas harmonic wave field (`SonicCanvas`) responsive to pointer motion and Web Audio analyzer frequency data, with reduced-motion static fallbacks.
- **Accessible Design System:** Porcelain & pitch-black aesthetics with metallic wire crimson accent (`#e60026` / `#ff2a4b`), WCAG AAA high-contrast buttons, minimum 44px mobile touch targets, and full keyboard navigation.
- **Defense-in-Depth Protection:** In-memory sliding-window rate limiting on the `/api/contact` dispatch endpoint (HTTP 429) and concurrency locks on client render jobs.

---

## Technology Stack & Architecture

- **Framework:** Next.js 16 (App Router with Turbopack)
- **UI & State:** React 19, Tailwind CSS v4, Zustand v5, Radix UI Primitives, Lucide / Phosphor Icons
- **Animation:** Motion (Framer Motion v14) & HTML5 2D Canvas
- **Audio Processing:** Native W3C Web Audio API (`AudioContext`, `OfflineAudioContext`, `BiquadFilterNode`, `ConvolverNode`, `StereoPannerNode`, `WaveShaperNode`)
- **Encoders:** Custom lossless binary RIFF WAV & AIFF writers, `lamejs` MP3 320kbps CBR encoder
- **Validation & Rate Limiting:** Zod v4, custom server-side sliding-window IP limiter
- **Testing:** Vitest v3 with comprehensive audio buffer and DSP math test suites

### Folder Structure
```
src/
├── app/                      # App router pages, layouts, error boundaries, and API routes
│   ├── api/contact/route.ts  # Protected server API endpoint with sliding-window rate limiter
│   ├── blog/                 # 38 in-depth educational preset engineering guides
│   ├── studio/               # Interactive Studio workspace
│   ├── layout.tsx            # Root layout with theme script injection
│   └── globals.css           # Design tokens, @theme inline, and utility classes
├── components/
│   ├── layout/               # Header, Footer, Logo, ThemeProvider, SidebarContext
│   ├── marketing/            # Hero, SonicCanvas, MacProcessWindow, FAQ, ContactForm
│   ├── editor/               # Studio rack, waveform visualizer, parameter controls, export
│   └── ui/                   # Accessible button, slider, switch, tabs, accordion primitives
├── config/                   # Site metadata, presets registry, effects registry
├── features/audio/           # Extracted modular audio domain:
│   ├── engine/               # audio-engine, dsp-plan, dsp-utils
│   ├── codecs/               # encoders (WAV, AIFF, MP3)
│   └── presets/              # presets and effects definitions
├── stores/                   # editor-store (Zustand client state)
└── types/                    # Shared TypeScript interfaces
docs/                         # Architecture, competitor benchmarks, preset inventory, SEO, rate limiting
tests/                        # Vitest unit and integration test suites
```

---

## Prerequisites & Installation

### Prerequisites
- Node.js 18.17+ or 20+
- npm 9+ or pnpm 8+

### Installation
```bash
# Clone the repository
git clone https://github.com/YashShinde024/svaraya.git
cd svaraya

# Install dependencies
npm install
```

---

## Development, Testing & Build Commands

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Run all test suites (Vitest)
npm test

# Run TypeScript type check
npx tsc --noEmit

# Run Next.js production build
npm run build

# Start production server
npm start

# Run ESLint validation
npm run lint
```

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
- **Peak Limiting vs LUFS Loudness:** Audify implements a true look-ahead sample-peak limiter with a −0.3 dBFS ceiling. It does not perform multi-band compression or ITU-R BS.1770 integrated LUFS loudness matching.
- **Noise Cleanup:** Audify's `noise-reducer` and `rumble-cut` presets utilize 80Hz/120Hz highpass filters for handling noise and stage rumble. It does not claim general broadband spectral AI voice isolation.

---

## Privacy Guarantee

Audify is architected with a strict zero-server privacy contract:
- **Zero Cloud Storage:** Audio buffers reside solely within your browser tab's RAM sandbox.
- **Zero Audio Fingerprinting:** No audio files or telemetry are recorded, uploaded, or transmitted.
- **Client Preference Storage:** Local storage keys (`audify-theme`, `audify-sidebar-docked`, `audify-cookie-consent`) store only UI preferences and contain zero personally identifiable information (PII).

---

## Attribution & Music Partner

- **Product:** Audify
- **Creator & Lead Engineer:** [Nyxen](https://nyxen.in) (`contact@nyxen.in`)
- **Music Partner:** [Xpert Melody](https://www.youtube.com/@xpertmelody)

---

## License

This project is licensed under the [MIT License](LICENSE).
