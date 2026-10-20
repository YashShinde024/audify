# Svaraya — SEO & YouTube Keyword Discovery Research Report

**Date of Research:** October 20, 2026  
**Product:** Svaraya (`https://svaraya.vercel.app`)  
**Tagline:** Sound, reimagined.  
**Attribution:** Nyxen × Xpert Melody (YouTube: `@xpertmelody`)  
**Primary Standards & Guidelines:** Google Search Central documentation, Webmaster Quality Guidelines, Schema.org WebApplication standards.

---

## 1. Research Methodology & Data Integrity

This research investigates publicly observable search intent, YouTube video title patterns, search auto-suggestions, and competitor architectural footprints.

### Standards & Constraints:
- **No invented search volumes:** Specific exact-match volume numbers are not fabricated. Search interest is characterized by observed query modifiers, prominence in autocomplete suggestions, and competitor taxonomy.
- **Evidence-based mapping:** Every keyword cluster corresponds to an authentic, functional tool or educational guide with working DSP.
- **Strictly no thin doorway pages:** All articles in `/blog/*` contain genuine technical audio explanations, historical origins, DSP chain diagrams, parameter tables, and direct studio deep-links.

---

## 2. Public Query Discovery & YouTube Intent Patterns

Audited across publicly observable query surfaces (Google Search Autocomplete, YouTube Search Suggest, and competitor public indexes):

### Cluster 1: Slowed and Reverb / Chopped & Ambient
- **Observed Queries:**
  - `slowed and reverb maker`
  - `slowed and reverb generator online`
  - `how to make slowed and reverb songs`
  - `super slowed songs 0.5x`
  - `vaporwave audio converter online`
- **YouTube Ecosystem Patterns:**
  - High video volume with titles like *"Song Name (Slowed + Reverb) [1 Hour Loop]"*, *"Aesthetic Slowed & Reverb Edit"*.
  - Viewers frequently search for free in-browser generators to create their own TikTok/Shorts audio stems without installing Audacity or FL Studio.
- **Mapped Svaraya Route:**
  - Guide: `/blog/slowed-reverb`, `/blog/super-slowed`
  - Presets: `slowed-reverb`, `slowed`, `super-slowed`, `vaporwave`
  - Studio Endpoint: `/studio?preset=slowed-reverb`

### Cluster 2: Nightcore & Sped-Up Audio
- **Observed Queries:**
  - `nightcore maker online`
  - `how to make nightcore song`
  - `sped up songs audio editor`
  - `daycore pitch changer online`
- **YouTube Ecosystem Patterns:**
  - Sped-up songs (125%–140% speed with pitch transposition + high-frequency shimmer) are dominant in algorithmic audio trends.
  - Video descriptions routinely cite exact BPM adjustments and semitone offsets.
- **Mapped Svaraya Route:**
  - Guide: `/blog/nightcore-daycore`
  - Presets: `nightcore`, `sped-up`, `daycore`
  - Studio Endpoint: `/studio?preset=nightcore`

### Cluster 3: 8D Audio & Spatial Panning
- **Observed Queries:**
  - `8d audio converter online`
  - `how to make 8d music free`
  - `8d audio maker with headphones`
  - `auto panner audio editor`
- **YouTube Ecosystem Patterns:**
  - Millions of views on videos requiring headphones: *"8D Audio - Wear Headphones [Bass Boosted]"*.
  - Users seek tools that provide orbital auto-panning coupled with ambient reverb.
- **Mapped Svaraya Route:**
  - Guide: `/blog/8d-audio`
  - Presets: `8d-audio`, `auto-panner`, `stereo-panner`, `stereo-widening`
  - Studio Endpoint: `/studio?preset=8d-audio`

### Cluster 4: Bass Booster & Sub-Bass EQ
- **Observed Queries:**
  - `bass booster online free`
  - `bass boosted songs maker`
  - `heavy bass booster no distortion`
  - `extreme bass boost mp3`
- **YouTube Ecosystem Patterns:**
  - "Bass boosted" remixes are huge in car audio and EDM culture.
  - Common complaint in comment sections: digital distortion and clipping. Svaraya's look-ahead limiter at −0.3 dBFS solves this real user pain point.
- **Mapped Svaraya Route:**
  - Guide: `/blog/bass-boost`
  - Presets: `bass-boost-light`, `bass-boost-mod`, `bass-boost-heavy`, `bass-boost-extreme`, `equalizer`
  - Studio Endpoint: `/studio?preset=bass-boost-mod`

### Cluster 5: 432 Hz Tuning & Sacred Geometry
- **Observed Queries:**
  - `432 hz converter online`
  - `convert song to 432hz`
  - `432 hz vs 440 hz pitch shift`
- **YouTube Ecosystem Patterns:**
  - Meditation, relaxation, and ambient music channels heavily feature 432 Hz tuned audio.
- **Mapped Svaraya Route:**
  - Guide: `/blog/432hz-tuning`
  - Preset: `pitch-432hz`
  - Studio Endpoint: `/studio?preset=pitch-432hz`

### Cluster 6: Lo-Fi, Cassette & Creative Timbre
- **Observed Queries:**
  - `lofi audio effect online`
  - `make song sound like cassette tape`
  - `underwater audio filter online`
  - `telephone voice filter online`
- **YouTube & TikTok Patterns:**
  - "Muffled / Underwater / Crying in the Bathroom" aesthetic trends in viral videos.
- **Mapped Svaraya Route:**
  - Guide: `/blog/lofi-tape`
  - Presets: `lofi-tape`, `underwater`, `telephone-voice`, `bathroom-reverb`
  - Studio Endpoint: `/studio?preset=underwater`

