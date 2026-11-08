# Audify Competitor Benchmarks & DSP Control Mapping

**Research Date:** October 2026  
**Audify Attribution:** Audify by Nyxen × Xpert Melody  
**Status:** Calibrated against Web Audio API offline rendering & sample verification  

---

## 1. Executive Summary & Methodology

This document systematically benchmarks publicly documented presets, algorithmic parameters, and user-facing controls from notable online and desktop audio tools:
- **Audioalter** ([audioalter.com](https://audioalter.com))
- **AudioMass** ([audiomass.co](https://audiomass.co))
- **TwistedWave** ([twistedwave.com](https://twistedwave.com/online))
- **123apps Audio Tools** ([mp3cut.net](https://mp3cut.net))
- **BandLab Web DAW** ([bandlab.com](https://www.bandlab.com))

> **Methodological Note:** Competitor settings serve as empirical reference points, not 1:1 mathematical clones. Convolution impulse responses, biquad filter topologies, look-ahead limiter release curves, and gain stages differ across audio engines. Audify's DSP values are calibrated through Web Audio API node measurements and listening tests to guarantee artifact-free, broadcast-ready renders.

---

## 2. Parameter Benchmark Tables

### 2.1 Slowed + Reverb
| Tool / Source | Published Parameters & Units | Original Date / URL | Audify DSP Mapping | Technical Uncertainty / Engine Difference |
|---|---|---|---|---|
| **Audioalter** | Speed: `0.85x` (or -15%), Reverb level: slider (0–100%) | `https://audioalter.com/slowed-reverb` (Verified 2026) | `playbackRate: 0.85`, Butterworth 2nd-order lowpass `fc: 4200 Hz`, synthetic convolution IR decay `4.8s`, `wet: 0.48`, `dry: 0.52` | Audioalter uses a proprietary server-side FFmpeg sox/reverb filter. Audify executes in-browser via `AudioBufferSourceNode.playbackRate` + `ConvolverNode`. Audify adds an essential 4.2 kHz lowpass filter to prevent decelerated cymbal/sibilance harshness. |
| **YouTube Community Standard** | Speed: `85%–88%` (tempo & pitch coupled), Reverb size: Large hall | Community practices (Screwed/Slowed movement) | Matches Audify's `slowed-reverb` preset default `0.85x` rate. | Community producers frequently use FL Studio Reeverb 2 or Valhalla VintageVerb with high damping. Audify generates an exponential damped noise IR in 32-bit float PCM. |

---

### 2.2 Slowed & Sped-Up Audio (Varispeed vs Time-Stretching)
| Tool / Source | Published Parameters & Units | Original Date / URL | Audify DSP Mapping | Technical Uncertainty / Engine Difference |
|---|---|---|---|---|
| **AudioMass** | Playback Speed: `0.5x` to `2.0x` (linear ratio) | `https://audiomass.co` (Verified 2026) | Speed: `0.5x` to `2.0x` (`playbackRate` change) | AudioMass uses Web Audio `playbackRate`, which natively couples pitch with speed ($f_{\text{new}} = f_{\text{orig}} \times r$). Audify provides the same bit-pure, artifact-free resampling without phase artifacts from FFT phase vocoders. |
| **123apps Speed Changer** | Speed slider: `0.5x` to `3.0x`, with optional pitch lock toggle | `https://mp3cut.net/change-speed` (Verified 2026) | `tempo-changer`: default `1.15x` rate. | 123apps relies on server-side SoundTouch or Rubberband for pitch preservation. Audify clearly documents that its varispeed resampler shifts pitch naturally according to physical tape/vinyl principles. |

---

### 2.3 Nightcore & Daycore
| Tool / Source | Published Parameters & Units | Original Date / URL | Audify DSP Mapping | Technical Uncertainty / Engine Difference |
|---|---|---|---|---|
| **Audioalter (Nightcore)** | Speed: `1.25x` (+25%), Pitch: `+3.86 semitones` (coupled) | `https://audioalter.com/nightcore` (Verified 2026) | `playbackRate: 1.25`, resulting in $+3.863$ semitones ($12 \times \log_2(1.25)$). | Identical mathematical ratio. Audify runs at full 32-bit float in-memory, avoiding lossy intermediate MP3 transcode steps. |
| **Audioalter (Daycore)** | Speed: `0.85x` (-15%), Pitch: `-2.81 semitones` (coupled) | `https://audioalter.com/daycore` (Verified 2026) | `playbackRate: 0.85`, resulting in $-2.814$ semitones ($12 \times \log_2(0.85)$). | Identical mathematical curve. |

---

### 2.4 8D Audio & Spatial Panning
| Tool / Source | Published Parameters & Units | Original Date / URL | Audify DSP Mapping | Technical Uncertainty / Engine Difference |
|---|---|---|---|---|
| **Audioalter (8D Audio)** | Rotation speed: slow (`12s`), medium (`8.5s`), fast (`5s`). Reverb space: light room. | `https://audioalter.com/8d-audio` (Verified 2026) | `StereoPannerNode.pan` automated over sinusoidal LFO ($t = 8.5\text{s}$ orbit period) + subtle binaural reverb `wet: 0.22`, decay `2.2s`. | "8D" is a marketing name for dynamic azimuth panning + binaural delay/reverb. Competitor server-side tools often use rotating Haas effect. Audify uses Web Audio stereo panning parameter automation at 50ms resolution. |
| **TwistedWave (Pan)** | Static L/R Balance: `-100%` to `+100%` | `https://twistedwave.com/online` (Verified 2026) | `stereo-panner`: `pan: -1.0` to `+1.0`. | TwistedWave applies a standard sine/cosine equal-power panning law. Audify uses `StereoPannerNode` with native constant-power panning law. |

---

### 2.5 Bass Boost Levels
| Tool / Source | Published Parameters & Units | Original Date / URL | Audify DSP Mapping | Technical Uncertainty / Engine Difference |
|---|---|---|---|---|
| **Audioalter (Bass Booster)** | Boost Level: Low (`+4 dB`), Medium (`+8 dB`), High (`+12 dB`), Extreme (`+16 dB`). Center frequency: undocumented (~80 Hz). | `https://audioalter.com/bass-booster` (Verified 2026) | 4 calibrated tiers:<br>• Light: `+3.5 dB` @ 95 Hz (`Q: 0.707`)<br>• Moderate: `+7.0 dB` @ 85 Hz (`Q: 0.707`)<br>• Heavy: `+10.5 dB` @ 75 Hz (`Q: 0.85`)<br>• Extreme: `+15.0 dB` @ 65 Hz (`Q: 1.0`) | Audioalter frequently clips when boosting without input gain reduction. Audify applies pre-calculated digital headroom attenuation and provides a true look-ahead peak limiter to eliminate distortion. |
| **AudioMass (Equalizer)** | Bass band: Low-shelf `100 Hz`, gain `±15 dB` | `https://audiomass.co` (Verified 2026) | 3-band parametric EQ: Low shelf `250 Hz` (`±12 dB`), Mid peaking `1000 Hz` (`±12 dB`), High shelf `4000 Hz` (`±12 dB`). | AudioMass provides a 10-band graphic EQ. Audify provides both discrete calibrated bass tiers and a mastering-grade 3-band parametric EQ. |

---

### 2.6 Echo & Reverb
| Tool / Source | Published Parameters & Units | Original Date / URL | Audify DSP Mapping | Technical Uncertainty / Engine Difference |
|---|---|---|---|---|
| **Audioalter (Reverb)** | Room types: Small Room, Medium Room, Large Hall, Cathedral. Wet slider: `0–100%`. | `https://audioalter.com/reverb` (Verified 2026) | 6 specialized reverb presets:<br>• Bathroom: `decay 0.65s`, `wet 0.22`<br>• Small Room: `decay 1.2s`, `wet 0.25`<br>• Medium Room: `decay 2.4s`, `wet 0.32`<br>• Large Room: `decay 4.2s`, `wet 0.40`<br>• Church Hall: `decay 5.8s`, `wet 0.45`<br>• Cathedral: `decay 7.5s`, `wet 0.52` | Most competitor tools apply Freeverb (Schroeder-Moorer comb/allpass network). Audify synthesizes high-density Gaussian white-noise impulse responses with exponential decay and high-frequency damping. |
| **TwistedWave (Delay / Echo)** | Delay time: `ms`, Feedback: `%`, Mix: `%` | `https://twistedwave.com/online` (Verified 2026) | `echo`: Delay `0.35s`, Feedback `38%`, Wet `35%`. `ping-pong`: Delay `0.28s`, alternating stereo head. | TwistedWave uses mono or stereo tapped delay lines. Audify implements both single-tap studio echo and true ping-pong cross-feedback. |

---

### 2.7 Pitch Shifting & 432 Hz Tuning
| Tool / Source | Published Parameters & Units | Original Date / URL | Audify DSP Mapping | Technical Uncertainty / Engine Difference |
|---|---|---|---|---|
| **Audioalter (Pitch Changer)** | Semitones: `-12` to `+12`, with optional tempo preservation | `https://audioalter.com/pitch-changer` (Verified 2026) | `pitch-shifter`: `-12` to `+12` semitones. Playback rate ratio: $2^{\text{semitones}/12}$. | Many web tools claim pitch shifting without tempo change but introduce audible metallic phase artifacts. Audify explicitly documents when pitch is coupled to speed. |
| **Audioalter (432 Hz Converter)** | Frequency shift: `440 Hz → 432 Hz` | `https://audioalter.com/432hz` (Verified 2026) | `tuning-432hz`: `playbackRate: 432 / 440 = 0.981818`, pitch shift: `-31.766 cents`. | Competitors use identical ratio $432/440$. Audify documents the actual mathematical physics without pseudoscientific health claims. |

---

### 2.8 Audio Cleanup & Filtering
| Tool / Source | Published Parameters & Units | Original Date / URL | Audify DSP Mapping | Technical Uncertainty / Engine Difference |
|---|---|---|---|---|
| **Audioalter (Noise Reducer)** | Basic highpass filter (~150 Hz) or noise gate | `https://audioalter.com/noise-reducer` (Verified 2026) | Audify provides distinct, honest filters:<br>• `noise-reducer` / `rumble-cut`: Highpass `80 Hz` (sub rumble)<br>• `telephone-voice`: Bandpass `450 Hz – 3200 Hz` + soft saturation<br>• `de-harsh`: High shelf `-4.5 dB` @ 7 kHz | **Crucial distinction:** Audify does NOT claim a high-pass filter is general broadband noise reduction or AI spectral denoising. It clearly explains that low-frequency rumble is removed while broadband hiss requires spectral estimation. |

---

### 2.9 Loudness & Peak Normalization
| Tool / Source | Published Parameters & Units | Original Date / URL | Audify DSP Mapping | Technical Uncertainty / Engine Difference |
|---|---|---|---|---|
| **AudioMass (Normalize)** | Peak normalize to `0 dBFS` or `-0.1 dBFS` | `https://audiomass.co` (Verified 2026) | `peak-normalizer`: Scans max absolute sample value and applies linear multiplier to reach `-0.3 dBFS` (`0.966`). | AudioMass normalizes to 0 dBFS, which can cause inter-sample clipping on MP3 encoding. Audify adheres to EBU/AES guidelines by leaving `0.3 dB` of sample-peak safety headroom. |
| **Audify Peak Limiter** | Look-ahead sliding minimum limiter with 5ms window | Internal Web Audio DSP | True look-ahead sample peak limiter preventing sample values $> 0.966$ (−0.3 dBFS). | Audify does NOT equate simple sample-peak normalization with ITU-R BS.1770 / EBU R128 integrated LUFS loudness normalization. |

---

## 3. Summary of Calibrated Improvements in Audify
1. **Dynamic Headroom Protection:** Unlike competitor tools that allow extreme bass boost or EQ to clip past 0 dBFS, Audify automatically attenuates pre-gain or engages its look-ahead limiter.
2. **Transparent Architectural Disclosures:** Audify never markets high-pass filters as AI noise suppression or varispeed as formant-preserving time stretching.
3. **True Broadcast Headroom:** Peak normalization and limiting enforce a −0.3 dBFS ceiling to prevent inter-sample overs upon MP3 encoding.
4. **Zero-Latency In-Browser Audio:** Competitors upload files to remote Python/FFmpeg servers. Audify processes 100% locally with zero server queues or data transfers.
