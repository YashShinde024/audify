import React from "react";
import { Waves, TrendUp, Waveform, MicrophoneStage } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import type { IconWeight } from "@phosphor-icons/react";

interface UseCase {
  icon: React.ComponentType<{ size?: number | string; weight?: IconWeight; className?: string }>;
  title: string;
  body: string;
}

const useCases: UseCase[] = [
  {
    icon: Waves,
    title: "Slowed & reverbed edits",
    body: "The classic late-night treatment — drop the tempo, widen the atmosphere, and let the track breathe.",
  },
  {
    icon: TrendUp,
    title: "Bass boosts & nightcore",
    body: "Push the low end or lift the pitch for energetic cuts that stand out in a feed.",
  },
  {
    icon: Waveform,
    title: "Spatial texture for shorts",
    body: "Give clips a sense of room and width so the audio matches the image, not just the caption.",
  },
  {
    icon: MicrophoneStage,
    title: "Quick audio clean-ups",
    body: "Gentle tone and level shaping for voice recordings before they go to the next step.",
  },
];

export function FeatureGrid({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2", className)}>
      {useCases.map((useCase) => (
        <div key={useCase.title} className="bg-surface p-6 sm:p-8">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-raised text-violet">
            <useCase.icon aria-hidden="true" size={20} weight="duotone" />
          </span>
          <h3 className="mt-4 text-base font-semibold tracking-tight text-fg">{useCase.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{useCase.body}</p>
        </div>
      ))}
    </div>
  );
}




