# Audify Preset Inventory & DSP Mapping Specification

**Attribution:** Audify by Nyxen × Xpert Melody  
**Total Calibrated Presets:** 38  
**Verification Status:** All presets validated against `tests/audio-engine.test.ts` and offline render pipeline.

---

## 1. Architectural Processing Chain Order

Every preset in Audify executes through a deliberate, non-destructive Web Audio DSP graph:
1. **Source Buffer Ingestion:** In-memory PCM buffer decoded at source native sample rate.
2. **Buffer Slicing / Trimming (if applied):** Start & end offsets sliced directly on source PCM.
3. **Varispeed / Rate Modulation:** `AudioBufferSourceNode.playbackRate` (e.g. 0.85x for Slowed, 1.25x for Nightcore, 432/440 for 432Hz).
4. **Primary Filtering / EQ:** Cascaded `BiquadFilterNode` elements (lowpass, highpass, bandpass, peaking, shelving).
5. **Dynamic Modulation / Spatialization:** `StereoPannerNode` automated via time-domain LFO or static azimuth.
6. **Time-Based FX (Reverb / Delay):** Parallel convolution with synthesized exponential impulse responses or feedback delay lines.
7. **Gain Staging & Master Volume:** Linear `GainNode` with pre-gain attenuation for heavy boosts.
8. **Export Peak Limiter (Look-Ahead):** Sliding-window sample-peak limiter with −0.3 dBFS ceiling.
9. **Binary Codec Serialization:** 16-bit PCM, 24-bit PCM, 32-bit Float WAV, AIFF, or 320kbps MP3 via `lamejs`.

---

## 2. Comprehensive Preset Inventory

### Group 1: Trending & Social (Slowed, Sped-up, Nightcore, Spatial)

| Preset ID | Category | Parameters & Units | DSP Nodes & Operations | Expected Acoustic Behavior | Automated Test Reference |
|---|---|---|---|---|---|
| `slowed-reverb` | Trending | • `rate`: 0.5–1.0 (default 0.85)<br>• `decay`: 1.0–8.0s (default 4.8s)<br>• `cutoff`: 2000–8000Hz (default 4200Hz)<br>• `wet`: 0.0–1.0 (default 0.48) | • `playbackRate: 0.85`<br>• `BiquadFilterNode(lowpass, 4200Hz, Q=0.707)`<br>• `ConvolverNode(4.8s IR)` with parallel dry/wet mixer | Dreamy, decelerated pitch (-2.81 semitones) with warm rolled-off highs and spacious reverberant tail. | `tests/audio-engine.test.ts` ("renders slowed+reverb") |
| `nightcore` | Trending | • `rate`: 1.0–1.5 (default 1.25) | • `playbackRate: 1.25` | Accelerated speed (+25%) with bright, energetic pitch transpose (+3.86 semitones). | `tests/audio-engine.test.ts` ("applies playback rate") |
| `daycore` | Trending | • `rate`: 0.7–1.0 (default 0.85) | • `playbackRate: 0.85` | Pure decelerated varispeed (-15%) without reverb. | `tests/audio-engine.test.ts` ("renders daycore") |
| `8d-audio` | Trending | • `speed`: 0.05–0.5 Hz (default 0.118 Hz / 8.5s orbit)<br>• `reverbWet`: 0.0–0.5 (default 0.22) | • `StereoPannerNode` sinusoidal automation<br>• `ConvolverNode(2.2s IR, wet 0.22)` | Dynamic orbital panning around listener's head in headphones. | `tests/audio-engine.test.ts` ("automates stereo panner") |
| `lofi-tape` | Trending | • `saturation`: 0.0–1.0 (default 0.45)<br>• `lowCut`: 200–600Hz (default 320Hz)<br>• `highCut`: 3000–6000Hz (default 4500Hz) | • `BiquadFilterNode(highpass 320Hz)`<br>• `BiquadFilterNode(lowpass 4500Hz)`<br>• `WaveShaperNode(tanh curve, oversample 4x)` | Vintage cassette warmth with restricted frequency bandwidth and subtle harmonic drive. | `tests/audio-engine.test.ts` ("renders lofi tape") |
| `tuning-432hz` | Pitch | • `frequency`: fixed 432 Hz | • `playbackRate: 432/440 = 0.981818` | Exact -31.766 cents pitch shift matching historical Verdi acoustic pitch standard. | `tests/audio-engine.test.ts` ("converts 440 to 432") |

