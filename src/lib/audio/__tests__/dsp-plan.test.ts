import { describe, expect, it } from "vitest";

import {
  computeEchoTailSeconds,
  computeOutputDuration,
  computePlaybackRate,
  computeRenderSignature,
  MAX_PLAYBACK_RATE,
  MIN_PLAYBACK_RATE,
  resolveProcessing,
  type ProcessingPlan,
} from "../dsp-plan";
import { getAllPresets, getPresetById, presets } from "@/config/presets";
import type { EffectValues } from "@/types/preset";

const plan = (presetId: string | null, values: EffectValues = {}) =>
  resolveProcessing(presetId, values);

describe("computePlaybackRate", () => {
  it("is speed × 2^(semitones/12) × tuning ratio, clamped", () => {
    expect(computePlaybackRate(100, 0)).toBe(1);
    expect(computePlaybackRate(135, 3)).toBeCloseTo(1.35 * Math.pow(2, 3 / 12), 10);
    expect(computePlaybackRate(80, 0)).toBeCloseTo(0.8, 10);
    expect(computePlaybackRate(100, 0, 432 / 440)).toBeCloseTo(432 / 440, 10);
  });

  it("clamps within the global engine boundaries", () => {
    expect(computePlaybackRate(999, 12)).toBe(MAX_PLAYBACK_RATE);
    expect(computePlaybackRate(-999, -12)).toBe(MIN_PLAYBACK_RATE);
  });

  it("never lets a preset request a rate outside the engine limits", () => {
    for (const preset of getAllPresets()) {
      const plan = resolveProcessing(preset.id, { ...preset.defaults });
      expect(plan.playbackRate).toBeGreaterThanOrEqual(MIN_PLAYBACK_RATE);
      expect(plan.playbackRate).toBeLessThanOrEqual(MAX_PLAYBACK_RATE);
    }
  });
});

describe("computeEchoTailSeconds", () => {
  it("returns the delay time for zero feedback", () => {
    expect(computeEchoTailSeconds(0.32, 0)).toBe(0.32);
    expect(computeEchoTailSeconds(0, 0.9)).toBe(0);
  });

  it("grows geometrically with feedback and caps display decay at 12 s", () => {
    const tail = computeEchoTailSeconds(0.32, 0.8);
    // log(0.001)/log(0.8) ≈ 31 repeats of 0.32 s — the input is one delay
    // line, not the full ping-pong cycle.
    expect(tail).toBeCloseTo(0.32 * 31, 2);
    expect(tail).toBeGreaterThan(0.32);
    // Feedback is clamped at 0.85, so an absurd input cannot run forever.
    expect(computeEchoTailSeconds(0.1, 1)).toBeCloseTo(0.1 * 43, 1);
  });
});

describe("computeOutputDuration", () => {
  const base: ProcessingPlan = resolveProcessing(null, {});
  it("scales duration by playback rate", () => {
    expect(computeOutputDuration(base, 100)).toBeCloseTo(100);
    expect(computeOutputDuration({ ...base, playbackRate: 2 }, 100)).toBeCloseTo(50);
    expect(computeOutputDuration({ ...base, playbackRate: 0.5 }, 100)).toBeCloseTo(200);
  });

  it("adds reverb/echo tails and respects trimming", () => {
    const trimmed = { ...base, trim: { start: 10, end: 30 } };
    expect(computeOutputDuration(trimmed, 100)).toBeCloseTo(20);
    expect(computeOutputDuration({ ...base, tailSeconds: 3 }, 100)).toBeCloseTo(103);
    // Clamp: end below start collapses to the 20 ms floor.
    const inverted = { ...base, trim: { start: 30, end: 10 } };
    expect(computeOutputDuration(inverted, 100)).toBeCloseTo(0.02);
  });
});

