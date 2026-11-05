"use client";

import { useCompletionSoundPreference } from "@/hooks/use-completion-sound";
import { Switch } from "@/components/ui/switch";
import { SpeakerHigh, SpeakerSlash, Play } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SoundSettingsProps {
  className?: string;
  variant?: "card" | "inline" | "compact";
}

/**
 * SoundToggle is a quick header/toolbar icon button with immediate toggle & preview feedback.
 */
export function SoundToggle({ className }: { className?: string }) {
  const { enabled, setEnabled, preview } = useCompletionSoundPreference();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = async () => {
    const nextState = !enabled;
    setEnabled(nextState);
    if (nextState) {
      setIsPlaying(true);
      await preview();
      setTimeout(() => setIsPlaying(false), 350);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={enabled ? "Mute audio completion chime" : "Enable audio completion chime"}
      title={enabled ? "Completion chime: On (Click to mute)" : "Completion chime: Off (Click to enable & test)"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface transition-all cursor-pointer active:scale-95",
        enabled
          ? "text-primary border-primary/30 bg-primary/5 hover:border-primary/60 shadow-xs"
          : "text-muted hover:text-fg hover:border-line-strong",
        isPlaying && "ring-2 ring-primary/40",
        className
      )}
    >
      {enabled ? (
        <SpeakerHigh size={16} weight="duotone" className="shrink-0" />
      ) : (
        <SpeakerSlash size={16} weight="regular" className="shrink-0" />
      )}
    </button>
  );
}

export function SoundSettings({ className, variant = "card" }: SoundSettingsProps) {
  const { enabled, setEnabled, preview } = useCompletionSoundPreference();
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const handlePreview = async () => {
    setIsPlayingPreview(true);
    await preview();
    setTimeout(() => setIsPlayingPreview(false), 350);
  };

  if (variant === "compact") {
    return (
      <div className={cn("inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs", className)}>
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className="flex items-center gap-1.5 font-medium text-fg hover:text-primary transition-colors cursor-pointer"
          title={enabled ? "Chime enabled (Click to mute)" : "Chime muted (Click to enable)"}
        >
          {enabled ? (
            <SpeakerHigh size={15} weight="duotone" className="text-primary shrink-0" />
          ) : (
            <SpeakerSlash size={15} weight="regular" className="text-muted shrink-0" />
          )}
          <span className="text-[11px] font-semibold">{enabled ? "Chime On" : "Chime Off"}</span>
        </button>
        <span aria-hidden="true" className="text-line-strong">|</span>
        <button
          type="button"
          onClick={handlePreview}
          disabled={isPlayingPreview}
          aria-label="Test completion chime"
          title="Test completion chime"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-primary transition-colors cursor-pointer"
        >
          <Play size={10} weight="fill" className={cn(isPlayingPreview && "text-primary animate-pulse")} />
          <span>Test</span>
        </button>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center justify-between gap-3", className)}>
        <div className="flex items-center gap-2">
          {enabled ? (
            <SpeakerHigh size={15} weight="duotone" className="text-primary shrink-0" />
          ) : (
            <SpeakerSlash size={15} weight="regular" className="text-muted shrink-0" />
          )}
          <label htmlFor="completion-sound-toggle-inline" className="text-xs font-medium text-fg cursor-pointer select-none">
            Completion Chime
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreview}
            disabled={isPlayingPreview}
            aria-label="Preview completion sound chime"
            title="Preview completion sound chime"
            className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2 py-1 text-[11px] font-medium text-muted hover:text-fg hover:border-primary transition-colors cursor-pointer"
          >
            <Play size={10} weight="fill" className={cn(isPlayingPreview && "text-primary animate-pulse")} />
            <span>Test</span>
          </button>
          <Switch
            id="completion-sound-toggle-inline"
            checked={enabled}
            onCheckedChange={setEnabled}
            aria-label="Toggle audio completion sound"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-line/80 bg-canvas-subtle p-3.5 space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {enabled ? (
            <SpeakerHigh size={15} weight="duotone" className="text-primary shrink-0" />
          ) : (
            <SpeakerSlash size={15} weight="regular" className="text-muted shrink-0" />
          )}
          <label htmlFor="completion-sound-toggle-card" className="text-xs font-semibold text-fg cursor-pointer select-none">
            Audio Completion Chime
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreview}
            disabled={isPlayingPreview}
            aria-label="Preview completion sound chime"
            title="Preview subtle completion chime"
            className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-muted hover:text-fg hover:border-primary transition-colors cursor-pointer"
          >
            <Play size={11} weight="fill" className={cn(isPlayingPreview && "text-primary animate-pulse")} />
            <span>Preview</span>
          </button>
          <Switch
            id="completion-sound-toggle-card"
            checked={enabled}
            onCheckedChange={setEnabled}
            aria-label="Toggle audio processing completion sound"
          />
        </div>
      </div>
      <p className="text-[11px] text-muted leading-relaxed">
        Plays a subtle 290 ms synthesized chime when studio mastering, audio exports, or utilities finish processing.
      </p>
    </div>
  );
}