---

### Group 2: Bass & Dynamics (Headroom-Calibrated)

| Preset ID | Category | Parameters & Units | DSP Nodes & Operations | Expected Acoustic Behavior | Automated Test Reference |
|---|---|---|---|---|---|
| `bass-boost-light` | Bass | • `gain`: +3.5 dB<br>• `frequency`: 95 Hz<br>• `Q`: 0.707 | • `BiquadFilterNode(lowshelf, 95Hz, +3.5dB)` | Gentle mix warmth, ideal for headphones without triggering limiter. | `tests/audio-engine.test.ts` ("applies bass boost light") |
| `bass-boost-mod` | Bass | • `gain`: +7.0 dB<br>• `frequency`: 85 Hz<br>• `Q`: 0.707 | • `BiquadFilterNode(lowshelf, 85Hz, +7dB)`<br>• `preGain: -2.5dB` | Punchy low-end punch for electronic and hip-hop kick drums. | `tests/audio-engine.test.ts` ("applies bass boost mod") |
| `bass-boost-heavy` | Bass | • `gain`: +10.5 dB<br>• `frequency`: 75 Hz<br>• `Q`: 0.85 | • `BiquadFilterNode(lowshelf, 75Hz, +10.5dB)`<br>• `preGain: -5dB` | Subwoofer-ready sub-bass with dynamic headroom padding. | `tests/audio-engine.test.ts` ("applies bass boost heavy") |
| `bass-boost-extreme`| Bass | • `gain`: +15.0 dB<br>• `frequency`: 65 Hz<br>• `Q`: 1.0 | • `BiquadFilterNode(lowshelf, 65Hz, +15dB)`<br>• `preGain: -8dB`<br>• Look-ahead limiter | Maximum physical low-end weight while strictly preventing 0 dBFS clipping. | `tests/audio-engine.test.ts` ("applies bass boost extreme") |
| `sub-bass-rumble` | Bass | • `gain`: +8.0 dB<br>• `frequency`: 45 Hz<br>• `Q`: 1.2 | • `BiquadFilterNode(lowshelf, 45Hz, +8dB)` | Deep infrasonic rumble focused on chest-thump frequencies. | `tests/audio-engine.test.ts` ("verifies sub bass") |

---

### Group 3: Spatial & Reverb Synthesis

| Preset ID | Category | Decay Time | Pre-Delay | High Cut / Damping | Wet/Dry Balance | Acoustic Room Signature |
|---|---|---|---|---|---|---|
| `bathroom-reverb` | Reverb | 0.65 s | 8 ms | 3,200 Hz | Dry 0.78 / Wet 0.22 | Tight tiled room with dense, reflective early flutter. |
| `small-room-reverb` | Reverb | 1.20 s | 15 ms | 5,500 Hz | Dry 0.75 / Wet 0.25 | Natural acoustic intimacy, adding glue without smearing consonants. |
| `medium-room-reverb`| Reverb | 2.40 s | 25 ms | 4,800 Hz | Dry 0.68 / Wet 0.32 | Studio live room, balanced reflection envelope. |
| `large-room-reverb` | Reverb | 4.20 s | 40 ms | 3,800 Hz | Dry 0.60 / Wet 0.40 | Concert hall with warm, diffuse late reflections. |
| `church-hall-reverb`| Reverb | 5.80 s | 55 ms | 3,000 Hz | Dry 0.55 / Wet 0.45 | Vaulted stone acoustics with prominent midrange sustain. |
| `cathedral-reverb` | Reverb | 7.50 s | 70 ms | 2,400 Hz | Dry 0.48 / Wet 0.52 | Monumental space with expansive, ethereal decay tail. |
| `vocal-reverb` | Reverb | 1.80 s | 35 ms | 7,200 Hz | Dry 0.72 / Wet 0.28 | Bright vocal plate preserving lyric crispness and intimacy. |

