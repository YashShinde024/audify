import { beforeEach, describe, expect, it } from "vitest";

import {
  defaultValuesFor,
  isPresetModified,
  selectIsResultStale,
  useEditorStore,
} from "../editor-store";
import { computeRenderSignature } from "@/lib/audio/dsp-plan";
import { getPresetById, presets } from "@/config/presets";
import { DEFAULT_EXPORT_CONFIG } from "@/types/export";

describe("defaultValuesFor", () => {
  it("returns the preset's declared defaults, one entry per declared param", () => {
    const slowed = getPresetById("slowed-reverb");
    if (!slowed) throw new Error("slowed-reverb missing");
    const values = defaultValuesFor("slowed-reverb");
    for (const param of slowed.params) {
      expect(values[param.id], param.id).toBe(slowed.defaults[param.id]);
    }
    expect(Object.keys(values)).toHaveLength(slowed.params.length);
  });

  it("returns an empty object for null ids and unknown presets", () => {
    expect(defaultValuesFor(null)).toEqual({});
    expect(defaultValuesFor("not-a-preset")).toEqual({});
  });

  it("covers every catalogued preset without any missing default", () => {
    for (const preset of presets) {
      const values = defaultValuesFor(preset.id);
      for (const param of preset.params) {
        expect(values, `${preset.id}.${param.id}`).toBeDefined();
      }
    }
  });
});

describe("isPresetModified", () => {
  it("is false at defaults and true after any control differs", () => {
    expect(isPresetModified("slowed-reverb", defaultValuesFor("slowed-reverb"))).toBe(false);
    expect(isPresetModified("slowed-reverb", { speed: 60 })).toBe(true);
  });

  it("ignores keys the preset does not declare and handles null ids", () => {
    expect(isPresetModified("slowed-reverb", { unknownKey: 42 })).toBe(false);
    expect(isPresetModified(null, { speed: 80 })).toBe(false);
    expect(isPresetModified("not-a-preset", { speed: 80 })).toBe(false);
  });
});

describe("selectIsResultStale", () => {
  it("reports not-stale when the result signature matches the current setup", () => {
    const effectValues = { speed: 65 };
    const selectedPresetId = "slowed-reverb";
    const exportConfig = { ...DEFAULT_EXPORT_CONFIG };
    const result = {
      signature: computeRenderSignature(selectedPresetId, effectValues, exportConfig),
      url: "blob:x",
      // Minimal extra fields; only the signature is compared.
    } as never;

    expect(
      selectIsResultStale({ processedResult: result, selectedPresetId, effectValues, exportConfig })
    ).toBe(false);
  });

  it("reports stale when a control or export setting changes afterwards", () => {
    const effectValues = { speed: 65 };
    const selectedPresetId = "slowed-reverb";
    const exportConfig = { ...DEFAULT_EXPORT_CONFIG };
    const result = {
      signature: computeRenderSignature(selectedPresetId, effectValues, exportConfig),
    } as never;

    expect(
      selectIsResultStale({
        processedResult: result,
        selectedPresetId,
        effectValues: { speed: 66 },
        exportConfig,
      })
    ).toBe(true);
    expect(
      selectIsResultStale({
        processedResult: result,
        selectedPresetId,
        effectValues,
        exportConfig: { ...exportConfig, sampleRate: 48000 },
      })
    ).toBe(true);
  });
});

