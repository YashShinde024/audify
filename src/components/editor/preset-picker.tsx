"use client";

/**
 * Preset cards + search + category tabs for the editor and the standalone
 * preset library page. Selection is pure UI state — no audio is processed.
 */

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MagnifyingGlass, ArrowsClockwise, Check } from "@phosphor-icons/react";
import { presetCategories, presets } from "@/config/presets";
import { PresetIcon } from "@/components/icons/preset-icons";
import { useEditorStore } from "@/stores/editor-store";
import type { Preset, PresetCategoryId } from "@/types/preset";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const categoryOrder: (PresetCategoryId | "all")[] = ["all", ...presetCategories.map((c) => c.id)];

export function PresetCategoryTabs() {
  const active = useEditorStore((s) => s.activeCategory);
  const setActive = useEditorStore((s) => s.setActiveCategory);

  return (
    <div role="tablist" aria-label="Preset categories" className="-mx-1 flex gap-1 overflow-x-auto px-1 py-1">
      {categoryOrder.map((id) => {
        const label = id === "all" ? "All" : presetCategories.find((c) => c.id === id)!.label;
        const selected = active === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => setActive(id)}
            onKeyDown={(e) => {
              const idx = categoryOrder.indexOf(active);
              if (e.key === "ArrowRight") setActive(categoryOrder[(idx + 1) % categoryOrder.length]);
              if (e.key === "ArrowLeft") setActive(categoryOrder[(idx - 1 + categoryOrder.length) % categoryOrder.length]);
            }}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
              selected ? "bg-faint text-canvas" : "text-muted hover:bg-raised hover:text-fg",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function PresetSearch() {
  const query = useEditorStore((s) => s.searchQuery);
  const setQuery = useEditorStore((s) => s.setSearchQuery);
  return (
    <label className="relative block sm:w-64">
      <span className="sr-only">Search presets</span>
      <MagnifyingGlass aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search presets…"
        className="h-9 w-full rounded-full border border-line bg-deep pl-9 pr-3 text-sm text-fg placeholder:text-faint focus:border-violet/60 focus:outline-none focus:ring-2 focus:ring-violet/25 focus:ring-offset-0"
      />
    </label>
  );
}

export function PresetCard({ preset }: { preset: Preset }) {
  const selected = useEditorStore((s) => s.selectedPresetId) === preset.id;
  const selectPreset = useEditorStore((s) => s.selectPreset);
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => selectPreset(preset.id)}
      aria-pressed={selected}
      whileHover={reduced ? undefined : { y: -2 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex h-full w-full flex-col items-start gap-1.5 rounded-xl border bg-raised/60 p-4 text-left transition-colors",
        selected ? "border-violet/70 ring-2 ring-violet/25 bg-raised" : "border-line hover:border-line-strong hover:bg-raised",
      )}
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <PresetIcon presetId={preset.id} className="h-4 w-4 text-violet shrink-0" />
          <span className={cn("text-sm font-semibold", selected ? "text-purple" : "text-fg")}>{preset.name}</span>
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors shrink-0",
            selected ? "border-violet bg-gradient-to-br from-violet to-blue text-white" : "border-line text-transparent",
          )}
        >
          <Check className="h-3 w-3" weight="bold" />
        </span>
      </span>
      <span className="text-xs leading-relaxed text-muted">{preset.description}</span>
    </motion.button>
  );
}

export function PresetLibrary({ presets, emptyMessage = "No presets match your search." }: {
  presets: Preset[];
  emptyMessage?: string;
}) {
  if (presets.length === 0) {
    return <p role="status" className="py-10 text-center text-sm text-muted">{emptyMessage}</p>;
  }
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {presets.map((preset) => (
        <li key={preset.id} className="h-full">
          <PresetCard preset={preset} />
        </li>
      ))}
    </ul>
  );
}

/** Combined toolbar + filtered grid used inside the editor panel. */
export function EditorPresetPicker() {
  const filtered = useFilteredPresets();
  const selectedPresetId = useEditorStore((s) => s.selectedPresetId);
  const clearSelection = useEditorStore((s) => s.selectPreset);

  return (
    <section aria-labelledby="preset-picker-heading" className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="preset-picker-heading" className="text-base font-semibold text-fg">
          Pick a preset
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => clearSelection("")}
          aria-label={selectedPresetId ? "Clear selected preset and return to default" : "Already at default state"}
          disabled={!selectedPresetId}
        >
          <ArrowsClockwise aria-hidden="true" className="h-3.5 w-3.5" />
          Default state
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PresetCategoryTabs />
        <PresetSearch />
      </div>

      <div className="mt-4">
        <PresetLibrary presets={filtered} />
      </div>
    </section>
  );
}

function useFilteredPresets(): Preset[] {
  const category = useEditorStore((s) => s.activeCategory);
  const query = useEditorStore((s) => s.searchQuery);

  return useMemo(() => {
    return presets.filter((preset) => {
      const inCategory = category === "all" || preset.category === category;
      const matches = query.trim() === "" || preset.name.toLowerCase().includes(query.trim().toLowerCase());
      return inCategory && matches;
    });
  }, [category, query]);
}
