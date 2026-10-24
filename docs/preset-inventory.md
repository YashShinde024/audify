# Audify Preset Inventory & DSP Mapping Specification

**Attribution:** Audify by Nyxen × Xpert Melody  
**Total Calibrated Presets & Tools:** 54  
**Verification Status:** All presets and tools validated against `src/config/__tests__/preset-audit.test.ts`, `src/lib/audio/__tests__/dsp-plan.test.ts`, and the offline render pipeline.

---

## 1. Architectural Processing Chain Order

Every preset in Audify executes through a deliberate, non-destructive Web Audio DSP graph:
1. **Source Buffer Ingestion:** In-memory PCM buffer decoded at source native sample rate.
2. **Buffer Slicing / Trimming (if applied):** Start & end offsets sliced directly on source PCM.
3. **Buffer Reversal (if applied):** Genuine bit-pure PCM channel reversal (`Float32Array.reverse()`).
4. **Varispeed / Rate Modulation:** `AudioBufferSourceNode.playbackRate` (e.g. 0.80x for Slowed, 1.35x for Nightcore, 432/440 for 432Hz).
5. **Primary Filtering / EQ:** Cascaded `BiquadFilterNode` elements (lowpass, highpass, bandpass, peaking, lowshelf, highshelf).
6. **Harmonic Saturation:** `WaveShaperNode` with oversampled 4x hyperbolic tangent (`tanh`) transfer curve.
7. **Pre-Bus Output Gain:** Linear `GainNode` with decibel scaling for calibrated makeup or attenuation.
8. **Time-Based FX (Reverb / Delay):** Parallel convolution with synthesized exponential impulse responses or cross-channel ping-pong feedback loops.
9. **Spatialization & Stereo Imaging:** Mid/side matrix width scaling, Haas effect precedence micro-delay, and `StereoPannerNode` automated via sinusoidal LFO.
10. **Gain Envelope Fades:** Start and finish linear gain ramps (`linearRampToValueAtTime`) for smooth transitions.
11. **Sanitization & Resampling:** Inf/NaN removal and polyphase windowed-sinc resampling to target export sample rate.
12. **Master Normalization & Headroom Protection:** Sample-peak normalization and look-ahead sliding-minimum peak limiter with −0.3 dBFS ceiling.
13. **Binary Codec Serialization:** 16-bit PCM, 24-bit PCM, 32-bit Float WAV, AIFF, or 128–320 kbps MP3 via `lamejs`.

---

## 2. Comprehensive Preset Inventory

### Group 1: Speed & Viral Edits (7 presets)

| Preset ID | Kind | Default Parameters | DSP Chain & Operations | Acoustic Role |
|---|---|---|---|---|
| `slowed-reverb` | preset | speed: 80%, reverb: 42%, size: 75% | `playbackRate: 0.80` + Parallel Convolver (decay: 4.2s, damping: 0.3) | Iconic relaxed tempo bathed in lush hall reverb. Pitch falls with tempo. |
| `slowed` | preset | speed: 80% | `playbackRate: 0.80` | Clean tape-style slowdown with natural pitch drop. |
| `super-slowed` | preset | speed: 50%, warmth: 40% | `playbackRate: 0.50` + `lowshelf(120Hz, +2.4dB)` + `lowpass(14kHz)` | Extreme half-speed drag with warm sub reinforcement. |
| `vaporwave` | preset | speed: 72%, reverb: 30%, haze: 50% | `playbackRate: 0.72` + `lowpass(13kHz)` + Convolver (decay: 3.6s) | Nostalgic slowed aesthetic with frequency haze and surf reflections. |
| `sped-up` | preset | speed: 118% | `playbackRate: 1.18` (windowed-sinc resampled) | Modest varispeed tempo acceleration with elevated pitch. |
| `nightcore` | preset | speed: 135%, pitch: +3 st, treble: +4 dB | `playbackRate` + `highshelf(10kHz, +4dB)` | Fast tempo, elevated pitch transpose, and vocal air lift. |
| `daycore` | preset | speed: 82%, pitch: -3 st, bass: +4 dB | `playbackRate` + `lowshelf(90Hz, +4dB)` | Anti-nightcore: baritone slowed pitch drop with heavy bass compensation. |

### Group 2: Stereo & Spatial Effects (6 presets)

| Preset ID | Kind | Default Parameters | DSP Chain & Operations | Acoustic Role |
|---|---|---|---|---|
| `8d-audio` | preset | rotation: 50%, reverb: 30% | Sinusoidal LFO pan (cycle: 9s) + Convolver (2.6s tail) | 360° orbital rotation around listener in headphones. |
| `auto-panner` | tool | pan-speed: 50% | `StereoPannerNode` sinusoidal LFO (cycle: 3.5s) | Rhythmically oscillates audio between left and right channels. |
| `stereo-panner`| tool | rotation: 50% | Static `StereoPannerNode` balance (-1 to +1) | Precise channel balance and pan steering. |
| `stereo-widening` | preset | width: 65% | Mid/Side matrix separation (side gain: 1.30x) | Expands stereo soundstage width without phase artifacts. |
| `haas-spatializer` | preset | delay-ms: 20 ms, mix: 75% | Right-channel micro-delay (20 ms) + mix gain | Psychoacoustic Haas precedence delay for immersive dimensional width. |
| `ping-pong` | preset | echo: 40%, size: 45% | Stereo cross-delay line (320 ms) + feedback loop (0.45) | Rhythmic bouncing delays across the stereo field. |

