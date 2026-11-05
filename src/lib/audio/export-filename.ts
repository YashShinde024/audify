/**
 * Audify Standardized Export Filename Generator
 *
 * Implements strict global naming convention for all exported audio files:
 * `Audify-{edit-type}-{song-name}.{extension}`
 *
 * Specification:
 * 1. Brand prefix: Always begins with "Audify-", never produces duplicates like "Audify-Audify-...".
 * 2. Edit type: Derived from active preset or standalone tool, normalized to Title-Case with hyphens.
 *    Falls back to "Custom-Edit" when no named preset is active.
 * 3. Song name: Sanitized stem from source audio file, stripped of extensions, invalid filesystem
 *    characters, and leading/trailing separators. Never duplicates extensions.
 * 4. Extension: Matches actual exported binary format (.wav, .mp3, .aiff).
 * 5. Sequence identifiers: Cleanly supports batch/split outputs like "Audify-Audio-Splitter-Song-Part-01.wav".
 */

export interface FormatExportFilenameOptions {
  /** Preset ID (e.g. "slowed-reverb") or Tool Slug (e.g. "audio-normalizer") */
  editType?: string | null;
  /** Explicit override label for edit type */
  editLabel?: string | null;
  /** Source file name (e.g. "Star Girl.mp3") */
  originalFileName?: string | null;
  /** Exported container format ("wav" | "mp3" | "aiff") */
  extension: "wav" | "mp3" | "aiff" | string;
  /** Optional sequence or partition identifier (e.g. 1 -> "Part-01") */
  partIndex?: number | string | null;
  /** Optional custom user-requested output name */
  customFilename?: string | null;
}

/**
 * Canonical dictionary mapping known preset IDs and tool slugs to standard Title-Cased names.
 */
const EDIT_TYPE_CANONICAL_NAMES: Record<string, string> = {
  // Speed & Viral Presets
  "slowed-reverb": "Slowed-Reverb",
  "slowed": "Slowed",
  "super-slowed": "Super-Slowed",
  "vaporwave": "Vaporwave",
  "sped-up": "Sped-Up",
  "nightcore": "Nightcore",
  "daycore": "Daycore",

  // Stereo & Spatial Presets
  "8d-audio": "8D-Audio",
  "auto-panner": "Auto-Panner",
  "stereo-panner": "Stereo-Panner",
  "stereo-widening": "Stereo-Widener",
  "ping-pong": "Ping-Pong-Delay",
  "haas-spatializer": "Haas-Spatializer",
  "chorus-flanger": "Chorus-Flanger",

  // Bass & EQ Presets
  "bass-boost-light": "Bass-Boost-Light",
  "bass-boost-mod": "Bass-Boost",
  "bass-boost-heavy": "Bass-Boost-Heavy",
  "bass-boost-extreme": "Bass-Boost-Extreme",
  "equalizer": "Equalizer",
  "treble-air": "Treble-Air",
  "mid-scoop": "Mid-Scoop",

  // Reverb & Echo Presets
  "bathroom-reverb": "Bathroom-Reverb",
  "small-room-reverb": "Small-Room-Reverb",
  "medium-room-reverb": "Medium-Room-Reverb",
  "large-room-reverb": "Large-Room-Reverb",
  "church-hall-reverb": "Church-Hall-Reverb",
  "cathedral-reverb": "Cathedral-Reverb",
  "vocal-reverb": "Vocal-Plate-Reverb",
  "plate-reverb": "Plate-Reverb",
  "slapback-echo": "Slapback-Echo",
  "echo-chamber": "Echo-Chamber",

  // Pitch & Tuning Presets
  "pitch-432hz": "Pitch-432Hz",
  "pitch-shifter": "Pitch-Shifter",
  "tempo-changer": "Tempo-Changer",

  // Creative & Lofi Presets
  "reverse": "Reverse-Audio",
  "underwater": "Underwater",
  "telephone-voice": "Telephone-Voice",
  "lofi-tape": "Lo-Fi-Tape",
  "tape-warmth": "Tape-Warmth",
  "tube-warmth": "Tube-Warmth",
  "am-radio": "AM-Radio",
  "muffled-room": "Muffled-Room",
  "bitcrusher": "Bitcrusher",

  // Cleanup & Dynamics Presets
  "sub-rumble-cut": "Sub-Rumble-Cut",
  "noise-reducer": "Noise-Reducer",
  "vocal-air": "Vocal-Air",
  "vocal-clarity": "Vocal-Clarity",
  "de-harsh": "De-Harsh",
  "podcast-voice": "Podcast-Voice",
  "gentle-compression": "Gentle-Compression",
  "vocal-leveling": "Vocal-Leveling",
  "dc-offset-remover": "DC-Offset-Remover",
  "compressor": "Audio-Compressor",
  "vocal-remover": "Vocal-Remover",
  "mastering-polish": "Mastering-Polish",
  "music-bus-glue": "Music-Bus-Glue",

  // Audio Utilities & Standalone Tools
  "audio-converter": "Audio-Converter",
  "format-converter": "Audio-Converter",
  "sample-rate-converter": "Sample-Rate-Converter",
  "channel-converter": "Channel-Converter",
  "downmixer": "Mono-Downmixer",
  "audio-trimmer": "Audio-Trimmer",
  "trimmer-cutter": "Audio-Trimmer",
  "audio-merger": "Audio-Merger",
  "audio-splitter": "Audio-Splitter",
  "reverse-audio": "Reverse-Audio",
  "audio-fades": "Audio-Fades",
  "fade-in-out": "Audio-Fades",
  "audio-compressor": "Audio-Compressor",
  "audio-normalizer": "Audio-Normalizer",
  "volume-changer": "Volume-Changer",
  "audio-equalizer": "Audio-Equalizer",
  "bass-booster": "Bass-Booster",
  "bpm-detector": "BPM-Detector",
  "audio-metadata": "Audio-Metadata",
};

