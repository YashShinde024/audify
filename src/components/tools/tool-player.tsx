"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, SpeakerHigh, SpeakerSlash, Repeat } from "@phosphor-icons/react";
import { formatDurationMs } from "@/lib/audio/tools-engine";

interface ToolPlayerProps {
  url: string;
  duration: number;
  fileName?: string;
}

export function ToolPlayer({ url, duration, fileName }: ToolPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    if (isLooping && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      return;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full p-4 rounded-xl border border-line bg-surface/80 backdrop-blur-sm space-y-3">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />

      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-medium text-fg truncate max-w-[200px] sm:max-w-xs">
          {fileName || "Preview Output"}
        </span>
        <span className="font-mono">
          {formatDurationMs(currentTime)} / {formatDurationMs(duration)}
        </span>
      </div>

      {/* Seekbar */}
      <div className="relative w-full flex items-center">
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.05}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-line rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full btn-gradient-primary flex items-center justify-center transition-all shadow-md active:scale-95"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause weight="fill" className="w-4 h-4 text-white" />
            ) : (
              <Play weight="fill" className="w-4 h-4 ml-0.5 text-white" />
            )}
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-lg text-muted hover:text-fg hover:bg-raised transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <SpeakerSlash className="w-4 h-4" /> : <SpeakerHigh className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              const next = !isLooping;
              setIsLooping(next);
              if (audioRef.current) audioRef.current.loop = next;
            }}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isLooping
                ? "text-primary bg-primary/10 border border-primary/20"
                : "text-muted hover:text-fg hover:bg-raised"
            }`}
            title={isLooping ? "Continuous loop active" : "Enable continuous loop"}
          >
            <Repeat className="w-4 h-4" weight={isLooping ? "bold" : "regular"} />
          </button>
        </div>

        <div className="text-[11px] text-muted uppercase tracking-wider font-semibold font-mono">
          High-Fidelity Preview
        </div>
      </div>
    </div>
  );
}
