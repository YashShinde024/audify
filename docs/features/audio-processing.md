# Audio Processing & DSP Architecture

Audify's audio processing engine is implemented in [`src/lib/audio/`](file:///c:/Users/Yash%20Shinde/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/Projects/Audify/src/lib/audio/). It provides deterministic, studio-grade processing via native Web Audio nodes and specialized DSP algorithms.

---

## 1. Web Audio Node Topology

When audio is previewed or exported, the engine constructs a Web Audio graph based on the active `DSPPlan`:

```mermaid
graph LR
    Source[AudioBufferSourceNode] --> PlaybackRate[Varispeed PlaybackRate]
    PlaybackRate --> Filters[BiquadFilterNodes (EQ / Shelves)]
    Filters --> Saturation[WaveShaperNode (Analog Tape Drive)]
    Saturation --> Spatial[StereoPannerNode / Haas Delay]
    Spatial --> Reverb[ConvolverNode (Synthesized Reverb)]
    Reverb --> Compressor[DynamicsCompressorNode]
    Compressor --> Limiter[Soft-Knee Peak Limiter (-0.3 dBFS)]
    Limiter --> Destination[Destination / Offline Context]
```

---

## 2. Core DSP Modules

### A. Varispeed Resampling
Rather than using phase vocoders that introduce phase smearing, robotic comb filtering, and transient blurring, Audify explicitly couples pitch with playback speed (`playbackRate`):
- **Slowed (`0.85×`):** Lowers tempo by 15% and pitch proportionally by ~2.7 semitones.
- **Nightcore (`1.25×`):** Increases tempo by 25% and raises pitch by ~3.86 semitones.
- **432 Hz Sacred Pitch:** Modulates playback rate by the exact frequency ratio:
  $$\text{Ratio} = \frac{432}{440} \approx 0.98181818 \quad (-31.766\text{ cents})$$

### B. Convolution Reverb Synthesis
Audify synthesizes synthetic impulse response buffers in memory without relying on heavy external impulse audio downloads:
- **Small Room:** Exponential decay envelope over 0.8 seconds.
- **Medium Room:** 1.5-second decay with subtle low-pass absorption.
- **Large Hall:** 3.2-second diffuse decay with early reflection taps.
- **Cathedral:** 5.5-second wide stereo decay with HF damping simulating vast stone acoustics.
- **Bathroom:** Rapid metallic reflections with early resonance peaks.

### C. Biquad Filtering & Parametric EQ
Implemented using W3C `BiquadFilterNode`:
- **Low-pass:** 400 Hz (Underwater), 3.5 kHz (Lo-Fi Tape), 8 kHz (Muffled).
- **High-pass:** 80 Hz (Rumble Cut), 300 Hz (Telephone Voice), 5 Hz (DC Offset).
- **Peaking / Notch:** Parametric EQ bands for bass boost, vocal clarity, and de-harshing.

### D. Look-Ahead Soft-Knee Peak Limiter
To prevent sample-level distortion on heavy bass boosts or aggressive gain boosts, Audify employs a sliding-window soft-knee peak limiter ([`src/lib/audio/dsp-utils.ts`](file:///c:/Users/Yash%20Shinde/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/Projects/Audify/src/lib/audio/dsp-utils.ts)):
- **Linear Region:** For inputs $|x| \le 0.90$ (−0.92 dBFS), the signal passes unaffected.
- **Soft-Knee Compression:** For signals exceeding $0.90$, excess energy is compressed using a hyperbolic tangent ($\tanh$) transfer curve.
- **Ceiling:** Guarantees peak amplitude never exceeds **$0.966$ (−0.3 dBFS)**, leaving standard headroom for lossy MP3 encoding.

---

## 3. Offline Rendering Pipeline

Offline rendering (`src/lib/audio/renderer.ts`) executes inside an `OfflineAudioContext`:
1. Instantiates context with the source buffer's sample rate and channel layout.
2. Clones the full `DSPPlan` node topology into the offline graph.
3. Renders the graph asynchronously.
4. Reports progress percentages (0–100%) and stage descriptions (`"Applying convolution reverb..."`, `"Limiting sample peaks..."`).
5. Supports instant cancellation if the user switches presets or adjusts parameters mid-render.
