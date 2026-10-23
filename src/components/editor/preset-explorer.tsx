"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MagnifyingGlass,
  ArrowRight,
  Headphones,
  Wrench,
  MusicNotes,
  Play,
  Square,
  Sparkle,
  BookOpenText,
} from "@phosphor-icons/react";
import { presets, presetCategories } from "@/config/presets";
import { presetArticleRegistry } from "@/config/blog-registry";
import { PresetIcon } from "@/components/icons/preset-icons";
import { Button } from "@/components/ui/button";
import type { Preset, PresetCategoryId, PresetKind } from "@/types/preset";
import { cn } from "@/lib/utils";

const FEATURED_IDS = [
  "slowed-reverb",
  "nightcore",
  "daycore",
  "8d-audio",
  "bass-boost-heavy",
  "pitch-432hz",
  "lofi-tape",
  "cathedral-reverb",
  "underwater",
];

export function PresetExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<PresetCategoryId | "all">("all");
  const [selectedKind, setSelectedKind] = useState<"all" | PresetKind>("all");
  const [onlyStandards, setOnlyStandards] = useState(false);
  const [search, setSearch] = useState("");
  const [auditioningId, setAuditioningId] = useState<string | null>(null);

  // Audio Context reference for procedural preset preview
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<Array<{ stop?: () => void; disconnect: () => void }>>([]);

  const stopAudition = () => {
    for (const node of activeNodesRef.current) {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {
        // ignore
      }
    }
    activeNodesRef.current = [];
    setAuditioningId(null);
  };

  useEffect(() => {
    return () => {
      stopAudition();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const playAudition = (presetId: string) => {
    if (auditioningId === presetId) {
      stopAudition();
      return;
    }

    stopAudition();

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      setAuditioningId(presetId);

      const now = ctx.currentTime;
      const duration = 2.8;

      // Master gain with gentle fade-out
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      masterGain.connect(ctx.destination);

      // Node chain customized per preset
      let endNode: AudioNode = masterGain;

      if (presetId === "underwater") {
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(650, now);
        filter.connect(masterGain);
        endNode = filter;
      } else if (presetId.includes("bass-boost")) {
        const bass = ctx.createBiquadFilter();
        bass.type = "lowshelf";
        bass.frequency.setValueAtTime(120, now);
        bass.gain.setValueAtTime(8, now);
        bass.connect(masterGain);
        endNode = bass;
      } else if (presetId === "8d-audio") {
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        if (panner) {
          panner.pan.setValueAtTime(-0.8, now);
          panner.pan.linearRampToValueAtTime(0.8, now + duration * 0.5);
          panner.pan.linearRampToValueAtTime(-0.8, now + duration);
          panner.connect(masterGain);
          endNode = panner;
        }
      }

      // Procedural warm chords: F-A-C-E ambient pad
      const freqs = presetId === "nightcore"
        ? [349.23 * 1.33, 440 * 1.33, 523.25 * 1.33]
        : presetId === "pitch-432hz"
        ? [216, 270, 324]
        : [174.61, 220.0, 261.63];

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? "sawtooth" : "sine";
        osc.frequency.setValueAtTime(f, now);

        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.28 / freqs.length;

        osc.connect(oscGain);
        oscGain.connect(endNode);

        osc.start(now);
        osc.stop(now + duration);

        activeNodesRef.current.push(osc, oscGain);
      });

      // Automatically reset audition state after duration
      setTimeout(() => {
        setAuditioningId((prev) => (prev === presetId ? null : prev));
      }, duration * 1000);
    } catch {
      setAuditioningId(null);
    }
  };

  const featuredPresets = useMemo(
    () => FEATURED_IDS.map((id) => presets.find((p) => p.id === id)).filter(Boolean) as Preset[],
    [],
  );

  const filteredPresets = useMemo(() => {
    const standardSet = new Set(FEATURED_IDS);
    return presets.filter((p) => {
      if (onlyStandards && !standardSet.has(p.id)) return false;
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
  }, [selectedCategory, selectedKind, onlyStandards, search]);

  const activeCategoryMeta = presetCategories.find((c) => c.id === selectedCategory);
  const totalPresetsCount = presets.filter((p) => p.kind === "preset").length;
  const totalToolsCount = presets.filter((p) => p.kind === "tool").length;

  return (
    <div className="space-y-12">
      {/* 1. Curated Featured Section */}
      <section aria-labelledby="featured-heading">
        <div className="flex items-center justify-between border-b border-line/70 pb-3">
          <div>
            <h2 id="featured-heading" className="text-base font-semibold text-fg">
              Featured Sound Transformations & Tools
            </h2>
            <p className="text-xs text-muted">
              Most celebrated studio audio signatures engineered with 32-bit float Web Audio DSP.
            </p>
          </div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wide flex items-center gap-1 font-mono">
            <Sparkle size={14} weight="fill" />
            Curated Matrix
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {featuredPresets.map((preset) => {
            const isAuditioning = auditioningId === preset.id;

            return (
              <div
                key={preset.id}
                className="surface-card glass-panel rounded-2xl p-5 flex flex-col justify-between hover:border-primary/50 hover:shadow-glow-wire transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line/70 bg-surface text-primary group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors">
                      <PresetIcon presetId={preset.id} size={22} weight="duotone" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-muted font-medium bg-raised/80 px-2 py-0.5 rounded border border-line/60 flex items-center gap-1">
                          {preset.kind === "tool" ? <Wrench className="w-3 h-3 text-primary" /> : <MusicNotes className="w-3 h-3 text-primary" />}
                          {presetCategories.find((c) => c.id === preset.category)?.label}
                        </span>
                        <span className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10" />
                      </div>
                      <h3 className="mt-1.5 text-sm font-semibold text-fg group-hover:text-primary transition-colors">
                        {preset.name}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-muted leading-relaxed">
                    {preset.description}
                  </p>

                  {preset.compatibilityNote && (
                    <p className="mt-2 text-[11px] text-primary flex items-center gap-1 font-medium">
                      <Headphones className="w-3.5 h-3.5" />
                      {preset.compatibilityNote}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3.5 border-t border-line/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Live Audition Button */}
                    <button
                      type="button"
                      onClick={() => playAudition(preset.id)}
                      aria-label={isAuditioning ? "Stop audio preview" : "Audition preset audio"}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                        isAuditioning
                          ? "border-primary bg-primary text-white shadow-xs"
                          : "border-line/70 bg-surface/80 text-muted hover:text-fg hover:border-primary/40"
                      )}
                      title="Audition 3-second procedural preview"
                    >
                      {isAuditioning ? (
                        <>
                          <Square size={11} weight="fill" />
                          <span className="text-[11px]">Playing</span>
                          <span className="dock-eq flex h-2.5 items-end gap-[1.5px]">
                            <span />
                            <span />
                            <span />
                          </span>
                        </>
                      ) : (
                        <>
                          <Play size={11} weight="fill" className="text-primary" />
                          <span className="text-[11px]">Audition</span>
                        </>
                      )}
                    </button>
                    <GuideLink presetId={preset.id} />
                  </div>

                  <Button asChild size="sm" variant="secondary" className="h-7 px-3 text-xs shrink-0 rounded-lg group-hover:border-primary/30">
                    <Link href={`/studio?preset=${preset.id}`}>
                      Open in Studio
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Full Search & Category Directory */}
      <section aria-labelledby="all-presets-heading">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line/70 pb-4">
          <div>
            <h2 id="all-presets-heading" className="text-base font-semibold text-fg">
              Full Audio Catalog ({presets.length})
            </h2>
            <p className="text-xs text-muted">
              Organized across 9 functional categories covering spatial, pitch, equalization, and dynamics modules.
            </p>
          </div>

          <div className="relative sm:w-72">
            <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, DSP node, or tag…"
              className="h-9 w-full rounded-xl border border-line/70 bg-surface/70 pl-8 pr-3 text-xs text-fg placeholder:text-faint focus:border-primary focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Kind Toggle (All vs Creative Presets vs Audio Tools vs Standards) */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-line/60 pb-3">
          <button
            type="button"
            onClick={() => setOnlyStandards(!onlyStandards)}
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer",
              onlyStandards
                ? "bg-primary text-white font-semibold shadow-glow-wire"
                : "text-muted hover:text-fg bg-surface/80 border border-line/70 hover:border-primary/40",
            )}
          >
            <Sparkle className="w-3.5 h-3.5 text-amber-400" weight="fill" />
            <span>Standard Presets ({FEATURED_IDS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOnlyStandards(false);
              setSelectedKind("all");
            }}
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer",
              !onlyStandards && selectedKind === "all"
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-muted hover:text-fg bg-surface/80 border border-line/70",
            )}
          >
            All Modules ({presets.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setOnlyStandards(false);
              setSelectedKind("preset");
            }}
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer",
              !onlyStandards && selectedKind === "preset"
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-muted hover:text-fg bg-surface/80 border border-line/70",
            )}
          >
            <MusicNotes className="w-3 h-3" />
            Creative Presets ({totalPresetsCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedKind("tool")}
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer",
              selectedKind === "tool"
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-muted hover:text-fg bg-surface/80 border border-line/70",
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
              "rounded-xl px-3 py-1.5 text-xs font-medium transition-colors border cursor-pointer",
              selectedCategory === "all"
                ? "bg-primary text-white border-primary font-semibold shadow-xs"
                : "bg-surface/80 text-muted border-line/70 hover:text-fg hover:border-line",
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
                "rounded-xl px-3 py-1.5 text-xs font-medium transition-colors border cursor-pointer",
                selectedCategory === cat.id
                  ? "bg-primary text-white border-primary font-semibold shadow-xs"
                  : "bg-surface/80 text-muted border-line/70 hover:text-fg hover:border-line",
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
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPresets.map((preset) => {
            const isAuditioning = auditioningId === preset.id;

            return (
              <div
                key={preset.id}
                className={cn(
                  "surface-card glass-panel rounded-2xl p-5 flex flex-col justify-between border transition-all duration-200 group",
                  isAuditioning
                    ? "border-primary ring-1 ring-primary/40 shadow-md"
                    : "border-line hover:border-primary/40 hover:shadow-sm"
                )}
              >
                <div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                      <PresetIcon presetId={preset.id} size={19} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] uppercase font-mono tracking-wider text-muted bg-surface px-2 py-0.5 rounded-full border border-line flex items-center gap-1">
                          {preset.kind === "tool" ? <Wrench className="w-2.5 h-2.5 text-primary" /> : <MusicNotes className="w-2.5 h-2.5 text-primary" />}
                          {presetCategories.find((c) => c.id === preset.category)?.label}
                        </span>
                        <span className="text-[10px] text-faint font-mono">
                          {preset.supportedOps.length} Ops
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-sm font-bold text-fg group-hover:text-primary transition-colors">
                        {preset.name}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-2.5 text-xs text-muted leading-relaxed line-clamp-3">
                    {preset.description}
                  </p>

                  {preset.compatibilityNote && (
                    <p className="mt-2 text-[10px] text-primary flex items-center gap-1 font-medium">
                      <Headphones className="w-3 h-3 shrink-0" />
                      <span>{preset.compatibilityNote}</span>
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3.5 border-t border-line/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => playAudition(preset.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-mono transition-all cursor-pointer",
                        isAuditioning
                          ? "bg-primary text-white border-primary shadow-xs font-semibold animate-pulse"
                          : "border-line bg-surface text-muted hover:text-fg hover:border-primary/40"
                      )}
                    >
                      {isAuditioning ? <Square size={10} weight="fill" /> : <Play size={10} weight="fill" />}
                      <span>{isAuditioning ? "Auditioning..." : "Audition"}</span>
                    </button>
                    <GuideLink presetId={preset.id} />
                  </div>

                  <Button asChild size="sm" variant="outline" className="h-7 px-3 text-xs shrink-0 rounded-lg border-line hover:border-primary/40">
                    <Link href={`/studio?preset=${preset.id}`}>
                      <span>Open</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPresets.length === 0 && (
          <div className="mt-8 rounded-xl border border-line/70 bg-surface/80 p-8 text-center text-xs text-muted">
            No tools or presets found matching “{search}”. Try searching for “bass”, “reverb”, “8d”, or “432”.
          </div>
        )}
      </section>
    </div>
  );
}

function GuideLink({ presetId }: { presetId: string }) {
  const slug = presetArticleRegistry.find((a) => a.presetId === presetId)?.slug;
  if (!slug) return null;
  return (
    <Link
      href={`/blog/${slug}`}
      className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-primary hover:text-primary-hover transition-colors"
    >
      <BookOpenText className="h-3 w-3" />
      Guide
    </Link>
  );
}
