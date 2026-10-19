import type { Preset, PresetCategory, PresetCategoryId, PresetParam } from "@/types/preset";

export const presetCategories: PresetCategory[] = [
  { id: "speed-viral", label: "Speed & Viral Edits", tagline: "Tempo shifts, pitch transformations, and energetic or melancholic pacing." },
  { id: "stereo-spatial", label: "Stereo & Spatial Effects", tagline: "8D orbital motion, auto-panning, stereo widening, and dimensional imaging." },
  { id: "bass-equalizer", label: "Bass & Equalizer", tagline: "Calibrated bass boost tiers (Light to Extreme) and 3-band parametric EQ." },
  { id: "reverb-echo", label: "Reverb & Echo", tagline: "Architectural acoustic reverbs: Bathroom, Rooms, Church, Cathedral, and Vocal." },
  { id: "pitch-tempo", label: "Pitch & Tempo", tagline: "432 Hz sacred tuning conversion, semitone pitch shifting, and tempo changer." },
  { id: "creative", label: "Creative Effects", tagline: "Reverse playback, underwater submersion, lo-fi cassette, and telephone acoustics." },
  { id: "cleanup", label: "Audio Cleanup", tagline: "Low-end mud cut, sub rumble highpass filter, and harsh sibilance taming." },
  { id: "utilities", label: "Audio Utilities", tagline: "Volume changer (dB gain), audio trimmer/cutter, downmixer, and BPM detector." },
  { id: "export-conversion", label: "Export & Conversion", tagline: "Format converter, sample rate mastering, bit depth, and peak protection." },
];

function slider(id: string, label: string, min: number, max: number, step: number, unit: string, description: string): PresetParam {
  return { id, label, kind: "slider", min, max, step, unit, description };
}

function toggle(id: string, label: string, description: string): PresetParam {
  return { id, label, kind: "toggle", description };
}