describe("presets → plan consistency", () => {
  it("every catalogued preset resolves without throwing", () => {
    expect(presets.length).toBeGreaterThan(20);
    for (const preset of presets) {
      const resolved = resolveProcessing(preset.id, { ...preset.defaults });
      expect(resolved.presetId).toBe(preset.id);
      expect(Number.isFinite(resolved.playbackRate)).toBe(true);
      expect(resolved.tailSeconds).toBeGreaterThanOrEqual(0);
      if (resolved.reverb) {
        expect(resolved.reverb.wet).toBeGreaterThan(0);
        expect(resolved.reverb.decaySeconds).toBeGreaterThanOrEqual(0.2);
      }
    }
  });

  it("every declared default falls inside its slider range", () => {
    for (const preset of presets) {
      for (const param of preset.params) {
        if (param.kind !== "slider") continue;
        const raw = preset.defaults[param.id];
        if (typeof raw !== "number") continue;
        if (param.min == null || param.max == null) continue;
        expect(
          raw,
          `${preset.id}.${param.id} default ${raw} outside [${param.min}, ${param.max}]`
        ).toBeGreaterThanOrEqual(param.min);
        expect(
          raw,
          `${preset.id}.${param.id} default ${raw} outside [${param.min}, ${param.max}]`
        ).toBeLessThanOrEqual(param.max);
      }
    }
  });

  it("declared bass shelf frequencies match the documented tiers", () => {
    const cases: Array<[string, number, number]> = [
      ["bass-boost-light", 95, 3.5],
      ["bass-boost-mod", 85, 7],
      ["bass-boost-heavy", 75, 10.5],
      ["bass-boost-extreme", 65, 15],
    ];
    for (const [id, frequency, gain] of cases) {
      const shelf = plan(id).filters.find((f) => f.type === "lowshelf");
      expect(shelf?.frequency, id).toBe(frequency);
      expect(shelf?.gain, id).toBeCloseTo(gain);
    }
  });

  it("de-harsh drops a 7 kHz high-shelf; vocal-clarity uses 110 Hz HP + 2.6 kHz bell", () => {
    const harsh = plan("de-harsh");
    expect(harsh.filters).toContainEqual({ type: "highshelf", frequency: 7000, gain: -3.5 });

    const clear = plan("vocal-clarity");
    expect(clear.filters[0]).toMatchObject({ type: "highpass", frequency: 110 });
    expect(clear.filters[1]).toMatchObject({ type: "peaking", frequency: 2600, q: 1.0 });

    // The mud-cut toggle removes the high-pass, but the bell stays.
    const noMud = plan("vocal-clarity", { "mud-cut": false });
    expect(noMud.filters[0]).toMatchObject({ type: "peaking", frequency: 2600 });
  });

  it("telephone-voice is a 450 Hz → 3.2 kHz band with waveshaper saturation", () => {
    const tel = plan("telephone-voice");
    expect(tel.filters.map((f) => f.type)).toEqual(["highpass", "lowpass", "lowpass"]);
    expect(tel.filters[0].frequency).toBe(450);
    expect(tel.filters.every((f) => f.frequency === 3200 || f.frequency === 450)).toBe(true);
    expect(tel.saturation).toBe(40);
  });

  it("underwater stacks two static low-passes at 520 Hz (no modulation)", () => {
    const deep = plan("underwater");
    expect(deep.filters.filter((f) => f.type === "lowpass")).toHaveLength(2);
    expect(deep.filters.filter((f) => f.type === "lowpass").every((f) => f.frequency === 520)).toBe(true);
    expect(deep.pan).toBeNull(); // nothing moves over time
    expect(deep.reverb?.decaySeconds).toBeCloseTo(2.4);
  });

  it("8D orbits and needs stereo; mono sources are widened, not left silent", () => {
    const orbit = plan("8d-audio");
    expect(orbit.pan?.mode).toBe("orbit");
    expect(orbit.needsStereo).toBe(true);
    expect(orbit.tailSeconds).toBeCloseTo(2.6);

    const panner = plan("auto-panner");
    expect(panner.pan?.mode).toBe("auto");
    expect(panner.needsStereo).toBe(true);
  });

  it("stereo widening converts width % into a mid/side gain and mono is untouched", () => {
    expect(plan("stereo-widening").width).toBeCloseTo(65 / 50);
    expect(plan("stereo-widening").needsStereo).toBe(true);
    // null preset: no width processing at all
    expect(plan(null).width).toBeNull();
  });

  it("ping-pong echo uses a fixed 320 ms delay and its feedback follows the slider", () => {
    const soft = plan("ping-pong", { echo: 40, size: 10 });
    const heavy = plan("ping-pong", { echo: 100, size: 80 });
    expect(soft.echo?.timeSeconds).toBe(0.32);
    expect(heavy.echo?.timeSeconds).toBe(0.32);
    expect(soft.echo?.wet).toBeCloseTo(0.4);
    // size % maps into [0.2, 0.75] before the 0.8 clamp: 80 → 0.64.
    expect(heavy.echo?.feedback).toBeCloseTo(0.64);
    // One ping-pong cycle is 2 × 0.32 s; 0.64 feedback decays for 16 cycles.
    expect(heavy.tailSeconds).toBeCloseTo(0.64 * 16, 1);
  });

  it("utilities map to their documented operations", () => {
    expect(plan("volume-changer", { "volume-db": -18 }).outputGainDb).toBe(-18);
    expect(plan("volume-changer", { "volume-db": 12 }).outputGainDb).toBe(12);
    expect(plan("downmixer").mono).toBe(true);
    expect(plan("trimmer-cutter", { "trim-start": 2, "trim-end": 5 }).trim).toEqual({
      start: 2,
      end: 5,
    });
    expect(plan("format-converter")).toEqual(
      expect.objectContaining({ filters: [], saturation: 0 })
    );
  });

  it("reverse defaults on only for the reverse preset", () => {
    expect(plan("reverse").reverse).toBe(true);
    expect(plan("slowed").reverse).toBe(false);
    expect(plan("reverse", { "reverse-enabled": false }).reverse).toBe(false);
  });

  it("432 Hz toggling only rescales the playback rate when enabled", () => {
    const on = plan("pitch-432hz", { "432hz-enabled": true });
    const off = plan("pitch-432hz", { "432hz-enabled": false });
    expect(on.playbackRate).toBeCloseTo(432 / 440, 10);
    expect(off.playbackRate).toBe(1);
    expect(off.filters).toHaveLength(0); // it is varispeed, not a filter bank
  });

  it("zero is a real value: explicit 0s never fall back to defaults", () => {
    // Explicit reverb=0 on a reverb preset disables the branch entirely.
    expect(plan("medium-room-reverb", { reverb: 0 }).reverb).toBeNull();
    // Explicit presence=0 on vocal-clarity removes the bell.
    expect(plan("vocal-clarity", { presence: 0 }).filters).toHaveLength(1);
    // Explicit bass=0 on bass-boost keeps the shelf with 0 gain? No: the
    // gain defaults are preset constants here, so a 0 slider yields 0 gain.
    expect(plan("bass-boost-mod", { bass: 0 }).filters).toEqual([
      { type: "lowshelf", frequency: 85, gain: 0 },
    ]);
  });

  it("missing values fall back to each preset's declared defaults", () => {
    const speeding = plan("sped-up");
    expect(speeding.playbackRate).toBeCloseTo(1.18, 5); // sped-up default is 118%
    const slowed = plan("slowed");
    expect(slowed.playbackRate).toBeCloseTo(0.8, 5);
  });

  it("output gain is clamped and independent sliders cannot smuggle extra gain", () => {
    expect(plan("volume-changer", { "volume-db": 100 }).outputGainDb).toBe(18);
    expect(plan("volume-changer", { "volume-db": -100 }).outputGainDb).toBe(-24);
  });
});

