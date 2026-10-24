# Audify Studio

The **Studio** (`/studio`) is Audify's primary in-browser audio workstation. It provides an intuitive, high-performance interface where producers, sound designers, and casual creators can shape, preview, and master audio without installing software or uploading files.

---

## 1. Studio Workflow

```mermaid
graph LR
    Upload[1. Ingest Audio File] --> Audition[2. Waveform & Timeline]
    Audition --> Presets[3. Select & Tweak Preset]
    Presets --> ABCompare[4. Dry/Wet A/B Audition]
    ABCompare --> Render[5. Offline DSP Render]
    Render --> Export[6. Lossless / MP3 Download]
```

---

## 2. Audio Ingestion & File Handling

- **Supported Formats:** MP3, WAV, FLAC, AAC, M4A, OGG, and AIFF.
- **Decoding:** Uses native `AudioContext.decodeAudioData()`, which reads the input binary array buffer and decodes it into multi-channel 32-bit linear PCM float buffers.
- **Memory Ceiling:** Enforces a strict **10 MB** file limit to guarantee mobile browser stability.
- **Test Loop Generator:** Includes a built-in synthetic demonstration track generator for testing audio effects immediately without requiring local files.

---

## 3. Waveform Timeline & Audition Deck

- **Dynamic Waveform Rendering:** Generates authentic peak bars directly from decoded PCM buffer sample arrays (up to 200 peak buckets).
- **Interactive Scrubber:** Click or drag anywhere along the timeline to seek instantly.
- **Hover Guideline:** Real-time hover cursor displaying precise timestamp tooltips.
- **Continuous Loop:** Seamless loop toggle allowing producers to test repetitive drops and rhythmic grooves.
- **A/B Dry/Wet Comparison:** Instant switching between the unprocessed input track ("Source Dry") and the mastered result ("Master Wet") without losing the playback position.

---

## 4. Workstation Mode Switching (`SoundSelector`)

The central rack in `src/components/editor/sound-selector.tsx` provides 4 dedicated modes:

1. **Catalog (62 Modules):**
   - Filter by kind: *All*, *Creative Presets (43)*, *Audio Tools (19)*, or *Essential Top 9*.
   - Filter by category: 9 categorized acoustic buckets with search.
2. **Sliders (Fine-Tuning):**
   - Real-time parameter controls for the active preset.
   - Adjust gain, frequency cutoffs, reverb wet mix, room sizes, feedback delays, and modulation depths.
   - Includes custom tool controls (e.g., millisecond crop sliders for trimmer, semitone pitch selectors).
3. **Saved (User Presets):**
   - Save custom parameter configurations with custom names.
   - Persisted locally in `localStorage` under `audify-custom-presets-v1`.
   - Export custom presets to JSON or import from other devices.
4. **Signal Chain:**
   - Visual inspection of the exact Web Audio nodes currently chained in the DSP pipeline (e.g., `SourceBuffer` → `BiquadFilter` → `Convolver` → `SoftKneeLimiter` → `Destination`).

---

## 5. Responsive Studio Shell & Mobile View Switcher

On mobile phones and small tablets (`< lg` breakpoints), the Studio automatically presents a compact two-step view switcher:
- **Tab 1: DSP Presets & Sliders:** Focuses on preset discovery, search, and slider adjustments.
- **Tab 2: Mastering & Export:** Focuses on master playback comparison, format selection (WAV 16/24/32-bit, AIFF, MP3 CBR), and one-tap downloading.

This prevents the infinite vertical scrolling common in desktop audio software, keeping all primary actions within comfortable thumb reach.
