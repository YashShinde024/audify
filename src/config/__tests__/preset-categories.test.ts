import { describe, expect, it } from "vitest";
import { presets, getPresetById } from "@/config/presets";
import { ACOUSTIC_CATEGORIES } from "@/components/editor/preset-explorer";
import { useEditorStore, defaultValuesFor, isPresetModified } from "@/stores/editor-store";

describe("Acoustic Categories & Preset Library Integrity", () => {
  it("every preset is accounted for in the curated acoustic categories", () => {
    const allCategoryPresetIds = new Set<string>();

    for (const cat of ACOUSTIC_CATEGORIES) {
      if (cat.id === "all") continue;
      for (const id of cat.presetIds) {
        allCategoryPresetIds.add(id);
      }
    }

    for (const preset of presets) {
      expect(
        allCategoryPresetIds.has(preset.id),
        `Preset '${preset.id}' should belong to an acoustic category`
      ).toBe(true);
    }
  });

  it("every category references valid presets that exist in the canonical registry", () => {
    for (const cat of ACOUSTIC_CATEGORIES) {
      for (const id of cat.presetIds) {
        const found = getPresetById(id);
        expect(found, `Category '${cat.id}' references unknown preset '${id}'`).toBeDefined();
      }
    }
  });

  it("selecting a preset updates the store and initializes canonical defaults", () => {
    const store = useEditorStore.getState();
    store.selectPreset("8d-audio");

    const updated = useEditorStore.getState();
    expect(updated.selectedPresetId).toBe("8d-audio");
    expect(updated.effectValues["rotation"]).toBe(50);
    expect(isPresetModified("8d-audio", updated.effectValues)).toBe(false);
  });

  it("updating an effect parameter modifies effectValues without corrupting preset state", () => {
    const store = useEditorStore.getState();
    store.selectPreset("slowed-reverb");
    store.setEffectValue("speed", 75);

    const updated = useEditorStore.getState();
    expect(updated.effectValues["speed"]).toBe(75);
    expect(isPresetModified("slowed-reverb", updated.effectValues)).toBe(true);

    store.resetEffects();
    const resetState = useEditorStore.getState();
    expect(resetState.effectValues["speed"]).toBe(80);
    expect(isPresetModified("slowed-reverb", resetState.effectValues)).toBe(false);
  });
});
