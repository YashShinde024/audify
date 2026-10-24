/**
 * Audify Saved Custom Presets Storage & Validation Module
 * Manages local user presets with schema validation, export, and import.
 */

import type { EffectValues, SavedCustomPreset } from "@/types/preset";

export const CUSTOM_PRESETS_STORAGE_KEY = "audify_custom_presets_v1";

/**
 * Validates whether an untrusted object conforms to the SavedCustomPreset schema.
 */
export function validateCustomPreset(item: unknown): SavedCustomPreset | null {
  if (!item || typeof item !== "object") return null;
  const obj = item as Record<string, unknown>;

  if (typeof obj.id !== "string" || obj.id.trim() === "") return null;
  if (typeof obj.name !== "string" || obj.name.trim() === "") return null;
  if (!obj.effectValues || typeof obj.effectValues !== "object" || Array.isArray(obj.effectValues)) {
    return null;
  }

  // Sanitize and validate effect values (numbers, booleans, strings only)
  const sanitizedValues: EffectValues = {};
  for (const [key, val] of Object.entries(obj.effectValues as Record<string, unknown>)) {
    // Prevent prototype pollution
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;

    if (typeof val === "number" && Number.isFinite(val)) {
      sanitizedValues[key] = val;
    } else if (typeof val === "boolean" || typeof val === "string") {
      sanitizedValues[key] = val;
    }
  }

  const createdAt = typeof obj.createdAt === "number" && Number.isFinite(obj.createdAt) ? obj.createdAt : Date.now();
  const updatedAt = typeof obj.updatedAt === "number" && Number.isFinite(obj.updatedAt) ? obj.updatedAt : Date.now();

  return {
    id: obj.id.trim(),
    name: obj.name.trim().slice(0, 50),
    basePresetId: typeof obj.basePresetId === "string" ? obj.basePresetId.trim() : undefined,
    description: typeof obj.description === "string" ? obj.description.trim().slice(0, 160) : undefined,
    effectValues: sanitizedValues,
    createdAt,
    updatedAt,
  };
}

/**
 * Loads and validates all custom presets from browser localStorage.
 */
export function loadSavedCustomPresets(): SavedCustomPreset[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }

  try {
    const raw = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const validPresets: SavedCustomPreset[] = [];
    for (const item of parsed) {
      const valid = validateCustomPreset(item);
      if (valid) {
        validPresets.push(valid);
      }
    }

    return validPresets;
  } catch (err) {
    console.warn("Failed to load custom presets from localStorage:", err);
    return [];
  }
}

/**
 * Saves the full list of custom presets into localStorage.
 */
export function persistCustomPresets(presets: SavedCustomPreset[]): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  try {
    localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(presets));
    return true;
  } catch (err) {
    console.error("Failed to write custom presets to localStorage:", err);
    return false;
  }
}

/**
 * Generates an exportable JSON payload of custom presets.
 */
export function exportPresetsToJson(presets: SavedCustomPreset[]): string {
  return JSON.stringify(
    {
      version: 1,
      source: "Audify by Nyxen × Xpert Melody",
      exportedAt: new Date().toISOString(),
      presets,
    },
    null,
    2
  );
}

/**
 * Safely parses and imports custom presets from a JSON string.
 */
export function importPresetsFromJson(jsonStr: string): {
  validPresets: SavedCustomPreset[];
  importedCount: number;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonStr);
    const rawPresets = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.presets) ? parsed.presets : null;

    if (!rawPresets) {
      return { validPresets: [], importedCount: 0, error: "Invalid JSON format: missing presets array." };
    }

    const validPresets: SavedCustomPreset[] = [];
    for (const item of rawPresets) {
      const valid = validateCustomPreset(item);
      if (valid) {
        validPresets.push(valid);
      }
    }

    return {
      validPresets,
      importedCount: validPresets.length,
    };
  } catch {
    return { validPresets: [], importedCount: 0, error: "Failed to parse JSON string." };
  }
}
