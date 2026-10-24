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
      { name: "Speed", range: "30% – 180% (preset-dependent)", unit: "%", description: "Ratio relative to the original recording speed." },
    ],
    targetPresetId: "slowed",
    status: "supported",
  },
  {
    id: "semitone-pitch",
    name: "Semitone Pitch Transposition",
    category: "Pitch & Speed",
    summary: "Transposes the tonal root of the recording by fractional or discrete semitones.",
    dspNodeChain: ["AudioBufferSourceNode.playbackRate (= speed × 2^(semitones/12))"],
    parameters: [
      { name: "Pitch Offset", range: "0 to +8 (nightcore), -8 to 0 (daycore), -12 to +12 (pitch-shifter)", unit: "st", description: "Semitone musical intervals up or down." },
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
  {
    id: "plate-reverb-module",
    name: "EMT-Style Plate Reverb",
    category: "Reverb & Echo",
    summary: "Dense, metallic plate reverberation with bright early reflection diffusion and low-end rumble cut at 220 Hz.",
    dspNodeChain: ["BiquadFilterNode (highpass, 220 Hz)", "ConvolverNode (Bright Plate IR)", "BiquadFilterNode (highshelf)", "Dry/Wet Gain Bus"],
    parameters: [
      { name: "Plate Wet Mix", range: "0% – 100%", unit: "%", description: "Reverberant plate signal level." },
      { name: "Decay Time", range: "1.0s – 5.0s", unit: "s", description: "Shimmering decay tail duration." },
      { name: "High End Shimmer", range: "0 dB to +8 dB", unit: "dB", description: "High-shelf presence boost." },
    ],
    targetPresetId: "plate-reverb",
    status: "supported",
  },

  /* 3. Tone & EQ */
  {
    id: "treble-shelf",
    name: "High-Shelf Air & Treble",
    category: "Tone & EQ",
    summary: "Boosts high frequencies above the 9 kHz corner with minimal phase shift.",
    dspNodeChain: ["BiquadFilterNode (highshelf, 9000 Hz)"],
    parameters: [
      { name: "High Shelf Boost", range: "0 dB to +10 dB", unit: "dB", description: "High frequency contour gain." },
    ],
    targetPresetId: "treble-air",
    status: "supported",
  },
  {
    id: "vocal-presence",
    name: "Peaking Mid-Presence Filter",
    category: "Tone & EQ",
    summary: "Parametric peaking bell filter centered at 2.6 kHz to focus vocals and leads.",
    dspNodeChain: ["BiquadFilterNode (peaking, Q=1.0, 2600 Hz)"],
    parameters: [
      { name: "Presence", range: "0 dB to +8 dB (default +3.5 dB)", unit: "dB", description: "Vocal articulation and mid forwardness." },
    ],
    targetPresetId: "vocal-clarity",
    status: "supported",
  },
  {
    id: "mud-cut",
    name: "Low-Cut / Mud High-Pass",
    category: "Tone & EQ",
    summary: "High-pass filter clearing boxy low frequencies below 110 Hz (default enabled).",
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
    name: "Low-Shelf Bass Boost (Heavy Tier)",
    category: "Bass",
    summary: "Delivers powerful low-frequency reinforcement with a 75 Hz low-shelf.",
    dspNodeChain: ["BiquadFilterNode (lowshelf, 75 Hz)"],
    parameters: [
      { name: "Bass Gain", range: "8 dB to +14 dB (default +10.5 dB)", unit: "dB", description: "Sub and kick drum reinforcement." },
    ],
    targetPresetId: "bass-boost-heavy",
    status: "supported",
  },
  {
    id: "sub-harmonic-shelf",
    name: "Sub Shelf (Extreme Tier)",
    category: "Bass",
    summary: "Deep sub-low shelf boosting fundamentals below 65 Hz.",
    dspNodeChain: ["BiquadFilterNode (lowshelf, 65 Hz)"],
    parameters: [
      { name: "Sub-Bass", range: "12 dB to +18 dB (default +15 dB)", unit: "dB", description: "Low fundamental chest weight." },
    ],
    targetPresetId: "bass-boost-extreme",
    status: "supported",
  },

  /* 5. Stereo */
  {
    id: "8d-orbital-panner",
    name: "360° 8D Orbital Panning",
    category: "Stereo",
    summary: "Continuous oscillator-driven sinusoidal stereo panning producing an orbiting sound field; mono sources are widened first so the orbit is audible.",
    dspNodeChain: ["StereoPannerNode", "OscillatorNode LFO → StereoPanner.pan"],
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
    summary: "Broadens soundstage width via mid/side processing; already-mono sources pass through unchanged.",
    dspNodeChain: ["Mid/Side Split", "Side Gain (Width)", "Stereo Re-composition"],
    parameters: [
      { name: "Width", range: "10% – 100%", unit: "%", description: "Stereo spread beyond conventional speaker axes." },
    ],
    targetPresetId: "stereo-widening",
    status: "supported",
  },
  {
    id: "haas-precedence",
    name: "Haas Psychoacoustic Stereo Precedence",
    category: "Stereo",
    summary: "Introduces an interaural micro-delay (12–35 ms) across channels to generate a dimensional 3D soundstage from narrow or centered recordings.",
    dspNodeChain: ["ChannelSplitterNode", "DelayNode (Micro-Delay)", "Dry/Wet Balance", "ChannelMergerNode"],
    parameters: [
      { name: "Spatial Delay", range: "12 ms – 35 ms", unit: "ms", description: "Interaural channel time offset." },
      { name: "Spread Mix", range: "0% – 100%", unit: "%", description: "Intensity of the spatialized stereo image." },
    ],
    targetPresetId: "haas-spatializer",
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
    summary: "Two cascaded 24 dB/octave low-pass filters at 520 Hz plus a 160 Hz sub shelf for a static submerged character.",
    dspNodeChain: ["BiquadFilterNode (lowpass, 520 Hz) ×2", "BiquadFilterNode (lowshelf, 160 Hz)", "Reverb (damped tail)"],
    parameters: [
      { name: "Muffled Low Body", range: "0 dB to +10 dB", unit: "dB", description: "Sub-surface low end boost." },
    ],
    targetPresetId: "underwater",
    status: "supported",
  },
  {
    id: "tube-preamp-saturation",
    name: "Vacuum Tube Preamp Warmth",
    category: "Creative",
    summary: "Simulates vintage analog triode valve behavior with gentle even/odd harmonic saturation, 200 Hz body, and top-end smoothing.",
    dspNodeChain: ["BiquadFilterNode (lowshelf, 200 Hz)", "WaveShaperNode (tanh curve)", "BiquadFilterNode (highshelf, 13 kHz)"],
    parameters: [
      { name: "Tube Drive", range: "0% – 50%", unit: "%", description: "Vacuum tube harmonic coloration." },
      { name: "Low-Mid Body", range: "0 dB to +6 dB", unit: "dB", description: "Warm analog low-shelf resonance." },
    ],
    targetPresetId: "tube-warmth",
    status: "supported",
  },

  /* 7. Utility & Finishing */
  {
    id: "audio-fade-envelope",
    name: "Linear Gain Fade In & Out",
    category: "Utility & Finishing",
    summary: "Applies smooth, non-destructive start and end gain ramping to ensure seamless audio transitions without clicks.",
    dspNodeChain: ["GainNode (linearRampToValueAtTime)"],
    parameters: [
      { name: "Fade In Duration", range: "0s – 15s", unit: "s", description: "Length of start volume ramp." },
      { name: "Fade Out Duration", range: "0s – 15s", unit: "s", description: "Length of trailing silence ramp." },
    ],
    targetPresetId: "fade-in-out",
    status: "supported",
  },
  {
    id: "peak-protection-limiter",
    name: "Look-Ahead Peak Protection Limiter",
    category: "Utility & Finishing",
    summary: "Look-ahead sliding-minimum envelope limiter pulls peaks to a -0.3 dBFS sample-peak ceiling. Runs only when peak protection is enabled (default on); no true-peak or inter-sample limiting.",
    dspNodeChain: ["Look-ahead sliding-minimum envelope", "Limiter gain application"],
    parameters: [
      { name: "Peak Protection", range: "On / Off", unit: "bool", description: "Protects playback devices from digital clipping." },
    ],
    targetPresetId: "mastering-polish",
    status: "supported",
  },
  {
    id: "loudness-normalization",
    name: "Peak Headroom Normalization",
    category: "Utility & Finishing",
    summary: "Analyzes the maximum sample peak and applies linear make-up gain up to -0.5 dBFS.",
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
    targetPresetId: "downmixer",
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
