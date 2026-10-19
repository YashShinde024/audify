"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MagnifyingGlass,
  ArrowRight,
  Cpu,
  Headphones,
  Wrench,
  MusicNotes,
} from "@phosphor-icons/react";
import { presets, presetCategories } from "@/config/presets";
import { PresetIcon } from "@/components/icons/preset-icons";
import { Button } from "@/components/ui/button";
import type { Preset, PresetCategoryId, PresetKind } from "@/types/preset";
import { cn } from "@/lib/utils";

const FEATURED_IDS = [
  "8d-audio",
  "slowed-reverb",
  "pitch-432hz",
  "bass-boost-heavy",
  "cathedral-reverb",
  "auto-panner",
];

export function PresetExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<PresetCategoryId | "all">("all");
  const [selectedKind, setSelectedKind] = useState<"all" | PresetKind>("all");
  const [search, setSearch] = useState("");

  const featuredPresets = useMemo(
    () => FEATURED_IDS.map((id) => presets.find((p) => p.id === id)).filter(Boolean) as Preset[],
    [],
  );

  const filteredPresets = useMemo(() => {
    return presets.filter((p) => {
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      const matchKind = selectedKind === "all" || p.kind === selectedKind;
      const q = search.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.supportedOps.some((op) => op.toLowerCase().includes(q));
      return matchCat && matchKind && matchSearch;
    });
  }, [selectedCategory, selectedKind, search]);

  const activeCategoryMeta = presetCategories.find((c) => c.id === selectedCategory);
  const totalPresetsCount = presets.filter((p) => p.kind === "preset").length;
  const totalToolsCount = presets.filter((p) => p.kind === "tool").length;

  return (
    <div className="space-y-12">
      {/* 1. Curated Featured Section */}
      <section aria-labelledby="featured-heading">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h2 id="featured-heading" className="text-base font-semibold text-fg">
              Featured Tools & Presets
            </h2>
            <p className="text-xs text-muted">
              Most requested transformations and audio utilities ready for instant execution.
            </p>
          </div>
          <span className="text-xs font-semibold text-violet uppercase tracking-wide">
            Curated Matrix
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredPresets.map((preset) => (
            <div
              key={preset.id}
              className="flex flex-col justify-between rounded-xl border border-line bg-surface p-5 shadow-xs hover:border-violet/50 transition-all group"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-violet group-hover:border-violet/40 group-hover:bg-violet/5 transition-colors">
                    <PresetIcon presetId={preset.id} size={22} weight="duotone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-muted font-medium bg-raised px-2 py-0.5 rounded border border-line/60 flex items-center gap-1">
                        {preset.kind === "tool" ? <Wrench className="w-3 h-3" /> : <MusicNotes className="w-3 h-3" />}
                        {presetCategories.find((c) => c.id === preset.category)?.label}
                      </span>
                      <span className="h-2 w-2 rounded-full bg-violet ring-4 ring-violet/10" />
                    </div>
                    <h3 className="mt-1.5 text-sm font-semibold text-fg group-hover:text-violet transition-colors">
                      {preset.name}
                    </h3>
                  </div>
                </div>

                <p className="mt-3 text-xs text-muted leading-relaxed">
                  {preset.description}
                </p>

                {preset.compatibilityNote && (
                  <p className="mt-2 text-[11px] text-violet flex items-center gap-1 font-medium">
                    <Headphones className="w-3.5 h-3.5" />
                    {preset.compatibilityNote}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3.5 border-t border-line flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-faint font-mono">
                  <Cpu className="w-3.5 h-3.5 text-violet" />
                  <span>{preset.supportedOps[0]}</span>
                </div>

                <Button asChild size="sm" variant="secondary" className="h-7 px-3 text-xs">
                  <Link href={`/studio?preset=${preset.id}`}>
                    Launch
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Full Search & Category Directory */}
      <section aria-labelledby="all-presets-heading">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <h2 id="all-presets-heading" className="text-base font-semibold text-fg">
              Full Audio Catalog ({presets.length})
            </h2>
            <p className="text-xs text-muted">
              Organized across 9 functional categories inspired by the breadth of modern audio utility platforms.
            </p>
          </div>

          <div className="relative sm:w-72">
            <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, DSP node, or tag…"
              className="h-8.5 w-full rounded-md border border-line bg-surface pl-8 pr-3 text-xs text-fg placeholder:text-faint focus:border-violet focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Kind Toggle (All vs Creative Presets vs Audio Tools) */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-line/70 pb-3">
          <button
            type="button"
            onClick={() => setSelectedKind("all")}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer",
              selectedKind === "all"
                ? "bg-violet text-white font-semibold shadow-xs"
                : "text-muted hover:text-fg bg-surface border border-line",
            )}
          >
            All Modules ({presets.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedKind("preset")}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer",
              selectedKind === "preset"
                ? "bg-violet text-white font-semibold shadow-xs"
                : "text-muted hover:text-fg bg-surface border border-line",
            )}
          >
            <MusicNotes className="w-3 h-3" />
            Creative Presets ({totalPresetsCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedKind("tool")}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer",
              selectedKind === "tool"
                ? "bg-violet text-white font-semibold shadow-xs"
                : "text-muted hover:text-fg bg-surface border border-line",
            )}
          >
            <Wrench className="w-3 h-3" />
            Audio Tools ({totalToolsCount})
          </button>
        </div>

        {/* 9 Category Selection Tabs */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border cursor-pointer",
              selectedCategory === "all"
                ? "bg-violet text-white border-violet font-semibold shadow-xs"
                : "bg-surface text-muted border-line hover:text-fg hover:border-line-strong",
            )}
          >
            All Categories
          </button>
          {presetCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border cursor-pointer",
                selectedCategory === cat.id
                  ? "bg-violet text-white border-violet font-semibold shadow-xs"
                  : "bg-surface text-muted border-line hover:text-fg hover:border-line-strong",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {activeCategoryMeta && (
          <div className="mt-3 text-xs text-muted italic">
            {activeCategoryMeta.tagline}
          </div>
        )}

        {/* Presets Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              className="flex flex-col justify-between rounded-lg border border-line bg-surface p-4 hover:border-line-strong transition-all"
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-md border border-line bg-deep text-violet">
                    <PresetIcon presetId={preset.id} size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-muted bg-deep px-1.5 py-0.5 rounded border border-line/60 flex items-center gap-1">
                        {preset.kind === "tool" ? <Wrench className="w-2.5 h-2.5" /> : <MusicNotes className="w-2.5 h-2.5" />}
                        {presetCategories.find((c) => c.id === preset.category)?.label}
                      </span>
                      <span className="text-[10px] text-faint font-mono">
                        {preset.supportedOps.length} DSP Ops
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-fg">
                      {preset.name}
                    </h3>
                  </div>
                </div>

                <p className="mt-2 text-xs text-muted leading-relaxed">
                  {preset.description}
                </p>

                {preset.compatibilityNote && (
                  <p className="mt-2 text-[10px] text-violet flex items-center gap-1">
                    <Headphones className="w-2.5 h-2.5" />
                    {preset.compatibilityNote}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-line/70 flex items-center justify-between">
                <div className="flex flex-wrap gap-1 font-mono text-[10px] text-faint">
                  {preset.params.slice(0, 2).map((p) => (
                    <span key={p.id}>
                      {p.id}: {p.kind === "slider" ? `${preset.defaults[p.id]}${p.unit}` : "on"}
                    </span>
                  ))}
                </div>

                <Button asChild size="sm" variant="outline" className="h-7 px-2.5 text-xs shrink-0">
                  <Link href={`/studio?preset=${preset.id}`}>
                    Launch
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredPresets.length === 0 && (
          <div className="mt-8 rounded-lg border border-line bg-surface p-8 text-center text-xs text-muted">
            No tools or presets found matching “{search}”. Try searching for “bass”, “reverb”, “8d”, or “432”.
          </div>
        )}
      </section>
    </div>
  );
}
