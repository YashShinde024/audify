/**
 * Professional Effects Directory Catalog
 * Reflects genuine Web Audio DSP engine processing operations.
 */

export const effectCategories = [
  "Pitch & Speed",
  "Reverb & Echo",
  "Tone & EQ",
  "Bass",
  "Stereo",
  "Creative",
  "Utility & Finishing",
] as const;

export type EffectCategory = (typeof effectCategories)[number];

export interface EffectModule {
  id: string;
  name: string;
  category: EffectCategory;
  summary: string;
  dspNodeChain: string[];
  parameters: {
    name: string;
    range: string;
    unit: string;
    description: string;
  }[];
  targetPresetId?: string;
  status: "supported" | "planned";
}

export const effects: EffectModule[] = [
  /* 1. Pitch & Speed */
  {
    id: "playback-rate",
    name: "Variable Playback Speed",
    category: "Pitch & Speed",
    summary: "High-precision resampling changes tempo and playback duration cleanly.",
    dspNodeChain: ["AudioBufferSourceNode.playbackRate"],
    parameters: [
      { name: "Speed", range: "30% – 175%", unit: "%", description: "Ratio relative to the original recording speed." },
    ],
    targetPresetId: "slowed",
    status: "supported",
  },
  {
    id: "semitone-pitch",
    name: "Semitone Pitch Transposition",
    category: "Pitch & Speed",
    summary: "Transposes the tonal root of the recording by fractional or discrete semitones.",
    dspNodeChain: ["AudioBufferSourceNode.playbackRate", "DetuneCents"],
    parameters: [
      { name: "Pitch Offset", range: "-8 to +8", unit: "st", description: "Semitone musical intervals up or down." },
    ],
    targetPresetId: "nightcore",
    status: "supported",
  },

  /* 2. Reverb & Echo */
  {
    id: "convolution-reverb",
    name: "Algorithmic Convolution Reverb",
    category: "Reverb & Echo",
    summary: "Convolves the signal through custom-generated acoustic impulse responses with variable room dimensions.",
    dspNodeChain: ["ConvolverNode (Synthetic IR)", "Dry/Wet Gain Bus"],
    parameters: [
      { name: "Reverb Wet Mix", range: "0% – 100%", unit: "%", description: "Ratio of reflected reverberation to dry audio." },
      { name: "Room Dimension", range: "10% – 100%", unit: "%", description: "Simulated architectural scale and decay tail." },
    ],
    targetPresetId: "slowed-reverb",
    status: "supported",
  },
  {
    id: "feedback-echo",
    name: "Stereo Feedback Delay Line",
    category: "Reverb & Echo",
    summary: "Time-delayed buffer loop with adjustable feedback gain and damping.",
    dspNodeChain: ["DelayNode (0.32s)", "GainNode (Feedback loop)", "DampingFilter"],
    parameters: [
      { name: "Echo Level", range: "0% – 100%", unit: "%", description: "Volume of secondary repetitions." },
      { name: "Feedback", range: "10% – 80%", unit: "%", description: "Sustain time of trailing repetitions." },
    ],
    targetPresetId: "ping-pong",
    status: "supported",
  },

  /* 3. Tone & EQ */
  {
    id: "treble-shelf",
    name: "High-Shelf Air & Treble",
    category: "Tone & EQ",
    summary: "Boosts or attenuates high frequencies above 8.5 kHz with minimal phase shift.",
    dspNodeChain: ["BiquadFilterNode (highshelf, 8500 Hz)"],
    parameters: [
      { name: "Treble Gain", range: "-8 dB to +10 dB", unit: "dB", description: "High frequency contour gain." },
    ],
    targetPresetId: "treble-air",
    status: "supported",
  },
  {
    id: "vocal-presence",
    name: "Peaking Mid-Presence Filter",
    category: "Tone & EQ",
    summary: "Parametric peaking bell filter centered at 2.6 kHz to focus vocals and leads.",
    dspNodeChain: ["BiquadFilterNode (peaking, Q=1.2, 2600 Hz)"],
    parameters: [
      { name: "Presence", range: "-6 dB to +8 dB", unit: "dB", description: "Vocal articulation and mid forwardness." },
    ],
    targetPresetId: "vocal-clarity",
    status: "supported",
  },
  {
    id: "mud-cut",
    name: "Low-Cut / Mud High-Pass",
    category: "Tone & EQ",
    summary: "12 dB/octave high-pass filter clearing boxy low frequencies between 80 Hz and 120 Hz.",
    dspNodeChain: ["BiquadFilterNode (highpass, 110 Hz)"],
    parameters: [
      { name: "Filter Enable", range: "On / Off", unit: "bool", description: "Engages high-pass mud cut." },
    ],
    targetPresetId: "vocal-clarity",
    status: "supported",
  },

  /* 4. Bass */
  {
    id: "low-shelf-bass",
    name: "Low-Shelf Bass Boost",
    category: "Bass",
    summary: "Delivers clean, powerful low-frequency reinforcement centered at 90 Hz.",
    dspNodeChain: ["BiquadFilterNode (lowshelf, 90 Hz)"],
    parameters: [
      { name: "Bass Gain", range: "0 dB to +14 dB", unit: "dB", description: "Sub and kick drum reinforcement." },
    ],
    targetPresetId: "bass-boosted",
    status: "supported",
  },
  {
    id: "sub-harmonic-shelf",
    name: "Sub Octave Resonance",
    category: "Bass",
    summary: "Targeted sub-low shelf boosting fundamental frequencies below 60 Hz.",
    dspNodeChain: ["BiquadFilterNode (lowshelf, 55 Hz)"],
    parameters: [
      { name: "Sub-Bass", range: "0 dB to +12 dB", unit: "dB", description: "Low fundamental chest weight." },
    ],
    targetPresetId: "deep-bass",
    status: "supported",
  },

  /* 5. Stereo */
  {
    id: "8d-orbital-panner",
    name: "360° 8D Orbital Panning",
    category: "Stereo",
    summary: "Continuous automated sinusoidal stereo panning producing an orbiting sound field.",
    dspNodeChain: ["StereoPannerNode", "AudioParam.setValueAtTime() (Sinusoidal Modulation)"],
    parameters: [
      { name: "Orbit Frequency", range: "10% – 100%", unit: "%", description: "Speed of continuous left-right rotation." },
    ],
    targetPresetId: "8d-audio",
    status: "supported",
  },
  {
    id: "stereo-widener",
    name: "Stereo Boundary Expander",
    category: "Stereo",
    summary: "Broadens soundstage width while maintaining mono compatibility.",
    dspNodeChain: ["ChannelSplitterNode", "MicroDelay", "ChannelMergerNode"],
    parameters: [
      { name: "Width", range: "10% – 100%", unit: "%", description: "Stereo spread beyond conventional speaker axes." },
    ],
    targetPresetId: "stereo-widening",
    status: "supported",
  },

  /* 6. Creative */
  {
    id: "tape-saturation",
    name: "Analog Tape Waveshaping",
    category: "Creative",
    summary: "Non-linear hyperbolic tangent curve introduces pleasant even and odd harmonics.",
    dspNodeChain: ["WaveShaperNode (Oversampled 4x)", "Tanh Transfer Function"],
    parameters: [
      { name: "Drive", range: "0% – 100%", unit: "%", description: "Tape oxide magnetic saturation." },
    ],
    targetPresetId: "lofi-tape",
    status: "supported",
  },
  {
    id: "sample-reversal",
    name: "Full Sample Buffer Reversal",
    category: "Creative",
    summary: "Inverts PCM channel arrays end-to-beginning for reverse sweeps and transitions.",
    dspNodeChain: ["Float32Array.reverse() across all channels"],
    parameters: [
      { name: "Reverse", range: "Toggle", unit: "bool", description: "Inverts time direction." },
    ],
    targetPresetId: "reverse",
    status: "supported",
  },
  {
    id: "underwater-filter",
    name: "Acoustic Low-Pass Submersion",
    category: "Creative",
    summary: "Steep 24 dB/octave low-pass filter isolating low rumble and dampening highs.",
    dspNodeChain: ["BiquadFilterNode (lowpass, 480 Hz, Q=2.0)"],
    parameters: [
      { name: "Muffled Resonance", range: "0 dB to +10 dB", unit: "dB", description: "Deep submerged acoustic volume." },
    ],
    targetPresetId: "underwater",
    status: "supported",
  },

  /* 7. Utility & Finishing */
  {
    id: "peak-protection-limiter",
    name: "True Peak Ceiling Protection",
    category: "Utility & Finishing",
    summary: "Soft-knee transparent limiter prevents inter-sample clipping and digital overs.",
    dspNodeChain: ["SoftCeilingLimiter (-0.1 dBFS ceiling)"],
    parameters: [
      { name: "Peak Protection", range: "On / Off", unit: "bool", description: "Protects playback devices from digital clipping." },
    ],
    targetPresetId: "mastering-polish",
    status: "supported",
  },
  {
    id: "loudness-normalization",
    name: "RMS Headroom Normalization",
    category: "Utility & Finishing",
    summary: "Analyzes maximum peak amplitude and applies optimal linear gain up to -0.5 dBFS.",
    dspNodeChain: ["PeakAnalysis", "GainNode (Make-up normalization)"],
    parameters: [
      { name: "Normalization Target", range: "-0.5 dBFS", unit: "dBFS", description: "Headroom-safe peak normalization." },
    ],
    targetPresetId: "mastering-polish",
    status: "supported",
  },
  {
    id: "mono-downmix",
    name: "Summed Mono Downmixing",
    category: "Utility & Finishing",
    summary: "Perfect 0.5 * (L + R) summing for radio, podcast, or phone speaker testing.",
    dspNodeChain: ["ChannelDownmixer (0.5 * Left + 0.5 * Right)"],
    parameters: [
      { name: "Mode", range: "Stereo / Mono", unit: "select", description: "Channel configuration." },
    ],
    targetPresetId: "mastering-polish",
    status: "supported",
  },
];

export function getAllEffects(): EffectModule[] {
  return effects;
}

export function getEffectsByCategory(category: EffectCategory): EffectModule[] {
  return effects.filter((e) => e.category === category);
}

export function searchEffects(query: string, category?: EffectCategory | "all"): EffectModule[] {
  const q = query.toLowerCase().trim();
  return effects.filter((effect) => {
    const matchesCategory = !category || category === "all" || effect.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;

    return (
      effect.name.toLowerCase().includes(q) ||
      effect.summary.toLowerCase().includes(q) ||
      effect.category.toLowerCase().includes(q) ||
      effect.dspNodeChain.some((node) => node.toLowerCase().includes(q))
    );
  });
}