### Group 3: Bass & Equalizer (7 presets)

| Preset ID | Kind | Default Parameters | DSP Chain & Operations | Acoustic Role |
|---|---|---|---|---|
| `bass-boost-light` | preset | bass: +3.5 dB | `BiquadFilterNode(lowshelf, 95Hz, +3.5dB)` | Transparent low-end presence, ideal for headphones. |
| `bass-boost-mod` | preset | bass: +7.0 dB | `BiquadFilterNode(lowshelf, 85Hz, +7.0dB)` | Punchy kick drum and bassline reinforcement. |
| `bass-boost-heavy` | preset | bass: +10.5 dB | `BiquadFilterNode(lowshelf, 75Hz, +10.5dB)` | Deep subwoofer body for electronic and hip-hop. |
| `bass-boost-extreme` | preset | bass: +15.0 dB | `BiquadFilterNode(lowshelf, 65Hz, +15.0dB)` + Limiter | Extreme chest-rattle low end safely caught by peak limiter. |
| `equalizer` | tool | bass: 0 dB, eq-mid: 0 dB, eq-high: 0 dB | 3-band: Lowshelf (120Hz), Peaking (2400Hz, Q=1.0), Highshelf (9kHz) | Full 3-band surgical mastering tone balance. |
| `treble-air` | preset | treble: +5 dB | `BiquadFilterNode(highshelf, 9000Hz, +5dB)` | Opens high-frequency presence and glossy shimmer. |
| `mid-scoop` | preset | cut: -3 dB, brightness: +3 dB | `peaking(350Hz, -3dB)` + `highshelf(8000Hz, +3dB)` | Scoops boxy lower-mids to create modern V-shaped clarity. |

### Group 4: Reverb & Echo (10 presets)

| Preset ID | Kind | Default Parameters | Decay / Delay Time | Acoustic Space Description |
|---|---|---|---|---|
| `bathroom-reverb` | preset | reverb: 35% | Decay: 0.65s (damping 0.75) | Tight, reflective tiled room with fast flutter. |
| `small-room-reverb` | preset | reverb: 28% | Decay: 1.10s (damping 0.55) | Intimate studio tracking room, natural acoustics. |
| `medium-room-reverb` | preset | reverb: 32% | Decay: 2.00s (damping 0.45) | Balanced studio live room with natural envelope. |
| `large-room-reverb` | preset | reverb: 40% | Decay: 3.40s (damping 0.35) | Warm concert hall with diffuse reflections. |
| `church-hall-reverb` | preset | reverb: 55% | Decay: 4.80s (damping 0.30) | Stone arched sanctuary with prominent sustain. |
| `cathedral-reverb` | preset | reverb: 65%, size: 95% | Decay: 6.40s (damping 0.25) | Monumental cathedral with ethereal decay tail. |
| `vocal-reverb` | preset | reverb: 28% | Decay: 1.80s (pre-delay: 35ms) | Transparent vocal chamber preserving lyric intelligibility. |
| `plate-reverb` | preset | reverb: 36%, decay: 2.4s, brightness: +3dB | Decay: 2.40s (highpass 220Hz) | EMT metal plate simulation with metallic shimmer and clean lows. |
| `slapback-echo` | preset | echo: 35% | Time: 115 ms (single repeat) | Classic rockabilly / slapback echo without wash. |
| `echo-chamber` | preset | echo: 25%, size: 50%, reverb: 25% | Echo: 280 ms + Reverb: 2.2s | Vintage studio echo chamber with ambient decay. |

### Group 5: Pitch & Tempo (3 tools)

| Preset ID | Kind | Default Parameters | DSP Nodes & Operations | Acoustic Role |
|---|---|---|---|---|
| `pitch-432hz` | tool | 432hz-enabled: true | `playbackRate: 432/440 = 0.981818` | Exact -31.77 cents shift to historical Verdi 432 Hz concert pitch. |
| `pitch-shifter`| tool | pitch: 0 st (-12 to +12) | `playbackRate = 2^(semitones/12)` | Musical semitone transposition. |
| `tempo-changer`| tool | speed: 100% (30% to 180%) | `playbackRate = speed / 100` | Smooth playback speed and tempo variation. |

### Group 6: Creative Effects (8 presets)

