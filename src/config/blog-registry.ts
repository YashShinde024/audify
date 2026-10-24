import type { PresetId } from "./presets";

/**
 * Central preset → article registry. Every preset in `src/config/presets.ts`
 * must have exactly one entry whose `slug` and `title` are unique across the
 * registry (enforced by `pnpm test` / `vitest run`).
 *
 * Six in-depth articles already exist as static routes under `src/app/blog/<slug>`;
 * the remaining presets are rendered by `src/app/blog/[slug]/page.tsx` from the
 * structured data in `src/config/preset-article-bodies/`.
 */
export interface PresetArticleMeta {
  /** Preset this article documents. `null` for extra overview guides (e.g. bass-boost overview kept from the legacy static page). */
  presetId: PresetId | null;
  slug: string;
  title: string;
  /** ~150-character meta description used for SEO + OG. */
  description: string;
  categoryLabel: string;
  readMinutes: number;
  /** Static pages that already ship their own hand-written route. */
  legacyStatic?: boolean;
}

export const presetArticleRegistry: PresetArticleMeta[] = [
  // ---- 1. Speed & Viral Edits ----
  { presetId: "slowed-reverb", slug: "slowed-reverb", title: "The Science & Culture of Slowed + Reverb", description: "The complete DSP chain behind slowed + reverb: playback-rate reduction, formant shifting, and a heavily-damped convolution tail.", categoryLabel: "Speed & Viral Edits", readMinutes: 6, legacyStatic: true },
  { presetId: "slowed", slug: "slowed", title: "How to Slow Down a Song Without Audio Artifacts", description: "Playback-rate resampling explained: why slowing to 0.85x drops pitch and lengthens the file, and how to choose the right rate.", categoryLabel: "Speed & Viral Edits", readMinutes: 5 },
  { presetId: "super-slowed", slug: "super-slowed", title: "Super Slowed: Extreme Time Dilation for Your Music", description: "Pushing playback down to 0.60x—the deepest slowed aesthetic, its sub-tail side effects and when to add warmth back in.", categoryLabel: "Speed & Viral Edits", readMinutes: 5 },
  { presetId: "sped-up", slug: "sped-up", title: "Sped-Up Audio: The TikTok Edit That Outlives Its Meme", description: "Why +15–25% speed feels energising, how pitch rises with playback rate, and safe speed ranges that keep vocals intelligible.", categoryLabel: "Speed & Viral Edits", readMinutes: 5 },
  { presetId: "nightcore", slug: "nightcore-daycore", title: "Nightcore Demystified: The 1.35× Speed + 3-Semitone Formula", description: "The math behind nightcore at its defaults—1.35× playback rate plus a +3 semitone lift, for roughly +60% total tempo—and the curation culture around it.", categoryLabel: "Speed & Viral Edits", readMinutes: 7, legacyStatic: true },
  { presetId: "daycore", slug: "daycore", title: "Daycore: Nightcore's Sleepy Twin Explained", description: "Slow, pitched-down, dreamlike daycore: varispeed plus a 90 Hz low-shelf, where the rate thresholds sit and why there is no airy reverb in the chain.", categoryLabel: "Speed & Viral Edits", readMinutes: 5 },
  { presetId: "vaporwave", slug: "vaporwave", title: "Vaporwave: The 0.72x Drag, Reverb and Haze Formula", description: "Vaporwave as three stacked decisions: a deep varispeed slowdown, a soft damped room tail, and a low-pass haze ceiling—and at what depth each feels right.", categoryLabel: "Speed & Viral Edits", readMinutes: 5 },

  // ---- 2. Stereo & Spatial Effects ----
  { presetId: "8d-audio", slug: "8d-audio", title: "8D Audio Demystified: Binaural Panning & Headphone Acoustics", description: "Sinusoidal azimuth panning, ITD/ILD psychoacoustics, and why headphones are mandatory for the full 360° orbit effect.", categoryLabel: "Spatial Audio", readMinutes: 7, legacyStatic: true },
  { presetId: "auto-panner", slug: "auto-panner", title: "Auto Panner: Rhythmic Stereo Movement in One Slider", description: "Oscillator-driven stereo panning whose cycle rate derives from the speed slider—how the oscillator rides the panner's pan param.", categoryLabel: "Spatial Audio", readMinutes: 5 },
  { presetId: "stereo-panner", slug: "stereo-panner", title: "Manual Stereo Panning: Placing Sound Left or Right", description: "The stereo pan law, constant-power vs linear panning, and how hard left/right placement changes mix balance.", categoryLabel: "Spatial Audio", readMinutes: 4 },
  { presetId: "stereo-widening", slug: "stereo-widening", title: "Stereo Widening: The Mid/Side Matrix Explained", description: "How mid/side decomposition stretches stereo image: mid = (L+R)/2, side = (L−R)/2, and the width factor that scales lateral separation.", categoryLabel: "Spatial Audio", readMinutes: 5 },
  { presetId: "ping-pong", slug: "ping-pong", title: "Ping-Pong Echo: Alternating Delay Taps", description: "The bouncing left-right delay architecture, feedback duration theory, and musical delay time selection.", categoryLabel: "Spatial Audio", readMinutes: 5 },
  { presetId: "haas-spatializer", slug: "haas-spatializer", title: "Haas Effect Spatializer: Psychoacoustic Precedence Width", description: "Micro-delay psychoacoustics (12–35 ms) that widens stereo panoramas without phase smearing or artificial reverb tails.", categoryLabel: "Spatial Audio", readMinutes: 5 },

  // ---- 3. Bass & Equalizer ----
  { presetId: "bass-boost-light", slug: "bass-boost-light", title: "Light Bass Boost: A Gentle +3.5 dB Sub Shelf", description: "The gentle first step: a +3.5 dB low-shelf at 95 Hz that thickens sound without pumping or limiting, on any playback device.", categoryLabel: "Bass & Equalizer", readMinutes: 4 },
  { presetId: "bass-boost-mod", slug: "bass-boost-mod", title: "Medium Bass Boost: +7 dB of Weight Without Mud", description: "The balanced tier: a +7 dB low-shelf at 85 Hz, no high-pass in the chain, and why the anti-mud shelf belongs to a different preset.", categoryLabel: "Bass & Equalizer", readMinutes: 4 },
  { presetId: "bass-boost-heavy", slug: "bass-boost-heavy", title: "Heavy Bass Boost: Headroom, Limiter & Tail Discipline", description: "A +10.5 dB low-shelf at 75 Hz—and the look-ahead peak protection that keeps it safe: no saturation is added, only the −0.3 dBFS sample-peak guard.", categoryLabel: "Bass & Equalizer", readMinutes: 5 },
  { presetId: "bass-boost-extreme", slug: "bass-boost-extreme", title: "Extreme Bass Boost: Headroom & Speaker Physics", description: "A +15 dB low-shelf at 65 Hz: what +15 dB of sub does in a waveform, why no saturation rescue is applied, and why your playback hardware is the real bound.", categoryLabel: "Bass & Equalizer", readMinutes: 5 },
  { presetId: "equalizer", slug: "equalizer", title: "The 3-Band Parametric Equalizer, Explained", description: "Low shelf at 120 Hz, mid bell at 2.4 kHz (Q 1.0), high shelf at 9 kHz: what each band does to your track and the mixing order that matters.", categoryLabel: "Bass & Equalizer", readMinutes: 5 },
  { presetId: "treble-air", slug: "treble-air", title: "Treble & Air: The 9 kHz High Shelf", description: "Openness and sparkle from a high-shelf boost—cymbal silk, vocal breath, and the sibilance ceiling to respect.", categoryLabel: "Bass & Equalizer", readMinutes: 4 },
  { presetId: "mid-scoop", slug: "mid-scoop", title: "Mid Scoop: Clearing the Boxy 350 Hz Zone", description: "A static bell cut centred at 350 Hz plus an 8 kHz gloss shelf—what the low-mid dip removes, what it can't, and why no dynamic stage is involved.", categoryLabel: "Bass & Equalizer", readMinutes: 4 },

  // ---- 4. Reverb & Echo ----
  { presetId: "bathroom-reverb", slug: "bathroom-reverb", title: "Bathroom Reverb: The Small-Tile Acoustic Signature", description: "A 0.65 s early-decaying reflection with heavy damping (0.75)—why tiled rooms sound bright-tight, and how the impulse is synthesised.", categoryLabel: "Reverb & Echo", readMinutes: 4 },
  { presetId: "small-room-reverb", slug: "small-room-reverb", title: "Small Room Reverb: Controlled Early Reflections", description: "~1-second decay, tight reflection spacing, near-invisible glue that keeps vocals forward and dry-feeling.", categoryLabel: "Reverb & Echo", readMinutes: 4 },
  { presetId: "medium-room-reverb", slug: "medium-room-reverb", title: "Medium Room Reverb: The Broadcast Sweet Spot", description: "~2-second decay and balanced diffusion—the conversational acoustic that flatters podcasts and pop vocals alike.", categoryLabel: "Reverb & Echo", readMinutes: 4 },
  { presetId: "large-room-reverb", slug: "large-room-reverb", title: "Large Room Reverb: Convincing Scale Without Mud", description: "3.4-second decay, reflection spacing and diffusion: how scale is faked, and how to keep decaying tails from drowning detail.", categoryLabel: "Reverb & Echo", readMinutes: 4 },
  { presetId: "church-hall-reverb", slug: "church-hall-reverb", title: "Church Hall Reverb: Vaulted Ceilings & Long Decays", description: "4.8-second sacred-space acoustics—stone reflections, tendency-free naturals, and pre-delay thinking for choral texture.", categoryLabel: "Reverb & Echo", readMinutes: 5 },
  { presetId: "cathedral-reverb", slug: "cathedral-reverb", title: "Cathedral Reverb: The Longest Tail in the House", description: "6-second-plus exponential decay: where it works, where it destroys mixes, and why the render window grows to fit the tail.", categoryLabel: "Reverb & Echo", readMinutes: 5 },
  { presetId: "vocal-reverb", slug: "vocal-reverb", title: "Vocal Reverb: Presence-Forward Reflection Design", description: "A 1.8 s decay with 35 ms pre-delay and 28% wet—tuned so lyrics stay forward; damping at 0.65 keeps the tail out of the sibilance zone.", categoryLabel: "Reverb & Echo", readMinutes: 5 },
  { presetId: "plate-reverb", slug: "plate-reverb", title: "Plate Reverb: Vintage Electromechanical Shimmer & Density", description: "High-density electromechanical plate diffusion with low-cut filtering to deliver vocal sparkle and snare crack without low-end mud.", categoryLabel: "Reverb & Echo", readMinutes: 5 },
  { presetId: "slapback-echo", slug: "slapback-echo", title: "Slapback Echo: The One-Repeat Ghost", description: "A 115 ms single repeat at 15% feedback—no reverb verb, no ping-pong bounce; how the classic rockabilly slap is built from one delay line.", categoryLabel: "Reverb & Echo", readMinutes: 4 },
  { presetId: "echo-chamber", slug: "echo-chamber", title: "Echo Chamber: Delay and Reverb in One Room", description: "A ping-pong delay and a 2.2 s room convolution running together: where the repeats end, the tail begins, and how the render window grows to fit both.", categoryLabel: "Reverb & Echo", readMinutes: 5 },

  // ---- 5. Pitch & Tempo ----
  { presetId: "pitch-432hz", slug: "432hz-tuning", title: "432 Hz Tuning: Science, Myth & Conversions", description: "The 432/440 ratio, exact −31.76 cent shift, resampling side-effects, and an honest look at the claims around Verdi tuning.", categoryLabel: "Pitch & Tempo", readMinutes: 6, legacyStatic: true },
  { presetId: "pitch-shifter", slug: "pitch-shifter", title: "Pitch Shifting by Semitones: The Playback-Rate Trade-Off", description: "Semitone math via playback rate: each step of +1 is 2^(1/12), and tempo shifts in parallel—plan your edit accordingly.", categoryLabel: "Pitch & Tempo", readMinutes: 4 },
  { presetId: "tempo-changer", slug: "tempo-changer", title: "Tempo Changer: Speed Without Losing Musical Feel", description: "Adjusting playback speed from 30% to 180%—what stays clean, what drifts, and how to build exact BPM multipliers.", categoryLabel: "Pitch & Tempo", readMinutes: 5 },
  { presetId: "bpm-detector", slug: "bpm-detector", title: "How BPM Detection Actually Works", description: "Transient-energy autocorrelation on decoded PCM: the math, why estimates drift on sparse drums, and the accuracy envelope to trust.", categoryLabel: "Pitch & Tempo", readMinutes: 5 },

  // ---- 6. Creative Effects ----
  { presetId: "reverse", slug: "reverse", title: "Reverse Audio: Time Inversion in One Pass", description: "Sample-level time reversal—what happens to percussive attacks, how the decrescendo becomes a riser, and creative reverses to try.", categoryLabel: "Creative Effects", readMinutes: 4 },
  { presetId: "underwater", slug: "underwater", title: "Underwater Effect: Submerged Acoustic Simulation", description: "Two cascaded 520 Hz low-passes, a 160 Hz sub shelf and a heavily damped 2.4 s tail—static by design; how far to push before speech stops mattering.", categoryLabel: "Creative Effects", readMinutes: 4 },
  { presetId: "telephone-voice", slug: "telephone-voice", title: "Telephone Voice Effect: The 450 Hz–3.2 kHz Band", description: "Classic narrowband telephony: a 450 Hz high-pass, cascaded 3.2 kHz low-passes and tanh line distortion—the mid character is what survives the band-limit.", categoryLabel: "Creative Effects", readMinutes: 4 },
  { presetId: "lofi-tape", slug: "lofi-tape", title: "Lo-fi Tape & Analogue Saturation DSP", description: "Tape saturation curves, gentle head bump, oxide pieces, and CassetteTape aesthetics in the modern mix.", categoryLabel: "Creative Effects", readMinutes: 6, legacyStatic: true },
  { presetId: "tape-warmth", slug: "tape-warmth", title: "Warm Analog Tape: Discrete Studio Harmonics", description: "Gentle tanh saturation curves, low-frequency console warmth and subtle top-end smoothing to add glue to digital masters.", categoryLabel: "Creative Effects", readMinutes: 4 },
  { presetId: "tube-warmth", slug: "tube-warmth", title: "Tube Warmth & Analog Saturation: Triode Preamp Harmonics", description: "Soft-clipping triode saturation curves paired with gentle low-frequency contouring to enrich sterile in-the-box digital recordings.", categoryLabel: "Creative Effects", readMinutes: 5 },
  { presetId: "am-radio", slug: "am-radio", title: "AM Radio Effect: Band-Limited Retro Transistor Broadcast", description: "Bandpass filtering (550 Hz–2.8 kHz), mid-frequency horn resonance, and subtle transistor overdrive for authentic medium-wave radio.", categoryLabel: "Creative Effects", readMinutes: 4 },
  { presetId: "muffled-room", slug: "muffled-room", title: "Room Next Door: The Muffled Party Acoustic", description: "Cascaded 320 Hz low-passes, subtle boundary resonance and diffused room reverb simulating audio heard through an insulated partition.", categoryLabel: "Creative Effects", readMinutes: 5 },

  // ---- 7. Audio Cleanup ----
  { presetId: "sub-rumble-cut", slug: "sub-rumble-cut", title: "30 Hz Infrasonic Rumble Cut: Restoring Headroom", description: "Steep 24 dB/oct high-pass filtering below 30 Hz: eliminating DC offset, sub-audible mic thumps, and freeing amplifier headroom.", categoryLabel: "Audio Cleanup", readMinutes: 4 },
  { presetId: "noise-reducer", slug: "noise-reducer", title: "Rumble & Noise Cut: The 115 Hz High-Pass Approach", description: "What a single 115 Hz high-pass actually removes—mic thumps and rumble—versus what it cannot: broadband hiss.", categoryLabel: "Audio Cleanup", readMinutes: 4 },
  { presetId: "vocal-air", slug: "vocal-air", title: "Vocal Air & Presence: The Modern Polish Curve", description: "Broad 3.2 kHz articulation bell combined with an 11 kHz high shelf to give lead vocals presence and breath without sibilance.", categoryLabel: "Audio Cleanup", readMinutes: 4 },
  { presetId: "vocal-clarity", slug: "vocal-clarity", title: "Vocal Clarity Polish: Mud Cut + 2.6 kHz Presence", description: "Two stages only: a 110 Hz high-pass clears mud, then a peaking lift at 2.6 kHz adds presence—no compression, no dynamic stage.", categoryLabel: "Audio Cleanup", readMinutes: 4 },
  { presetId: "de-harsh", slug: "de-harsh", title: "De-Harsh: Taming Sibilant and Metallic Highs", description: "A static high-shelf above 7 kHz, exciter myths debunked, and why a shelf that never reacts is different from a de-esser.", categoryLabel: "Audio Cleanup", readMinutes: 4 },
  { presetId: "podcast-voice", slug: "podcast-voice", title: "Podcast Voice Polish: Broadcast Shaping Without a Compressor", description: "Three static EQ moves for spoken word—95 Hz rumble cut, 3.2 kHz presence bell, and an optional 8 kHz smoothing shelf—with an honest no-compressor notice.", categoryLabel: "Audio Cleanup", readMinutes: 4 },

  // ---- 8. Utilities & Export ----
  { presetId: "volume-changer", slug: "volume-changer", title: "Volume as decibels: Linear Gain & the dB Scale", description: "−18 dB to +12 dB gain math, what peak protection does when you push over 0 dBFS, and the difference between gain and loudness.", categoryLabel: "Utilities & Export", readMinutes: 4 },
  { presetId: "trimmer-cutter", slug: "trimmer-cutter", title: "Trimming & Cutting Audio to the Precise Millisecond", description: "Sample-accurate trim windows clamped to real duration, why tails ring past the end bound, and re-encoding to WAV without loss.", categoryLabel: "Utilities & Export", readMinutes: 4 },
  { presetId: "fade-in-out", slug: "fade-in-out", title: "Fade In & Out: Automated Linear Gain Envelopes", description: "Sample-accurate linear gain automation at head and tail to eliminate harsh clicks, mic thumps, and abrupt musical endings.", categoryLabel: "Utilities & Export", readMinutes: 4 },
  { presetId: "downmixer", slug: "downmixer", title: "Stereo → Mono Downmix: The 0.5 × (L+R) Math", description: "A straight average fold, why correlated content cannot clip it, and the optional anti-mud shelf that tightens the result.", categoryLabel: "Utilities & Export", readMinutes: 4 },
  { presetId: "format-converter", slug: "format-converter", title: "Format Conversion: WAV, MP3 & AIFF Myths", description: "What really changes between WAV, MP3 320 kbps and AIFF: losslessness, sample rate, bitrate, and honest expectations for each format.", categoryLabel: "Utilities & Export", readMinutes: 6 },
  { presetId: "mastering-polish", slug: "mastering-polish", title: "Mastering Polish: The Commercial Finishing Curve", description: "An 80 Hz sub shelf, 1 kHz mid glue and 12 kHz air shelf, plus the sample-peak limiter—what 'mastering-grade' actually means for one-click and why true-peak is not claimed here.", categoryLabel: "Utilities & Export", readMinutes: 6 },

  // ---- Legacy static overview (kept for back-compat with the pre-registry URL) ----
  { presetId: null, slug: "bass-boost", title: "Bass Boost Without Clipping: The Complete Guide", description: "Low-shelf boost tiers, limiter interplay and speaker physics—how to get weight without mud on any device.", categoryLabel: "Bass & Equalizer", readMinutes: 6, legacyStatic: true },
];

/** Unique slugs across the registry (used by the sitemap and validation tests). */
export const registrySlugs: string[] = presetArticleRegistry.map((a) => a.slug);

/** All preset ids that have an article. */
export const articlePresetIds: PresetId[] = presetArticleRegistry
  .map((a) => a.presetId)
  .filter((id): id is PresetId => id !== null);

/** Try to find the meta for a preset id (returns undefined for presets without articles). */
export function articleForPreset(presetId: PresetId): PresetArticleMeta | undefined {
  return presetArticleRegistry.find((a) => a.presetId === presetId);
}