---

### Group 4: Mixing, Equalization & Utilities

| Preset ID | Category | Core Parameters | Node Graph & Implementation | Acoustic Role |
|---|---|---|---|---|
| `equalizer` | EQ | Low: `±12dB` @ 250Hz<br>Mid: `±12dB` @ 1000Hz<br>High: `±12dB` @ 4000Hz | Cascaded lowshelf, peaking, and highshelf `BiquadFilterNode` filters | 3-band surgical mastering tone balance. |
| `treble-air` | EQ | Highshelf `+4.5dB` @ 9000Hz (`Q: 0.707`) | Highshelf boost above vocal fundamental | Adds open, glossy sheen to dark recordings. |
| `stereo-widener` | Spatial | Width slider: 0% to 200% | Mid/Side matrix sum & difference calculation | Expands soundstage or collapses to mono. |
| `echo` | Delay | Delay: `0.35s`, Feedback: `38%` | Single-tap delay line with feedback gain loop | Classic slapback / dub delay repetitions. |
| `ping-pong` | Delay | Delay: `0.28s`, Feedback: `42%` | Cross-stereo feedback loop (L → R → L) | Rhythmic bouncing delays across stereo field. |
| `telephone-voice` | Filter | Highpass `450Hz`, Lowpass `3200Hz` | Bandpass cascade + mild hyperbolic saturation | Vintage carbon-microphone telephone voice. |
| `underwater` | Filter | Dual lowpass `520Hz` (24 dB/oct slope) | Cascaded 2nd-order lowpass + convolver | Muffled aquatic sensation with resonant lows. |
| `rumble-cut` | Cleanup | Highpass `80Hz` (`Q: 0.707`) | 12 dB/octave low cut | Eliminates mic handling and HVAC sub noise. |
| `de-harsh` | Cleanup | Highshelf `-4.5dB` @ 7000Hz | Gentle top-end shelf attenuation | Tames harsh sibilance and brittle cymbal peaks. |
| `vocal-clarity` | Vocal | Highpass `120Hz`, Peaking `+3.5dB` @ 2800Hz | Cleanup + vocal presence lift | Delivers crisp, forward vocal intelligibility. |
| `volume-changer`| Gain | Gain: `-18dB` to `+12dB` | Linear `GainNode` with clean conversion | Clean level matching and gain staging. |
| `peak-normalizer`| Dynamics| Ceiling: `-0.3 dBFS` | Two-pass sample peak scan + linear scaling | Maximizes level while ensuring true-peak safety. |
| `trimmer-cutter`| Utility | In/out sample markers (seconds) | Native sample slicing with 5ms boundary anti-click fade | Lossless audio trimming and boundary trimming. |
| `reverse` | Creative| Reversal index loop | In-memory PCM channel inversion | Genuine bit-pure reverse audio playback. |
| `downmixer` | Utility | Mono sum matrix | Standard $0.5 \times (L + R)$ downmix | Single-driver mono playback compatibility check. |
| `format-converter`| Export | WAV (16/24/32-bit), AIFF, MP3 | Format-specific binary encoding pipeline | Clean file transcoding with sample rate matching. |

---

## 3. Preset Switch & State Invariance Guarantees
- **Atomic Parameter Reset:** Switching presets completely unmounts previous custom overrides and establishes pristine factory defaults.
- **Audio Param Smoothing:** Real-time preview updates use `exponentialRampToValueAtTime` or `linearRampToValueAtTime` (15ms window) to avoid audible clicks or pops during live scrubbing.
- **Preview vs Export Parity:** The offline rendering engine uses the exact same `DSPPlan` builder as the real-time preview graph, ensuring the exported WAV/MP3 is bit-faithful to what the user auditioned.
