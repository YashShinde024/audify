"use client";

import { useRef, useState } from "react";
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
  BookmarkSimple,
  FloppyDisk,
  Trash,
  Export,
  UploadSimple,
  PencilSimple,
} from "@phosphor-icons/react";
import { presetCategories, presets, getPresetById } from "@/config/presets";
import { PresetIcon } from "@/components/icons/preset-icons";
import { useEditorStore, isPresetModified } from "@/stores/editor-store";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { PresetParam } from "@/types/preset";
import { cn, formatTime } from "@/lib/utils";
import { exportPresetsToJson } from "@/lib/audio/custom-presets";

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
  const [activeTab, setActiveTab] = useState<"presets" | "customize" | "saved" | "chain">("presets");
  const [onlyStandards, setOnlyStandards] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const customPresets = useEditorStore((s) => s.customPresets);
  const saveCustomPreset = useEditorStore((s) => s.saveCustomPreset);
  const applyCustomPreset = useEditorStore((s) => s.applyCustomPreset);
  const deleteCustomPreset = useEditorStore((s) => s.deleteCustomPreset);
  const renameCustomPreset = useEditorStore((s) => s.renameCustomPreset);
  const importCustomPresets = useEditorStore((s) => s.importCustomPresets);

  const handleExportCustomPresets = () => {
    if (customPresets.length === 0) return;
    const json = exportPresetsToJson(customPresets);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audify-custom-presets-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        importCustomPresets(text);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSaveCurrentPreset = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newPresetName.trim() || `${selectedPreset?.name || "Custom"} Signature`;
    saveCustomPreset(name);
    setNewPresetName("");
    setSaveDialogOpen(false);
    setActiveTab("saved");
  };

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
              Acoustic DSP Workstation
            </h3>
            {isCustomized && !isProcessing && (
              <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-500 uppercase tracking-wide">
                Customized
              </span>
            )}
            {isProcessing && (
              <span className="rounded bg-primary/10 border border-primary/25 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wide animate-pulse">
                DSP Locked
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {isProcessing
              ? "Parameter adjustments are locked while offline DSP rendering completes."
              : "Select a sonic preset, fine-tune sliders, or inspect the Web Audio node graph."}
          </p>
        </div>

        {/* 4-Way Segmented Tab Toggle */}
        <div className="flex items-center overflow-x-auto no-scrollbar max-w-full rounded-lg border border-line bg-deep/60 p-1 self-stretch sm:self-auto shrink-0 gap-0.5 whitespace-nowrap">
          <button
            type="button"
            onClick={() => setActiveTab("presets")}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer shrink-0",
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
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shrink-0",
              activeTab === "customize"
                ? "bg-surface text-fg font-semibold shadow-xs"
                : "text-muted hover:text-fg",
            )}
          >
            <Faders className="h-3 w-3" />
            <span>Sliders</span>
            {isCustomized && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shrink-0",
              activeTab === "saved"
                ? "bg-surface text-fg font-semibold shadow-xs"
                : "text-muted hover:text-fg",
            )}
          >
            <BookmarkSimple className="h-3 w-3" />
            <span>Saved ({customPresets.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chain")}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shrink-0",
              activeTab === "chain"
                ? "bg-surface text-fg font-semibold shadow-xs"
                : "text-muted hover:text-fg",
            )}
          >
            <Cpu className="h-3 w-3" />
            <span>Signal Chain</span>
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
            placeholder="Search sound or tool (e.g. slowed reverb, 432 hz, heavy bass boost, 8d audio)"
            className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-24 text-[16px] sm:text-xs text-fg placeholder:text-faint focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary font-sans transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 inline-flex items-center gap-1 rounded bg-raised border border-line px-2.5 py-1 text-[11px] font-medium text-fg hover:border-primary/40 transition-colors cursor-pointer"
          >
            Map Sound
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
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-lg border border-line bg-raised/50 px-3.5 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Active:</span>
          <span className="text-xs font-semibold text-fg flex items-center gap-1.5">
            <PresetIcon presetId={selectedPresetId || ""} size={15} className="text-primary" />
            {selectedPreset?.name || "Custom DSP Curve"}
          </span>

          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-surface border border-line text-muted">
            {selectedPreset?.kind === "tool" ? "Audio Tool" : "Preset"}
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
              Reset
            </button>
          )}

          {selectedPreset && activeTab === "presets" && (
            <button
              type="button"
              onClick={() => setActiveTab("customize")}
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1 ml-1 cursor-pointer"
            >
              Fine-tune
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: Catalog (Bounded Scrollable Grid) */}
      {activeTab === "presets" && (
        <div className={cn("space-y-3 transition-opacity duration-200", isProcessing && "pointer-events-none opacity-50")}>
          {/* Sub-Filters: Standards vs All vs Presets vs Tools & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-line/70 pb-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setOnlyStandards(!onlyStandards)}
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium transition-all flex items-center gap-1 cursor-pointer",
                  onlyStandards
                    ? "bg-primary text-white font-semibold shadow-glow-wire"
                    : "text-muted hover:text-fg bg-raised border border-line hover:border-primary/40",
                )}
              >
                <Sparkle className="w-3 h-3 text-amber-400" weight="fill" />
                <span>Top 9</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOnlyStandards(false);
                  setActiveKind("all");
                }}
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer",
                  !onlyStandards && activeKind === "all"
                    ? "bg-primary text-white font-semibold"
                    : "text-muted hover:text-fg bg-raised border border-line",
                )}
              >
                All ({presets.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setOnlyStandards(false);
                  setActiveKind("preset");
                }}
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer",
                  !onlyStandards && activeKind === "preset"
                    ? "bg-primary text-white font-semibold"
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
                  "px-2 py-0.5 rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer",
                  !onlyStandards && activeKind === "tool"
                    ? "bg-primary text-white font-semibold"
                    : "text-muted hover:text-fg bg-raised border border-line",
                )}
              >
                <Wrench className="w-3 h-3" />
                Tools ({totalToolsCount})
              </button>
            </div>

            <div className="relative sm:w-44 shrink-0">
              <MagnifyingGlass className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter catalog…"
                className="h-8 sm:h-7 w-full rounded-md border border-line bg-surface pl-7 pr-2 text-[16px] sm:text-xs text-fg placeholder:text-faint focus:border-primary focus:outline-none font-sans"
              />
            </div>
          </div>

          {/* 9 Categories Pills in Horizontal Scroll Rail */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-medium transition-colors cursor-pointer shrink-0",
                activeCategory === "all"
                  ? "bg-primary text-white font-semibold shadow-xs"
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
                  "rounded-md px-2 py-0.5 text-xs font-medium transition-colors cursor-pointer shrink-0",
                  activeCategory === c.id
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : "bg-surface text-muted hover:text-fg border border-line",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Bounded Scrollable Preset Grid (Eliminates Infinite Scroll) */}
          <div className="max-h-[440px] overflow-y-auto pr-1 overscroll-contain scrollbar-thin rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-2.5 min-w-0">
              {filteredPresets.map((preset) => {
                const isSelected = selectedPresetId === preset.id;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset.id)}
                    className={cn(
                      "flex flex-col justify-between rounded-xl border p-3 text-left transition-all cursor-pointer group shadow-xs min-w-0 overflow-hidden",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-glow-wire/20"
                        : "border-line bg-surface hover:bg-raised hover:border-line-strong",
                    )}
                  >
                    <div className="w-full min-w-0">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors",
                            isSelected
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-line bg-surface text-muted group-hover:text-primary group-hover:border-primary/30",
                          )}
                        >
                          <PresetIcon presetId={preset.id} size={15} />
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
                          <p className="mt-0.5 text-[11px] leading-snug text-muted line-clamp-2 break-words">
                            {preset.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Operations & Param summary badges */}
                    <div className="mt-2 pt-1.5 border-t border-line/60 flex flex-wrap items-center justify-between gap-1 text-[10px] min-w-0">
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

          {/* Catalog Footer Info */}
          <div className="flex items-center justify-between text-[11px] text-muted border-t border-line/60 pt-2 px-1">
            <span>Showing {filteredPresets.length} of {presets.length} modules</span>
            <span className="font-mono text-faint">Bounded catalog view</span>
          </div>
        </div>
      )}

      {/* TAB 2: Customize Active Parameters */}
      {activeTab === "customize" && (
        <div className={cn("space-y-4 transition-opacity duration-200", isProcessing && "pointer-events-none opacity-50")}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
            <div>
              <span className="text-xs font-medium text-muted">
                Active Parameters: <strong className="text-fg">{selectedPreset?.name || "Custom Shape"}</strong>
              </span>
              <p className="text-[11px] text-faint mt-0.5">
                Sliders update parameters for offline Web Audio DSP rendering.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSaveDialogOpen(true);
                  setActiveTab("saved");
                }}
                className="text-xs h-7 px-2.5 cursor-pointer shadow-xs"
                title="Save current parameter sliders as a named custom preset"
              >
                <FloppyDisk className="h-3 w-3" />
                <span>Save Preset</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetEffects}
                className="text-xs h-7 px-2.5 cursor-pointer"
              >
                <ArrowsClockwise className="h-3 w-3" />
                <span>Reset to defaults</span>
              </Button>
            </div>
          </div>

          {/* Special Custom Controls for Specific Tools */}
          {selectedPresetId === "trimmer-cutter" && decodedAudio && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5 text-primary font-semibold">
                  <Scissors className="w-3.5 h-3.5" />
                  Crop Range Selector
                </span>
                <span className="font-mono text-fg text-[11px]">
                  Total: {formatTime(decodedAudio.duration)}
                </span>
              </div>
              <p className="text-[11px] text-muted">
                Adjust start and end sliders below. The exported master will only contain the cropped time slice.
              </p>
            </div>
          )}

          {selectedPresetId === "pitch-432hz" && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-muted leading-relaxed">
              <span className="font-semibold text-primary block mb-0.5">
                Sacred Harmonic Pitch Transposition
              </span>
              Mathematical frequency ratio of <code className="text-primary font-mono font-semibold">432 / 440 = 0.981818</code> (-31.766 cents pitch transposition) preserving pristine acoustic harmonic resonance.
            </div>
          )}

          {/* Preset / Tool Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <div className="pt-3 border-t border-line space-y-2.5">
            <h4 className="text-xs font-semibold text-fg uppercase tracking-wide flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              Master Tone Sculpting
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <MasterSliderControl id="bass" label="Low Bass (85 Hz)" min={0} max={15} unit="dB" description="Warm low-end boost." />
              <MasterSliderControl id="treble" label="High Treble (10 kHz)" min={-8} max={10} unit="dB" description="Air & crisp presence." />
              <MasterSliderControl id="presence" label="Mid Vocals (2.4 kHz)" min={-4} max={8} unit="dB" description="Speech clarity contour." />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Saved Custom Presets */}
      {activeTab === "saved" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
            <div>
              <span className="text-xs font-semibold text-fg flex items-center gap-1.5">
                <BookmarkSimple className="w-3.5 h-3.5 text-primary" />
                Saved Custom Presets ({customPresets.length})
              </span>
              <p className="text-[11px] text-muted mt-0.5">
                Local DSP presets stored in browser memory. Export or import backups anytime.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSaveDialogOpen(true)}
                className="text-xs h-7 px-2.5 cursor-pointer"
              >
                <FloppyDisk className="h-3 w-3 text-primary" />
                <span>Save Current</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={customPresets.length === 0}
                onClick={handleExportCustomPresets}
                className="text-xs h-7 px-2.5 cursor-pointer"
                title="Export custom presets to JSON file"
              >
                <Export className="h-3 w-3" />
                <span>Export</span>
              </Button>

              <label className="inline-flex items-center gap-1 rounded-md border border-line bg-surface hover:bg-raised text-xs text-muted hover:text-fg h-7 px-2.5 font-medium cursor-pointer transition-colors shadow-xs">
                <UploadSimple className="h-3 w-3" />
                <span>Import</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Save Preset Dialog Modal / Box */}
          {saveDialogOpen && (
            <form onSubmit={handleSaveCurrentPreset} className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  <FloppyDisk className="w-3.5 h-3.5" />
                  Save Current DSP Parameters
                </span>
                <button
                  type="button"
                  onClick={() => setSaveDialogOpen(false)}
                  className="text-muted hover:text-fg text-xs font-mono cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder={`Name (e.g. ${selectedPreset?.name || "Custom"} Signature)`}
                  autoFocus
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-line bg-surface text-fg focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button type="submit" variant="primary" size="sm" className="h-auto text-xs px-3 cursor-pointer">
                  Save
                </Button>
              </div>
            </form>
          )}

          {/* List of Saved Presets */}
          {customPresets.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-line bg-deep/40 space-y-2">
              <BookmarkSimple className="w-8 h-8 text-muted mx-auto" />
              <p className="text-xs font-medium text-fg">No custom presets saved yet</p>
              <p className="text-[11px] text-muted max-w-sm mx-auto">
                Customize any preset sliders or tone sculpting faders in the Sliders tab, then click &quot;Save Current&quot; to preserve your signature sound locally.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {customPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3.5 rounded-xl border border-line bg-deep/30 hover:border-line-strong transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h5 className="font-semibold text-xs text-fg truncate">{preset.name}</h5>
                      <span className="text-[10px] text-muted font-mono block">
                        Base: {preset.basePresetId || "Custom"} · {new Date(preset.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const newName = prompt("Rename preset:", preset.name);
                          if (newName && newName.trim()) {
                            renameCustomPreset(preset.id, newName.trim());
                          }
                        }}
                        className="p-1 text-muted hover:text-fg rounded transition-colors cursor-pointer"
                        title="Rename preset"
                      >
                        <PencilSimple className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete custom preset "${preset.name}"?`)) {
                            deleteCustomPreset(preset.id);
                          }
                        }}
                        className="p-1 text-muted hover:text-red-500 rounded transition-colors cursor-pointer"
                        title="Delete preset"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px] font-mono text-muted">
                    {Object.entries(preset.effectValues).slice(0, 4).map(([k, v]) => (
                      <span key={k} className="px-1.5 py-0.5 rounded bg-surface border border-line">
                        {k}: {typeof v === "number" ? (Number.isInteger(v) ? v : v.toFixed(2)) : String(v)}
                      </span>
                    ))}
                    {Object.keys(preset.effectValues).length > 4 && (
                      <span className="px-1.5 py-0.5 rounded bg-surface border border-line text-faint">
                        +{Object.keys(preset.effectValues).length - 4} more
                      </span>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyCustomPreset(preset)}
                    className="w-full text-xs h-7 cursor-pointer hover:border-primary hover:text-primary transition-colors"
                  >
                    <span>Apply Custom Preset</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DSP Signal Chain Architecture */}
      {activeTab === "chain" && (
        <div className="space-y-4">
          <div className="border-b border-line pb-2.5">
            <h4 className="text-xs font-semibold text-fg flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              Web Audio DSP Signal Architecture
            </h4>
            <p className="text-[11px] text-muted mt-0.5">
              Real-time visualization of the node graph synthesized during offline rendering.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {/* Stage 1: PCM Source */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-line bg-surface shadow-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold shrink-0">
                01
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-fg block">PCM Buffer Source</span>
                <span className="text-[11px] text-muted font-mono">
                  {decodedAudio
                    ? `${decodedAudio.numberOfChannels}ch · ${(decodedAudio.sampleRate / 1000).toFixed(1)} kHz · ${formatTime(decodedAudio.duration)}`
                    : "Source audio loaded"}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-raised px-2 py-0.5 rounded border border-line text-muted">
                AudioBuffer
              </span>
            </div>

            {/* Stage 2: Preset Filter Graph */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5 shadow-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white font-mono text-xs font-bold shrink-0 shadow-xs">
                02
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-primary block">
                  {selectedPreset?.name || "Acoustic DSP Processor"}
                </span>
                <span className="text-[11px] text-muted">
                  Ops: {selectedPreset?.supportedOps.join(" → ") || "Standard Filters"}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-surface px-2 py-0.5 rounded border border-primary/30 text-primary font-semibold">
                DSP Graph
              </span>
            </div>

            {/* Stage 3: Master Tone Faders */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-line bg-surface shadow-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface border border-line text-fg font-mono text-xs font-bold shrink-0">
                03
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-fg block">Master 3-Band Tone Sculptor</span>
                <span className="text-[11px] text-muted font-mono">
                  Low: {Number(effectValues.bass ?? 0) > 0 ? `+${effectValues.bass}` : effectValues.bass ?? 0}dB · Mid: {Number(effectValues.presence ?? 0) > 0 ? `+${effectValues.presence}` : effectValues.presence ?? 0}dB · High: {Number(effectValues.treble ?? 0) > 0 ? `+${effectValues.treble}` : effectValues.treble ?? 0}dB
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-raised px-2 py-0.5 rounded border border-line text-muted">
                Biquad Tri-Filter
              </span>
            </div>

            {/* Stage 4: Pro Lookahead Limiter */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-line bg-surface shadow-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 font-mono text-xs font-bold shrink-0 border border-emerald-500/20">
                04
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-fg block">Mastering Limiter &amp; Normalizer</span>
                <span className="text-[11px] text-muted font-mono">
                  Ceiling −0.3 dBFS · Ratio 20:1 · Lookahead 3ms
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
                Safeguard
              </span>
            </div>

            {/* Stage 5: Output Destination */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-line bg-deep/50 shadow-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface border border-line text-fg font-mono text-xs font-bold shrink-0">
                05
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-fg block">PCM Master Encoder</span>
                <span className="text-[11px] text-muted">
                  Lossless WAV (16/24/32-bit Float) / MP3 / AIFF
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-surface px-2 py-0.5 rounded border border-line text-muted">
                OfflineAudioContext
              </span>
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
