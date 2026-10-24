"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  ArrowRight,
  Headphones,
  SlidersHorizontal,
  Play,
  Square,
  Sparkle,
  BookOpenText,
  X,
  Sliders,
  CheckCircle,
  FileAudio,
  Waveform,
  Info,
} from "@phosphor-icons/react";
import { presets, getPresetById } from "@/config/presets";
import { presetArticleRegistry } from "@/config/blog-registry";
import { getToolSlugForPreset } from "@/config/tools-registry";
import { PresetIcon } from "@/components/icons/preset-icons";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import type { Preset } from "@/types/preset";
import { cn, formatTime } from "@/lib/utils";

export interface AcousticCategory {
  id: string;
  label: string;
  tagline: string;
  presetIds: string[];
}

export const ACOUSTIC_CATEGORIES: AcousticCategory[] = [
  {
    id: "all",
    label: "All Sounds",
    tagline: "Complete library of browser-native Web Audio DSP modules.",
    presetIds: presets.map((p) => p.id),
  },
  {
    id: "slowed-reverb",
    label: "Slowed & Reverb",
    tagline: "Varispeed tempo drops, lush atmospheric hall decays, and cathedral acoustics.",
    presetIds: [
      "slowed-reverb",
      "slowed",
      "super-slowed",
      "vaporwave",
      "bathroom-reverb",
      "small-room-reverb",
      "medium-room-reverb",
      "large-room-reverb",
      "church-hall-reverb",
      "cathedral-reverb",
      "vocal-reverb",
      "plate-reverb",
      "slapback-echo",
      "echo-chamber",
    ],
  },
  {
    id: "speed-pitch",
    label: "Speed & Pitch",
    tagline: "Varispeed lifts, semitone musical transpositions, and 432 Hz sacred tuning.",
    presetIds: [
      "sped-up",
      "nightcore",
      "daycore",
      "pitch-432hz",
      "pitch-shifter",
      "tempo-changer",
    ],
  },
  {
    id: "spatial-audio",
    label: "Spatial Audio",
    tagline: "Sinusoidal 8D orbital pans, mid/side stereo widening, and auto-panning fields.",
    presetIds: [
      "8d-audio",
      "auto-panner",
      "stereo-panner",
      "stereo-widening",
      "haas-spatializer",
      "ping-pong",
      "chorus-flanger",
    ],
  },
  {
    id: "bass-tone",
    label: "Bass & Tone",
    tagline: "Calibrated low-shelf tiers, 3-band parametric EQ, air shelves, and noise cleanup.",
    presetIds: [
      "bass-boost-light",
      "bass-boost-mod",
      "bass-boost-heavy",
      "bass-boost-extreme",
      "equalizer",
      "treble-air",
      "mid-scoop",
      "sub-rumble-cut",
      "noise-reducer",
      "vocal-air",
      "vocal-clarity",
      "de-harsh",
      "podcast-voice",
      "gentle-compression",
      "vocal-leveling",
      "dc-offset-remover",
    ],
  },
  {
    id: "ambient-creative",
    label: "Ambient & Creative",
    tagline: "Analog tape saturation, acoustic submersion, vintage telephone, and sample reversal.",
    presetIds: [
      "lofi-tape",
      "tape-warmth",
      "tube-warmth",
      "am-radio",
      "underwater",
      "muffled-room",
      "telephone-voice",
      "reverse",
      "bitcrusher",
    ],
  },
  {
    id: "utilities",
    label: "Studio Utilities",
    tagline: "Lossless volume gain, precision audio trimming, mono downmixing, and mastering polish.",
    presetIds: [
      "volume-changer",
      "trimmer-cutter",
      "fade-in-out",
      "downmixer",
      "bpm-detector",
      "format-converter",
      "mastering-polish",
      "compressor",
      "vocal-remover",
      "music-bus-glue",
    ],
  },
];

