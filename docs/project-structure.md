# Project Structure

This document details the directory layout and architectural responsibilities of each module in the Audify repository.

---

## Root Level Overview

```text
audify/
├── .env.example              # Template environment variables with safe defaults
├── AGENTS.md                 # Project-specific AI agent operational guidelines
├── CONTRIBUTING.md           # Contribution workflow, guidelines, and quality gates
├── LICENSE                   # MIT License
├── package.json              # Project dependencies, scripts, and engine metadata
├── README.md                 # Primary project entry point and quickstart
├── SECURITY.md               # Security reporting guidelines and threat model
├── tsconfig.json             # TypeScript compiler configuration
├── vitest.config.ts          # Vitest testing environment configuration
├── docs/                     # Full technical, architectural, and design documentation
├── scripts/                  # Standalone verification harnesses
└── src/                      # Next.js App Router source code
```

---

## Detailed Directory Map

### `src/app/` — Next.js App Router Pages & APIs
Contains all public-facing routes, server components, dynamic parameters, and layout trees:

- **`layout.tsx`**: Root layout injecting Google Fonts (`Geist` & `Geist Mono`), theme initialization script, and global providers.
- **`globals.css`**: Tailwind CSS v4 setup, `@theme inline` design tokens, light/dark color variables, and utility classes.
- **`page.tsx`**: High-performance landing page showcasing the audio DSP preview, acoustic signatures, and capabilities.
- **`studio/`**: The primary audio workstation interface (`/studio`). Supports preset exploration, fine-tuning sliders, real-time auditioning, and binary audio export.
- **`tools/`**: Audio tools directory (`/tools`) and dynamic standalone tool pages (`/tools/[slug]`).
- **`presets/`**: Acoustic preset catalog (`/presets`) featuring real-time audio audition previews.
- **`effects/`**: Dedicated effects workstation rack (`/effects`) for parameter shaping.
- **`how-it-works/`**: Interactive technical breakdown of 32-bit float Web Audio DSP and filter math.
- **`about/`**: Nyxen ecosystem details and Xpert Melody sound partnership background.
- **`blog/`**: Educational audio engineering articles index and dynamic guides (`/blog/[slug]`).
- **`contact/`**: Secure contact dispatch interface.
- **`faq/`**: Frequently asked questions.
- **`privacy/` & `terms/`**: Local-first privacy guarantee and usage terms.
- **`api/contact/route.ts`**: Hardened contact submission endpoint with sliding-window rate limiting and honeypot protection.

---

### `src/components/` — UI Components & Views

Organized by functional domain:

- **`components/layout/`**:
  - `site-header.tsx`: Sticky responsive header with Dynamic Island navigation and mobile drawer.
  - `site-footer.tsx`: Responsive site footer with attribution, legal links, and cookie preference modal trigger.
  - `studio-shell.tsx`: Shared application shell wrapping the header, footer, background wave canvas, and floating audio controller.
  - `theme-toggle.tsx` & `theme-provider.tsx`: Clean light/dark mode switcher with cookie and local storage synchronization.
  - `floating-audio-controller.tsx`: Persistent floating audio controller with animated kinetic EQ bars and master volume slider.
  - `cookie-banner.tsx`: GDPR/CCPA privacy preferences banner and modal.

- **`components/editor/`**:
  - `editor-shell.tsx`: Responsive Studio layout with mobile view switcher.
  - `audio-player.tsx`: Real-time transport deck, waveform track, hover timecode tooltip, and A/B comparison.
  - `sound-selector.tsx`: 4-way mode switcher (`Catalog`, `Sliders`, `Saved`, `Signal Chain`).
  - `preset-explorer.tsx`: Categorized preset browser with audio audition player.
  - `export-panel.tsx`: Audio export rack configuring format, sample rate, bit depth, and bitrate.

- **`components/tools/`**:
  - `tool-workspace.tsx`: Common shell for standalone task-oriented audio tools.
  - `tool-uploader.tsx`: Multi-file / single-file drag-and-drop audio ingester with tap-to-upload.
  - `tool-player.tsx`: Audio audition deck for tool workspaces.
  - `tool-settings.tsx`: Dynamic parameter adjustment form for standalone tools.

- **`components/marketing/`**:
  - `hero.tsx` & `hero-visual.tsx`: Hero section with functional Studio preview in a macOS browser frame.
  - `wave-field.tsx`: Single coordinated background HTML5 Canvas rendering gentle harmonic waves.
  - `preset-signatures.tsx`: Interactive preview of popular acoustic signatures.
  - `capabilities-overview.tsx`: Grid detailing Audify's in-browser capabilities.

- **`components/ui/`**:
  - Low-level accessible primitives: `button.tsx`, `slider.tsx`, `switch.tsx`, `tabs.tsx`, `dialog.tsx`, `accordion.tsx`.

---

### `src/lib/` — Business Logic & Audio Processing

- **`lib/audio/`**:
  - `decoding.ts`: Decodes audio files into standard 32-bit float PCM buffers.
  - `dsp-plan.ts`: Maps active preset parameters to Web Audio node topologies (`DSPPlan`).
  - `dsp-utils.ts`: Biquad filter mathematics, impulse response generators, saturation curves, and peak limiter.
  - `renderer.ts`: Offline rendering pipeline using `OfflineAudioContext`.
  - `encoders.ts`: Lossless binary WAV (16/24/32-bit float), AIFF, and MP3 encoders.
  - `tools-engine.ts`: Execution engine for standalone tools (merger, splitter, resampler, diagnostics).
  - `analysis.ts`: PCM waveform peaks extraction, RMS, peak amplitude, and BPM autocorrelation.
  - `custom-presets.ts`: Import/export and validation for user-saved custom presets.
  - `prompt-matcher.ts`: Natural language audio search mapping user phrases to presets.

- **`lib/utils.ts`**: Formatting utilities (`formatTime`, `formatBytes`), class merging (`cn`), and math helpers.

---

### `src/config/` — Declarative Configurations & Registries

- **`config/site.ts`**: Site metadata, canonical domain, team attribution, and file size limits.
- **`config/presets.ts`**: Canonical definitions for all 62 audio presets and modules.
- **`config/tools-registry.ts`**: Registry for standalone audio tools.
- **`config/navigation.ts`**: Header, footer, and mobile navigation items.
- **`config/blog-registry.ts`**: Articles and acoustic engineering guides registry.
- **`config/preset-article-bodies/`**: Detailed content for audio engineering articles.

---

### `src/stores/` — Client State Management

- **`stores/editor-store.ts`**: Central Zustand store orchestrating file ingestion, preset selection, playback state, offline processing, and export options.