### Cluster 7: Utility, Trimming, Downmixing & Format Conversion
- **Observed Queries:**
  - `online audio trimmer free`
  - `stereo to mono audio downmixer`
  - `free audio peak limiter online`
  - `wav to mp3 320kbps in browser`
- **Mapped Svaraya Route:**
  - Landing: `/` & `/studio`
  - Presets: `trimmer-cutter`, `downmixer`, `volume-changer`, `format-converter`
  - Technical Architecture Guide: `/how-it-works`

---

## 3. Route & Metadata Mapping Matrix

| Route | Canonical Target | Primary Heading (H1) | Meta Title | Meta Description |
|---|---|---|---|---|
| `/` | `https://svaraya.vercel.app` | Sound, reimagined. | Svaraya — Free Browser Audio Processing | Free, professional browser-based audio processing. Choose presets like Slowed + Reverb, Nightcore, or 8D Audio, shape the DSP sound, and download finished masters. |
| `/studio` | `https://svaraya.vercel.app/studio` | Svaraya Studio | Svaraya Studio — Browser Web Audio DSP | Fullscreen browser audio processing workspace. Decode, trim, apply DSP presets, audition A/B, and export studio masters in WAV, AIFF, or MP3. |
| `/presets` | `https://svaraya.vercel.app/presets` | Preset Directory | Audio Preset Directory · Svaraya | Explore 25+ curated Web Audio DSP presets and tools across Speed, Spatial, Bass, Reverb, Pitch, and Creative categories. |
| `/effects` | `https://svaraya.vercel.app/effects` | Effects Directory | Effects Directory · Svaraya | Professional Web Audio DSP effect reference catalog detailing node chains, parameter bounds, and implementation mechanics. |
| `/how-it-works` | `https://svaraya.vercel.app/how-it-works` | Client-side audio DSP. Zero server uploads. | How It Works — Local Web Audio DSP Architecture · Svaraya | Learn how Svaraya processes studio audio 100% inside your browser: memory buffer decoding, OfflineAudioContext DSP graphs, and multi-format packaging. |
| `/blog/slowed-reverb` | `https://svaraya.vercel.app/blog/slowed-reverb` | The Art & Science of Slowed + Reverb | Slowed + Reverb Guide — DSP Parameters & History · Svaraya | Comprehensive guide to the Slowed + Reverb aesthetic: Chopped and Screwed roots, exact varispeed formulas, impulse reverb decay, and parameter tuning. |
| `/blog/8d-audio` | `https://svaraya.vercel.app/blog/8d-audio` | 8D Audio & Spatial Panning: How It Actually Works | 8D Audio Guide — Panning Mechanics & Spatial Acoustics · Svaraya | Technical dissection of 8D audio: stereo panning modulation, Haas effect precedence, reverberant room simulation, and honest headphone psychoacoustics. |
| `/blog/bass-boost` | `https://svaraya.vercel.app/blog/bass-boost` | Calibrated Bass Boosting Without Distortion | Bass Boost Guide — Low-Shelf DSP & Peak Limiting · Svaraya | How to boost low-end frequencies without digital clipping: low-shelf filter mechanics, harmonic saturation, look-ahead limiting, and headroom management. |
| `/blog/432hz-tuning` | `https://svaraya.vercel.app/blog/432hz-tuning` | 432 Hz Tuning Conversion: Pitch Math & Acoustic Reality | 432 Hz Tuning Conversion Guide — Math & Acoustics · Svaraya | The acoustic reality of 432 Hz conversion: A4 440 Hz standard vs 432 Hz, mathematical transposition ratio (−31.766 cents), and varispeed implementation. |
| `/blog/nightcore-daycore` | `https://svaraya.vercel.app/blog/nightcore-daycore` | Nightcore & Daycore: High-Energy and Downtempo Transposition | Nightcore & Daycore Audio Guide — Tempo & Pitch DSP · Svaraya | The cultural history and signal processing behind Nightcore and Daycore: accelerated tempos, pitch-shift mechanics, and vocal presence equalization. |
| `/blog/lofi-tape` | `https://svaraya.vercel.app/blog/lofi-tape` | Lo-Fi Tape & Creative Acoustic Degradation | Lo-Fi Tape Audio Guide — Saturation & Filtering DSP · Svaraya | Sculpt nostalgic lo-fi audio textures in your browser: band-limiting filters, soft-clipping polynomial saturation, and submerged underwater acoustics. |

---

## 4. Technical SEO & Schema Markup Audit

### 1. Verification of Canonical URLs & Open Graph
- Every route renders an absolute canonical URL prefixed with `siteConfig.url` (`https://svaraya.vercel.app` by default or `NEXT_PUBLIC_SITE_URL`).
- All OG tags (`og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`) use valid absolute URIs.
- Twitter card metadata is configured with `summary_large_image`.

### 2. Structured Data (Schema.org)
- Studio and homepage include valid `WebApplication` structured data conforming to Google guidelines:
  - `applicationCategory: "MultimediaApplication"`
  - `operatingSystem: "Any (Web Browser)"`
  - `offers: { "@type": "Offer", "price": "0", "priceCurrency": "USD" }`
  - Verified no required upload or payment barrier.

### 3. XML Sitemap & Robots Configuration
- `src/app/sitemap.ts` dynamically indexes all 40+ blog articles, core utilities, presets, and effects pages with proper `lastModified`, `changeFrequency`, and priority weights.
- `src/app/robots.ts` allows indexation of all user-facing content and points directly to `/sitemap.xml`.

### 4. Zero Unverified Performance Claims
- Peak limiter ceiling is documented as −0.3 dBFS sample peak (not true-peak, not LUFS).
- High-pass filters are clearly labelled as low-end rumble cut, never as general noise reduction or AI spectral subtraction.
- Pitch shift is clearly labelled as varispeed (speed and pitch shift together).
