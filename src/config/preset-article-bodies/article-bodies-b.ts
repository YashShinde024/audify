import type { PresetArticleBody } from "./article-bodies-a";

/**
 * Structured article bodies — Part B: Pitch & Tempo, Creative Effects,
 * Audio Cleanup, Utilities & Export.
 */
export const articleBodiesB: PresetArticleBody[] = [
  // ============ Pitch & Tempo ============
  {
    presetId: "pitch-shifter",
    slug: "pitch-shifter",
    what:
      "The Pitch Shifter transposes your audio in semitone steps. One honest engineering note defines it: the shift is implemented with playback-rate resampling, so time stretches in parallel. Each +1 semitone is the octave ratio 2^(1/12) — pitch and tempo are one dial here, not two.",
    sound:
      "Everything rises or falls together: key moves, speed moves, duration changes. The result is a clean transpose with resampler gloss rather than a phase-locked time-stretch.",
    dsp: [
      "Semitone count n maps to playbackRate = 2^(n/12).",
      "AudioBufferSourceNode.playbackRate is set to that ratio in the offline render.",
      "Output duration scales to duration ÷ rate: up a fifth shortens the file, down a third lengthens it.",
      "Peak protection (on by default) runs after the resample at a −0.3 dBFS sample-peak ceiling; negative semitones simply extend the render window.",
    ],
    tips: [
      "Need pitch without tempo change? No preset does that today — read the tempo-changer guide for the coupling caveat.",
      "+1 or −1 semitone lands around ±5.9% speed: subtle, and often exactly what a key match needs.",
      "Use the Tempo Changer if your goal is speed and the pitch shift is a side effect you'll live with.",
      "Semitone 0 with speed untouched renders an unchanged copy — the pipeline still runs, it just has nothing to alter.",
    ],
    useCases: ["Key matching", "Vocal re-reading", "Sample transposing"],
    related: ["tempo-changer", "432hz-tuning", "sped-up"],
  },
  {
    presetId: "tempo-changer",
    slug: "tempo-changer",
    what:
      "The Tempo Changer maps your speed request onto playback rate directly: from 30% crawl to 180% sprint. Because it rides the same playbackRate mechanism as every speed preset, pitch follows tempo — that intentional limitation defines the effect's character and keeps CPU cost near zero.",
    sound:
      "Smooth acceleration or deceleration with classic tape-character pitch drift: no artifact-y granular glitches, just the honest speed-weight trade.",
    dsp: [
      "speed param (30–180) becomes playbackRate = speed / 100.",
      "Output duration recomputes to duration ÷ rate — a 1:06 clip at 180% exports in ~36.7 seconds.",
      "No separate time-stretch stage exists; the coupling is real, not a setting you missed.",
      "Peak protection (on by default) catches resampled transients with look-ahead sliding-minimum limiting at a −0.3 dBFS sample peak.",
    ],
    tips: [
      "To hit an exact BPM target, compute rate = targetBPM / detectedBPM first with the BPM Detector.",
      "Slower than ~70% drops formants noticeably; layer Vocal Clarity if the voice gets too deep.",
      "Faster than ~140% degrades intelligibility; consider the Sped-Up editorial style instead.",
      "This is not time-stretching: if you need tempo-preserved pitch, this preset is not the tool.",
    ],
    useCases: ["Precise BPM nudges", "Loop-fitting", "Editorial speed reads"],
    related: ["bpm-detector", "pitch-shifter", "sped-up"],
  },
  {
    presetId: "bpm-detector",
    slug: "bpm-detector",
    what:
      "The BPM Detector estimates tempo from the waveform itself: it autocorrelates transient energy across the decoded PCM and picks the lag whose periodicity best matches a 65–185 BPM window. That is a real algorithm, not a label — and like every estimator, it has accuracy edges.",
    sound:
      "No audible change at all: detection is a read-only pass. Its value is in what you do after — matching tempo or gating your speed edits off real numbers.",
    dsp: [
      "The decoded buffer's peak envelope is derived from channel 0.",
      "Autocorrelation runs over lags corresponding to 65–185 BPM.",
      "The lag with strongest periodicity converts into an integer BPM estimate.",
      "Detection failures fall back to a conservative default with a console warning — the render never blocks.",
    ],
    tips: [
      "Sparse percussion (film scores, ambient) is the algorithm's weak zone — expect drift.",
      "Double- or half-time confusions (70 vs 140 BPM) resolve in favor of the window: trust musical ears over the number.",
      "Detection runs on channel 0 only; a mixed stereo file is fine, a two-tempo mashup is not.",
      "Treat detected BPM as a starting point for tempo edits, not gospel.",
    ],
    useCases: ["Tempo matching", "Loop alignment", "Mashup prep"],
    related: ["tempo-changer", "trimmer-cutter", "pitch-shifter"],
  },

  // ============ Creative Effects ============
  {
    presetId: "reverse",
    slug: "reverse",
    what:
      "Reverse Audio is time inversion at the sample level: the last sample becomes the first, the first the last. Attacks become decays and vice versa — percussive hits bloom backwards, sustained pads become risers. It is one of the oldest studio tricks precisely because the transformation is total.",
    sound:
      "Instantly 'inside-out': reversed cymbals swell, reversed piano notes decay-into-attack, reversed speech sounds alien but rhythmic.",
    dsp: [
      "The render writes samples in mirror order across whatever source the studio hands it.",
      "No rate, filter or space is applied — it is a pure 1:1 time flip.",
      "Output duration is identical to input; peak protection (on by default) still applies at export.",
      "Reverse stacks with any later effect: a reversed pad through a reverb tail rises toward the listener instead of decaying away.",
    ],
    tips: [
      "Reverse a cymbal to make an impact swell: the classic studio transition.",
      "Short, percussive material reverses most recognizably; long pads read as ambient.",
      "Reverse + reverb together is the full 'muffled tide' trick — the order matters more than the amount.",
      "Files exported with reverse keep full resolution: the flip is lossless.",
    ],
    useCases: ["Transition risers", "Sound design beds", "Creative vocal phrases"],
    related: ["bathroom-reverb", "underwater", "ping-pong"],
  },
  {
    presetId: "underwater",
    slug: "underwater",
    what:
      "The Underwater Effect simulates submersion: everything above roughly 520 Hz is rolled off twice, the sub gets a small lift, and a heavily damped reverb tail supplies the pressure. It is a static filter-and-space effect, not a moving one — depth comes from how hard you push the controls.",
    sound:
      "Muffled, damped, 'pressured': dialogue softens, transients lose their edges, and the track glides rather than attacks.",
    dsp: [
      "Two cascaded 12 dB/oct low-passes at 520 Hz give a real 24 dB/oct roll-off.",
      "A low-shelf at 160 Hz adds the low-end weight that survives under water.",
      "A 2.4 s reverb with heavy damping (0.8) and a 20 ms pre-delay supplies the pressure tail.",
      "There is no LFO or filter sweep: the effect is static for the whole file.",
      "Peak protection (default on) limits at a −0.3 dBFS sample peak.",
    ],
    tips: [
      "Because the filter is static, sell depth with reverb amount rather than expecting the preset to move.",
      "Landing on '18 minutes' is overkill — most edits submerge for 4–8 bars, then surface.",
      "Pair with slowed playback for the classic 'sunk down into the track' joint.",
      "Voice intelligibility dies quickly: subtitle this if it's a spoken edit.",
    ],
    useCases: ["Dramatic submersion moments", "Ambient transitions", "Game/menu sound-design"],
    related: ["slowed", "reverse", "bathroom-reverb"],
  },
  {
    presetId: "telephone-voice",
    slug: "telephone-voice",
    what:
      "The Telephone Voice preset compresses everything into a narrow telephony band: a 450 Hz high-pass and two cascaded 3.2 kHz low-passes. There is no added mid boost — the honky midrange you hear is simply the part of the signal that survives the band-limit.",
    sound:
      "Narrow, honky, retro-mic: lows and highs gone, mid-body forward because it is all that remains, consonants rounded off at 3.2 kHz.",
    dsp: [
      "A 450 Hz high-pass plus two cascaded 3.2 kHz low-passes form the band (24 dB/oct on the top edge).",
      "No mid-emphasis filter exists: the forward mids are a consequence of removing everything else.",
      "A tanh waveshaper adds line distortion; Line Distortion sets the drive from nearly clean to crunchy.",
      "Slopes are 12 dB/oct per stage rather than brickwall, so some energy leaks outside the band.",
      "Peak protection (default on) runs last at a −0.3 dBFS sample peak.",
    ],
    tips: [
      "On vocals it is a texture, not a correction — use it for a phrase, a skit, or a sampled vignette, then return to the dry voice.",
      "Line Distortion at 40% is already audible; push toward 80% for a broken-speaker gag, not for a clean phone.",
      "Intelligibility survives despite the band-limit; that is the point of the 450 Hz–3.2 kHz spec.",
      "Podcast intros, 'phone call' jokes, and time-machine scenes all want this preset.",
    ],
    useCases: ["Phone-call scenes", "Vintage AM radio", "Sampled-phonetic vignettes"],
    related: ["bathroom-reverb", "lofi-tape", "reverse"],
  },

  // ============ Audio Cleanup ============
  {
    presetId: "noise-reducer",
    slug: "noise-reducer",
    what:
      "The Noise Reducer preset is an honest one-filter utility: it engages a 115 Hz high-pass to remove low-frequency rumble — mic thumps, HVAC vibration, footsteps, desk bumps. It is not broadband hiss removal, and there is no spectral denoiser hiding behind the name.",
    sound:
      "Cleaner, tighter low end; the recording stops 'shifting on its base'. Mid and high content pass untouched.",
    dsp: [
      "A single biquad high-pass at 115 Hz (12 dB/oct) attenuates content below the corner.",
      "That is the entire chain: no gate, no spectral subtraction, no broadband denoising.",
      "Gain stays at 0 dB; cleanup never changes loudness.",
      "Peak protection (default on) applies at export like every preset.",
    ],
    tips: [
      "Frequency-selective only: for hiss or fans, look at a dedicated denoiser, not this preset.",
      "Bass instruments fight back at 115 Hz — EQ'd bass and kick don't belong stone-locked here.",
      "Cleanup before reverb, always: reverb amplifies rumble one stage later.",
      "Auto-piloted vocal workflows start with this preset, then Vocal Clarity.",
    ],
    useCases: ["Voiceover pre-clean", "Booth recording rescue", "Field recording rumble removal"],
    related: ["vocal-clarity", "de-harsh", "equalizer"],
  },
  {
    presetId: "vocal-clarity",
    slug: "vocal-clarity",
    what:
      "Vocal Clarity Polish makes two moves: a 110 Hz high-pass to clear rumble and low mud, then a peaking lift at 2.6 kHz for presence. Those two stages are the whole preset — no compressor, no de-esser, no second de-mud filter.",
    sound:
      "Legible, forward, 'radio-vocal': consonants emerge, rumble vanishes, the voice sits at the front instead of fighting the mix.",
    dsp: [
      "A 110 Hz high-pass (12 dB/oct) clears rumble and low mud below the vocal fundamental.",
      "A peaking filter at 2.6 kHz with Q 1.0 adds presence; the Vocal Presence slider sets 0–8 dB.",
      "The high-pass is the mud control — there is no additional tilt or dynamic stage.",
      "Peak protection (default on) and peak normalize (default off) are export options, not part of the preset.",
    ],
    tips: [
      "+3 dB presence is the conversational sweet spot; +6 dB starts to sound like a radio host.",
      "If the top end sizzles after the boost, drop presence by a dB before reaching De-Harsh.",
      "Run after rumble cleanup and before reverb — that order is the classic clarity chain.",
      "Music beds want less of this than voice: keep mids musical unless it is dialogue-led.",
    ],
    useCases: ["Podcast/voiceover rescue", "Interview edits", "Vocal-forward lyric videos"],
    related: ["noise-reducer", "de-harsh", "vocal-reverb"],
  },
  {
    presetId: "de-harsh",
    slug: "de-harsh",
    what:
      "De-Harsh is a static high-shelf cut above 7 kHz: sibilance, cheap-mic metal and codec crunch above the corner get pulled down by up to 8 dB. It does not 'denoise' broadband and it is not a dynamic de-esser — it is one shelf, always on.",
    sound:
      "Recordings read as detailed rather than aggressive: cymbal edges soften, 's' consonants stop tripping, masks of high-frequency crunch retreat.",
    dsp: [
      "A high-shelf at 7 kHz applies a cut up to −8 dB above the corner; the Treble Taming slider sets the depth.",
      "Static by design: it does not react to individual 's' sounds the way a de-esser would.",
      "No compression or saturation stage is added.",
      "Peak protection (default on) runs last at a −0.3 dBFS sample peak.",
    ],
    tips: [
      "De-Harsh pairs especially well after Treble & Air edits that overshoot.",
      "On lo-fi samples, judge by ear: what reads as harsh varies by codec, not just bandwidth.",
      "Don't stack with Mastering Polish's own air shelf as-is — pick one definition of 'bright'.",
      "Masking is your friend: a little cut removes complaints above what its dB suggests.",
    ],
    useCases: ["Rescuing cheap mic recordings", "Post-air-shelf cleanup", "Cymbal taming"],
    related: ["treble-air", "vocal-clarity", "noise-reducer"],
  },

  // ============ Utilities & Export ============
  {
    presetId: "volume-changer",
    slug: "volume-changer",
    what:
      "Volume is the most honest utility in audio: a single gain stage from −18 dB to +12 dB. Tone, image and pacing are untouched — but push into the red and peak protection is what keeps the export from hard-clipping.",
    sound:
      "Louder or quieter — nothing else. The tone, image and pacing of your track are exactly what you handed in.",
    dsp: [
      "Gain factor = 10^(dB / 20), applied to every channel in the offline render.",
      "The Gain Offset slider spans −18 dB to +12 dB.",
      "With peak protection on (default), the look-ahead sliding-minimum limiter pulls overs back to −0.3 dBFS sample peak; with it off, the encoder clamps and you get hard clipping instead.",
      "Peak normalize, when enabled, applies make-up gain so the loudest sample reaches −0.5 dBFS.",
    ],
    tips: [
      "+12 dB on an already-hot master eats headroom fast — set your target level first and boost the difference.",
      "Check the true loudness on your device after boosting; perceptual loudness is not the dB value.",
      "Silence stays silence: gain cannot invent content that isn't there.",
      "Fade-in/outs aren't part of this preset: use the studio timeline for those edits.",
    ],
    useCases: ["Level matching", "Quiet recording rescue", "Podcast loudness targets"],
    related: ["downmixer", "mastering-polish", "trimmer-cutter"],
  },
  {
    presetId: "trimmer-cutter",
    slug: "trimmer-cutter",
    what:
      "The Trimmer & Cutter is sample-accurate surgery: mark a start and an end, everything outside goes. It is the most underappreciated utility in any audio editor because what it does seems trivial — until you need millisecond precision and can't get it.",
    sound:
      "The edit matters more than any tone: a clean cut at the right silence boundary sounds like the file was recorded that way.",
    dsp: [
      "Start and end are resolved in seconds against the decoded duration and clamped so end ≥ start.",
      "The source is started at the start offset for exactly the trimmed duration; samples outside that window are never rendered.",
      "Reverb and echo tails generated after the trim window still ring out: the render is long enough to include them.",
      "Output format, sample rate and channels come from the export panel; the cut itself is sample-accurate.",
    ],
    tips: [
      "Trim before or after processing deliberately: slowing first changes which seconds you want.",
      "Listen on the edges of cut boundaries — clicks, not blur, are the real risk.",
      "For social edits, trim with headroom at the start and end, not razor-exact.",
      "Very long files are bounded by the render frame limit (600 s per pass), not file length.",
    ],
    useCases: ["Cut a hook", "Remove silences", "Isolate a sample"],
    related: ["volume-changer", "bpm-detector", "format-converter"],
  },
  {
    presetId: "downmixer",
    slug: "downmixer",
    what:
      "The Downmixer collapses stereo to mono the plain way: every output sample is the average of the left and right inputs. No weighted pan-law sum, no fancy phase logic — just 0.5 × (L + R), plus an optional anti-mud shelf.",
    sound:
      "A single solid channel. Image information is gone, and what remains is the mono-power collapse of your stereo mix.",
    dsp: [
      "Each sample folds as 0.5 × (L + R) — a straight average, not a weighted sum.",
      "Correlated content can never sum above full scale, but heavily decorrelated peaks still can; peak protection (default on) catches them.",
      "An optional anti-mud low-shelf at 120 Hz, −3.5 dB, runs before the fold.",
      "Already-mono sources pass through unchanged; the fold simply doesn't apply.",
    ],
    tips: [
      "Test on single-driver playback: what reads as 'quiet imaging' in stereo often reads as 'muddy center' in mono.",
      "Widened mixes (extensive side content) lose most when collapsed to mono — check with the stereo-widening guide first.",
      "For phones and social clips, downmixing is delivery-friendly: a real mono export beats fake stereo on a single driver.",
      "WAV export preserves exact samples post-fold — this is not an MP3 'mono flag' (which is a decoder hint).",
    ],
    useCases: ["Phone-optimized exports", "Single-driver checks", "Podcast delivery"],
    related: ["stereo-widening", "volume-changer", "format-converter"],
  },
  {
    presetId: "format-converter",
    slug: "format-converter",
    what:
      "The Format Converter is container and codec truth: WAV (uncompressed PCM), MP3 (lossy at the bitrate you choose), AIFF (uncompressed PCM, the byte-order cousin of WAV). Sample rate and bitrate are separate decisions and the honest guide is right there in the render: each format claims only what it delivers.",
    sound:
      "No audible transformation of the source — the conversion changes the file, not the tone, within the numerical formats' own limits.",
    dsp: [
      "WAV export writes uncompressed PCM at 16, 24, or 32-bit float.",
      "AIFF export writes uncompressed big-endian PCM at 16 or 24-bit.",
      "MP3 uses the LAME encoder at 128–320 kbps — but only at 32, 44.1 or 48 kHz; other rates raise a clear error instead of guessing.",
      "Sample-rate conversion runs before encoding when the target rate differs from the render rate.",
    ],
    tips: [
      "MP3 at 320 kbps is perceptually excellent and ~4× smaller than WAV — perfect for social, awkward for archiving.",
      "WAV/AIFF are the only lossless formats: store masters uncompressed.",
      "Because lossy decoders re-encode per play, an MP3 handed to another editor degrades with each pass.",
      "The bitrate is the knob; LAME decides what to throw away within it.",
    ],
    useCases: ["Platform-ready exports", "Archive masters", "Bitrate tuning for size"],
    related: ["trimmer-cutter", "volume-changer", "mastering-polish"],
  },
  {
    presetId: "mastering-polish",
    slug: "mastering-polish",
    what:
      "Mastering Polish is a three-band finishing EQ plus the engine's peak protection: a low-shelf at 80 Hz for sub weight, a peaking filter at 1 kHz for mid glue, and a high-shelf at 12 kHz for air. The word 'mastering' earns limits, not magic: this gets a rough render closer to radio-ready in one pass, and that is all one click can honestly mean.",
    sound:
      "Radio-ready bass heft, polish in the mids, sparkly open highs — everything slightly lacquered without feeling pushed to the edge.",
    dsp: [
      "A low-shelf at 80 Hz sets sub weight; the Bass slider defaults to +2 dB.",
      "A peaking filter at 1 kHz (Q 0.7) shapes the mid 'glue' band; Presence defaults to +1 dB.",
      "A high-shelf at 12 kHz opens air above the presence zone; Treble defaults to +2 dB.",
      "Peak protection (default on) limits at a −0.3 dBFS sample peak; peak normalize is optional.",
      "No compression, no true-peak (inter-sample) limiting.",
    ],
    tips: [
      "Mastering Polish does not do true-peak (inter-sample) processing — every claim here stops at the sample ceiling.",
      "Run cleanup first: De-Harsh and rumble removal before the polish stage keeps mids honest.",
      "If it sounds squashed, back the low shelf down first — +2 dB of sub on a hot source eats headroom fast.",
      "Two passes at 50% is not a replacement: order and restraint are the real levers.",
    ],
    useCases: ["Client-dub masters", "One-click polish", "Radio-style tuning"],
    related: ["equalizer", "de-harsh", "volume-changer"],
  },
];
