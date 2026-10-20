# Audio Competitor Benchmark

Source-backed research into publicly disclosed parameters of comparable
browser audio tools, used to inform Svaraya preset calibration. This document
records **what competitors actually disclose** — not what we assume their
internals do. Where a value is not disclosed, that is stated explicitly.

## Methodology

- Only public tool pages and preset pages were inspected (fetch dates below).
- Web-audio applications that render entirely client-side (AudioMass) expose
  no parameter data to static fetching; this limitation is recorded rather
  than filled with guesses.
- No proprietary source code, private configuration, or visual assets were
  copied.

---

## Audioalter (audioalter.com) — accessed 2026-10-20

The most relevant direct competitor: a free, client-side audio toolkit with a
preset gallery that closely mirrors Svaraya's catalogue.

### Disclosed facts

| Topic | Public disclosure | Source URL |
| --- | --- | --- |
| 432 Hz conversion | Pitch shift of **−0.3176665363342977 semitones** (shown rounded as −0.32), achieved via their Pitch Shifter tool set to −0.32 st | `/preset/432hz` |
| 8D Audio | Achieved by chaining **Auto Panner** (alternating L→R) **plus a reverb effect** "to make it seem like the audio is coming from a live concert" | `/preset/8d-audio` |
| Bass Boost presets | Five intensity tiers: Very Light, Light, Moderate, Heavy, Extreme. **No numeric values disclosed** for the underlying gain or filter curve | `/bass-booster`, `/preset/*-bass` |
| Bass normalization | Optional normalization; documented as **decreasing volume to prevent clipping** when a heavy boost would clip. Not a loudness target — purely peak-protection | `/bass-booster` |
| Reverb presets | Room-size tiers: Bathroom, Small/Medium/Large Room, Church Hall, Cathedral, Vocal Reverb. **No decay/pre-delay/damping numbers disclosed** | homepage preset list |
| File constraints | MP3/WAV/FLAC/OGG; **max file size 50 MB** | tool pages |
| Noise Reducer | Exists as a tool, no algorithm disclosed on the landing page | homepage |
| Pitch Shifter / Tempo Changer | Separate tools exist (pitch and tempo are distinct operations) — but the engine used is not disclosed per tool | homepage |

### Cross-check against Svaraya

- Svaraya's 432 Hz preset transposes by 432/440 ≈ −31.77 cents, implemented as
  varispeed (tempo drops ~1.8% in parallel). The magnitude matches
  Audioalter's disclosed −0.3176665 st. **Difference in kind**: Audioalter
  uses a Pitch Shifter (tempo-preserving) for the conversion; Svaraya is
  varispeed-only and says so in the preset description. This is disclosed, not hidden.
- Svaraya's 8D preset family (orbital panning) can match the disclosed
  Auto-Panner + Reverb chain; Svaraya describes it as panning, not "true 3D"
  — an accuracy improvement over the marketing term "8D".
- Svaraya's bass-boost tiers follow the same qualitative intensity ladder.
  Their numeric filter settings are our own calibration (unit: dB of
  low-shelf gain), tested for clipping with the sliding-minimum limiter.

---

## AudioMass (audiomass.co) — accessed 2026-10-20

A fully client-side waveform editor. The public page renders only
"AudioMass - Audio Editor" from static content — the application is compiled
into client-side bundles with **no SSR-exposed parameters**.

### Disclosed facts

- Nothing parameter-related is publicly fetchable. Effect implementations
  exist in-browser, but settings/preset values are not published as
  documentation.

### Consequence for Svaraya

- AudioMass cannot serve as a numeric reference source. It is nonetheless a
  positive architectural precedent for serious in-browser DSP (its editor runs
  entirely in-browser on a decoded AudioBuffer), supporting Svaraya's
  local-first constraint as a credible design.

---

## TwistedWave (twistedwave.com) — accessed 2026-10-20

