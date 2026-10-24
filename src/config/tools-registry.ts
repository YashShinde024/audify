/**
 * Audify Canonical Audio Tools Registry
 * Defines all task-oriented audio utilities available under /tools and /tools/[slug].
 */

export type ToolCategory = "convert-export" | "edit-audio" | "enhance-audio" | "audio-info";

export interface ToolSettingOption {
  label: string;
  value: string | number;
}

export interface ToolSetting {
  id: string;
  label: string;
  description: string;
  type: "select" | "slider" | "toggle" | "time-range" | "file-list";
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: ToolSettingOption[];
}

export interface ToolDefinition {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  categoryLabel: string;
  badge: string;
  presetId?: string; // Matching preset in presets.ts if mapped to Studio
  multiFile?: boolean;
  specs: string;
  supportedInputs: string[];
  supportedOutputs: string[];
  settings: ToolSetting[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  articleSlug?: string;
}

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // -------------------------------------------------------------
  // 1. CONVERT & EXPORT
  // -------------------------------------------------------------
  {
    slug: "audio-converter",
    name: "Audio Converter",
    tagline: "Convert audio files to WAV, MP3, or AIFF directly in your browser",
    description:
      "Transcode any audio format (MP3, WAV, FLAC, OGG, AAC, M4A) into uncompressed 16/24/32-bit float WAV, broadcast AIFF, or high-bitrate MP3 with custom sample rates and channel settings.",
    category: "convert-export",
    categoryLabel: "Convert & Export",
    badge: "Transcoder",
    presetId: "format-converter",
    specs: "WAV, AIFF, MP3 · 44.1 / 48.0 kHz · Up to 320 kbps CBR",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC", "M4A"],
    supportedOutputs: ["WAV (16-bit)", "WAV (24-bit)", "WAV (32-bit Float)", "AIFF", "MP3 (320 kbps)", "MP3 (192 kbps)", "MP3 (128 kbps)"],
    settings: [
      {
        id: "format",
        label: "Output Format",
        description: "Choose your target audio container format",
        type: "select",
        defaultValue: "wav",
        options: [
          { label: "WAV (Lossless PCM)", value: "wav" },
          { label: "MP3 (Compressed MPEG)", value: "mp3" },
          { label: "AIFF (Broadcast Big-Endian)", value: "aiff" },
        ],
      },
      {
        id: "bitDepth",
        label: "PCM Bit Depth (WAV / AIFF)",
        description: "Select sample precision for lossless formats",
        type: "select",
        defaultValue: 24,
        options: [
          { label: "16-bit Signed Integer (CD Standard)", value: 16 },
          { label: "24-bit Signed Integer (Studio Master)", value: 24 },
          { label: "32-bit IEEE Float (Infinite Headroom)", value: 32 },
        ],
      },
      {
        id: "mp3Bitrate",
        label: "MP3 Bitrate",
        description: "Target encoding bitrate for MP3 files",
        type: "select",
        defaultValue: 320,
        options: [
          { label: "320 kbps (Maximum Quality CBR)", value: 320 },
          { label: "256 kbps (High Quality)", value: 256 },
          { label: "192 kbps (Standard Quality)", value: 192 },
          { label: "128 kbps (Compact Web Streaming)", value: 128 },
        ],
      },
      {
        id: "sampleRate",
        label: "Sample Rate",
        description: "Output sample clock frequency",
        type: "select",
        defaultValue: 44100,
        options: [
          { label: "44.1 kHz (CD Standard)", value: 44100 },
          { label: "48.0 kHz (Broadcast & Video Standard)", value: 48000 },
        ],
      },
    ],
    seo: {
      title: "Audio Converter Online — Free In-Browser Transcoder · Audify",
      description:
        "Convert MP3, WAV, FLAC, OGG, and AAC to lossless WAV, broadcast AIFF, or 320k MP3 in your browser without uploading files to remote servers.",
      keywords: ["audio converter", "wav to mp3", "flac to wav", "online audio converter", "mp3 converter free"],
    },
    articleSlug: "format-converter",
  },
  {
    slug: "sample-rate-converter",
    name: "Sample Rate Converter",
    tagline: "Resample audio to 22.05 kHz, 32 kHz, 44.1 kHz, or 48 kHz",
    description:
      "Mathematical windowed-sinc resampling that converts audio sample clock rates with polyphase anti-aliasing filters while strictly preserving original pitch and duration.",
    category: "convert-export",
    categoryLabel: "Convert & Export",
    badge: "Resampler",
    presetId: "format-converter",
    specs: "Windowed-Sinc Interpolation · 22.05 to 48.0 kHz",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (16/24/32-bit)", "AIFF", "MP3"],
    settings: [
      {
        id: "targetRate",
        label: "Target Sample Rate",
        description: "Resample audio clock to desired frequency",
        type: "select",
        defaultValue: 48000,
        options: [
          { label: "48.0 kHz (Video & Film Standard)", value: 48000 },
          { label: "44.1 kHz (Music & CD Standard)", value: 44100 },
          { label: "32.0 kHz (Broadcast Voice)", value: 32000 },
          { label: "22.05 kHz (Low-Bandwidth / Retro)", value: 22050 },
        ],
      },
      {
        id: "format",
        label: "Output Format",
        description: "Container format for resampled output",
        type: "select",
        defaultValue: "wav",
        options: [
          { label: "WAV (Lossless)", value: "wav" },
          { label: "MP3", value: "mp3" },
          { label: "AIFF", value: "aiff" },
        ],
      },
    ],
    seo: {
      title: "Sample Rate Converter Online — Resample Audio Free · Audify",
      description:
        "Resample audio between 44.1 kHz, 48 kHz, 32 kHz, and 22.05 kHz with genuine windowed-sinc interpolation in your browser memory.",
      keywords: ["sample rate converter", "resample audio online", "44.1khz to 48khz", "audio resampler"],
    },
  },
  {
    slug: "channel-converter",
    name: "Audio Channel Converter",
    tagline: "Convert stereo audio to mono or rebalance channels",
    description:
      "Downmix stereo signals into a mono stream using an equal-power -3 dB summation law to prevent acoustic clipping, with an optional 120 Hz low-shelf mud reduction filter.",
    category: "convert-export",
    categoryLabel: "Convert & Export",
    badge: "Channels",
    presetId: "downmixer",
    specs: "-3 dB Equal Power Law · Mud Reduction Filter",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (Mono/Stereo)", "MP3 (Mono/Stereo)"],
    settings: [
      {
        id: "channelMode",
        label: "Channel Mode",
        description: "Target acoustic channel configuration",
        type: "select",
        defaultValue: "mono",
        options: [
          { label: "Stereo to Mono (Summed -3 dB)", value: "mono" },
          { label: "Preserve Stereo (Pass-Through)", value: "stereo" },
        ],
      },
      {
        id: "mudCut",
        label: "Low-Frequency Mud Reduction",
        description: "Attenuate low-mid buildup (120 Hz shelf at -3.5 dB) during mono summation",
        type: "toggle",
        defaultValue: true,
      },
    ],
    seo: {
      title: "Stereo to Mono Audio Converter Online · Audify",
      description:
        "Downmix stereo tracks to mono using power-preserving summation. Prevent phase cancellation and acoustic clipping without uploading files.",
      keywords: ["stereo to mono converter", "convert stereo to mono online", "audio downmixer", "mono converter free"],
    },
    articleSlug: "downmixer",
  },