describe("preset switching has no stale carry-over", () => {
  it("switching preset id changes the resolved plan even with foreign values", () => {
    const values: EffectValues = { reverb: 50, bass: 9, treble: 9, speed: 130, pitch: 4 };
    const asNightcore = plan("nightcore", values);
    const asBass = plan("bass-boost-heavy", values);

    expect(asNightcore.playbackRate).toBeCloseTo(1.3 * Math.pow(2, 4 / 12), 10);
    expect(asBass.playbackRate).toBeCloseTo(1.3 * Math.pow(2, 4 / 12), 10);
    // nightcore never inherits a bass shelf from foreign values
    expect(asNightcore.filters.map((f) => f.type)).toEqual(["highshelf"]);
    expect(asBass.filters.map((f) => f.type)).toEqual(["lowshelf"]);
    expect(asBass.filters[0]).toMatchObject({ frequency: 75, gain: 9 });
  });

  it("resolveProcessing(null, …) is the id-clean passthrough plan", () => {
    const clean = plan(null, { speed: 130, pitch: 4 });
    // Even with slider values present, an unknown/no preset applies no timbre.
    expect(clean.filters).toHaveLength(0);
    expect(clean.reverb).toBeNull();
  });
});

describe("render signatures", () => {
  it("change when any audible input changes and not otherwise", () => {
    const a = computeRenderSignature("slowed", {});
    const b = computeRenderSignature("slowed", { speed: 79 });
    expect(a).not.toBe(b);

    const again = computeRenderSignature("slowed", {});
    expect(a).toBe(again);

    const exportDiff = computeRenderSignature("slowed", {}, { mp3Bitrate: 128 });
    expect(a).not.toBe(exportDiff);
  });

  it("tracks filter and export config fields", () => {
    const withBass = computeRenderSignature("bass-boost-light", { bass: 4 });
    const without = computeRenderSignature("bass-boost-light", {});
    expect(withBass).not.toBe(without);

    const sampleRateOnly = computeRenderSignature("slowed", {}, { sampleRate: 48000 });
    expect(sampleRateOnly).not.toBe(computeRenderSignature("slowed", {}));
  });

  it("exposes every known preset through getPresetById", () => {
    for (const preset of presets) {
      expect(getPresetById(preset.id)).toBe(preset);
    }
    expect(getPresetById("does-not-exist")).toBeUndefined();
  });
});
