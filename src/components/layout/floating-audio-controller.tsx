"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Slider } from "@/components/ui/slider";
import { useEditorStore } from "@/stores/editor-store";
import { formatTime, cn } from "@/lib/utils";

/**
 * Global Floating Audio Controller.
 *
 * Appears whenever audio is loaded in the browser.
 * - Subtle floating badge with real-time animated EQ bars and quick play/pause.
 * - Smoothly expands into a rich volume fader, mute toggle, scrubber, and A/B comparison.
 * - Anchored consistently at bottom-right with zero layout jump or viewport clipping.
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

  const [isExpanded, setIsExpanded] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(80);
  const prefersReducedMotion = useReducedMotion();
  const progressBarRef = useRef<HTMLDivElement>(null);

  // If no file or duration is 0, state is unexpanded
  const expanded = Boolean(file && duration > 0 && isExpanded);

  // Handle escape key to collapse
  useEffect(() => {
    if (!expanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expanded]);

  // Click scrubber to seek
  const handleScrubberClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current || duration <= 0) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const ratio = clickX / rect.width;
      const newTime = Math.max(0, Math.min(duration, ratio * duration));

      // Update Audio element in DOM if active
      const audioEl = document.querySelector("audio") as HTMLAudioElement | null;
      if (audioEl && Number.isFinite(audioEl.duration)) {
        audioEl.currentTime = newTime;
      }
      setCurrentTime(newTime);
    },
    [duration, setCurrentTime]
  );

  const toggleMute = useCallback(() => {
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolume(0);
    } else {
      setVolume(previousVolume || 80);
    }
  }, [volume, previousVolume, setVolume]);

  // Only render when an audio track has been loaded into memory
  if (!file || duration <= 0) return null;

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <div
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] right-3 sm:bottom-5 sm:right-5 z-40 select-none pointer-events-none"
      style={{
        transformOrigin: "bottom right",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          /* ── Expanded Volume & Control Popover ────────────────────────── */
          <motion.div
            key="expanded-panel"
            role="region"
            aria-label="Floating audio player controls"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: 12, originX: 1, originY: 1 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: 10, originX: 1, originY: 1 }
            }
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
              mass: 0.8,
            }}
            className="pointer-events-auto surface-card glass-panel w-[calc(100vw-1.5rem)] max-w-[320px] sm:max-w-none sm:w-80 rounded-2xl border border-line-strong p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl space-y-3.5"
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
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
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
              <div
                ref={progressBarRef}
                onClick={handleScrubberClick}
                role="slider"
                aria-label="Audio timeline progress"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(currentTime)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    const newT = Math.min(duration, currentTime + 5);
                    const audioEl = document.querySelector("audio");
                    if (audioEl) audioEl.currentTime = newT;
                    setCurrentTime(newT);
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    const newT = Math.max(0, currentTime - 5);
                    const audioEl = document.querySelector("audio");
                    if (audioEl) audioEl.currentTime = newT;
                    setCurrentTime(newT);
                  }
                }}
                className="h-2 w-full bg-line rounded-full overflow-hidden relative cursor-pointer group py-0.5"
              >
                <div
                  className="h-full bg-accent rounded-full transition-[width] duration-75 ease-linear pointer-events-none"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-muted tnum">
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
                  {isPlaying ? (
                    <Pause size={13} weight="fill" />
                  ) : (
                    <Play size={13} weight="fill" className="ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const audioEl = document.querySelector("audio");
                    if (audioEl) audioEl.currentTime = 0;
                    setCurrentTime(0);
                  }}
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
                      !showAfter
                        ? "bg-surface text-fg font-semibold shadow-xs"
                        : "text-muted hover:text-fg"
                    )}
                  >
                    Dry
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAfter(true)}
                    className={cn(
                      "px-2 py-0.5 rounded font-medium transition-colors cursor-pointer",
                      showAfter
                        ? "bg-accent text-white font-semibold shadow-xs"
                        : "text-muted hover:text-fg"
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
          </motion.div>
        ) : (
          /* ── Compact Floating Capsule ──────────────────────────────── */
          <motion.div
            key="compact-capsule"
            role="button"
            tabIndex={0}
            onClick={() => setIsExpanded(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsExpanded(true);
              }
            }}
            aria-label="Open volume and audio controls"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.9, y: 8, originX: 1, originY: 1 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.9, y: 6, originX: 1, originY: 1 }
            }
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 32,
              mass: 0.8,
            }}
            className={cn(
              "pointer-events-auto group relative flex items-center gap-2.5 rounded-full pl-2 pr-3.5 py-1.5 cursor-pointer shadow-lg transition-colors duration-200",
              "border border-line-strong bg-surface/90 hover:bg-surface backdrop-blur-md active:scale-95",
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

            {/* Kinetic EQ Bars: CSS keyframe motion when playing, stable resting state when paused */}
            <div className="flex items-center gap-0.5 h-3.5" aria-hidden="true">
              <span
                className={cn(
                  "w-[2.5px] rounded-full bg-accent transition-[height] duration-200 ease-out",
                  isPlaying ? "h-3.5 motion-safe:animate-[pulse_0.9s_ease-in-out_infinite]" : "h-1.5"
                )}
              />
              <span
                className={cn(
                  "w-[2.5px] rounded-full bg-accent transition-[height] duration-200 ease-out",
                  isPlaying ? "h-2.5 motion-safe:animate-[pulse_0.7s_ease-in-out_infinite_0.15s]" : "h-2"
                )}
              />
              <span
                className={cn(
                  "w-[2.5px] rounded-full bg-accent transition-[height] duration-200 ease-out",
                  isPlaying ? "h-4 motion-safe:animate-[pulse_1.1s_ease-in-out_infinite_0.3s]" : "h-1.5"
                )}
              />
            </div>

            {/* Volume Indicator icon */}
            <span className="flex items-center gap-1 text-xs font-mono font-medium text-fg tnum">
              <SpeakerHigh size={13} className="text-accent" />
              <span className="hidden sm:inline">{volume}%</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