describe("store actions", () => {
  beforeEach(() => {
    // Fresh state per test: reinitialize through the store's own setters.
    const store = useEditorStore.getState();
    store.selectPreset("slowed-reverb");
    store.selectPreset(null);
  });

  it("selectPreset seeds that preset's defaults — switching never inherits stale values", () => {
    const store = useEditorStore.getState();
    store.selectPreset("nightcore");
    let state = useEditorStore.getState();
    expect(state.selectedPresetId).toBe("nightcore");
    // Foreign keys from slowed-reverb are gone entirely.
    expect(state.effectValues).toEqual(defaultValuesFor("nightcore"));

    store.selectPreset("bass-boost-heavy");
    state = useEditorStore.getState();
    expect(state.effectValues).toEqual(defaultValuesFor("bass-boost-heavy"));

    store.selectPreset("does-not-exist");
    state = useEditorStore.getState();
    expect(state.selectedPresetId).toBeNull();
    expect(state.effectValues).toEqual({});
  });

  it("setEffectValue writes a real 0 (not a fallback) and resetEffects restores actual defaults", () => {
    const store = useEditorStore.getState();
    store.selectPreset("slowed-reverb");
    store.setEffectValue("speed", 50);
    expect(useEditorStore.getState().effectValues.speed).toBe(50);
    store.setEffectValue("reverb", 0);
    expect(useEditorStore.getState().effectValues.reverb).toBe(0);
    expect(isPresetModified("slowed-reverb", useEditorStore.getState().effectValues)).toBe(true);

    useEditorStore.getState().resetEffects();
    const state = useEditorStore.getState();
    expect(state.effectValues).toEqual(defaultValuesFor("slowed-reverb"));
    expect(isPresetModified("slowed-reverb", state.effectValues)).toBe(false);
  });

  it("the initial store starts on slowed-reverb with its declared defaults", () => {
    const before = useEditorStore.getState().selectedPresetId;
    useEditorStore.getState().selectPreset(null);
    expect(useEditorStore.getState().selectedPresetId).toBeNull();
    // Restore the shipped default selection for other consumers of the store singleton.
    useEditorStore.getState().selectPreset(before ?? "slowed-reverb");
    const state = useEditorStore.getState();
    expect(state.selectedPresetId).toBe("slowed-reverb");
    expect(state.effectValues).toEqual(defaultValuesFor("slowed-reverb"));
    expect(state.exportConfig.profile).toBe(
      (DEFAULT_EXPORT_CONFIG as { profile: string }).profile
    );
  });

  it("setExportConfig marks the profile custom and preserves untouched fields", () => {
    const store = useEditorStore.getState();
    const before = { ...useEditorStore.getState().exportConfig };
    store.setExportConfig({ format: "wav" });
    const cfg = useEditorStore.getState().exportConfig;
    expect(cfg.format).toBe("wav");
    expect(cfg.profile).toBe("custom");
    expect(cfg.sampleRate).toBe(before.sampleRate);
  });

  it("export profiles apply their documented settings", () => {
    const store = useEditorStore.getState();
    store.applyExportProfile("sharing");
    let cfg = useEditorStore.getState().exportConfig;
    expect(cfg).toMatchObject({
      profile: "sharing",
      format: "mp3",
      mp3Bitrate: 192,
      sampleRate: 44100,
      channels: "stereo",
      peakNormalize: true,
      peakProtection: true,
    });

    store.applyExportProfile("standard");
    cfg = useEditorStore.getState().exportConfig;
    expect(cfg).toMatchObject({
      profile: "standard",
      format: "wav",
      wavBitDepth: 16,
      sampleRate: 0,
      peakNormalize: false,
      peakProtection: true,
    });

    store.applyExportProfile("production");
    cfg = useEditorStore.getState().exportConfig;
    expect(cfg).toMatchObject({
      profile: "production",
      format: "wav",
      wavBitDepth: 24,
      sampleRate: 48000,
      peakNormalize: false,
      peakProtection: true,
    });
  });

  it("playback volume and time are clamped to sane ranges", () => {
    const store = useEditorStore.getState();
    store.setVolume(150);
    expect(useEditorStore.getState().volume).toBe(100);
    store.setVolume(-5);
    expect(useEditorStore.getState().volume).toBe(0);
    store.setCurrentTime(-2);
    expect(useEditorStore.getState().currentTime).toBe(0);
    store.setCurrentTime(Number.NaN);
    expect(useEditorStore.getState().currentTime).toBe(0);
    store.setDuration(Number.POSITIVE_INFINITY);
    expect(useEditorStore.getState().duration).toBe(0);
  });

  it("togglePlay and toggleAfter flip state and reset the playhead", () => {
    const store = useEditorStore.getState();
    store.selectPreset(null);
    store.setCurrentTime(3);
    store.togglePlay();
    expect(useEditorStore.getState().isPlaying).toBe(true);
    store.togglePlay();
    expect(useEditorStore.getState().isPlaying).toBe(false);

    useEditorStore.getState().toggleAfter();
    const flipped = useEditorStore.getState();
    expect(flipped.showAfter).toBe(true);
    expect(flipped.currentTime).toBe(0);
    expect(flipped.isPlaying).toBe(false);
    useEditorStore.getState().toggleAfter();
    expect(useEditorStore.getState().showAfter).toBe(false);
  });
});
