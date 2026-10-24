"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MagnifyingGlass,
  ArrowRight,
  Sliders,
  SlidersHorizontal,
  Sparkle,
  BookOpenText,
  X,
  Waveform,
  CheckCircle,
  FileAudio,
  Faders,
} from "@phosphor-icons/react";
import { PresetIcon } from "@/components/icons/preset-icons";
import { Button } from "@/components/ui/button";
import { presets } from "@/config/presets";
import { presetArticleRegistry } from "@/config/blog-registry";
import { PRESET_TO_TOOL_SLUG } from "@/config/tools-registry";
import type { Preset } from "@/types/preset";
import { cn } from "@/lib/utils";

interface ToolCategory {
  id: string;
  label: string;
  tagline: string;
  predicate: (p: Preset) => boolean;
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "all",
    label: "All Tools",
    tagline: "Complete suite of in-browser audio editing, processing, and mastering utilities.",
    predicate: () => true,
  },
  {
    id: "dynamics-tone",
    label: "Dynamics & Tone",
    tagline: "Dynamic range compression, vocal leveling, bus glue, parametric EQ, and peak limiting.",
    predicate: (p) =>
      [
        "audio-normalizer",
        "compressor",
        "gentle-compression",
        "vocal-leveling",
        "music-bus-glue",
        "equalizer",
        "sub-rumble-cut",
        "noise-reducer",
        "dc-offset-remover",
        "mastering-polish",
      ].includes(p.id),
  },
  {
    id: "edit-clean",
    label: "Edit & Clean",
    tagline: "Sample-accurate trimming, waveform reversal, fade envelopes, track merging, and splitting.",
    predicate: (p) =>
      [
        "audio-merger",
        "audio-splitter",
        "trimmer-cutter",
        "reverse",
        "fade-in-out",
        "downmixer",
        "dc-offset-remover",
        "sub-rumble-cut",
        "noise-reducer",
      ].includes(p.id),
  },
  {
    id: "spatial-pitch",
    label: "Spatial & Pitch",
    tagline: "Stereo panning, Haas widening, binaural orbits, semitone transposition, and tempo calibration.",
    predicate: (p) =>
      [
        "stereo-panner",
        "stereo-widening",
        "haas-spatializer",
        "auto-panner",
        "8d-audio",
        "pitch-shifter",
        "tempo-changer",
        "chorus-flanger",
      ].includes(p.id),
  },
  {
    id: "creative-isolate",
    label: "Creative & Isolation",
    tagline: "Mid/Side vocal isolation, sample decimation, chorus modulation, and analog tape drive.",
    predicate: (p) =>
      [
        "vocal-remover",
        "bitcrusher",
        "chorus-flanger",
        "lofi-tape",
        "underwater",
        "vaporwave",
      ].includes(p.id),
  },
  {
    id: "export-convert",
    label: "Convert & Export",
    tagline: "Multi-format bitstream transcoding, sample rate conversion, and peak normalization.",
    predicate: (p) =>
      [
        "format-converter",
        "sample-rate-converter",
        "audio-normalizer",
        "volume-changer",
        "bpm-detector",
        "pitch-432hz",
      ].includes(p.id),
  },
];