A professional desktop/mobile/online editor. Few internal values disclosed,
but several capability claims are directly relevant to honest claim
distinction in Svaraya.

### Disclosed facts

| Claim | Relevant implication |
| --- | --- |
| "Best-in-class **ZTX time-stretch and pitch-shift**" | Professional time-compressed/pitch-transposed audio is a *separate, dedicated algorithm* — clearly distinct from varispeed. This reinforces that any tool claiming pitch-independent tempo must use such DSP, and tools that do not (like Svaraya's varispeed) must not claim it. |
| "32-bit / 192 kHz" support ceiling | High-resolution editing/processing is a pro expectation; supports Svaraya's 24/32-bit WAV/AIFF exports. |
| Effects run "in the background while you keep working" | Asynchronous/staged processing UX is a standard for credible editors. |
| Batch fades, effects, conversions | Utility coverage expectations. |

- **No preset parameter values are disclosed publicly.**

---

## Soundation (soundation.com) — accessed 2026-10-20

An online DAW (different product class: multitrack studio, samples, synths).
Used here mainly as a UX/positioning reference.

### Disclosed facts

- Product-class observations, not parameter disclosures: effects include
  "reverb, delay, parametric EQ, compression" as standard professional
  expectations.
- Template/sample libraries and collaboration dominate the marketing; no
  numeric effect parameters are published on the public pages inspected.

---

## What cannot be established from public information

For every competitor inspected:

1. **Exact filter curves** for bass/EQ presets (frequency, Q, gain, shelf vs.
   peak). Audioalter's tiers have no numeric disclosure.
2. **Reverb algorithm character** (IR selection, decay mapping, damping,
   wet/dry gain structure, render tail behavior).
3. **Delay/echo feedback and damping mapping** and any feedback stability
   clamps.
4. **Noise-reduction algorithm** — mere existence of a "Noise Reducer" tool
   name does not tell us whether it is spectral subtraction, a filter-based
   denoiser, or a simple high-pass. This distinction is exactly why Svaraya
   separates "High-Pass Filter (background hum/rumble removal)" from any
   claim of general noise reduction.
5. **Whether "8D Audio"/"3D Audio" involve any HRTF/binaural processing** or
   is LFO panning only — Audioalter's own preset description confirms plain
   auto-panning plus reverb, effectively de-hyping the marketing name.
6. **Headroom/limiting behavior** — Audioalter's "normalization" is documented
   only as clipping-avoidance gain reduction; whether true-peak or sample-peak,
   and whether a limiter stage also runs, is undisclosed.

## Confirmed values adopted into Svaraya

| Svaraya behavior | Basis |
| --- | --- |
| 432 Hz = 432/440 playback ratio (−31.77 cents) via varispeed, tempo impact disclosed | Audioalter `/preset/432hz` magnitude; TwistedWave's ZTX reference distinguishes real time-stretch from varispeed, so Svaraya does not over-claim |
| Bass-boost presets as intensity tiers with clipping protection (look-ahead sliding-minimum limiter at −0.3 dBFS sample peak), normalization as a separate explicit loudness adjust | Audioalter tier structure and normalization-as-clipping-avoidance philosophy; the numeric dB values are Svaraya's own calibration |
| 8D/orbit described as LFO panning (with optional reverb), never as "true 3D"/binaural | Audioalter's own disclosure that 8D = Auto Panner + Reverb |
| No "Noise Reduction" naming for high-pass filtering | Divergent from Audioalter's naming on purpose: their Noise Reducer's algorithm is undisclosed, and a plain high-pass does not do spectral denoising |

## Benchmark limitations

- Competitor behavior is inferred from public pages; effects could differ from
  what pages say.
- No listening comparison against competitor outputs is included in this
  document; a fixture-based A/B listening comparison remains outstanding (see
  final-report disclosure).
- Audioalter's 50 MB limit is theirs, not a target; Svaraya retains its own
  10 MB limit for memory safety.