export const presets: Preset[] = [
  /* ----------------------------------------------------
   * 1. Speed & Viral Edits
   * ---------------------------------------------------- */
  {
    id: "slowed-reverb",
    name: "Slowed + Reverb",
    kind: "preset",
    category: "speed-viral",
    description: "The quintessential viral sonic aesthetic: relaxed tempo bathed in lush hall reverb.",
    supportedOps: ["PlaybackRate", "ImpulseConvolver", "StereoWidener"],
    compatibilityNote: "Best experienced on headphones or stereo speakers.",
    tags: ["slowed", "reverb", "aesthetic", "vibe", "hall"],
    params: [
      slider("speed", "Playback Speed", 50, 100, 1, "%", "Slowdown factor applied to track."),
      slider("reverb", "Reverb Wet Mix", 0, 100, 1, "%", "Volume of the acoustic space reflections."),
      slider("size", "Room Dimension", 20, 100, 1, "%", "Length of the algorithmic decay tail."),
    ],
    defaults: { speed: 80, reverb: 42, size: 75 },
  },
  {
    id: "slowed",
    name: "Slowed",
    kind: "preset",
    category: "speed-viral",
    description: "Gentle tempo slowdown that relaxes pacing while preserving audio clarity.",
    supportedOps: ["PlaybackRate", "LowPassAntiAlias"],
    tags: ["slow", "chill", "relaxed", "downtempo"],
    params: [slider("speed", "Playback Speed", 50, 100, 1, "%", "Lower is slower. 100% is original tempo.")],
    defaults: { speed: 80 },
  },
  {
    id: "super-slowed",
    name: "Super Slowed",
    kind: "preset",
    category: "speed-viral",
    description: "Extreme half-speed slowdown for an immersive, dreamlike time stretch.",
    supportedOps: ["PlaybackRate", "LowShelfWarmth"],
    tags: ["half speed", "ultra slow", "ambient", "chopped"],
    params: [
      slider("speed", "Playback Speed", 30, 80, 1, "%", "Extreme slowdown rate."),
      slider("warmth", "Sub Warmth", 0, 100, 1, "%", "Adds low-end body for stretched audio."),
    ],
    defaults: { speed: 50, warmth: 40 },
  },
  {
    id: "sped-up",
    name: "Sped Up",
    kind: "preset",
    category: "speed-viral",
    description: "Modest tempo lift that injects rhythmic energy without unnatural artifacting.",
    supportedOps: ["PlaybackRate"],
    tags: ["fast", "tempo", "energy", "club"],
    params: [slider("speed", "Playback Speed", 100, 160, 1, "%", "Above 100% accelerates playback speed.")],
    defaults: { speed: 118 },
  },
  {
    id: "nightcore",
    name: "Nightcore",
    kind: "preset",
    category: "speed-viral",
    description: "Fast tempo paired with elevated pitch and crisp vocal high-shelf presence.",
    supportedOps: ["PlaybackRate", "HighShelfBoost", "PresenceFilter"],
    tags: ["nightcore", "high pitch", "anime", "fast", "bright"],
    params: [
      slider("speed", "Speed", 115, 175, 1, "%", "Accelerates tempo and raises fundamental frequencies."),
      slider("pitch", "Pitch Offset", 0, 8, 1, "st", "Additional semitone transpose."),
      slider("treble", "Treble Lift", 0, 8, 1, "dB", "Adds sparkle and vocal brilliance."),
    ],
    defaults: { speed: 135, pitch: 3, treble: 4 },
  },
  {
    id: "daycore",
    name: "Daycore",
    kind: "preset",
    category: "speed-viral",
    description: "Anti-nightcore: pitched down, slowed tempo with deep, resonant vocal baritone.",
    supportedOps: ["PlaybackRate", "LowShelfBoost", "LowPassSmoothing"],
    tags: ["daycore", "anti nightcore", "deep", "heavy", "low pitch"],
    params: [
      slider("speed", "Speed", 70, 95, 1, "%", "Tempo reduction percentage."),
      slider("pitch", "Pitch Offset", -8, 0, 1, "st", "Negative semitone transposition."),
      slider("bass", "Sub Bass Compensation", 0, 10, 1, "dB", "Low-end weight."),
    ],
    defaults: { speed: 82, pitch: -3, bass: 4 },
  },

  /* ----------------------------------------------------
   * 2. Stereo & Spatial Effects
   * ---------------------------------------------------- */
  {
    id: "8d-audio",
    name: "8D Audio (Orbital Pan)",
    kind: "preset",
    category: "stereo-spatial",
    description: "360-degree cyclical spatial rotation moving continuously around the listener with acoustic space.",
    supportedOps: ["StereoPannerModulation", "ImpulseConvolver", "HeadRelatedHRTF"],
    compatibilityNote: "Headphones required to perceive the 360° rotational orbit.",
    tags: ["8d", "surround", "orbit", "spatial", "spinning", "binaural"],
    params: [
      slider("rotation", "Orbit Speed", 10, 100, 1, "%", "How rapidly the sound travels around you."),
      slider("reverb", "Cavern Reflection", 0, 80, 1, "%", "Atmospheric space surrounding the orbit."),
    ],
    defaults: { rotation: 50, reverb: 30 },
  },
  {
    id: "auto-panner",
    name: "Auto Panner",
    kind: "tool",
    category: "stereo-spatial",
    description: "Rhythmically modulates audio between left and right channels at adjustable LFO rates.",
    supportedOps: ["StereoPannerLFO", "PhaseOscillator"],
    compatibilityNote: "Best on stereo monitors or headphones.",
    tags: ["pan", "panner", "stereo", "autopan", "lfo", "bounce"],
    params: [
      slider("pan-speed", "Pan Frequency", 10, 100, 1, "%", "Speed of the left-to-right cycle."),
    ],
    defaults: { "pan-speed": 50 },
  },
  {
    id: "stereo-panner",
    name: "Stereo Panner / Balance",
    kind: "tool",
    category: "stereo-spatial",
    description: "Adjusts static stereo panning balance and lateral soundstage positioning.",
    supportedOps: ["StereoPannerNode", "GainNode"],
    tags: ["balance", "panning", "left right", "stereo"],
    params: [
      slider("rotation", "Pan Balance", 10, 100, 1, "%", "Static stereo positioning (50% is center)."),
    ],
    defaults: { rotation: 50 },
  },
  {
    id: "stereo-widening",
    name: "Stereo Widener",
    kind: "preset",
    category: "stereo-spatial",
    description: "Broadens lateral acoustic boundaries beyond standard speaker axes while preserving mono compatibility.",
    supportedOps: ["HaasDelayEffect", "MidSideStereoWidth"],
    tags: ["wide", "stereo", "broad", "expansive", "dimension"],
    params: [
      slider("width", "Stereo Spread", 10, 100, 1, "%", "Lateral separation amount."),
    ],
    defaults: { width: 65 },
  },
  {
    id: "ping-pong",
    name: "Ping-Pong Echo",
    kind: "preset",
    category: "stereo-spatial",
    description: "Rhythmic echoes bouncing alternately between the left and right stereo channels.",
    supportedOps: ["BouncingDelayLine", "FeedbackGain"],
    compatibilityNote: "Best experienced with stereo speakers or headphones.",
    tags: ["echo", "delay", "ping pong", "stereo bounce", "rhythm"],
    params: [
      slider("echo", "Echo Intensity", 0, 100, 1, "%", "Level of bouncing repeats."),
      slider("size", "Feedback Duration", 10, 80, 1, "%", "How many echoes sustain before fading."),
    ],
    defaults: { echo: 40, size: 45 },
  },

  /* ----------------------------------------------------
   * 3. Bass & Equalizer
   * ---------------------------------------------------- */
  {
    id: "bass-boost-light",
    name: "Bass Booster: Light (+3dB)",
    kind: "preset",
    category: "bass-equalizer",
    description: "Subtle +3.5 dB low-shelf lift centered at 95 Hz for transparent bass enhancement.",
    supportedOps: ["BiquadLowShelf", "GainStaging"],
    tags: ["bass", "light", "boost", "clean", "hifi"],
    params: [slider("bass", "Gain Boost", 0, 6, 1, "dB", "Low-shelf gain.")],
    defaults: { bass: 3.5 },
  },
  {
    id: "bass-boost-mod",
    name: "Bass Booster: Moderate (+7dB)",
    kind: "preset",
    category: "bass-equalizer",
    description: "Punchy, authoritative +7.0 dB boost tailored for punchy club mixes and car audio.",
    supportedOps: ["BiquadLowShelf", "DynamicLimiter"],
    tags: ["bass", "moderate", "boost", "808", "club"],
    params: [slider("bass", "Gain Boost", 4, 10, 1, "dB", "Low-shelf gain.")],
    defaults: { bass: 7 },
  },
  {
    id: "bass-boost-heavy",
    name: "Bass Booster: Heavy (+10dB)",
    kind: "preset",
    category: "bass-equalizer",
    description: "Deep, massive +10.5 dB low-end shelf with automatic soft-knee peak protection.",
    supportedOps: ["BiquadSubShelf", "PeakLimiterCeiling"],
    tags: ["heavy bass", "sub", "chest hit", "loud"],
    params: [slider("bass", "Gain Boost", 8, 14, 1, "dB", "Low-shelf gain.")],
    defaults: { bass: 10.5 },
  },
  {
    id: "bass-boost-extreme",
    name: "Bass Booster: Extreme (+15dB)",
    kind: "preset",
    category: "bass-equalizer",
    description: "Monumental +15.0 dB sub-boost with true ceiling saturation to prevent digital distortion.",
    supportedOps: ["BiquadLowShelf65Hz", "SoftCeilingSaturation"],
    tags: ["extreme bass", "earrape", "insane", "max bass"],
    params: [slider("bass", "Gain Boost", 12, 18, 1, "dB", "Extreme low-shelf gain.")],
    defaults: { bass: 15 },
  },
  {
    id: "equalizer",
    name: "3-Band Equalizer",
    kind: "tool",
    category: "bass-equalizer",
    description: "Custom multi-band parametric tone shaping: Low-Shelf (120 Hz), Peaking Mid (2.4 kHz), High-Shelf (9 kHz).",
    supportedOps: ["BiquadLowShelf", "BiquadPeaking", "BiquadHighShelf"],
    tags: ["eq", "equalizer", "tone", "parametric", "sound sculpt"],
    params: [
      slider("bass", "Low Band (120Hz)", -10, 12, 1, "dB", "Bass and sub body."),
      slider("eq-mid", "Mid Band (2.4kHz)", -8, 8, 1, "dB", "Vocal and lead presence."),
      slider("eq-high", "High Band (9kHz)", -10, 10, 1, "dB", "Air, brilliance, and cymbals."),
    ],
    defaults: { bass: 0, "eq-mid": 0, "eq-high": 0 },
  },
  {
    id: "treble-air",
    name: "Treble Booster",
    kind: "preset",
    category: "bass-equalizer",
    description: "Silky high-shelf boost above 9 kHz to breathe life into dull recordings.",
    supportedOps: ["BiquadHighShelf", "DeMudPeaking"],
    tags: ["treble", "air", "sparkle", "bright", "crisp", "shine"],
    params: [
      slider("treble", "High Shelf Boost", 0, 10, 1, "dB", "High-frequency gain above 9 kHz."),
    ],
    defaults: { treble: 5 },
  },

  /* ----------------------------------------------------
   * 4. Reverb & Echo
   * ---------------------------------------------------- */
  {
    id: "bathroom-reverb",
    name: "Bathroom Reverb",
    kind: "preset",
    category: "reverb-echo",
    description: "Bright, intimate ceramic-tiled acoustic reflection with fast flutter and minimal absorption.",
    supportedOps: ["ImpulseConvolver", "HighShelfBrightness"],
    tags: ["bathroom", "shower", "tiled", "flutter", "bright reverb"],
    params: [
      slider("reverb", "Wet Level", 10, 80, 1, "%", "Volume of tiled reflections."),
    ],
    defaults: { reverb: 35 },
  },
  {
    id: "small-room-reverb",
    name: "Small Room Reverb",
    kind: "preset",
    category: "reverb-echo",
    description: "Subtle acoustic boundary reflections placing instruments in a cozy, dry studio room.",
    supportedOps: ["ImpulseConvolver", "EarlyReflections"],
    tags: ["small room", "studio", "intimate", "natural"],
    params: [
      slider("reverb", "Wet Level", 0, 80, 1, "%", "Room boundary mix."),
    ],
    defaults: { reverb: 25 },
  },
  {
    id: "medium-room-reverb",
    name: "Medium Room Reverb",
    kind: "preset",
    category: "reverb-echo",
    description: "Balanced acoustic chamber simulation with 2.2-second smooth decay tails.",
    supportedOps: ["ImpulseConvolver", "MidDamping"],
    tags: ["medium room", "chamber", "balanced", "hallway"],
    params: [
      slider("reverb", "Wet Level", 0, 80, 1, "%", "Chamber reflection volume."),
    ],
    defaults: { reverb: 35 },
  },
  {
    id: "large-room-reverb",
    name: "Large Room Reverb",
    kind: "preset",
    category: "reverb-echo",
    description: "Spacious concert hall acoustics with broad stereo diffusion.",
    supportedOps: ["ImpulseConvolver", "StereoDiffuse"],
    tags: ["large room", "concert", "auditorium", "hall"],
    params: [
      slider("reverb", "Wet Level", 10, 90, 1, "%", "Hall wash balance."),
    ],
    defaults: { reverb: 45 },
  },
  {
    id: "church-hall-reverb",
    name: "Church Hall Reverb",
    kind: "preset",
    category: "reverb-echo",
    description: "Echoing stone archways with 4.8-second natural reverberation.",
    supportedOps: ["ImpulseConvolver", "VaultedAcoustic"],
    tags: ["church", "sanctuary", "stone", "sacred", "reverberation"],
    params: [
      slider("reverb", "Wet Level", 20, 100, 1, "%", "Sanctuary reflection mix."),
    ],
    defaults: { reverb: 55 },
  },
  {
    id: "cathedral-reverb",
    name: "Cathedral Reverb",
    kind: "preset",
    category: "reverb-echo",
    description: "Massive cavernous stone reflections with elongated 6.2-second decay tails.",
    supportedOps: ["ImpulseConvolver", "HighShelfDamping", "LowCutFilter"],
    tags: ["cathedral", "huge", "infinite", "monumental"],
    params: [
      slider("reverb", "Cathedral Wet Mix", 0, 100, 1, "%", "Wet cavernous ambience level."),
      slider("size", "Vaulted Decay", 50, 100, 1, "%", "Lengthens acoustic reverberation."),
    ],
    defaults: { reverb: 65, size: 95 },
  },
  {
    id: "vocal-reverb",
    name: "Vocal Reverb",
    kind: "preset",
    category: "reverb-echo",
    description: "Transparent vocal chamber with pre-delay separation and tailored high damping.",
    supportedOps: ["ImpulseConvolver", "PreDelay", "VocalHighDamp"],
    tags: ["vocal", "singing", "lead", "clean reverb"],
    params: [
      slider("reverb", "Vocal Wet Mix", 0, 70, 1, "%", "Audible vocal reverberation."),
    ],
    defaults: { reverb: 28 },
  },

  /* ----------------------------------------------------
   * 5. Pitch & Tempo
   * ---------------------------------------------------- */
  {
    id: "pitch-432hz",
    name: "432 Hz Tuning Conversion",
    kind: "tool",
    category: "pitch-tempo",
    description: "Converts standard A=440 Hz concert pitch to A=432 Hz sacred tuning (exact 432/440 ratio).",
    supportedOps: ["PitchTuningRatio432", "PhaseResampling"],
    tags: ["432", "432hz", "tuning", "healing", "frequency", "verdi"],
    params: [
      toggle("432hz-enabled", "Enable 432 Hz Tuning Shift", "Transposes pitch by exact -31.76 cents (432/440 factor)."),
    ],
    defaults: { "432hz-enabled": true },
  },
  {
    id: "pitch-shifter",
    name: "Pitch Shifter",
    kind: "tool",
    category: "pitch-tempo",
    description: "Transposes musical pitch up or down by discrete semitones without altering file structure.",
    supportedOps: ["AudioBufferSourceNode.playbackRate", "SemitoneMath"],
    tags: ["pitch", "transpose", "semitone", "key change"],
    params: [
      slider("pitch", "Pitch Transpose", -12, 12, 1, "st", "Negative transposes lower; positive transposes higher."),
    ],
    defaults: { pitch: 0 },
  },
  {
    id: "tempo-changer",
    name: "Tempo / Speed Changer",
    kind: "tool",
    category: "pitch-tempo",
    description: "Adjusts playback speed from 30% to 180% of original tempo.",
    supportedOps: ["AudioBufferSourceNode.playbackRate"],
    tags: ["tempo", "speed", "bpm", "accelerate", "slowdown"],
    params: [
      slider("speed", "Tempo Ratio", 30, 180, 1, "%", "100% is original recording speed."),
    ],
    defaults: { speed: 100 },
  },

  /* ----------------------------------------------------
   * 6. Creative Effects
   * ---------------------------------------------------- */
  {
    id: "reverse",
    name: "Reverse Audio",
    kind: "tool",
    category: "creative",
    description: "Inverts sample buffers back-to-front for surreal backwards swells and reverse transitions.",
    supportedOps: ["SampleBufferReverse"],
    tags: ["reverse", "backwards", "psychedelic", "swell"],
    params: [
      toggle("reverse-enabled", "Reverse Direction", "Reverses sample playback order end-to-start."),
    ],
    defaults: { "reverse-enabled": true },
  },
  {
    id: "underwater",
    name: "Underwater Submersion",
    kind: "preset",
    category: "creative",
    description: "Steep 24 dB/oct low-pass filtering at 480 Hz simulates hearing sound from deep underwater.",
    supportedOps: ["BiquadLowPassSteep", "SubBassResonance"],
    tags: ["underwater", "submerged", "muffled", "party next door", "ocean"],
    params: [
      slider("reverb", "Aquatic Resonance", 0, 100, 1, "%", "Underwater boundary reverberation."),
      slider("bass", "Muffled Low Body", 0, 10, 1, "dB", "Sub-surface low end."),
    ],
    defaults: { reverb: 55, bass: 6 },
  },
  {
    id: "telephone-voice",
    name: "Telephone Speaker",
    kind: "preset",
    category: "creative",
    description: "Sharp bandpass filter restricting frequencies strictly between 450 Hz and 3.2 kHz.",
    supportedOps: ["BandPassChebyshev", "WaveShaperDrive"],
    tags: ["telephone", "intercom", "megaphone", "lofi voice", "call"],
    params: [
      slider("saturation", "Line Distortion", 0, 100, 1, "%", "Analogue line clipping."),
    ],
    defaults: { saturation: 40 },
  },
  {
    id: "lofi-tape",
    name: "Lo-Fi Cassette Tape",
    kind: "preset",
    category: "creative",
    description: "Magnetic tape oxide saturation, softened high frequencies, and slight motor drag.",
    supportedOps: ["WaveShaperSaturation", "HighCutFilter", "PlaybackRate"],
    tags: ["lofi", "tape", "cassette", "vintage", "chillhop"],
    params: [
      slider("saturation", "Tape Saturation", 0, 100, 1, "%", "Magnetic oxide distortion curve."),
      slider("speed", "Motor Pacing", 70, 100, 1, "%", "Mimics slightly dragging tape motor."),
      slider("treble", "Treble Dampening", -8, 2, 1, "dB", "High-frequency head loss."),
    ],
    defaults: { saturation: 50, speed: 94, treble: -3 },
  },

  /* ----------------------------------------------------
   * 7. Audio Cleanup
   * ---------------------------------------------------- */
  {
    id: "noise-reducer",
    name: "Noise Reducer (Rumble Cut)",
    kind: "tool",
    category: "cleanup",
    description: "Cleans out low-frequency microphone thumps, air conditioner hum, and subsonic rumble.",
    supportedOps: ["BiquadHighPass120Hz", "DeMudFilter"],
    tags: ["noise", "rumble", "clean", "hiss", "mic thump"],
    params: [
      toggle("mud-cut", "Engage 115 Hz High-Pass Filter", "Attenuates rumble and room vibration."),
    ],
    defaults: { "mud-cut": true },
  },
  {
    id: "vocal-clarity",
    name: "Vocal Clarity Polish",
    kind: "preset",
    category: "cleanup",
    description: "Enhances presence in speech/vocal frequencies while clearing low-end mud buildup.",
    supportedOps: ["HighPass120Hz", "Peaking2600Hz", "DeMudCut"],
    tags: ["vocal", "clarity", "speech", "podcast", "clean", "intelligibility"],
    params: [
      slider("presence", "Vocal Presence", 0, 8, 1, "dB", "Boost in the 2.6 kHz vocal articulation band."),
      toggle("mud-cut", "Filter Low Mud", "Highpasses below 110 Hz to prevent muddiness."),
    ],
    defaults: { presence: 3.5, "mud-cut": true },
  },
  {
    id: "de-harsh",
    name: "De-Harsh Sibilance Tamer",
    kind: "preset",
    category: "cleanup",
    description: "Smooths fatiguing digital highs and harsh sibilance without sacrificing air.",
    supportedOps: ["PeakingNotch4k", "HighShelfSoftener"],
    tags: ["deharsh", "smooth", "sibilance", "ear fatigue", "soften"],
    params: [
      slider("treble", "Treble Taming", -8, 0, 1, "dB", "Softens upper-treble bite."),
    ],
    defaults: { treble: -3.5 },
  },

  /* ----------------------------------------------------
   * 8. Audio Utilities
   * ---------------------------------------------------- */
  {
    id: "volume-changer",
    name: "Volume / Gain Changer",
    kind: "tool",
    category: "utilities",
    description: "Boosts or attenuates overall audio level from -18 dB to +12 dB with ceiling limiting.",
    supportedOps: ["GainNode", "DecibelMath", "PeakProtectionLimiter"],
    tags: ["volume", "gain", "louder", "quieter", "amplifier", "db"],
    params: [
      slider("volume-db", "Gain Offset", -18, 12, 1, "dB", "Negative reduces volume; positive amplifies."),
    ],
    defaults: { "volume-db": 3 },
  },
  {
    id: "trimmer-cutter",
    name: "Audio Trimmer & Cutter",
    kind: "tool",
    category: "utilities",
    description: "Crops and trims the audio start and end times to export only the selected segment.",
    supportedOps: ["BufferSlice", "OfflineAudioContext"],
    tags: ["trim", "cut", "crop", "slice", "length"],
    params: [
      slider("trim-start", "Start Time", 0, 120, 1, "s", "Beginning of the audio segment."),
      slider("trim-end", "End Time", 1, 300, 1, "s", "End of the audio segment."),
    ],
    defaults: { "trim-start": 0, "trim-end": 60 },
  },
  {
    id: "downmixer",
    name: "Stereo to Mono Downmixer",
    kind: "tool",
    category: "utilities",
    description: "Downmixes stereo multi-channel audio to a single coherent mono channel using 0.5 * (L+R).",
    supportedOps: ["MonoDownmixNode", "PhaseAlignment"],
    tags: ["mono", "downmix", "single channel", "podcast"],
    params: [
      toggle("mud-cut", "Anti-Mud Filtering", "Protects against center-channel bass buildup."),
    ],
    defaults: { "mud-cut": false },
  },
  {
    id: "bpm-detector",
    name: "BPM & Tempo Detector",
    kind: "tool",
    category: "utilities",
    description: "Analyzes transient energy autocorrelation from raw PCM to determine the exact musical BPM.",
    supportedOps: ["AutocorrelationBeatTracker", "PeakEnergyEnvelope"],
    tags: ["bpm", "tempo", "beat detector", "metronome"],
    params: [
      slider("speed", "Target Tempo Shift", 50, 150, 1, "%", "Optionally adjust speed after BPM analysis."),
    ],
    defaults: { speed: 100 },
  },

  /* ----------------------------------------------------
   * 9. Export & Conversion
   * ---------------------------------------------------- */
  {
    id: "format-converter",
    name: "Format Converter",
    kind: "tool",
    category: "export-conversion",
    description: "Transcodes audio between WAV (16/24/32-bit float), MP3 (128–320 kbps), and AIFF directly in-browser.",
    supportedOps: ["MultiFormatEncoder", "PCMResampler"],
    tags: ["converter", "wav to mp3", "transcode", "bitrate", "export"],
    params: [
      toggle("mud-cut", "Low Mud Cut", "Optional low frequency filter before transcoding."),
    ],
    defaults: { "mud-cut": false },
  },
  {
    id: "mastering-polish",
    name: "Mastering Polish & Limiter",
    kind: "preset",
    category: "export-conversion",
    description: "Commercial finishing curve: tight sub weight, open 12kHz air, and true-peak limiter protection.",
    supportedOps: ["SubLowShelf", "AirHighShelf", "SoftCeilingLimiter"],
    tags: ["mastering", "polish", "commercial", "loudness", "radio ready"],
    params: [
      slider("bass", "Low End Weight", 0, 4, 1, "dB", "Subtle low body boost at 80 Hz."),
      slider("treble", "Air Shelf", 0, 4, 1, "dB", "Silky air boost at 12 kHz."),
      slider("presence", "Mid Focus", 0, 3, 1, "dB", "Mix glue peaking boost."),
    ],
    defaults: { bass: 2, treble: 2, presence: 1 },
  },
];

export function getAllPresets(): Preset[] {
  return presets;
}

export function getPresetById(id: string): Preset | undefined {
  return presets.find((preset) => preset.id === id);
}

export function getPresetsByCategory(category: PresetCategoryId): Preset[] {
  return presets.filter((preset) => preset.category === category);
}

export function getPresetsByKind(kind: "preset" | "tool"): Preset[] {
  return presets.filter((preset) => preset.kind === kind);
}

export function searchPresets(
  query: string,
  category?: PresetCategoryId | "all",
  kind?: "all" | "preset" | "tool"
): Preset[] {
  const q = query.toLowerCase().trim();
  return presets.filter((preset) => {
    const matchesCategory = !category || category === "all" || preset.category === category;
    const matchesKind = !kind || kind === "all" || preset.kind === kind;
    if (!matchesCategory || !matchesKind) return false;
    if (!q) return true;

    return (
      preset.name.toLowerCase().includes(q) ||
      preset.description.toLowerCase().includes(q) ||
      preset.tags.some((t) => t.toLowerCase().includes(q)) ||
      preset.supportedOps.some((op) => op.toLowerCase().includes(q))
    );
  });
}

export function resolveDefaults(preset: Preset): Record<string, number | boolean> {
  return { ...preset.defaults };
}
