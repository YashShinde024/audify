"use client";

import React from "react";
import { presetIds, type PresetId } from "@/config/presets";
import {
  // Speed & Viral
  MoonStars,
  TrendUp,
  SunHorizon,
  FastForward,
  ClockCountdown,
  // Stereo & Spatial
  Planet,
  ArrowsLeftRight,
  ArrowsOutCardinal,
  ArrowArcRight,
  ArrowsCounterClockwise,
  // Bass & Equalizer
  SpeakerLow,
  SpeakerHigh,
  SpeakerHifi,
  WaveSawtooth,
  Equalizer,
  Wind,
  // Reverb & Echo
  Drop,
  House,
  Buildings,
  Church,
  Columns,
  MicrophoneStage,
  Waves,
  // Pitch & Tempo
  PianoKeys,
  Pulse,
  WaveSine,
  Speedometer,
  // Creative
  ArrowCounterClockwise,
  PhoneCall,
  CassetteTape,
  Infinity as InfinityIcon,
  Radioactive,
  Lightning,
  // Cleanup & Polish
  ShieldCheck,
  Sparkle,
  MagicWand,
  // Utilities
  Scissors,
  ArrowsMerge,
  Metronome,
  FileAudio,
  SlidersHorizontal,
  // Brand
  YoutubeLogo,
  type IconWeight,
  type IconProps as PhosphorIconProps,
} from "@phosphor-icons/react";

export type PresetIconWeight = IconWeight;

export interface BaseAudioIconProps {
  size?: number | string;
  weight?: PresetIconWeight;
  className?: string;
  color?: string;
}

/** Component type for any Phosphor icon entry. */
type PresetIconComponent = React.ComponentType<PhosphorIconProps>;

/**
 * Canonical map: every preset id from `src/config/presets.ts` MUST have an
 * entry here. The `Record<PresetId, …>` type makes a missing mapping a
 * compile-time error, so the registry can never drift from the catalogue.
 */
const presetIconMap: Record<PresetId, PresetIconComponent> = {
  // Speed & Viral Edits
  "slowed-reverb": MoonStars,
  "slowed": MoonStars,
  "super-slowed": ClockCountdown,
  "nightcore": TrendUp,
  "daycore": SunHorizon,
  "sped-up": FastForward,

  // Stereo & Spatial Effects
  "8d-audio": Planet,
  "auto-panner": ArrowsLeftRight,
  "stereo-panner": ArrowsLeftRight,
  "stereo-widening": ArrowsOutCardinal,
  "ping-pong": ArrowArcRight,

  // Bass & Equalizer
  "bass-boost-light": SpeakerLow,
  "bass-boost-mod": SpeakerHigh,
  "bass-boost-heavy": SpeakerHifi,
  "bass-boost-extreme": WaveSawtooth,
  "equalizer": Equalizer,
  "treble-air": Wind,

  // Reverb & Echo
  "bathroom-reverb": Drop,
  "small-room-reverb": House,
  "medium-room-reverb": Buildings,
  "large-room-reverb": Columns,
  "church-hall-reverb": Church,
  "cathedral-reverb": Church,
  "vocal-reverb": MicrophoneStage,

  // Pitch & Tempo
  "pitch-432hz": PianoKeys,
  "pitch-shifter": Pulse,
  "tempo-changer": Speedometer,

  // Creative Effects
  "reverse": ArrowCounterClockwise,
  "underwater": Waves,
  "telephone-voice": PhoneCall,
  "lofi-tape": CassetteTape,

  // Cleanup
  "noise-reducer": ShieldCheck,
  "vocal-clarity": Sparkle,
  "de-harsh": WaveSine,

  // Utilities & Export
  "volume-changer": SpeakerHigh,
  "trimmer-cutter": Scissors,
  "downmixer": ArrowsMerge,
  "bpm-detector": Metronome,
  "format-converter": FileAudio,
  "mastering-polish": MagicWand,
};

