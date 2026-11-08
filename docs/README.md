# Audify Documentation Hub

Welcome to the **Audify** developer and architecture documentation.

Audify is a high-performance, local-first in-browser audio workstation developed by **Nyxen** in partnership with acoustic partner **Xpert Melody**. It executes real-time and offline Web Audio DSP processing directly in the client browser with zero cloud file uploads.

---

## Documentation Map

```text
docs/
├── getting-started.md              # Prerequisites, installation, local setup & verification
├── architecture.md                 # System architecture, Web Audio pipeline & Mermaid diagrams
├── project-structure.md            # Codebase directory map & module responsibilities
├── configuration.md                # Environment variables, runtime settings & site constants
├── routing-and-pages.md            # App Router pages, dynamic routes & API endpoints
├── features/
│   ├── studio.md                   # Main Studio workspace, waveform timeline & transport deck
│   ├── presets-and-effects.md      # 62 preset modules, parameter schemas & custom presets
│   ├── audio-processing.md         # DSP plan, biquad filters, convolution reverb & peak limiter
│   ├── audio-encoders-and-export.md# Binary WAV (16/24/32-bit), AIFF & MP3 encoders
│   └── tools.md                    # Standalone audio tools (Merger, Splitter, Resampler, etc.)
├── development/
│   ├── coding-conventions.md       # TypeScript, React 19, Tailwind CSS v4 & styling rules
│   ├── testing.md                  # Vitest suite (23 suites / 301 tests), audio math harness & testing guide
│   ├── troubleshooting.md          # Common developer errors, port issues & browser audio unlocks
│   └── performance.md              # Client memory management, 10 MB ceiling & canvas rendering
├── design/
│   ├── design-system.md            # Quartz & Sonic design language, tokens & gradient aesthetics
│   ├── responsive-design.md        # Mobile-first strategy, tested viewports (320px–1440px)
│   └── accessibility.md            # WCAG AA/AAA compliance, ARIA attributes & reduced motion
├── deployment.md                   # Vercel deployment, edge runtime, canonical domain & headers
├── search-performance-and-indexing.md # Search Console, Bing Webmaster Tools & indexing guide
├── privacy-and-security.md         # Local-first privacy model, RAM sandbox & endpoint hardening
└── decisions/
    └── README.md                   # Architectural Decision Records (ADRs) index
```

---

## Quick Navigation

| If you want to... | Read this first |
| :--- | :--- |
| Set up the repository locally on your machine | [Getting Started](./getting-started.md) |
| Understand how in-browser audio DSP processing works | [Architecture](./architecture.md) & [Audio Processing](./features/audio-processing.md) |
| Learn how presets, filters, and effect chains are built | [Presets & Effects](./features/presets-and-effects.md) |
| Run tests, type checks, and DSP verification | [Testing Guide](./development/testing.md) |
| Inspect supported audio output formats and encoders | [Encoders & Export](./features/audio-encoders-and-export.md) |
| Review environment variables and configuration | [Configuration](./configuration.md) |
| Understand our zero-server privacy contract | [Privacy & Security](./privacy-and-security.md) |
| Monitor search indexing, sitemap submission & Search Console | [Search & Indexing](./search-performance-and-indexing.md) |
| Deploy to production or configure custom domains | [Deployment](./deployment.md) |