  // -------------------------------------------------------------
  // 2. EDIT AUDIO
  // -------------------------------------------------------------
  {
    slug: "audio-trimmer",
    name: "Audio Trimmer & Cutter",
    tagline: "Cut and trim audio tracks with sample-level accuracy",
    description:
      "Extract custom audio sections by specifying exact start and end timestamps. Operates directly on raw decoded 32-bit float PCM buffers with zero generational compression loss.",
    category: "edit-audio",
    categoryLabel: "Edit Audio",
    badge: "Editing",
    presetId: "trimmer-cutter",
    specs: "Millisecond Precision · Instant Waveform Scrubbing",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (Lossless)", "MP3 (320 kbps)"],
    settings: [
      {
        id: "timeRange",
        label: "Trim Range",
        description: "Set start and end times in seconds",
        type: "time-range",
        defaultValue: { start: 0, end: 30 },
      },
      {
        id: "format",
        label: "Export Format",
        description: "Format for trimmed audio segment",
        type: "select",
        defaultValue: "wav",
        options: [
          { label: "WAV (Lossless)", value: "wav" },
          { label: "MP3 (320 kbps)", value: "mp3" },
        ],
      },
    ],
    seo: {
      title: "Audio Trimmer & Cutter Online — Trim Audio Free · Audify",
      description:
        "Cut and trim audio files with millisecond accuracy in your browser. Extract clips, ringtones, and podcast segments without quality loss.",
      keywords: ["audio trimmer", "audio cutter", "cut audio online", "mp3 trimmer", "trim audio free"],
    },
    articleSlug: "trimmer-cutter",
  },
  {
    slug: "audio-merger",
    name: "Audio Merger & Joiner",
    tagline: "Combine multiple audio tracks into a single seamless file",
    description:
      "Join two or more audio tracks sequentially in custom order with automatic sample-rate synchronization, channel matching, and configurable inter-track silence gaps.",
    category: "edit-audio",
    categoryLabel: "Edit Audio",
    badge: "Joiner",
    multiFile: true,
    specs: "Multi-Track Sequence · Auto Sample-Rate Sync",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (Lossless)", "MP3 (320 kbps)"],
    settings: [
      {
        id: "gapSeconds",
        label: "Gap Between Tracks",
        description: "Silence duration inserted between merged clips",
        type: "select",
        defaultValue: 0.5,
        options: [
          { label: "No Gap (0 seconds)", value: 0 },
          { label: "0.5 seconds", value: 0.5 },
          { label: "1.0 second", value: 1.0 },
          { label: "2.0 seconds", value: 2.0 },
        ],
      },
      {
        id: "format",
        label: "Output Format",
        description: "Export format for joined master",
        type: "select",
        defaultValue: "wav",
        options: [
          { label: "WAV (Lossless)", value: "wav" },
          { label: "MP3 (320 kbps)", value: "mp3" },
        ],
      },
    ],
    seo: {
      title: "Audio Merger Online — Join Multiple Audio Files · Audify",
      description:
        "Combine and merge audio files sequentially in your browser. Reorder tracks, customize gaps, and export seamless WAV or MP3 files.",
      keywords: ["audio merger", "join audio files", "combine songs online", "audio joiner free", "merge mp3"],
    },
  },
  {
    slug: "audio-splitter",
    name: "Audio Splitter",
    tagline: "Split audio files into equal parts or duration segments",
    description:
      "Divide an audio file into multiple playable clips either by equal part count (2, 3, 4 parts) or fixed duration intervals (e.g. 30s, 60s). Download individual segments instantly.",
    category: "edit-audio",
    categoryLabel: "Edit Audio",
    badge: "Splitter",
    specs: "Equal Parts / Interval Splitting · Individual Downloads",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (Lossless)", "MP3"],
    settings: [
      {
        id: "splitMode",
        label: "Split Method",
        description: "Choose how to divide the audio file",
        type: "select",
        defaultValue: "parts",
        options: [
          { label: "Split into Equal Parts (2–6)", value: "parts" },
          { label: "Split by Fixed Duration Interval", value: "duration" },
        ],
      },
      {
        id: "partCount",
        label: "Number of Equal Parts",
        description: "How many segments to produce",
        type: "select",
        defaultValue: 2,
        options: [
          { label: "2 Equal Parts", value: 2 },
          { label: "3 Equal Parts", value: 3 },
          { label: "4 Equal Parts", value: 4 },
          { label: "5 Equal Parts", value: 5 },
          { label: "6 Equal Parts", value: 6 },
        ],
      },
      {
        id: "segmentDuration",
        label: "Interval Duration (Seconds)",
        description: "Length of each segment when splitting by duration",
        type: "select",
        defaultValue: 30,
        options: [
          { label: "15 Seconds per clip", value: 15 },
          { label: "30 Seconds per clip", value: 30 },
          { label: "60 Seconds per clip", value: 60 },
          { label: "120 Seconds per clip", value: 120 },
        ],
      },
    ],
    seo: {
      title: "Audio Splitter Online — Split Audio Files into Segments · Audify",
      description:
        "Split long audio recordings into equal parts or fixed-duration clips in your browser. Download segments individually without server uploads.",
      keywords: ["audio splitter", "split audio online", "split mp3 into parts", "audio segmenter free"],
    },
  },
  {
    slug: "reverse-audio",
    name: "Reverse Audio",
    tagline: "Invert audio sample order for reverse effects",
    description:
      "Reverses audio sample arrays across all channels, creating reverse cymbal swells, backward vocals, experimental risers, and mysterious sound design.",
    category: "edit-audio",
    categoryLabel: "Edit Audio",
    badge: "Reversal",
    presetId: "reverse",
    specs: "Float32 Array Inversion · Preserves Channels & Duration",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (Lossless)", "MP3 (320 kbps)"],
    settings: [
      {
        id: "format",
        label: "Export Format",
        description: "Format for reversed audio",
        type: "select",
        defaultValue: "wav",
        options: [
          { label: "WAV (Lossless)", value: "wav" },
          { label: "MP3 (320 kbps)", value: "mp3" },
        ],
      },
    ],
    seo: {
      title: "Reverse Audio Online — Play Audio Backwards · Audify",
      description:
        "Reverse audio files backwards in your browser with sample-accurate Float32 inversion. Create backwards reverb risers and sound design effects.",
      keywords: ["reverse audio", "play audio backwards", "reverse mp3 online", "backwards audio maker"],
    },
    articleSlug: "reverse",
  },
  {
    slug: "audio-fades",
    name: "Audio Fade In & Fade Out",
    tagline: "Apply smooth entrance and exit volume envelopes",
    description:
      "Apply configurable duration fade-in and fade-out volume curves to eliminate sudden audio cutoffs, harsh digital clicks, and DC thumps.",
    category: "edit-audio",
    categoryLabel: "Edit Audio",
    badge: "Envelopes",
    presetId: "fade-in-out",
    specs: "0 to 15s Envelopes · Linear & S-Curve Gain Envelopes",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (Lossless)", "MP3 (320 kbps)"],
    settings: [
      {
        id: "fadeIn",
        label: "Fade In Duration",
        description: "Length of the opening volume ramp in seconds",
        type: "slider",
        defaultValue: 2,
        min: 0,
        max: 15,
        step: 0.5,
        unit: "s",
      },
      {
        id: "fadeOut",
        label: "Fade Out Duration",
        description: "Length of the closing volume ramp in seconds",
        type: "slider",
        defaultValue: 3,
        min: 0,
        max: 15,
        step: 0.5,
        unit: "s",
      },
    ],
    seo: {
      title: "Audio Fade In & Out Online — Smooth Audio Envelopes · Audify",
      description:
        "Add smooth fade-in and fade-out volume transitions to audio files online. Eliminate clicks and harsh track cutoffs in your browser.",
      keywords: ["audio fade in fade out", "fade audio online", "fade in mp3", "audio volume envelope"],
    },
    articleSlug: "fade-in-out",
  },