| Preset ID | Kind | Default Parameters | DSP Nodes & Operations | Acoustic Role |
|---|---|---|---|---|
| `reverse` | tool | reverse-enabled: true | `Float32Array.reverse()` across channels | Bit-pure backwards playback and transitional swells. |
| `underwater` | preset | reverb: 45%, bass: +6 dB | Cascaded Lowpass (520Hz, 24 dB/oct) + Lowshelf (160Hz) + Reverb | Muffled aquatic submersion with resonant deep lows. |
| `telephone-voice` | preset | saturation: 40% | Highpass (450Hz) + Cascaded Lowpass (3.2kHz) + tanh Saturation | Vintage band-limited carbon microphone telephone tone. |
| `lofi-tape` | preset | saturation: 50%, speed: 94%, treble: -3 dB | tanh saturation + Highshelf (6.5kHz) + Lowpass (9.5kHz) + Drag | 1980s cassette tape with motor drag and head roll-off. |
| `tape-warmth` | preset | warmth: 24%, sub-warmth: +1.5 dB | Subtle tanh drive + Lowshelf (100Hz) + Lowpass (14kHz) | Studio console tape warmth and pleasant even harmonics. |
| `tube-warmth` | preset | drive: 25%, warmth: +2.5 dB, air: -1.5 dB | Triode tanh waveshaping + Lowshelf (200Hz) + Highshelf (13kHz) | Analog vacuum tube preamp warmth with harmonic body. |
| `am-radio` | preset | bandwidth: 2800 Hz, saturation: 35% | Highpass (550Hz) + Peaking (1800Hz, +4dB) + Lowpass (2.8kHz) + Drive | Vintage AM radio broadcast with resonant horn and transistor grit. |
| `muffled-room` | preset | cutoff: 320 Hz, bass: +4 dB, reverb: 32% | Dual Lowpass (320Hz, 24 dB/oct) + Lowshelf (120Hz) + Diffusion | Sensation of music playing through a wall in the adjacent room. |

### Group 7: Audio Cleanup (6 presets & tools)

| Preset ID | Kind | Default Parameters | DSP Nodes & Operations | Acoustic Role |
|---|---|---|---|---|
| `sub-rumble-cut` | tool | rumble-cut: true | Cascaded 24 dB/oct Butterworth highpass at 30 Hz | Cleans inaudible DC offset and infrasonic sub rumble. |
| `noise-reducer` | tool | mud-cut: true | Highpass at 115 Hz (Q=0.707) | Tames HVAC thumps, handling noise, and mic stand rumble. |
| `vocal-air` | preset | presence: +3 dB, air: +4 dB | Peaking (3200Hz, +3dB) + Highshelf (11kHz, +4dB) | Forward vocal articulation and silky breath air. |
| `vocal-clarity` | preset | presence: +3.5 dB, mud-cut: true | Highpass (110Hz) + Peaking (2600Hz, +3.5dB) | Removes low-end mud while emphasizing speech presence. |
| `de-harsh` | preset | treble: -3.5 dB | Highshelf (7000Hz, -3.5dB) | Softens sibilant harshness and brittle cymbals. |
| `podcast-voice` | preset | presence: +3 dB, mud-cut: true, smooth: true | Highpass (95Hz) + Peaking (3200Hz) + Highshelf (8kHz, -2dB) | Tailored voice contour for podcast, broadcast, and voiceover. |

### Group 8: Audio Utilities & Export (8 tools & presets)

| Preset ID | Kind | Default Parameters | DSP Nodes & Operations | Acoustic Role |
|---|---|---|---|---|
| `volume-changer` | tool | volume-db: +3 dB | Linear `GainNode` with dB scaling (-18 dB to +12 dB) | Clean track gain leveling and gain staging. |
| `trimmer-cutter` | tool | trim-start: 0s, trim-end: 60s | Native PCM slicing with 5 ms anti-click fades | Lossless segment cropping and duration trimming. |
| `fade-in-out` | tool | fade-in: 2s, fade-out: 3s | Gain envelope linear ramps at start and end | Smooth intro and outro volume fades without abrupt clicks. |
| `downmixer` | tool | mud-cut: false | Arithmetic mean 0.5 * (L + R) summing | True mono fold-down for phone speaker and radio check. |
| `bpm-detector` | tool | speed: 100% | Transient-energy autocorrelation analysis | Automatic tempo and beat detection. |
| `format-converter` | tool | mud-cut: false | Multi-codec binary encoder pipeline | In-browser transcoding between WAV, MP3, and AIFF. |
| `mastering-polish` | preset | bass: +2 dB, treble: +2 dB, presence: +1 dB | 3-band polish + 5 ms look-ahead limiter (-0.3 dBFS) | Commercial finishing curve with peak headroom safety. |

---

## 3. Verification & Invariance Guarantees
- **Pure Functional Resolution:** `resolveProcessing()` maps preset IDs and control values purely into deterministic plans.
- **Render Signature Invariance:** Any change to an audible parameter or export setting modifies `signature`, preventing stale playback or outdated exports.
- **Headroom & Peak Protection:** Look-ahead limiter with −0.3 dBFS ceiling guarantees zero digital overs regardless of boost levels.
- **Test Integrity:** Every preset and operation is continuously verified in `src/config/__tests__/preset-audit.test.ts` and `src/lib/audio/__tests__/dsp-plan.test.ts`.
