"use client";

import { useState } from "react";
import {
  MagnifyingGlass,
  Sparkle,
  Faders,
  Check,
  ArrowsClockwise,
  ArrowRight,
  Headphones,
  Cpu,
  SlidersHorizontal,
  Wrench,
  MusicNotes,
  Scissors,
} from "@phosphor-icons/react";
import { presetCategories, presets, getPresetById } from "@/config/presets";
import { PresetIcon } from "@/components/icons/preset-icons";
import { useEditorStore, isPresetModified } from "@/stores/editor-store";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { PresetParam } from "@/types/preset";
import { cn, formatTime } from "@/lib/utils";

export const STANDARD_PRESET_IDS = new Set([
  "slowed-reverb",
  "nightcore",
  "daycore",
  "8d-audio",
  "bass-boost-heavy",
  "pitch-432hz",
  "lofi-tape",
  "cathedral-reverb",
  "underwater",
]);

export function SoundSelector() {
  const [activeTab, setActiveTab] = useState<"presets" | "customize">("presets");
  const [onlyStandards, setOnlyStandards] = useState(false);

  const selectedPresetId = useEditorStore((s) => s.selectedPresetId);
  const selectPreset = useEditorStore((s) => s.selectPreset);
  const activeCategory = useEditorStore((s) => s.activeCategory);
  const setActiveCategory = useEditorStore((s) => s.setActiveCategory);
  const activeKind = useEditorStore((s) => s.activeKind);
  const setActiveKind = useEditorStore((s) => s.setActiveKind);
  const searchQuery = useEditorStore((s) => s.searchQuery);
  const setSearchQuery = useEditorStore((s) => s.setSearchQuery);
  const effectValues = useEditorStore((s) => s.effectValues);
  const resetEffects = useEditorStore((s) => s.resetEffects);
  const decodedAudio = useEditorStore((s) => s.decodedAudio);

  const isProcessing = useEditorStore((s) => s.isProcessing);
  const naturalPrompt = useEditorStore((s) => s.naturalPrompt);
  const setNaturalPrompt = useEditorStore((s) => s.setNaturalPrompt);
  const applyNaturalPrompt = useEditorStore((s) => s.applyNaturalPrompt);
  const matchedPromptLabel = useEditorStore((s) => s.matchedPromptLabel);

  const selectedPreset = getPresetById(selectedPresetId ?? "");
  const isCustomized = isPresetModified(selectedPresetId, effectValues);

  // Filter presets across all 9 categories & kind (presets vs tools)
  const filteredPresets = presets.filter((p) => {
    if (onlyStandards && !STANDARD_PRESET_IDS.has(p.id)) return false;
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchKind = activeKind === "all" || p.kind === activeKind;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      q === "" ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.supportedOps.some((op) => op.toLowerCase().includes(q));
    return matchCat && matchKind && matchQuery;
  });

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyNaturalPrompt();
  };

  const totalPresetsCount = presets.filter((p) => p.kind === "preset").length;
  const totalToolsCount = presets.filter((p) => p.kind === "tool").length;

  return (
    <section aria-labelledby="sound-selection-heading" className="rounded-2xl border border-line bg-surface p-4 sm:p-5 space-y-4 min-w-0 overflow-hidden shadow-sm">
      {/* Header and Mode switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 id="sound-selection-heading" className="text-base font-semibold text-fg">
              Choose Sound or Tool
            </h3>
            {isCustomized && !isProcessing && (
              <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-500 uppercase tracking-wide">
                Custom Parameters
              </span>
            )}
            {isProcessing && (
              <span className="rounded bg-primary/10 border border-primary/25 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wide animate-pulse">
                DSP Render in Progress (Locked)
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {isProcessing
              ? "Parameter adjustments are locked while offline DSP rendering completes."
              : "Select an aesthetic preset, or engage dedicated audio utilities like Equalizer, Trimmer, or 432 Hz tuning."}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center rounded-lg border border-line bg-deep/60 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("presets")}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              activeTab === "presets"
                ? "bg-surface text-fg font-semibold shadow-xs"
                : "text-muted hover:text-fg",
            )}
          >
            Catalog ({presets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("customize")}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5",
              activeTab === "customize"
                ? "bg-surface text-fg font-semibold shadow-xs"
                : "text-muted hover:text-fg",
            )}
          >
            <Faders className="h-3 w-3" />
            DSP Controls
          </button>
        </div>
      </div>

      {/* Natural-Language Sound Search Bar */}
      <form onSubmit={handlePromptSubmit}>
        <div className="relative flex items-center">
          <Sparkle className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-primary" />
          <input
            type="text"
            value={naturalPrompt}
            onChange={(e) => setNaturalPrompt(e.target.value)}
            placeholder="Describe what you want (e.g. slowed reverb, 432 hz, heavy bass boost, nightcore, 8d audio)"
            className="h-9.5 w-full rounded-lg border border-line bg-surface pl-9 pr-24 text-xs text-fg placeholder:text-faint focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary font-sans transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 inline-flex items-center gap-1 rounded bg-raised border border-line px-2.5 py-1 text-[11px] font-medium text-fg hover:border-primary/40 transition-colors cursor-pointer"
          >
            Map Tool
            <ArrowRight className="h-2.5 w-2.5" />
          </button>
        </div>

        {matchedPromptLabel && (
          <p className="mt-1.5 text-[11px] text-primary flex items-center gap-1 font-medium">
            <Check className="h-3 w-3 stroke-[3]" />
            Matched request to: <strong className="font-semibold underline">{matchedPromptLabel}</strong>
          </p>
        )}
      </form>

      {/* Active Preset / Tool Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-lg border border-line bg-raised/50 px-3.5 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Active module:</span>
          <span className="text-xs font-semibold text-fg flex items-center gap-1.5">
            <PresetIcon presetId={selectedPresetId || ""} size={15} className="text-primary" />
            {selectedPreset?.name || "Custom DSP Curve"}
          </span>

          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-surface border border-line text-muted">
            {selectedPreset?.kind === "tool" ? "Audio Tool" : "Creative Preset"}
          </span>

          {isCustomized ? (
            <span className="text-[11px] text-amber-500 dark:text-amber-400 font-mono">
              (modified)
            </span>
          ) : (
            <span className="text-[11px] text-muted font-mono">
              (default)
            </span>
          )}

          {selectedPreset?.compatibilityNote && (
            <span className="hidden md:inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-medium">
              <Headphones className="w-2.5 h-2.5" />
              {selectedPreset.compatibilityNote}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isCustomized && (
            <button
              type="button"
              onClick={resetEffects}
              className="text-xs text-amber-500 dark:text-amber-400 hover:opacity-80 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset parameters to the original preset values"
            >
              <ArrowsClockwise className="h-3 w-3" />
              Reset to Preset
            </button>
          )}

          {selectedPreset && activeTab === "presets" && (
            <button
              type="button"
              onClick={() => setActiveTab("customize")}
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1 ml-2 cursor-pointer"
            >
              Adjust sliders
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tab A: Catalog (Presets & Tools) */}
      {activeTab === "presets" && (
        <div className={cn("space-y-4 transition-opacity duration-200", isProcessing && "pointer-events-none opacity-50")}>
          {/* Sub-Filters: Standards vs All vs Presets vs Tools */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-line/70 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setOnlyStandards(!onlyStandards);
                }}
                className={cn(
                  "btn-preset-filter px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 cursor-pointer",
                  onlyStandards
                    ? "is-selected bg-primary text-white font-semibold shadow-xs"
                    : "text-muted hover:text-fg bg-raised border border-line hover:border-primary/40",
                )}
              >
                <Sparkle className="w-3 h-3 text-amber-400" weight="fill" />
                <span>Standard Presets ({STANDARD_PRESET_IDS.size})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOnlyStandards(false);
                  setActiveKind("all");
                }}
                className={cn(
                  "btn-preset-filter px-2.5 py-1 rounded text-xs font-medium cursor-pointer",
                  !onlyStandards && activeKind === "all"
                    ? "is-selected bg-primary text-white font-semibold"
                    : "text-muted hover:text-fg bg-raised border border-line",
                )}
              >
                All Modules ({presets.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setOnlyStandards(false);
                  setActiveKind("preset");
                }}
                className={cn(
                  "btn-preset-filter px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 cursor-pointer",
                  !onlyStandards && activeKind === "preset"
                    ? "is-selected bg-primary text-white font-semibold"
                    : "text-muted hover:text-fg bg-raised border border-line",
                )}
              >
                <MusicNotes className="w-3 h-3" />
                Creative ({totalPresetsCount})
              </button>

              <button
                type="button"
                onClick={() => {
                  setOnlyStandards(false);
                  setActiveKind("tool");
                }}
                className={cn(
                  "btn-preset-filter px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 cursor-pointer",
                  !onlyStandards && activeKind === "tool"
                    ? "is-selected bg-primary text-white font-semibold"
                    : "text-muted hover:text-fg bg-raised border border-line",
                )}
              >
                <Wrench className="w-3 h-3" />
                Tools ({totalToolsCount})
              </button>
            </div>

            <div className="relative sm:w-56 shrink-0">
              <MagnifyingGlass className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tools or tags…"
                className="h-8 w-full rounded-md border border-line bg-surface pl-8 pr-2.5 text-xs text-fg placeholder:text-faint focus:border-primary focus:outline-none font-sans"
              />
            </div>
          </div>

          {/* 9 Categories Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "btn-preset-filter rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer",
                activeCategory === "all"
                  ? "is-selected bg-primary text-white font-semibold shadow-xs"
                  : "bg-surface text-muted hover:text-fg border border-line",
              )}
            >
              All Categories
            </button>
            {presetCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={cn(
                  "btn-preset-filter rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer",
                  activeCategory === c.id
                    ? "is-selected bg-primary text-white font-semibold shadow-xs"
                    : "bg-surface text-muted hover:text-fg border border-line",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Preset & Tool Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-2.5 min-w-0">
            {filteredPresets.map((preset) => {
              const isSelected = selectedPresetId === preset.id;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => selectPreset(preset.id)}
                  className={cn(
                    "btn-preset-filter flex flex-col justify-between rounded-xl border p-3.5 text-left cursor-pointer group shadow-xs min-w-0 overflow-hidden",
                    isSelected
                      ? "is-selected border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-line bg-surface hover:bg-raised hover:border-line-strong",
                  )}
                >
                  <div className="w-full min-w-0">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                          isSelected
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-line bg-surface text-muted group-hover:text-primary group-hover:border-primary/30",
                        )}
                      >
                        <PresetIcon presetId={preset.id} size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5 min-w-0">
                          <span className={cn("text-xs font-semibold truncate", isSelected ? "text-primary" : "text-fg")}>
                            {preset.name}
                          </span>
                          {isSelected ? (
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-xs">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="h-4 w-4 shrink-0 rounded-full border border-line" />
                          )}
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted line-clamp-2 break-words">
                          {preset.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Operations & Param summary badges */}
                  <div className="mt-2.5 pt-2 border-t border-line/60 flex flex-wrap items-center justify-between gap-1 text-[10px] min-w-0">
                    <div className="flex items-center gap-1 text-faint truncate">
                      <Cpu className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{preset.supportedOps[0]}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 font-mono text-muted overflow-hidden">
                      {preset.params.slice(0, 2).map((p) => {
                        const defVal = preset.defaults[p.id];
                        return (
                          <span key={p.id} className="bg-raised px-1 py-0.5 rounded border border-line text-[10px] truncate">
                            {p.id}: {p.kind === "slider" ? `${defVal}${p.unit}` : "on"}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab B: Customize Active Parameters */}
      {activeTab === "customize" && (
        <div className={cn("space-y-4 transition-opacity duration-200", isProcessing && "pointer-events-none opacity-50")}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
            <div>
              <span className="text-xs font-medium text-muted">
                Active DSP Chain: <strong className="text-fg">{selectedPreset?.name || "Custom Shape"}</strong>
              </span>
              <p className="text-[11px] text-faint mt-0.5">
                Every slider updates the OfflineAudioContext DSP graph in real time.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={resetEffects}
              className="text-xs h-7 px-2.5 cursor-pointer"
            >
              <ArrowsClockwise className="h-3 w-3" />
              Reset to defaults
            </Button>
          </div>

          {/* Special Custom Controls for Specific Tools */}
          {selectedPresetId === "trimmer-cutter" && decodedAudio && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5 text-primary font-semibold">
                  <Scissors className="w-3.5 h-3.5" />
                  Crop Range Selector
                </span>
                <span className="font-mono text-fg">
                  Total File: {formatTime(decodedAudio.duration)}
                </span>
              </div>
              <p className="text-xs text-muted">
                Specify start and end times to trim. The exported master will only contain the cropped slice.
              </p>
            </div>
          )}

          {selectedPresetId === "pitch-432hz" && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 text-xs text-muted leading-relaxed">
              <span className="font-semibold text-primary block mb-1">
                Concert Pitch (A=440 Hz) → Sacred Pitch (A=432 Hz)
              </span>
              Applying exact mathematical tuning frequency ratio of <code className="text-primary font-mono font-semibold">432 / 440 = 0.981818</code> (-31.766 cents pitch transposition) preserving clean acoustic harmonic balance.
            </div>
          )}

          {/* Preset / Tool Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {selectedPreset?.params.map((param) => {
              if (param.kind === "slider") {
                return <ActiveSliderControl key={param.id} param={param} />;
              }
              if (param.kind === "toggle") {
                return <ActiveToggleControl key={param.id} param={param} />;
              }
              return null;
            })}
          </div>

          {/* Master Sound Sculpting Faders */}
          <div className="pt-3 border-t border-line space-y-3">
            <h4 className="text-xs font-semibold text-fg uppercase tracking-wide flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              Master Tone Sculpting
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MasterSliderControl id="bass" label="Low-Shelf Bass" min={0} max={15} unit="dB" description="Boosts low frequencies centered at 85 Hz." />
              <MasterSliderControl id="treble" label="High-Shelf Treble" min={-8} max={10} unit="dB" description="Brightens air or smooths harsh highs." />
              <MasterSliderControl id="presence" label="Mid-Presence" min={-4} max={8} unit="dB" description="Vocal clarity contour around 2.4 kHz." />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ActiveSliderControl({ param }: { param: Extract<PresetParam, { kind: "slider" }> }) {
  const effectValues = useEditorStore((s) => s.effectValues);
  const setEffectValue = useEditorStore((s) => s.setEffectValue);

  const val = typeof effectValues[param.id] === "number" ? (effectValues[param.id] as number) : param.min;

  return (
    <div className="rounded-xl border border-line bg-surface p-3.5 shadow-xs">
      <div className="flex items-center justify-between text-xs">
        <label htmlFor={`fader-${param.id}`} className="font-medium text-fg">
          {param.label}
        </label>
        <span className="font-mono text-primary font-semibold">
          {val} {param.unit}
        </span>
      </div>
      <Slider
        id={`fader-${param.id}`}
        value={[val]}
        min={param.min}
        max={param.max}
        step={param.step}
        onValueChange={([next]) => setEffectValue(param.id, next ?? val)}
        aria-label={param.label}
        className="mt-2.5"
      />
      <p className="mt-1.5 text-[11px] text-faint">{param.description}</p>
    </div>
  );
}

function MasterSliderControl({
  id,
  label,
  min,
  max,
  unit,
  description,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  unit: string;
  description: string;
}) {
  const effectValues = useEditorStore((s) => s.effectValues);
  const setEffectValue = useEditorStore((s) => s.setEffectValue);

  const val = typeof effectValues[id] === "number" ? (effectValues[id] as number) : 0;

  return (
    <div className="rounded-xl border border-line bg-surface p-3 shadow-xs">
      <div className="flex items-center justify-between text-xs">
        <label htmlFor={`master-${id}`} className="font-medium text-fg">
          {label}
        </label>
        <span className="font-mono text-muted text-[11px]">
          {val > 0 ? `+${val}` : val} {unit}
        </span>
      </div>
      <Slider
        id={`master-${id}`}
        value={[val]}
        min={min}
        max={max}
        step={1}
        onValueChange={([next]) => setEffectValue(id, next ?? val)}
        aria-label={label}
        className="mt-2"
      />
      <p className="mt-1 text-[10px] text-muted">{description}</p>
    </div>
  );
}

function ActiveToggleControl({ param }: { param: Extract<PresetParam, { kind: "toggle" }> }) {
  const effectValues = useEditorStore((s) => s.effectValues);
  const setEffectValue = useEditorStore((s) => s.setEffectValue);

  const checked = effectValues[param.id] === true;

  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-deep/40 p-3.5">
      <div>
        <label htmlFor={`toggle-${param.id}`} className="text-xs font-medium text-fg block">
          {param.label}
        </label>
        <p className="text-[11px] text-faint mt-0.5">{param.description}</p>
      </div>
      <Switch
        id={`toggle-${param.id}`}
        checked={checked}
        onCheckedChange={(c) => setEffectValue(param.id, c)}
        aria-label={param.label}
      />
    </div>
  );
}
