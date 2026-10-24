import { describe, expect, it } from "vitest";
import { getAllPresets, presetCategories } from "../presets";
import { resolveProcessing } from "@/lib/audio/dsp-plan";
import { PRESET_ICON_REGISTRY, getMissingPresetIconIds } from "@/components/icons/preset-icons";

describe("Preset System Audit (Phase 2)", () => {
  const allCategoryIds = new Set(presetCategories.map((c) => c.id));
  const allPresets = getAllPresets();

  it("Criterion 1: Preset IDs are unique", () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];

    for (const preset of allPresets) {
      if (seen.has(preset.id)) {
        duplicates.push(preset.id);
      }
      seen.add(preset.id);
    }

    expect(duplicates, `Found duplicate preset IDs: ${duplicates.join(", ")}`).toHaveLength(0);
  });

  it("Criterion 2: Every preset references an existing category", () => {
    for (const preset of allPresets) {
      expect(
        allCategoryIds.has(preset.category),
        `Preset '${preset.id}' references unknown category '${preset.category}'`
      ).toBe(true);
    }
  });

  it("Criterion 3: Every preset parameter ID is unique within that preset", () => {
    for (const preset of allPresets) {
      const seenParams = new Set<string>();
      for (const param of preset.params) {
        expect(
          seenParams.has(param.id),
          `Preset '${preset.id}' has duplicate parameter ID '${param.id}'`
        ).toBe(false);
        seenParams.add(param.id);
      }
    }
  });

  it("Criterion 4: Every declared default corresponds to a valid parameter and vice versa", () => {
    for (const preset of allPresets) {
      const paramIds = new Set(preset.params.map((p) => p.id));
      const defaultKeys = Object.keys(preset.defaults);

      // Every default key must exist in declared params
      for (const key of defaultKeys) {
        expect(
          paramIds.has(key),
          `Preset '${preset.id}' declares default for unknown parameter '${key}'`
        ).toBe(true);
      }

      // Every declared param must have a default value
      for (const param of preset.params) {
        expect(
          keyInDefaults(param.id, preset.defaults),
          `Preset '${preset.id}' missing default for parameter '${param.id}'`
        ).toBe(true);
      }
    }
  });

  it("Criterion 5: Default values match the parameter type and allowed range", () => {
    for (const preset of allPresets) {
      for (const param of preset.params) {
        const val = preset.defaults[param.id];

        if (param.kind === "slider") {
          expect(
            typeof val,
            `Preset '${preset.id}' param '${param.id}' default must be a number`
          ).toBe("number");

          const numVal = val as number;
          if (param.min != null) {
            expect(
              numVal,
              `Preset '${preset.id}' param '${param.id}' default (${numVal}) below min (${param.min})`
            ).toBeGreaterThanOrEqual(param.min);
          }
          if (param.max != null) {
            expect(
              numVal,
              `Preset '${preset.id}' param '${param.id}' default (${numVal}) above max (${param.max})`
            ).toBeLessThanOrEqual(param.max);
          }
        } else if (param.kind === "toggle") {
          expect(
            typeof val,
            `Preset '${preset.id}' param '${param.id}' default must be boolean`
          ).toBe("boolean");
        } else if (param.kind === "select") {
          const allowedValues = param.options.map((o) => o.value);
          expect(
            allowedValues.includes(val as string | number),
            `Preset '${preset.id}' param '${param.id}' default (${String(val)}) not in select options`
          ).toBe(true);
        }
      }
    }
  });

  it("Criterion 6: Select-valued parameters support their declared value types", () => {
    for (const preset of allPresets) {
      for (const param of preset.params) {
        if (param.kind === "select") {
          expect(param.options.length).toBeGreaterThan(0);
          for (const opt of param.options) {
            expect(
              typeof opt.value === "string" || typeof opt.value === "number",
              `Preset '${preset.id}' param '${param.id}' option has invalid value type`
            ).toBe(true);
          }
        }
      }
    }
  });

  it("Criterion 7: Every preset maps to a valid DSP implementation in resolveProcessing", () => {
    for (const preset of allPresets) {
      const plan = resolveProcessing(preset.id, preset.defaults);
      expect(plan.presetId).toBe(preset.id);
      expect(Number.isFinite(plan.playbackRate)).toBe(true);
      expect(plan.playbackRate).toBeGreaterThan(0);
      expect(plan.tailSeconds).toBeGreaterThanOrEqual(0);
    }
  });

  it("Criterion 8: Advertised supported operations correspond to actual behavior", () => {
    for (const preset of allPresets) {
      const plan = resolveProcessing(preset.id, preset.defaults);
      const ops = preset.supportedOps;

      if (ops.includes("ImpulseConvolver")) {
        // Reverb must be configured in plan if default wet > 0
        const defaultReverbWet = preset.defaults["reverb"] as number | undefined;
        if (defaultReverbWet == null || defaultReverbWet > 0) {
          expect(
            plan.reverb,
            `Preset '${preset.id}' advertises ImpulseConvolver but plan.reverb is null`
          ).not.toBeNull();
        }
      }

      if (ops.includes("WaveShaperSaturation") || ops.includes("TanhTransferFunction")) {
        expect(
          plan.saturation,
          `Preset '${preset.id}' advertises WaveShaperSaturation but plan.saturation is 0`
        ).toBeGreaterThan(0);
      }

      if (ops.includes("SampleBufferReverse")) {
        expect(
          plan.reverse,
          `Preset '${preset.id}' advertises SampleBufferReverse but plan.reverse is false`
        ).toBe(true);
      }

      if (ops.includes("MonoDownmixNode")) {
        expect(
          plan.mono,
          `Preset '${preset.id}' advertises MonoDownmixNode but plan.mono is false`
        ).toBe(true);
      }

      if (ops.includes("MidSideWidth")) {
        expect(
          plan.width,
          `Preset '${preset.id}' advertises MidSideWidth but plan.width is null`
        ).not.toBeNull();
      }

      if (ops.includes("PingPongFeedbackLoop")) {
        expect(
          plan.echo,
          `Preset '${preset.id}' advertises PingPongFeedbackLoop but plan.echo is null`
        ).not.toBeNull();
      }
    }
  });

  it("Criterion 9: Every preset has the correct icon mapping", () => {
    expect(getMissingPresetIconIds()).toHaveLength(0);
    for (const preset of allPresets) {
      const icon = PRESET_ICON_REGISTRY[preset.id];
      expect(
        icon,
        `Preset '${preset.id}' is missing an icon mapping in PRESET_ICON_REGISTRY`
      ).toBeDefined();
    }
  });

  it("Criterion 10: UI labels, descriptions, and registry IDs are non-empty and well-formed", () => {
    for (const preset of allPresets) {
      expect(preset.name.trim().length, `Preset '${preset.id}' has empty name`).toBeGreaterThan(0);
      expect(
        preset.description.trim().length,
        `Preset '${preset.id}' has empty description`
      ).toBeGreaterThan(10);
      expect(preset.tags.length, `Preset '${preset.id}' has no tags`).toBeGreaterThan(0);
      expect(preset.supportedOps.length, `Preset '${preset.id}' has no supportedOps`).toBeGreaterThan(0);

      for (const param of preset.params) {
        expect(param.label.trim().length, `Preset '${preset.id}' param '${param.id}' has empty label`).toBeGreaterThan(0);
        expect(
          param.description.trim().length,
          `Preset '${preset.id}' param '${param.id}' has empty description`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("Criterion 11: Every declared parameter modifies the resolved DSP plan or export configuration", () => {
    for (const preset of allPresets) {
      if (preset.params.length === 0) continue;

      const basePlan = resolveProcessing(preset.id, { ...preset.defaults });

      for (const param of preset.params) {
        let testVal: number | string | boolean;
        if (param.kind === "slider") {
          const def = (preset.defaults[param.id] as number) ?? param.min;
          testVal = def === param.max ? param.min : param.max;
        } else if (param.kind === "toggle") {
          testVal = !(preset.defaults[param.id] as boolean);
        } else if (param.kind === "select") {
          const other = param.options.find((o) => o.value !== preset.defaults[param.id]);
          testVal = other ? other.value : param.options[0].value;
        } else {
          continue;
        }

        const altPlan = resolveProcessing(preset.id, {
          ...preset.defaults,
          [param.id]: testVal,
        });

        // Some parameters affect export config (sampleRate, bitDepth, mp3Bitrate, channels)
        const isExportParam = [
          "sampleRate",
          "bitDepth",
          "mp3Bitrate",
          "channels",
          "format",
          "quality",
        ].includes(param.id);

        const differs = JSON.stringify(basePlan) !== JSON.stringify(altPlan);
        expect(
          differs || isExportParam,
          `Preset '${preset.id}' parameter '${param.id}' does not alter the DSP plan or export config!`
        ).toBe(true);
      }
    }
  });
});

function keyInDefaults(key: string, defaults: Record<string, unknown>): boolean {
  return Object.prototype.hasOwnProperty.call(defaults, key) && defaults[key] !== undefined;
}