const STANDARD_PRESET_IDS = new Set([
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

export function PresetExplorer() {
  const router = useRouter();

  // Store state for workspace integration
  const selectedPresetId = useEditorStore((s) => s.selectedPresetId);
  const selectPreset = useEditorStore((s) => s.selectPreset);
  const file = useEditorStore((s) => s.file);
  const duration = useEditorStore((s) => s.duration);

  // Local filtering state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [onlyStandards, setOnlyStandards] = useState(false);
  const [detailPresetId, setDetailPresetId] = useState<string | null>(null);
  const [auditioningId, setAuditioningId] = useState<string | null>(null);

  // Audio Context reference for procedural preset preview
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<Array<{ stop?: () => void; disconnect: () => void }>>([]);
  const auditionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAudition = useCallback(() => {
    if (auditionTimeoutRef.current) {
      clearTimeout(auditionTimeoutRef.current);
      auditionTimeoutRef.current = null;
    }
    for (const node of activeNodesRef.current) {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {
        // safely ignore
      }
    }
    activeNodesRef.current = [];
    setAuditioningId(null);
  }, []);

  useEffect(() => {
    return () => {
      stopAudition();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopAudition]);

  const playAudition = (presetId: string) => {
    if (auditioningId === presetId) {
      stopAudition();
      return;
    }

    stopAudition();

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      setAuditioningId(presetId);

      const now = ctx.currentTime;
      const auditionDuration = 3.0;

      // Master gain with smooth envelope to prevent clicks
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.2, now + 0.08);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + auditionDuration);
      masterGain.connect(ctx.destination);

      let busNode: AudioNode = masterGain;

      // Real DSP filtering customized per acoustic character
      if (presetId === "underwater") {
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(520, now);
        filter.connect(masterGain);
        busNode = filter;
      } else if (presetId.includes("bass-boost")) {
        const bass = ctx.createBiquadFilter();
        bass.type = "lowshelf";
        bass.frequency.setValueAtTime(80, now);
        bass.gain.setValueAtTime(10.5, now);
        bass.connect(masterGain);
        busNode = bass;
      } else if (presetId === "treble-air") {
        const treble = ctx.createBiquadFilter();
        treble.type = "highshelf";
        treble.frequency.setValueAtTime(9000, now);
        treble.gain.setValueAtTime(6.0, now);
        treble.connect(masterGain);
        busNode = treble;
      } else if (presetId === "8d-audio") {
        if (ctx.createStereoPanner) {
          const panner = ctx.createStereoPanner();
          panner.pan.setValueAtTime(-0.85, now);
          panner.pan.linearRampToValueAtTime(0.85, now + auditionDuration * 0.5);
          panner.pan.linearRampToValueAtTime(-0.85, now + auditionDuration);
          panner.connect(masterGain);
          busNode = panner;
        }
      } else if (presetId === "telephone-voice" || presetId === "telephone") {
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.setValueAtTime(450, now);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.setValueAtTime(3200, now);
        hp.connect(lp);
        lp.connect(masterGain);
        busNode = hp;
      }

      // Authentic musical chord frequencies (Cmaj7 / Am / F)
      let freqs = [174.61, 220.0, 261.63, 329.63]; // F-A-C-E ambient pad
      if (presetId === "nightcore" || presetId === "sped-up") {
        freqs = [232.0, 293.0, 349.0, 440.0];
      } else if (presetId === "daycore" || presetId === "super-slowed") {
        freqs = [130.81, 164.81, 196.0, 246.94];
      } else if (presetId === "pitch-432hz") {
        const r = 432 / 440;
        freqs = freqs.map((f) => f * r);
      }

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(f, now);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.25 / freqs.length, now);

        osc.connect(oscGain);
        oscGain.connect(busNode);

        osc.start(now);
        osc.stop(now + auditionDuration);

        activeNodesRef.current.push(osc, oscGain);
      });

      auditionTimeoutRef.current = setTimeout(() => {
        setAuditioningId((prev) => (prev === presetId ? null : prev));
      }, auditionDuration * 1000);
    } catch {
      setAuditioningId(null);
    }
  };

  const handleApplyPreset = (presetId: string) => {
    stopAudition();
    selectPreset(presetId);
    router.push(`/studio?preset=${presetId}`);
  };

  const currentCategory = useMemo(() => {
    return ACOUSTIC_CATEGORIES.find((c) => c.id === selectedCategoryId) || ACOUSTIC_CATEGORIES[0];
  }, [selectedCategoryId]);

  const filteredPresets = useMemo(() => {
    const q = search.toLowerCase().trim();
    const categoryPresetSet = new Set(currentCategory.presetIds);

    return presets.filter((preset) => {
      if (selectedCategoryId !== "all" && !categoryPresetSet.has(preset.id)) {
        return false;
      }
      if (onlyStandards && !STANDARD_PRESET_IDS.has(preset.id)) {
        return false;
      }
      if (q) {
        const matchName = preset.name.toLowerCase().includes(q);
        const matchDesc = preset.description.toLowerCase().includes(q);
        const matchTags = preset.tags.some((t) => t.toLowerCase().includes(q));
        const matchOps = preset.supportedOps.some((op) => op.toLowerCase().includes(q));
        return matchName || matchDesc || matchTags || matchOps;
      }
      return true;
    });
  }, [selectedCategoryId, currentCategory, onlyStandards, search]);

  const detailPreset = useMemo(() => {
    return detailPresetId ? getPresetById(detailPresetId) : null;
  }, [detailPresetId]);

  return (
    <div className="space-y-8">
      {/* ── Active Studio Workspace Context Bar ──────────────────────── */}
      {file && (
        <aside
          aria-label="Active workspace track"
          className="rounded-xl border border-line bg-surface/90 px-4 py-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileAudio size={16} weight="duotone" />
            </span>
            <div className="truncate">
              <span className="font-semibold text-fg truncate">{file.name}</span>
              <span className="ml-2 font-mono text-[11px] text-muted">
                {formatTime(duration)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {selectedPresetId && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                <CheckCircle size={12} weight="fill" />
                Active in Studio: {getPresetById(selectedPresetId)?.name}
              </span>
            )}
            <Button asChild size="sm" className="h-8 rounded-lg btn-gradient-primary text-white text-xs font-semibold px-3.5 shadow-glow-wire hover:opacity-95 cursor-pointer">
              <Link href="/studio">
                <span>Go to Studio</span>
                <ArrowRight size={12} />
              </Link>
            </Button>
          </div>
        </aside>
      )}

      {/* ── Search & Filter Controls Bar ────────────────────────────── */}
      <div className="space-y-4">
        {/* Search and Secondary Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by preset name, audio effect, or DSP node…"
              aria-label="Search presets by name, effect, or DSP node"
              className="h-10 sm:h-9.5 w-full rounded-xl border border-line bg-surface pl-9 pr-9 text-[16px] sm:text-xs text-fg placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-sans transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg p-0.5 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyStandards((prev) => !prev)}
              aria-pressed={onlyStandards}
              className={cn(
                "h-9.5 inline-flex items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-all cursor-pointer select-none",
                onlyStandards
                  ? "btn-gradient-primary text-white shadow-glow-wire font-semibold"
                  : "border-line bg-surface text-muted hover:text-fg hover:border-line-strong hover:bg-surface"
              )}
            >
              <Sparkle size={13} weight={onlyStandards ? "fill" : "regular"} />
              <span>Essential Presets ({STANDARD_PRESET_IDS.size})</span>
            </button>

            <span className="text-xs font-mono text-muted pl-1">
              {filteredPresets.length} {filteredPresets.length === 1 ? "sound" : "sounds"}
            </span>
          </div>
        </div>

        {/* Acoustic Category Pills Navigation */}
        <nav aria-label="Preset acoustic categories" className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar max-w-full sm:flex-wrap pb-1">
          {ACOUSTIC_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const count =
              cat.id === "all"
                ? presets.length
                : presets.filter((p) => cat.presetIds.includes(p.id)).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                aria-pressed={isSelected}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all border cursor-pointer select-none",
                  isSelected
                    ? "btn-gradient-primary text-white shadow-glow-wire font-semibold"
                    : "border-line bg-surface/80 text-muted hover:text-fg hover:border-line-strong hover:bg-surface"
                )}
              >
                <span>{cat.label}</span>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.2 text-[10px] font-mono",
                    isSelected ? "bg-white/20 text-white" : "bg-raised text-muted"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Category Description Banner */}
        <div className="flex items-center justify-between text-xs text-muted border-b border-line pb-3">
          <p className="italic">{currentCategory.tagline}</p>
          <Button asChild variant="ghost" size="sm" className="h-7 text-[11px] text-muted hover:text-fg px-2.5">
            <Link href="/effects" className="flex items-center gap-1">
              <Sliders size={12} />
              <span>View DSP parameters</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Preset Cards Library Grid ───────────────────────────────── */}
      <section aria-label="Available sound presets">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredPresets.map((preset) => {
            const isSelectedInStudio = selectedPresetId === preset.id;
            const isAuditioning = auditioningId === preset.id;
            const keyParams = preset.params.slice(0, 3);

            return (
              <article
                key={preset.id}
                className={cn(
                  "surface-card rounded-2xl border p-5 flex flex-col justify-between transition-all duration-180 group",
                  isSelectedInStudio
                    ? "border-primary ring-2 ring-primary/20 bg-surface shadow-xs"
                    : "border-line hover:border-line-strong bg-surface/90 hover:bg-surface"
                )}
              >
                <div>
                  {/* Top Bar: Icon, Category Badge, Selected Indicator */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                          isSelectedInStudio
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-line bg-canvas text-muted group-hover:text-primary group-hover:border-primary/30"
                        )}
                      >
                        <PresetIcon presetId={preset.id} size={20} weight="duotone" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-fg truncate group-hover:text-primary transition-colors">
                          {preset.name}
                        </h3>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                          {preset.kind === "tool" ? "Studio Utility" : "Acoustic Preset"}
                        </span>
                      </div>
                    </div>

                    {isSelectedInStudio && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 border border-primary/25 px-2 py-0.5 text-[10px] font-medium text-primary">
                        <CheckCircle size={10} weight="fill" />
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-muted leading-relaxed line-clamp-2">
                    {preset.description}
                  </p>

                  {/* Key Parameter Preview Chips */}
                  {keyParams.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                      {keyParams.map((param) => {
                        const val = preset.defaults[param.id];
                        const unit = param.kind === "slider" ? param.unit : "";
                        const displayVal =
                          typeof val === "boolean"
                            ? val ? "On" : "Off"
                            : `${val}${unit}`;

                        return (
                          <span
                            key={param.id}
                            className="inline-flex items-center gap-1 rounded-md bg-canvas border border-line px-2 py-0.5 text-[10px] font-mono text-muted"
                          >
                            <span className="text-faint">{param.label}:</span>
                            <span className="font-semibold text-fg">{displayVal}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Compatibility Advice */}
                  {preset.compatibilityNote && (
                    <p className="mt-2.5 flex items-center gap-1 text-[11px] text-muted">
                      <Headphones size={13} className="shrink-0 text-faint" />
                      <span className="truncate">{preset.compatibilityNote}</span>
                    </p>
                  )}
                </div>

                {/* Card Footer: Audition, Details, and Action */}
                <div className="mt-5 pt-3.5 border-t border-line flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* User-initiated Audition Button */}
                    <button
                      type="button"
                      onClick={() => playAudition(preset.id)}
                      aria-label={
                        isAuditioning
                          ? `Stop audio preview for ${preset.name}`
                          : `Preview procedural chords for ${preset.name}`
                      }
                      className={cn(
                        "h-8 inline-flex items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-all cursor-pointer select-none active:scale-95 shadow-xs",
                        isAuditioning
                          ? "btn-gradient-primary text-white font-semibold shadow-glow-wire"
                          : "border-line bg-canvas text-muted hover:text-fg hover:border-line-strong hover:bg-surface"
                      )}
                    >
                      {isAuditioning ? (
                        <>
                          <Square size={10} weight="fill" />
                          <span>Stop</span>
                          <span className="dock-eq flex h-2.5 items-end gap-[1.5px] ml-0.5">
                            <span />
                            <span />
                            <span />
                          </span>
                        </>
                      ) : (
                        <>
                          <Play size={10} weight="fill" className="text-primary" />
                          <span>Preview</span>
                        </>
                      )}
                    </button>

                    {/* Inspect Details Drawer Toggle */}
                    <button
                      type="button"
                      onClick={() => setDetailPresetId(preset.id)}
                      aria-label={`View parameters and DSP details for ${preset.name}`}
                      className="h-8 inline-flex items-center gap-1 rounded-lg border border-line/70 bg-surface/60 hover:bg-raised text-muted hover:text-fg px-2 text-xs font-medium transition-colors cursor-pointer shadow-xs"
                      title="Inspect parameters & DSP nodes"
                    >
                      <Info size={13} className="text-muted" />
                      <span className="hidden sm:inline">Details</span>
                    </button>

                    {/* Dedicated Tool Link */}
                    {getToolSlugForPreset(preset.id) && (
                      <Link
                        href={`/tools/${getToolSlugForPreset(preset.id)}`}
                        className="h-8 inline-flex items-center gap-1 rounded-lg border border-primary/25 bg-primary/5 hover:bg-primary/10 text-primary px-2 text-xs font-medium transition-colors cursor-pointer shadow-xs"
                        title={`Open dedicated ${preset.name} audio tool`}
                      >
                        <Sliders size={12} />
                        <span className="hidden sm:inline">Tool</span>
                      </Link>
                    )}
                  </div>

                  {/* Apply / Open-in-Studio Primary Action — Every card gets the signature rotating gradient button */}
                  <Button
                    size="sm"
                    onClick={() => handleApplyPreset(preset.id)}
                    className={cn(
                      "h-8 rounded-lg btn-gradient-primary text-white text-xs font-semibold px-3 shadow-glow-wire hover:opacity-95 transition-all cursor-pointer shrink-0 group/btn active:scale-95",
                      isSelectedInStudio && "ring-2 ring-white/60",
                    )}
                  >
                    {isSelectedInStudio ? (
                      <>
                        <CheckCircle size={13} weight="fill" className="text-white shrink-0" />
                        <span>Active in Studio</span>
                      </>
                    ) : (
                      <>
                        <span>Use in Studio</span>
                        <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5 shrink-0" />
                      </>
                    )}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredPresets.length === 0 && (
          <div className="rounded-2xl border border-line bg-surface p-12 text-center space-y-3">
            <SlidersHorizontal size={28} className="mx-auto text-muted" />
            <h3 className="text-sm font-semibold text-fg">No sounds found</h3>
            <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
              No presets matched “{search}” in the {currentCategory.label} category. Try searching for
              “reverb”, “bass”, “8d”, or “pitch”.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setSelectedCategoryId("all");
                setOnlyStandards(false);
              }}
              className="mt-2 text-xs"
            >
              Reset all filters
            </Button>
          </div>
        )}
      </section>

      {/* ── Preset Details Drawer / Inspector Modal ─────────────────── */}
      {detailPreset && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="surface-card w-full max-w-lg rounded-2xl border border-line-strong p-6 shadow-2xl space-y-5 bg-surface max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  <PresetIcon presetId={detailPreset.id} size={22} weight="duotone" />
                </div>
                <div>
                  <h3 id="detail-title" className="text-base font-bold text-fg">
                    {detailPreset.name}
                  </h3>
                  <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
                    {detailPreset.category} · {detailPreset.kind}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDetailPresetId(null)}
                aria-label="Close preset details"
                className="rounded-lg p-1.5 text-muted hover:text-fg hover:bg-raised transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold text-fg uppercase tracking-wider font-mono">
                Acoustic Description
              </h4>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                {detailPreset.description}
              </p>
            </div>

            {/* Signal Node Chain */}
            <div>
              <h4 className="text-xs font-semibold text-fg uppercase tracking-wider font-mono">
                Web Audio DSP Signal Chain
              </h4>
              <div className="mt-1.5 rounded-xl border border-line bg-canvas p-3 font-mono text-xs text-primary">
                {detailPreset.supportedOps.join(" → ")}
              </div>
            </div>

            {/* Parameter Schema Breakdown */}
            <div>
              <h4 className="text-xs font-semibold text-fg uppercase tracking-wider font-mono">
                Configurable Parameters ({detailPreset.params.length})
              </h4>
              <div className="mt-2 space-y-2">
                {detailPreset.params.map((param) => {
                  const def = detailPreset.defaults[param.id];
                  const unit = param.kind === "slider" ? param.unit : "";
                  return (
                    <div
                      key={param.id}
                      className="rounded-lg border border-line bg-canvas p-2.5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-fg">{param.label}</span>
                        <span className="font-mono text-primary text-[11px]">
                          Default: {typeof def === "boolean" ? (def ? "Enabled" : "Disabled") : `${def}${unit}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted leading-snug">{param.description}</p>
                      {param.kind === "slider" && (
                        <div className="text-[10px] font-mono text-faint">
                          Range: {param.min} to {param.max} {param.unit} (step: {param.step})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blog Guide Link if Available */}
            <BlogGuideDetail presetId={detailPreset.id} />

            {/* Modal Actions */}
            <div className="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => playAudition(detailPreset.id)}
                className={cn(
                  "h-8 rounded-lg text-xs font-medium cursor-pointer shadow-xs",
                  auditioningId === detailPreset.id &&
                    "border-primary/40 bg-primary/10 text-primary font-semibold shadow-glow-wire",
                )}
              >
                {auditioningId === detailPreset.id ? (
                  <>
                    <Square size={12} weight="fill" />
                    <span>Stop Preview</span>
                  </>
                ) : (
                  <>
                    <Play size={12} weight="fill" className="text-primary" />
                    <span>Audition Sound</span>
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="h-8 rounded-lg text-xs font-medium shadow-xs">
                  <Link href={`/effects?preset=${detailPreset.id}`}>
                    <Sliders size={13} />
                    <span>Customize in Effects</span>
                  </Link>
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    setDetailPresetId(null);
                    handleApplyPreset(detailPreset.id);
                  }}
                  className="h-8 rounded-lg btn-gradient-primary text-white text-xs font-semibold px-3.5 shadow-glow-wire hover:opacity-95 cursor-pointer active:scale-95"
                >
                  <span>Open in Studio</span>
                  <ArrowRight size={13} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BlogGuideDetail({ presetId }: { presetId: string }) {
  const slug = presetArticleRegistry.find((a) => a.presetId === presetId)?.slug;
  if (!slug) return null;

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 text-fg">
        <BookOpenText size={16} className="text-primary" />
        <span>In-depth acoustic engineering guide available</span>
      </div>
      <Link
        href={`/blog/${slug}`}
        className="font-semibold text-primary hover:text-primary-hover flex items-center gap-1 text-[11px]"
      >
        <span>Read Guide</span>
        <ArrowRight size={11} />
      </Link>
    </div>
  );
}