/** Common audio file extensions to strip from stems. */
const AUDIO_EXTENSION_REGEX = /\.(wav|mp3|aiff|aif|flac|ogg|m4a|aac|opus|weba|webm|wma)$/i;

/** Invalid filesystem characters on Windows, macOS, and Linux: < > : " / \ | ? * and control chars */
const INVALID_FILENAME_CHARS_REGEX = /[<>:"/\\|?*\x00-\x1F]+/g;

/**
 * Normalizes an edit-type identifier or preset slug into Title-Case with hyphens.
 */
export function normalizeEditType(editType?: string | null, customLabel?: string | null): string {
  if (customLabel && customLabel.trim()) {
    const cleaned = customLabel
      .trim()
      .replace(INVALID_FILENAME_CHARS_REGEX, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (cleaned) return cleaned;
  }

  if (!editType || !editType.trim() || editType === "custom" || editType === "custom-dsp") {
    return "Custom-Edit";
  }

  const slug = editType.trim().toLowerCase();
  if (EDIT_TYPE_CANONICAL_NAMES[slug]) {
    return EDIT_TYPE_CANONICAL_NAMES[slug];
  }

  // Fallback heuristic: convert kebab-case / snake_case into Title-Case
  const words = slug.split(/[-_]+/).filter(Boolean);
  if (words.length === 0) return "Custom-Edit";

  return words
    .map((w) => {
      if (w === "8d") return "8D";
      if (w === "432hz") return "432Hz";
      if (w === "eq") return "EQ";
      if (w === "bpm") return "BPM";
      if (w === "dc") return "DC";
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join("-");
}

/**
 * Sanitizes a song name stem, removing extensions, duplicate Audify prefixes,
 * and invalid characters.
 */
export function sanitizeSongStem(originalFileName?: string | null): string {
  if (!originalFileName || !originalFileName.trim()) {
    return "Audio";
  }

  let stem = originalFileName.trim();

  // Strip known audio extensions (repeat in case of duplicate extensions like .wav.mp3)
  while (AUDIO_EXTENSION_REGEX.test(stem)) {
    stem = stem.replace(AUDIO_EXTENSION_REGEX, "").trim();
  }

  // Strip leading "audify-" or "audify_" if already present in the source file name
  // to avoid redundant "Audify-Nightcore-Audify-..."
  stem = stem.replace(/^audify[-_\s]+/i, "");

  // Replace invalid filesystem characters and separators with hyphens
  stem = stem
    .replace(INVALID_FILENAME_CHARS_REGEX, "-")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // Bounded length protection (keep stem <= 64 chars to guarantee safety across all OS limits)
  if (stem.length > 64) {
    stem = stem.substring(0, 64).replace(/-+$/, "");
  }

  return stem || "Audio";
}

/**
 * Formats a sequence/part identifier (e.g. 1 -> "Part-01", 12 -> "Part-12").
 */
export function formatSequencePart(part?: number | string | null): string | null {
  if (part == null || part === "") return null;
  if (typeof part === "number") {
    const num = Math.max(1, Math.floor(part));
    return `Part-${num.toString().padStart(2, "0")}`;
  }
  const clean = part.toString().trim().replace(INVALID_FILENAME_CHARS_REGEX, "-");
  if (!clean) return null;
  if (/^part[-_\s]?\d+$/i.test(clean)) {
    const digits = clean.match(/\d+/)?.[0] ?? "1";
    return `Part-${digits.padStart(2, "0")}`;
  }
  return clean.replace(/\s+/g, "-");
}

/**
 * Centralized standard export filename generator.
 *
 * Produces: `Audify-{edit-type}-{song-name}.{extension}`
 * Or for splits/batches: `Audify-{edit-type}-{song-name}-Part-01.{extension}`
 */
export function formatExportFilename(options: FormatExportFilenameOptions): string {
  const {
    editType,
    editLabel,
    originalFileName,
    extension,
    partIndex,
    customFilename,
  } = options;

  // Normalize container extension
  const extClean = (extension || "wav").toLowerCase().replace(/^\./, "").trim();
  const validExt = extClean === "mp3" ? "mp3" : extClean === "aiff" || extClean === "aif" ? "aiff" : "wav";

  // If user provided an explicit custom filename:
  if (customFilename && customFilename.trim()) {
    let cleanCustom = customFilename.trim();
    // Strip trailing extension if typed by user
    cleanCustom = cleanCustom.replace(AUDIO_EXTENSION_REGEX, "");
    cleanCustom = cleanCustom
      .replace(INVALID_FILENAME_CHARS_REGEX, "-")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Ensure it begins with Audify-
    if (!/^audify[-]/i.test(cleanCustom)) {
      cleanCustom = `Audify-${cleanCustom}`;
    } else {
      // Normalize casing of prefix
      cleanCustom = cleanCustom.replace(/^audify[-]/i, "Audify-");
    }

    const seqPart = formatSequencePart(partIndex);
    if (seqPart && !cleanCustom.includes(seqPart)) {
      cleanCustom = `${cleanCustom}-${seqPart}`;
    }

    return `${cleanCustom}.${validExt}`;
  }

  // Standard derivation:
  const resolvedEditType = normalizeEditType(editType, editLabel);
  const resolvedSongStem = sanitizeSongStem(originalFileName);
  const seqPart = formatSequencePart(partIndex);

  // Avoid repetitive edit type in song stem if song stem already contains it
  // e.g. stem "Nightcore-Track" with editType "Nightcore"
  let cleanStem = resolvedSongStem;
  const editTypeLower = resolvedEditType.toLowerCase();
  if (cleanStem.toLowerCase() === editTypeLower) {
    cleanStem = "Track";
  } else if (cleanStem.toLowerCase().startsWith(`${editTypeLower}-`)) {
    cleanStem = cleanStem.slice(editTypeLower.length + 1);
  }

  const base = seqPart
    ? `Audify-${resolvedEditType}-${cleanStem}-${seqPart}`
    : `Audify-${resolvedEditType}-${cleanStem}`;

  return `${base}.${validExt}`;
}

