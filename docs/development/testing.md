# Testing & Quality Assurance

Audify maintains a comprehensive, automated test suite covering unit tests, integration tests, audio math validation, rate limiting, and encoder correctness.

---

## 1. Test Suite Overview

- **Test Runner:** [Vitest v3.2.7](https://vitest.dev/)
- **Configuration:** [`vitest.config.ts`](../../vitest.config.ts)
- **Status:** **23 test files**, **301 tests** passing (100% pass rate).

---

## 2. Test Execution Commands

```bash
# Run the full Vitest suite once
npm test

# Run tests in watch mode during development
npx vitest

# Run a specific test suite
npx vitest run src/lib/audio/__tests__/dsp-plan.test.ts

# Run the standalone audio DSP verification script
npx tsx scripts/verify-audio.ts

# Run TypeScript compiler checks
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Compile production build
npm run build
```

---

## 3. Test Suites Breakdown

| Suite Path | Focus & Coverage |
| :--- | :--- |
| `src/lib/audio/__tests__/dsp-plan.test.ts` (41 tests) | DSP plan generation, filter parameter mapping, biquad node connections, and parameter smoothing. |
| `src/lib/audio/__tests__/dsp-utils.test.ts` (25 tests) | Biquad coefficients, impulse responses (reverbs), waveshaping curves, and soft-knee limiter mathematics. |
| `src/lib/audio/__tests__/audio-quality-audit.test.ts` (21 tests) | Audio quality assertions, headroom management, peak limiting, and non-clipping behavior under +6 dBFS boosts. |
| `src/lib/audio/__tests__/encoders.test.ts` (11 tests) | Binary WAV (16/24/32-bit float), AIFF, and MP3 CBR byte-length assertions and frame headers. |
| `src/lib/audio/__tests__/tools-engine.test.ts` (9 tests) | Multi-track merger, interval splitter, resampler, and metadata diagnostic execution. |
| `src/lib/audio/__tests__/custom-presets.test.ts` (6 tests) | User preset serialization, deserialization, and schema validation. |
| `src/lib/audio/__tests__/audio-file.test.ts` (10 tests) | File extension validation, MIME type checks, and 10 MB memory ceiling enforcement. |
| `src/lib/audio/__tests__/export-config.test.ts` (9 tests) | Bit depth, sample rate, and container compatibility. |
| `src/lib/audio/__tests__/modular-architecture.test.ts` (9 tests) | Boundary tests verifying audio engine modularity and decoupling. |
| `src/stores/__tests__/editor-store.test.ts` (14 tests) | Zustand store mutations, state transitions, playhead resets, and result invalidation. |
| `src/app/api/contact/__tests__/route.test.ts` (7 tests) | Contact endpoint rate limiting (5 req / 10 min), honeypot anti-spam, and payload size validation. |
| `src/lib/__tests__/rate-limiter.test.ts` (3 tests) | In-memory sliding window rate limiter unit tests. |
| `src/config/__tests__/preset-audit.test.ts` (11 tests) | Registry integrity, unique IDs, valid parameter types, and default values. |
| `src/config/__tests__/blog-registry.test.ts` (14 tests) | Blog guide metadata, article slug mappings, and reading times. |
| `src/config/__tests__/preset-categories.test.ts` (4 tests) | Category taxonomy consistency and preset assignments. |
| `src/config/__tests__/navigation.test.ts` (2 tests) | Primary and secondary navigation links. |

---

## 4. Writing New Audio Tests

When adding or modifying an audio preset or effect:
1. Write a test asserting that the operation is included in `DSPPlan`.
2. Verify that rendered audio does not output `NaN` or `Infinity` sample values.
3. Validate that hot inputs (+3dB to +15dB) remain strictly constrained below the −0.3 dBFS ceiling.
