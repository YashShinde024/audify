# Architectural Decision Records (ADRs)

This directory documents key architectural decisions, rationale, trade-offs, and design history for Audify.

---

## Index of Architectural Decisions

### ADR-001: Local-First Web Audio DSP Over Cloud Microservices
- **Status:** Accepted
- **Context:** Many audio tools upload multimegabyte files to backend FFmpeg workers, introducing server hosting costs, latency, and privacy risks.
- **Decision:** Execute all audio decoding, filtering, convolution, and encoding directly in the client browser using the W3C Web Audio API and `OfflineAudioContext`.
- **Consequences:** Eliminates cloud bandwidth costs and ensures absolute user privacy. Constrains file size to 10 MB to prevent mobile tab OOM crashes.

### ADR-002: Varispeed Resampling Over Time-Domain Phase Vocoders
- **Status:** Accepted
- **Context:** Time-stretching without pitch shift (phase vocoders) introduces metallic phase artifacts and transient smearing in web environments.
- **Decision:** Explicitly couple playback speed and pitch (Varispeed playback), providing genuine vinyl/tape realism for Slowed, Nightcore, and 432 Hz tuning.
- **Consequences:** Pristine audio fidelity without metallic comb-filtering, matching authentic hip-hop, lo-fi, and vaporwave production aesthetics.

### ADR-003: Sliding-Window Look-Ahead Soft-Knee Peak Limiting
- **Status:** Accepted
- **Context:** Heavy bass boost (+10.5 dB to +15 dB) causes integer PCM clamping, resulting in harsh digital clipping.
- **Decision:** Implement a sliding-window look-ahead soft-knee peak limiter enforcing a strict −0.3 dBFS ceiling.
- **Consequences:** Preserves clean transient dynamics without hard digital clipping or distortion across extreme EQ boosts.

### ADR-004: Next.js 16 App Router & Turbopack
- **Status:** Accepted
- **Context:** High SEO requirements for 38+ educational guides and 15 standalone tool pages.
- **Decision:** Leverage Next.js 16 App Router with Turbopack for static site generation (SSG) of public content and client-side hydration of the Studio.
- **Consequences:** Ultra-fast page generation (96 static pages generated in ~1.3s) and pristine search engine indexability.