  // -------------------------------------------------------------
  // 3. ENHANCE AUDIO
  // -------------------------------------------------------------
  {
    slug: "audio-compressor",
    name: "Audio Compressor",
    tagline: "Control dynamic range, level vocals, and punch up mixes",
    description:
      "Professional dynamic range compression powered by Web Audio's DynamicsCompressorNode. Features adjustable threshold, ratio, attack, release, knee, and makeup gain with parallel wet/dry blending.",
    category: "enhance-audio",
    categoryLabel: "Enhance Audio",
    badge: "Dynamics",
    presetId: "compressor",
    specs: "Threshold -60 dB · Ratio up to 20:1 · Soft Knee · Makeup Gain",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (Lossless)", "MP3 (320 kbps)"],
    settings: [
      {
        id: "threshold",
        label: "Threshold",
        description: "Signal level in dB above which compression begins",
        type: "slider",
        defaultValue: -20,
        min: -60,
        max: 0,
        step: 1,
        unit: "dB",
      },
      {
        id: "ratio",
        label: "Ratio",
        description: "Input to output volume reduction ratio (e.g. 4:1)",
        type: "slider",
        defaultValue: 4,
        min: 1,
        max: 20,
        step: 0.5,
        unit: ":1",
      },
      {
        id: "attack",
        label: "Attack Time",
        description: "How quickly compression clamps down on loud transients",
        type: "slider",
        defaultValue: 15,
        min: 1,
        max: 200,
        step: 1,
        unit: "ms",
      },
      {
        id: "release",
        label: "Release Time",
        description: "How smoothly compression releases back to uncompressed gain",
        type: "slider",
        defaultValue: 180,
        min: 10,
        max: 1000,
        step: 10,
        unit: "ms",
      },
      {
        id: "makeup",
        label: "Makeup Gain",
        description: "Compensate for volume reduction to boost perceived loudness",
        type: "slider",
        defaultValue: 4,
        min: 0,
        max: 24,
        step: 0.5,
        unit: "dB",
      },
    ],
    seo: {
      title: "Audio Compressor Online — Dynamic Range Compression · Audify",
      description:
        "Compress audio dynamics online. Level vocals, smooth podcasts, and glue music mixes with threshold, ratio, attack, release, and makeup gain.",
      keywords: ["audio compressor", "dynamic range compression online", "compress audio free", "vocal compressor"],
    },
    articleSlug: "compressor",
  },
  {
    slug: "audio-normalizer",
    name: "Audio Normalizer",
    tagline: "Maximize volume safely with peak normalization",
    description:
      "Mathematically scales audio sample values so the single loudest transient reaches a calibrated target ceiling (−0.3 dBFS, −1 dBFS, −3 dBFS) without altering internal dynamic relationships.",
    category: "enhance-audio",
    categoryLabel: "Enhance Audio",
    badge: "Normalizer",
    presetId: "volume-changer",
    specs: "Peak Normalization · Inter-Sample Peak Headroom",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (Lossless)", "MP3 (320 kbps)"],
    settings: [
      {
        id: "targetCeiling",
        label: "Target Peak Ceiling",
        description: "Maximum allowable peak level in the exported file",
        type: "select",
        defaultValue: -0.3,
        options: [
          { label: "−0.3 dBFS (Maximum Safe Broadcast Ceiling)", value: -0.3 },
          { label: "−1.0 dBFS (Streaming Standard Headroom)", value: -1.0 },
          { label: "−2.0 dBFS (Conservative Master Ceiling)", value: -2.0 },
          { label: "−3.0 dBFS (Podcast Speech Norm)", value: -3.0 },
        ],
      },
    ],
    seo: {
      title: "Audio Normalizer Online — Peak Normalize Audio Free · Audify",
      description:
        "Peak normalize audio files to −0.3 dBFS or −1 dBFS in your browser. Maximize volume and prevent clipping distortion without cloud uploads.",
      keywords: ["audio normalizer", "normalize audio online", "peak normalizer free", "normalize mp3 volume"],
    },
  },
  {
    slug: "volume-changer",
    name: "Volume Changer",
    tagline: "Boost or reduce track volume with lookahead peak protection",
    description:
      "Apply linear decibel gain adjustments from −24 dB to +24 dB. Output is automatically protected by Audify's lookahead sample-peak limiter at −0.3 dBFS to prevent digital distortion.",
    category: "enhance-audio",
    categoryLabel: "Enhance Audio",
    badge: "Gain",
    presetId: "volume-changer",
    specs: "−24 dB to +24 dB Gain · Lookahead Peak Limiter",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (Lossless)", "MP3 (320 kbps)"],
    settings: [
      {
        id: "gainDb",
        label: "Volume Adjustment",
        description: "Decibel boost (positive) or attenuation (negative)",
        type: "slider",
        defaultValue: 3,
        min: -24,
        max: 24,
        step: 0.5,
        unit: "dB",
      },
    ],
    seo: {
      title: "Volume Changer Online — Boost or Lower Audio Volume · Audify",
      description:
        "Change audio track volume with clean decibel gain. Boost quiet files or reduce loud tracks with automatic limiter protection.",
      keywords: ["volume changer", "boost audio volume online", "make audio louder", "audio gain tool"],
    },
    articleSlug: "volume-changer",
  },
  {
    slug: "audio-equalizer",
    name: "3-Band Audio Equalizer",
    tagline: "Sculpt low, mid, and high frequencies with parametric precision",
    description:
      "Interactive 3-band parametric equalizer featuring a 120 Hz low-shelf, 2.4 kHz peaking bell for vocal presence, and a 9 kHz high-shelf for cymbal and vocal air.",
    category: "enhance-audio",
    categoryLabel: "Enhance Audio",
    badge: "EQ",
    presetId: "equalizer",
    specs: "120 Hz Low-Shelf · 2.4 kHz Mid-Bell · 9 kHz High-Shelf",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (Lossless)", "MP3 (320 kbps)"],
    settings: [
      {
        id: "bass",
        label: "Bass (120 Hz Low Shelf)",
        description: "Boost sub and bass warmth or cut low-end mud",
        type: "slider",
        defaultValue: 0,
        min: -12,
        max: 12,
        step: 0.5,
        unit: "dB",
      },
      {
        id: "mid",
        label: "Midrange (2.4 kHz Bell)",
        description: "Bring vocals forward or scoop harsh frequencies",
        type: "slider",
        defaultValue: 0,
        min: -12,
        max: 12,
        step: 0.5,
        unit: "dB",
      },
      {
        id: "high",
        label: "Treble (9.0 kHz High Shelf)",
        description: "Add acoustic air and sparkle or tame sibilance",
        type: "slider",
        defaultValue: 0,
        min: -12,
        max: 12,
        step: 0.5,
        unit: "dB",
      },
    ],
    seo: {
      title: "Audio Equalizer Online — 3-Band Parametric EQ · Audify",
      description:
        "Equalize audio tracks online with our 3-band parametric EQ. Adjust bass, mid presence, and treble air directly in your browser.",
      keywords: ["audio equalizer", "online equalizer", "equalize audio free", "parametric eq online"],
    },
    articleSlug: "equalizer",
  },
  {
    slug: "bass-booster",
    name: "Bass Booster",
    tagline: "Enhance low-end frequencies with calibrated analog curves",
    description:
      "Infuse tracks with powerful low-end energy using calibrated 75–95 Hz low-shelf acoustic filters, protected by our automated lookahead brickwall limiter.",
    category: "enhance-audio",
    categoryLabel: "Enhance Audio",
    badge: "Bass",
    presetId: "bass-boost-heavy",
    specs: "75–95 Hz Shelf · Automated Limiter Protection",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (Lossless)", "MP3 (320 kbps)"],
    settings: [
      {
        id: "intensity",
        label: "Boost Level",
        description: "Low-end enhancement tier",
        type: "select",
        defaultValue: "moderate",
        options: [
          { label: "Light Boost (+3.5 dB @ 95 Hz)", value: "light" },
          { label: "Moderate Boost (+7.0 dB @ 85 Hz)", value: "moderate" },
          { label: "Heavy Boost (+10.5 dB @ 75 Hz)", value: "heavy" },
          { label: "Extreme Boost (+15.0 dB @ 65 Hz with Limiter)", value: "extreme" },
        ],
      },
    ],
    seo: {
      title: "Bass Booster Online — Deep Bass Enhancement · Audify",
      description:
        "Boost bass in your audio files online. Add deep punch and sub-bass warmth with automated peak limiter protection against clipping.",
      keywords: ["bass booster", "bass boost online", "boost bass in song", "bass booster free"],
    },
    articleSlug: "bass-boost-heavy",
  },
  {
    slug: "vocal-remover",
    name: "Vocal Remover & Center Extractor",
    tagline: "Isolate or remove center vocals with Mid/Side phase cancellation",
    description:
      "Mid/Side subtractive matrix processor that cancels out center-panned lead vocal signals while retaining wide stereo instrumentals and sub-bass through a crossover filter.",
    category: "enhance-audio",
    categoryLabel: "Enhance Audio",
    badge: "Isolation",
    presetId: "vocal-remover",
    specs: "Mid/Side Phase Subtraction · Sub-Bass Crossover Filter",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC"],
    supportedOutputs: ["WAV (Lossless)", "MP3 (320 kbps)"],
    settings: [
      {
        id: "mode",
        label: "Processing Mode",
        description: "Choose whether to remove or isolate center vocals",
        type: "select",
        defaultValue: "remove-center",
        options: [
          { label: "Remove Center Vocals (Create Instrumental)", value: "remove-center" },
          { label: "Isolate Center Channel (Acapella Focus)", value: "isolate-center" },
        ],
      },
      {
        id: "bassPreserve",
        label: "Sub-Bass Crossover Retention",
        description: "Frequency cutoff below which kick and bass are protected from cancellation",
        type: "slider",
        defaultValue: 120,
        min: 40,
        max: 300,
        step: 10,
        unit: "Hz",
      },
      {
        id: "reduction",
        label: "Center Reduction Intensity",
        description: "Depth of center phase cancellation",
        type: "slider",
        defaultValue: 90,
        min: 20,
        max: 100,
        step: 5,
        unit: "%",
      },
    ],
    seo: {
      title: "Vocal Remover Online — Remove Vocals from Songs Free · Audify",
      description:
        "Remove vocals from songs online using Mid/Side center-channel phase subtraction with bass retention. Create karaoke tracks in your browser.",
      keywords: ["vocal remover", "remove vocals from song", "karaoke maker online", "vocal extractor free"],
    },
    articleSlug: "vocal-remover",
  },