const STANDALONE_TOOLS: Preset[] = [
  {
    id: "audio-merger",
    name: "Audio Merger & Joiner",
    kind: "tool",
    category: "utilities",
    description: "Combine multiple audio tracks sequentially into one file with custom silence gaps, automatic sample-rate synchronization, and lossless WAV/MP3 export.",
    supportedOps: ["MultiTrackConcatenation", "SampleRateAlignment", "ChannelMatching"],
    tags: ["merger", "join", "combine audio", "stitcher", "tracks"],
    params: [
      { id: "gap", label: "Gap Duration", kind: "slider", min: 0, max: 5, step: 0.5, unit: "s", description: "Silence gap" },
    ],
    defaults: { gap: 0.5 },
  },
  {
    id: "audio-splitter",
    name: "Audio Splitter",
    kind: "tool",
    category: "utilities",
    description: "Divide audio files into equal parts (2–6 parts) or fixed duration intervals (15s–120s) with instant individual or batch segment downloads.",
    supportedOps: ["BufferSegmentation", "IntervalSlicing", "ZeroLossPartitioning"],
    tags: ["splitter", "segments", "divide audio", "cut mp3 into parts"],
    params: [
      { id: "parts", label: "Parts", kind: "slider", min: 2, max: 6, step: 1, unit: "parts", description: "Segment count" },
    ],
    defaults: { parts: 2 },
  },
  {
    id: "sample-rate-converter",
    name: "Sample Rate Converter",
    kind: "tool",
    category: "export-conversion",
    description: "Windowed-sinc resampling between 22.05, 32, 44.1, and 48 kHz with polyphase anti-aliasing filters that preserve audio pitch and duration.",
    supportedOps: ["WindowedSincResampler", "PolyphaseAntiAliasing", "SampleClockConversion"],
    tags: ["resample", "sample rate", "44.1khz to 48khz", "audio clock"],
    params: [
      { id: "rate", label: "Target Rate", kind: "slider", min: 22050, max: 48000, step: 1000, unit: "Hz", description: "Target sample rate" },
    ],
    defaults: { rate: 48000 },
  },
  {
    id: "audio-normalizer",
    name: "Audio Peak Normalizer",
    kind: "tool",
    category: "utilities",
    description: "Scale audio track volume mathematically so the loudest transient reaches -0.3 dBFS, -1.0 dBFS, or -3.0 dBFS without distortion.",
    supportedOps: ["PeakNormalization", "InterSamplePeakHeadroom", "LinearGainScaling"],
    tags: ["normalize", "peak normalizer", "master ceiling", "audio gain"],
    params: [
      { id: "ceiling", label: "Peak Ceiling", kind: "slider", min: -6, max: 0, step: 0.5, unit: "dBFS", description: "Target peak level" },
    ],
    defaults: { ceiling: -0.3 },
  },
];

// Curated list of all utility tools and processing modules from the canonical registry
const UTILITY_PRESET_IDS = new Set([
  "compressor",
  "gentle-compression",
  "vocal-leveling",
  "music-bus-glue",
  "trimmer-cutter",
  "reverse",
  "fade-in-out",
  "format-converter",
  "volume-changer",
  "downmixer",
  "bpm-detector",
  "vocal-remover",
  "dc-offset-remover",
  "equalizer",
  "sub-rumble-cut",
  "noise-reducer",
  "pitch-shifter",
  "tempo-changer",
  "stereo-panner",
  "stereo-widening",
  "haas-spatializer",
  "auto-panner",
  "bitcrusher",
  "chorus-flanger",
  "mastering-polish",
]);