/** Legacy/friendly aliases kept for backwards compatibility with older routes. */
const legacyIconAliases: Record<string, PresetIconComponent> = {
  "stereo-widener": ArrowsOutCardinal,
  "bass-boost": SpeakerHifi,
  "reverb": Waves,
  "echo": ArrowsCounterClockwise,
  "pitch": Pulse,
  "speed": Speedometer,
  "chorus": InfinityIcon,
  "flanger": Radioactive,
  "phaser": Radioactive,
  "distortion": Lightning,
  "noise-reduction": ShieldCheck,
  "volume": SpeakerHigh,
  "volume-normalize": SpeakerHigh,
  "trim": Scissors,
  "stereo-to-mono": ArrowsMerge,
  "fade": SlidersHorizontal,
  "fade-in-out": SlidersHorizontal,
};

/** Flattened lookup (canonical + legacy aliases). */
export const PRESET_ICON_REGISTRY: Record<string, PresetIconComponent> = {
  ...presetIconMap,
  ...legacyIconAliases,
};

/** Default fallback icon when no semantic mapping exists. */
export const FALLBACK_PRESET_ICON: PresetIconComponent = Equalizer;

/**
 * Runtime audit helper (used by tests): returns preset ids that lack an icon
 * mapping. Should always be empty — the type system already enforces this,
 * but the check guards against accidental `as any` casts.
 */
export function getMissingPresetIconIds(): PresetId[] {
  return presetIds.filter((id) => !(id in presetIconMap));
}

/**
 * Set of signature featured preset IDs that receive duotone styling by default
 */
const FEATURED_DUOTONE_PRESETS = new Set([
  "slowed-reverb",
  "8d-audio",
  "pitch-432hz",
  "bass-boost-heavy",
  "cathedral-reverb",
  "nightcore",
  "daycore",
  "lofi-tape",
  "auto-panner",
  "mastering-polish",
]);

/**
 * Reusable Component: PresetIcon
 * Renders a professional Phosphor icon with semantic mapping and optional duotone weight.
 */
export function PresetIcon({
  presetId,
  size = 20,
  weight,
  className = "",
  color,
}: {
  presetId: string;
  size?: number | string;
  weight?: PresetIconWeight;
  className?: string;
  color?: string;
}) {
  const IconComponent = PRESET_ICON_REGISTRY[presetId] || FALLBACK_PRESET_ICON;
  const resolvedWeight: PresetIconWeight =
    weight || (FEATURED_DUOTONE_PRESETS.has(presetId) ? "duotone" : "regular");

  return <IconComponent size={size} weight={resolvedWeight} className={className} color={color} />;
}

/**
 * Reusable Component: EffectIcon
 */
export function EffectIcon({
  effectId,
  size = 20,
  weight = "regular",
  className = "",
  color,
}: {
  effectId: string;
  size?: number | string;
  weight?: PresetIconWeight;
  className?: string;
  color?: string;
}) {
  const IconComponent = PRESET_ICON_REGISTRY[effectId] || Equalizer;
  return <IconComponent size={size} weight={weight} className={className} color={color} />;
}

/**
 * Reusable Component: ToolIcon
 */
export function ToolIcon({
  toolId,
  size = 20,
  weight = "regular",
  className = "",
  color,
}: {
  toolId: string;
  size?: number | string;
  weight?: PresetIconWeight;
  className?: string;
  color?: string;
}) {
  const IconComponent = PRESET_ICON_REGISTRY[toolId] || FileAudio;
  return <IconComponent size={size} weight={weight} className={className} color={color} />;
}

/**
 * Reusable YouTube Brand Icon from Phosphor Icons
 */
export function YouTubeIcon({
  size = 18,
  weight = "fill",
  className = "",
}: {
  size?: number | string;
  weight?: PresetIconWeight;
  className?: string;
}) {
  return <YoutubeLogo size={size} weight={weight} className={className} />;
}
