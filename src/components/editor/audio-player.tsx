"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
  Play,
  Pause,
  SpeakerHigh,
  SpeakerNone,
  ArrowsClockwise,
  Repeat,
  Waveform,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useEditorStore } from "@/stores/editor-store";
import { formatTime, cn } from "@/lib/utils";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  const decodedAudio = useEditorStore((s) => s.decodedAudio);
  const originalAudioUrl = useEditorStore((s) => s.originalAudioUrl);
  const processedResult = useEditorStore((s) => s.processedResult);
  const showAfter = useEditorStore((s) => s.showAfter);
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

  // Synchronize volume and loop mode
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.loop = isLooping;
    }
  }, [volume, isLooping]);

  // Handle source switch. Read the live playback state from the element so this
  // effect does not re-run (and reset the playhead) when play/pause toggles.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeUrl) return;

    const wasPlaying = !audio.paused;
    audio.src = activeUrl;
    audio.currentTime = 0;
    setCurrentTime(0);

    if (wasPlaying) {
      audio.play().catch(() => togglePlay(false));
    }
  }, [activeUrl, setCurrentTime, togglePlay]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && Number.isFinite(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  }, [setCurrentTime, setDuration]);

  const handleEnded = useCallback(() => {
    if (isLooping && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => togglePlay(false));
      return;
    }
    togglePlay(false);
    setCurrentTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, [isLooping, togglePlay, setCurrentTime]);

  const handleSeek = (ratio: number) => {
    if (audioRef.current && duration > 0) {
      const targetTime = Math.max(0, Math.min(duration, ratio * duration));
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current || duration <= 0) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = x / rect.width;
    setHoverPosition(x);
    setHoverTime(ratio * duration);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setHoverPosition(null);
  };

  const progressRatio = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
  const peaks = decodedAudio?.peaks || [];

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-sm space-y-4">
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 pb-3">
        <div className="flex items-center gap-2">
          <Waveform size={16} className="text-primary shrink-0" />
          <span className="text-xs font-semibold text-fg">
            Waveform &amp; Audition Deck
          </span>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-[11px] font-mono font-medium transition-colors",
              showAfter && processedResult
                ? "bg-primary/10 text-primary border border-primary/25 font-semibold"
                : "bg-raised text-muted border border-line",
            )}
          >
            {showAfter && processedResult ? "Master Output (After)" : "Source Input (Before)"}
          </span>
        </div>

        {canCompare && (
          <div className="flex items-center gap-1 rounded-lg border border-line bg-deep/50 p-1">
            <button
              type="button"
              onClick={() => setShowAfter(false)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                !showAfter ? "bg-surface text-fg shadow-xs font-semibold" : "text-muted hover:text-fg",
              )}
            >
              Source Dry
            </button>
            <button
              type="button"
              onClick={() => setShowAfter(true)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                showAfter ? "bg-primary text-white shadow-xs font-semibold" : "text-muted hover:text-fg",
              )}
            >
              Master Wet
            </button>
          </div>
        )}
      </div>

      {/* Genuine Functional Waveform Track derived from decoded peaks */}
      <div
        ref={waveformRef}
        role="slider"
        aria-label="Audio seeker timeline"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        tabIndex={0}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          handleSeek(ratio);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") handleSeek((currentTime - 5) / duration);
          if (e.key === "ArrowRight") handleSeek((currentTime + 5) / duration);
        }}
        className="group relative flex h-24 w-full cursor-pointer items-center overflow-hidden rounded-xl border border-line bg-deep/80 px-2.5 select-none transition-colors hover:border-line-strong"
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
                  className="w-full min-w-[2px] max-w-[5px] rounded-full transition-colors duration-150"
                  style={{
                    height: `${Math.max(10, Math.round(peak * 90))}%`,
                    backgroundColor: isPassed
                      ? "var(--color-primary)"
                      : "var(--color-line-strong)",
                  }}
                />
              );
            })
          ) : (
            <div className="w-full text-center text-xs text-muted flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span>Decoding PCM audio waveform…</span>
            </div>
          )}
        </div>

        {/* Hover Timecode Guideline */}
        {hoverPosition !== null && hoverTime !== null && (
          <div
            className="pointer-events-none absolute inset-y-0 w-px bg-fg/40 z-10"
            style={{ left: `${hoverPosition}px` }}
          >
            <div className="absolute -top-1 -translate-x-1/2 rounded bg-surface border border-line px-1.5 py-0.5 text-[10px] font-mono font-medium text-fg shadow-sm">
              {formatTime(hoverTime)}
            </div>
          </div>
        )}

        {/* Playhead line with glowing head */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-primary shadow-glow-wire z-10"
          style={{ left: `${progressRatio * 100}%` }}
        >
          <div className="absolute top-0 -translate-x-1/2 h-2 w-2 rounded-full bg-primary shadow-sm" />
        </div>
      </div>

      {/* Transport Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2.5">
          {/* Main Play / Pause Button with Primary Glow */}
          <Button
            variant="primary"
            size="icon"
            onClick={() => togglePlay()}
            aria-label={isPlaying ? "Pause audio playback" : "Play audio playback"}
            className="h-10 w-10 rounded-full shadow-glow-wire cursor-pointer transition-transform active:scale-95"
          >
            {isPlaying ? (
              <Pause size={17} weight="fill" />
            ) : (
              <Play size={17} weight="fill" className="ml-0.5" />
            )}
          </Button>

          {/* Rewind to beginning */}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => handleSeek(0)}
            aria-label="Restart playback from beginning"
            title="Restart from beginning"
            className="h-8 w-8 text-muted hover:text-fg"
          >
            <ArrowsClockwise size={14} />
          </Button>

          {/* Loop Mode Toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsLooping(!isLooping)}
            aria-label={isLooping ? "Disable loop" : "Enable continuous loop"}
            title={isLooping ? "Continuous loop active" : "Enable continuous loop"}
            className={cn(
              "h-8 w-8 transition-colors",
              isLooping
                ? "text-primary bg-primary/10 border border-primary/20"
                : "text-muted hover:text-fg hover:bg-raised",
            )}
          >
            <Repeat size={14} weight={isLooping ? "bold" : "regular"} />
          </Button>

          {/* Time Readout */}
          <div className="ml-1 font-mono text-xs text-muted">
            <span className="font-semibold text-fg">{formatTime(currentTime)}</span>
            <span className="mx-1 text-line-strong">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Fader */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVolume(volume === 0 ? 85 : 0)}
            className="text-muted hover:text-fg transition-colors cursor-pointer"
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
            className="w-20 sm:w-24"
          />
          <span className="w-8 text-right font-mono text-[11px] text-muted">
            {volume}%
          </span>
        </div>
      </div>
    </div>
  );
}
