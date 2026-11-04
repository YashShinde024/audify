"use client";

import { useCompletionSoundPreference } from "@/hooks/use-completion-sound";
import { Switch } from "@/components/ui/switch";
import { SpeakerHigh, Play } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SoundSettingsProps {
  className?: string;
  variant?: "card" | "inline";
}

export function SoundSettings({ className, variant = "card" }: SoundSettingsProps) {
  const { enabled, setEnabled, preview } = useCompletionSoundPreference();
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const handlePreview = async () => {
    setIsPlayingPreview(true);
    await preview();
    setTimeout(() => setIsPlayingPreview(false), 300);
  };

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center justify-between gap-3", className)}>
        <div className="flex items-center gap-2">
          <SpeakerHigh size={15} className="text-primary shrink-0" />
          <label htmlFor="completion-sound-toggle-inline" className="text-xs font-medium text-fg cursor-pointer select-none">
            Completion Sound
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreview}
            disabled={isPlayingPreview}
            aria-label="Preview completion sound"
            title="Preview completion sound"
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
          <SpeakerHigh size={14} className="text-primary shrink-0" />
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
        Plays a subtle 200 ms synthesized chime when studio mastering, audio exports, or utilities finish processing. Disabled by default.
      </p>
    </div>
  );
}

