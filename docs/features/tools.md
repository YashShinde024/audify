# Standalone Audio Tools

In addition to the multi-track Studio workspace, Audify provides **15 dedicated task-oriented audio tools** under `/tools` and `/tools/[slug]`.

Each standalone tool provides a streamlined single-task interface for creators who need a fast, specialized utility without opening the full preset rack.

---

## 1. Tools Directory & Workspace Engine

The tools system is powered by two main modules:
- **Registry ([`src/config/tools-registry.ts`](../../src/config/tools-registry.ts)):** Declares tool metadata, input/output constraints, parameters, and SEO descriptors.
- **Execution Engine ([`src/lib/audio/tools-engine.ts`](../../src/lib/audio/tools-engine.ts)):** Executes the specialized algorithms for non-standard workflows (such as multi-file concatenation and interval slicing).

---

## 2. Specialized Standalone Utilities

### A. Audio Merger & Joiner (`/tools/audio-merger`)
- **Multi-File Ingestion:** Accepts multiple audio files simultaneously.
- **Visual Reordering:** Up/down arrows allow users to arrange track sequence.
- **Configurable Silence Gaps:** Injects configurable silence (0 to 5 seconds) between tracks.
- **Sample Rate Synchronization:** Automatically resamples tracks with mismatched sample rates (e.g., merging a 44.1 kHz track with a 48.0 kHz track) into a uniform output clock.

### B. Audio Splitter (`/tools/audio-splitter`)
- **Parts Mode:** Divides an audio buffer into equal parts (2 to 6 parts).
- **Interval Mode:** Slices audio by fixed time intervals (15s to 120s segments).
- **Batch Export:** Provides instant individual preview and download for every segment.

### C. Sample Rate Converter (`/tools/sample-rate-converter`)
- **Polyphase Resampling:** Transcodes audio sample clocks between 22.05 kHz, 32.0 kHz, 44.1 kHz, and 48.0 kHz.
- **Pitch Preservation:** Windowed-sinc anti-aliasing filters prevent audible aliasing while keeping pitch and duration unchanged.

### D. Audio Metadata & Diagnostic Analyzer (`/tools/audio-metadata-viewer`)
- **Diagnostic Insights:** Analyzes duration, exact sample rate, channel count, peak amplitude (linear & dBFS), and RMS loudness.
- **JSON Export:** Allows users to copy or export technical file metrics as structured JSON.

### E. Additional Standalone Tools
- `audio-converter`: Fast transcode to WAV (16/24/32-bit), AIFF, or MP3.
- `audio-trimmer`: Precision millisecond crop with 5ms anti-click crossfades.
- `audio-normalizer`: EBU R128 and sample peak normalization.
- `bpm-detector`: Autocorrelation tempo analysis.
- `pitch-shifter`: Semitone transposition.
- `tempo-changer`: Varispeed speed control.
- `vocal-remover`: Center-channel vocal attenuation.
- `audio-reverser`: Reverse PCM buffer playback.
- `volume-changer`: Linear gain adjustment.
- `audio-compressor`: Dynamic range limiter.
- `fade-in-out`: Fade envelopes.
