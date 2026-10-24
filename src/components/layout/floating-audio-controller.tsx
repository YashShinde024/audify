"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  SpeakerHigh,
  SpeakerLow,
  SpeakerNone,
  ArrowsClockwise,
  ArrowRight,
  X,
  Waveform,
  Sliders,
} from "@phosphor-icons/react";
import { Slider } from "@/components/ui/slider";
import { useEditorStore } from "@/stores/editor-store";
import { formatTime, cn } from "@/lib/utils";

/**
 * Global Floating Audio Controller.
 *
 * Appears whenever audio is loaded in the browser.
 * - Subtle floating badge with real-time animated EQ bars and quick play/pause.
 * - Tapping reveals a rich volume fader, mute toggle, scrubber, and A/B comparison.
 */
export function FloatingAudioController() {
  const file = useEditorStore((s) => s.file);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const currentTime = useEditorStore((s) => s.currentTime);
  const duration = useEditorStore((s) => s.duration);
  const volume = useEditorStore((s) => s.volume);
  const setVolume = useEditorStore((s) => s.setVolume);
  const togglePlay = useEditorStore((s) => s.togglePlay);
  const setCurrentTime = useEditorStore((s) => s.setCurrentTime);
  const processedResult = useEditorStore((s) => s.processedResult);
  const showAfter = useEditorStore((s) => s.showAfter);
  const setShowAfter = useEditorStore((s) => s.setShowAfter);

  const [expanded, setExpanded] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(80);

  // Only render when an audio track has been loaded into memory
  if (!file || duration <= 0) return null;

  const toggleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolume(0);
    } else {
      setVolume(previousVolume || 80);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 select-none max-w-[calc(100vw-1.5rem)]">
      {/* ── Expanded Volume & Control Popover ────────────────────────── */}
      {expanded ? (
        <div
          role="region"
          aria-label="Floating audio player controls"
          className="surface-card glass-panel w-[calc(100vw-1.5rem)] max-w-[320px] sm:max-w-none sm:w-80 rounded-2xl border border-line-strong p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 space-y-3.5"
        >
          {/* Header with track name and minimize button */}
          <div className="flex items-center justify-between gap-2 border-b border-line pb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 border border-accent/25 text-accent">
                <Waveform size={14} weight="duotone" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-fg truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-[10px] text-muted font-mono">
                  {isPlaying ? "Playing active audio" : "Paused"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Minimize player"
              className="rounded-lg p-1 text-muted hover:text-fg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={15} weight="bold" />
            </button>
          </div>

          {/* Volume Control Fader */}
          <div className="space-y-1.5 rounded-xl border border-line bg-surface/60 p-2.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-fg">
              <span className="flex items-center gap-1.5 text-muted">
                <Sliders size={13} className="text-accent" />
                Master Volume
              </span>
              <span className="font-mono text-accent font-semibold tnum">{volume}%</span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={volume === 0 ? "Unmute" : "Mute"}
                className="text-muted hover:text-accent transition-colors shrink-0 cursor-pointer"
              >
                {volume === 0 ? (
                  <SpeakerNone size={16} />
                ) : volume < 50 ? (
                  <SpeakerLow size={16} />
                ) : (
                  <SpeakerHigh size={16} />
                )}
              </button>

              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={([v]) => setVolume(v ?? volume)}
                aria-label="Volume slider"
                className="flex-1"
              />
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-line rounded-full overflow-hidden relative cursor-pointer">
              <div
                className="h-full bg-accent rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-muted">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Transport Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => togglePlay()}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                {isPlaying ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" className="ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => setCurrentTime(0)}
                aria-label="Restart track"
                className="rounded-lg p-1.5 text-muted hover:text-fg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ArrowsClockwise size={13} />
              </button>
            </div>

            {/* A/B Switch if output is processed */}
            {processedResult && (
              <div className="flex items-center gap-1 rounded-lg border border-line bg-raised/80 p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setShowAfter(false)}
                  className={cn(
                    "px-2 py-0.5 rounded font-medium transition-colors cursor-pointer",
                    !showAfter ? "bg-surface text-fg font-semibold shadow-xs" : "text-muted hover:text-fg"
                  )}
                >
                  Dry
                </button>
                <button
                  type="button"
                  onClick={() => setShowAfter(true)}
                  className={cn(
                    "px-2 py-0.5 rounded font-medium transition-colors cursor-pointer",
                    showAfter ? "bg-accent text-white font-semibold shadow-xs" : "text-muted hover:text-fg"
                  )}
                >
                  Wet
                </button>
              </div>
            )}

            <Link
              href="/studio"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
            >
              <span>Studio</span>
              <ArrowRight size={11} weight="bold" />
            </Link>
          </div>
        </div>
      ) : (
        /* ── Compact Floating Capsule ──────────────────────────────── */
        <div
          role="button"
          tabIndex={0}
          onClick={() => setExpanded(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setExpanded(true);
            }
          }}
          aria-label="Open volume and audio controls"
          className={cn(
            "group relative flex items-center gap-2.5 rounded-full pl-2 pr-3.5 py-1.5 cursor-pointer shadow-lg transition-all duration-200",
            "border border-line-strong bg-surface/90 hover:bg-surface backdrop-blur-md hover:scale-105",
            isPlaying && "ring-2 ring-accent/30"
          )}
        >
          {/* Play/Pause quick tap */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            aria-label={isPlaying ? "Pause playback" : "Start playback"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-xs hover:scale-110 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause size={12} weight="fill" />
            ) : (
              <Play size={12} weight="fill" className="ml-0.5" />
            )}
          </button>

          {/* Animated Kinetic EQ Bars */}
          <div className="flex items-center gap-0.5 h-3.5" aria-hidden="true">
            <span
              className={cn(
                "w-[2.5px] rounded-full bg-accent transition-all",
                isPlaying ? "h-3.5 animate-pulse" : "h-1.5"
              )}
            />
            <span
              className={cn(
                "w-[2.5px] rounded-full bg-accent transition-all",
                isPlaying ? "h-2.5 animate-bounce" : "h-2"
              )}
            />
            <span
              className={cn(
                "w-[2.5px] rounded-full bg-accent transition-all",
                isPlaying ? "h-4 animate-pulse" : "h-1.5"
              )}
            />
          </div>

          {/* Volume Indicator icon */}
          <span className="flex items-center gap-1 text-xs font-mono font-medium text-fg">
            <SpeakerHigh size={13} className="text-accent" />
            <span className="hidden sm:inline">{volume}%</span>
          </span>
        </div>
      )}
    </div>
  );
}
