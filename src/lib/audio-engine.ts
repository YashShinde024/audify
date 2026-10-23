/**
 * Audify Web Audio Processing Engine (Canonical Facade)
 *
 * Exposes the unified public API for decoding, analysis, rendering,
 * encoding, and natural-language sound matching.
 *
 * Underlying modular architecture:
 * - @/lib/audio/decoding.ts      -> AudioContext lifecycle & buffer decoding
 * - @/lib/audio/analysis.ts      -> BPM autocorrelation detection
 * - @/lib/audio/encoders.ts      -> Multi-format encoders (WAV, AIFF, MP3) & size estimation
 * - @/lib/audio/renderer.ts      -> OfflineAudioContext graph builder & render pipeline
 * - @/lib/audio/prompt-matcher.ts-> Heuristic prompt interpretation
 * - @/lib/audio/dsp-plan.ts      -> Pure parameter resolution & plan compilation
 * - @/lib/audio/dsp-utils.ts     -> Lookahead limiter, peak normalization, channel math
 */

export * from "./audio/decoding";
export * from "./audio/analysis";
export * from "./audio/encoders";
export * from "./audio/renderer";
export * from "./audio/prompt-matcher";