export function ToolsClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const articleSlugMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const article of presetArticleRegistry) {
      map.set(article.slug, article.slug);
    }
    return map;
  }, []);

  const allTools = useMemo(() => {
    const list = presets.filter((p) => p.kind === "tool" || UTILITY_PRESET_IDS.has(p.id));
    return [...STANDALONE_TOOLS, ...list];
  }, []);

  const filteredTools = useMemo(() => {
    const cat = TOOL_CATEGORIES.find((c) => c.id === activeCategory) || TOOL_CATEGORIES[0];
    const q = searchQuery.trim().toLowerCase();

    return allTools.filter((tool) => {
      // Category filter
      if (!cat.predicate(tool)) return false;

      // Search filter
      if (!q) return true;

      const inName = tool.name.toLowerCase().includes(q);
      const inDesc = tool.description.toLowerCase().includes(q);
      const inId = tool.id.toLowerCase().includes(q);
      const inOps = tool.supportedOps.some((op) => op.toLowerCase().includes(q));
      const inTags = tool.tags.some((tag) => tag.toLowerCase().includes(q));

      return inName || inDesc || inId || inOps || inTags;
    });
  }, [allTools, activeCategory, searchQuery]);

  const activeCategoryObj = TOOL_CATEGORIES.find((c) => c.id === activeCategory) || TOOL_CATEGORIES[0];

  return (
    <div className="space-y-8">
      {/* Category Pills & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Tool Categories">
          {TOOL_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150",
                  isSelected
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface/80 text-muted hover:bg-surface hover:text-fg border border-line/60"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <MagnifyingGlass
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audio tools..."
            aria-label="Search audio tools"
            className="w-full rounded-xl border border-line/80 bg-surface/80 py-2 pl-9 pr-8 text-xs text-fg placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-fg"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Category Lead */}
      <div className="flex items-center justify-between border-b border-line/60 pb-3 text-xs text-muted">
        <span>{activeCategoryObj.tagline}</span>
        <span className="font-mono text-[11px] text-muted">
          {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"} available
        </span>
      </div>

      {/* Tool Cards Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const hasArticle = articleSlugMap.has(tool.id);
            const toolSlug = PRESET_TO_TOOL_SLUG[tool.id];
            const targetHref = toolSlug ? `/tools/${toolSlug}` : `/studio?preset=${tool.id}`;

            return (
              <article
                key={tool.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-line/80 bg-surface/60 p-5 transition-all duration-200 hover:border-line-strong hover:bg-surface hover:shadow-lg hover:shadow-black/5"
              >
                <div>
                  {/* Card Header: Icon + Category Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line/80 bg-raised/80 text-primary transition-colors group-hover:border-primary/40 group-hover:text-primary">
                      <PresetIcon presetId={tool.id} className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center rounded-md border border-line/60 bg-raised/50 px-2 py-0.5 font-mono text-[10px] font-medium text-muted uppercase tracking-wider">
                      {tool.kind === "tool" ? "Utility Tool" : "DSP Module"}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-3.5 text-base font-semibold text-fg group-hover:text-primary transition-colors">
                    <Link href={targetHref} className="hover:underline">
                      {tool.name}
                    </Link>
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted line-clamp-3">
                    {tool.description}
                  </p>

                  {/* Supported DSP Operations */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {tool.supportedOps.slice(0, 3).map((op) => (
                      <span
                        key={op}
                        className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted border border-line/50"
                      >
                        {op}
                      </span>
                    ))}
                  </div>

                  {/* Parameter Count & Compatibility Note */}
                  <div className="mt-3.5 flex items-center gap-2 border-t border-line/50 pt-2.5 text-[11px] text-muted">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                    <span>{tool.params.length} adjustable {tool.params.length === 1 ? "control" : "controls"}</span>
                    {tool.compatibilityNote && (
                      <>
                        <span className="text-line-strong">·</span>
                        <span className="truncate text-muted/80">{tool.compatibilityNote}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Action CTAs */}
                <div className="mt-5 flex items-center justify-between gap-2 pt-3 border-t border-line/60">
                  {hasArticle ? (
                    <Link
                      href={`/blog/${tool.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-fg transition-colors"
                    >
                      <BookOpenText className="h-3.5 w-3.5" />
                      <span>Audio Guide</span>
                    </Link>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    {toolSlug ? (
                      <>
                        <Button
                          asChild
                          size="sm"
                          className="h-8 rounded-lg btn-gradient-primary text-white text-xs font-medium px-3.5 group/btn"
                        >
                          <Link href={`/tools/${toolSlug}`} aria-label={`Open ${tool.name} tool`}>
                            <span>Open Tool</span>
                            <ArrowRight className="ml-1 h-3 w-3 btn-arrow transition-transform duration-200" />
                          </Link>
                        </Button>
                        {tool.kind === "preset" && (
                          <Link
                            href={`/studio?preset=${tool.id}`}
                            className="text-[11px] text-muted hover:text-fg font-medium transition-colors hidden sm:inline-block px-1"
                            title="Open in Audify Studio"
                          >
                            Studio
                          </Link>
                        )}
                      </>
                    ) : (
                      <Button
                        asChild
                        size="sm"
                        className="h-8 rounded-lg btn-gradient-primary text-white text-xs font-medium px-3.5 group/btn"
                      >
                        <Link href={`/studio?preset=${tool.id}`} aria-label={`Open ${tool.name} in Audify Studio`}>
                          <span>Open in Studio</span>
                          <ArrowRight className="ml-1 h-3 w-3 btn-arrow transition-transform duration-200" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-line bg-surface/40 p-12 text-center">
          <Waveform className="mx-auto h-8 w-8 text-muted/60" />
          <h3 className="mt-3 text-sm font-semibold text-fg">No tools found</h3>
          <p className="mt-1 text-xs text-muted">
            No audio tools matched &quot;{searchQuery}&quot; in this category.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-fg hover:bg-raised transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span>Clear search &amp; filters</span>
          </button>
        </div>
      )}

      {/* Trust & Guarantee Callout */}
      <div className="mt-12 rounded-2xl border border-line bg-surface/40 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              100% In-Browser Audio Engine
            </span>
            <h4 className="text-base font-semibold text-fg">
              Zero server uploads. Your audio files stay in your device memory.
            </h4>
            <p className="text-xs text-muted max-w-2xl leading-relaxed">
              Every tool runs locally using Web Audio API and 32-bit floating-point linear PCM buffers. No audio bytes are ever sent to external cloud servers, and buffers are wiped immediately when your tab closes.
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="shrink-0 h-9 rounded-xl border-line">
            <Link href="/how-it-works">Learn How It Works</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