  // -------------------------------------------------------------
  // 4. AUDIO INFORMATION & INSPECTION
  // -------------------------------------------------------------
  {
    slug: "audio-metadata",
    name: "Audio File Inspector & Metadata",
    tagline: "Inspect technical audio properties, sample rates, and tags",
    description:
      "Instant in-browser diagnostic inspector that decodes and reveals duration, sample clock frequency, channel layout, peak amplitude, RMS loudness, and DC offset directly from audio headers and sample buffers.",
    category: "audio-info",
    categoryLabel: "Audio Information",
    badge: "Diagnostic",
    specs: "Header & PCM Sample Inspection · No Transcoding Required",
    supportedInputs: ["MP3", "WAV", "OGG", "FLAC", "AAC", "M4A"],
    supportedOutputs: ["On-Screen Report", "JSON Metadata Export"],
    settings: [],
    seo: {
      title: "Audio Metadata & File Inspector Online · Audify",
      description:
        "Inspect audio file metadata, sample rates, duration, RMS levels, and channel layouts directly in your browser without uploading files.",
      keywords: ["audio metadata viewer", "check audio sample rate", "audio file inspector", "view mp3 properties"],
    },
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug);
}

export function getAllToolSlugs(): string[] {
  return TOOLS_REGISTRY.map((t) => t.slug);
}

export const PRESET_TO_TOOL_SLUG: Record<string, string> = {
  "format-converter": "audio-converter",
  "sample-rate-converter": "sample-rate-converter",
  "downmixer": "channel-converter",
  "trimmer-cutter": "audio-trimmer",
  "audio-merger": "audio-merger",
  "audio-splitter": "audio-splitter",
  "reverse": "reverse-audio",
  "fade-in-out": "audio-fades",
  "compressor": "audio-compressor",
  "audio-normalizer": "audio-normalizer",
  "volume-changer": "volume-changer",
  "equalizer": "audio-equalizer",
  "vocal-remover": "vocal-remover",
  "bpm-detector": "audio-metadata",
};

export function getToolSlugForPreset(presetId: string): string | undefined {
  return PRESET_TO_TOOL_SLUG[presetId];
}

