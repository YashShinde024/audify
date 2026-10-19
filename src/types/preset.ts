export type PresetCategoryId =
  | "speed-viral"
  | "stereo-spatial"
  | "bass-equalizer"
  | "reverb-echo"
  | "pitch-tempo"
  | "creative"
  | "cleanup"
  | "utilities"
  | "export-conversion";

export interface PresetCategory {
  id: PresetCategoryId;
  label: string;
  tagline: string;
}

export type ParamKind = "slider" | "toggle" | "select";

interface ParamBase {
  /** Stable identifier used by the Web Audio DSP graph */
  id: string;
  label: string;
  /** Human-readable explanation shown under the control */
  description: string;
}

export interface SliderParam extends ParamBase {
  kind: "slider";
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export interface ToggleParam extends ParamBase {
  kind: "toggle";
}

export interface SelectParam extends ParamBase {
  kind: "select";
  options: { label: string; value: string | number }[];
}

export type PresetParam = SliderParam | ToggleParam | SelectParam;

export type PresetKind = "preset" | "tool";

export interface Preset {
  id: string;
  name: string;
  kind: PresetKind;
  category: PresetCategoryId;
  description: string;
  /** Primary DSP operations utilized */
  supportedOps: string[];
  /** Technical compatibility notes (e.g. headphones recommended) */
  compatibilityNote?: string;
  /** Search tags */
  tags: string[];
  /** Params exposed by this preset's control panel */
  params: PresetParam[];
  /** Default values resolved from param definitions */
  defaults: Record<string, number | boolean>;
}

export type EffectValue = number | boolean;

export type EffectValues = Record<string, EffectValue>;
