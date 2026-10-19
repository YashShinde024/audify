"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  SpeakerHigh,
  SpeakerNone,
  ArrowsLeftRight,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useEditorStore } from "@/stores/editor-store";
import { formatTime, cn } from "@/lib/utils";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const file = useEditorStore((s) => s.file);
  const decodedAudio = useEditorStore((s) => s.decodedAudio);
  const originalAudioUrl = useEditorStore((s) => s.originalAudioUrl);
  const processedResult = useEditorStore((s) => s.processedResult);
  const showAfter = useEditorStore((s) => s.showAfter);
  const toggleAfter = useEditorStore((s) => s.toggleAfter);
  const setShowAfter = useEditorStore((s) => s.setShowAfter);

  const isPlaying = useEditorStore((s) => s.isPlaying);
  const togglePlay = useEditorStore((s) => s.togglePlay);
  const currentTime = useEditorStore((s) => s.currentTime);
  const setCurrentTime = useEditorStore((s) => s.setCurrentTime);
  const duration = useEditorStore((s) => s.duration);
  const setDuration = useEditorStore((s) => s.setDuration);
  const volume = useEditorStore((s) => s.volume);
  const setVolume = useEditorStore((s) => s.setVolume);

  // Active audio URL depends on whether we are listening to processed or original
  const activeUrl = showAfter && processedResult ? processedResult.url : originalAudioUrl;
  const canCompare = Boolean(originalAudioUrl && processedResult);

  // Synchronize audio element playback state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Audio play prevented:", err);
        togglePlay(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, togglePlay]);

  // Synchronize volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle source switch
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeUrl) return;

    const wasPlaying = isPlaying;
    audio.src = activeUrl;
    audio.currentTime = 0;
    setCurrentTime(0);

    if (wasPlaying) {
      audio.play().catch(() => togglePlay(false));
    }
  }, [activeUrl]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && Number.isFinite(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  }, [setCurrentTime, setDuration]);

  const handleEnded = useCallback(() => {
    togglePlay(false);
    setCurrentTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, [togglePlay, setCurrentTime]);

  const handleSeek = (ratio: number) => {
    if (audioRef.current && duration > 0) {
      const targetTime = Math.max(0, Math.min(duration, ratio * duration));
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const progressRatio = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
  const peaks = decodedAudio?.peaks || [];

  return (
    <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      {/* Hidden real HTML5 Audio element */}
      <audio
        ref={audioRef}
        src={activeUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={() => {
          if (audioRef.current?.duration && Number.isFinite(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
          }
        }}
      />

      {/* Header bar: Auditioning indicator & A/B comparison toggle */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Auditioning:
          </span>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-medium",
              showAfter && processedResult
                ? "bg-violet/15 text-purple border border-violet/30"
                : "bg-raised text-fg border border-line",
            )}
          >
            {showAfter && processedResult ? "Processed Output (After)" : "Original Input (Before)"}
          </span>
        </div>

        {canCompare && (
          <div className="flex items-center gap-1.5 rounded-lg border border-line bg-raised/70 p-1">
            <button
              type="button"
              onClick={() => setShowAfter(false)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                !showAfter ? "bg-surface text-fg shadow-xs font-semibold" : "text-muted hover:text-fg",
              )}
            >
              Original
            </button>
            <button
              type="button"
              onClick={() => setShowAfter(true)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                showAfter ? "bg-violet text-white shadow-xs font-semibold" : "text-muted hover:text-fg",
              )}
            >
              Processed
            </button>
          </div>
        )}
      </div>

      {/* Genuine Functional Waveform Track derived from decoded peaks */}
      <div
        role="slider"
        aria-label="Audio seeker timeline"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        tabIndex={0}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          handleSeek(ratio);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") handleSeek((currentTime - 5) / duration);
          if (e.key === "ArrowRight") handleSeek((currentTime + 5) / duration);
        }}
        className="group relative flex h-20 w-full cursor-pointer items-center overflow-hidden rounded-lg border border-line bg-deep px-2 select-none"
      >
        {/* Authentic Peaks bars */}
        <div className="flex h-full w-full items-center justify-between gap-[2px]">
          {peaks.length > 0 ? (
            peaks.map((peak, idx) => {
              const barRatio = idx / peaks.length;
              const isPassed = barRatio <= progressRatio;
              return (
                <div
                  key={idx}
                  className="w-full min-w-[2px] max-w-[5px] rounded-full transition-colors"
                  style={{
                    height: `${Math.max(12, Math.round(peak * 88))}%`,
                    backgroundColor: isPassed
                      ? (showAfter && processedResult ? "#8b5cf6" : "#25232b")
                      : "rgba(255, 255, 255, 0.15)",
                  }}
                />
              );
            })
          ) : (
            <div className="w-full text-center text-xs text-muted">
              Loading authentic waveform…
            </div>
          )}
        </div>

        {/* Playhead line */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-violet shadow-xs"
          style={{ left: `${progressRatio * 100}%` }}
        />
      </div>

      {/* Transport Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="icon"
            onClick={() => togglePlay()}
            aria-label={isPlaying ? "Pause audio playback" : "Play audio playback"}
            className="h-9.5 w-9.5 rounded-full"
          >
            {isPlaying ? (
              <Pause size={16} weight="fill" />
            ) : (
              <Play size={16} weight="fill" className="ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleSeek(0)}
            aria-label="Restart playback from beginning"
          >
            <ArrowsClockwise size={14} />
          </Button>

          <span className="tnum font-mono text-xs text-muted">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Volume Fader */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setVolume(volume === 0 ? 80 : 0)}
            className="text-muted hover:text-fg"
            aria-label={volume === 0 ? "Unmute" : "Mute"}
          >
            {volume === 0 ? (
              <SpeakerNone size={16} />
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
            aria-label="Audition volume"
            className="w-24"
          />
          <span className="tnum w-7 text-right font-mono text-xs text-muted">
            {volume}%
          </span>
        </div>
      </div>
    </div>
  );
}
