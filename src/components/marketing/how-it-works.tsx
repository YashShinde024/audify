import React from "react";
import {
  UploadSimple,
  Faders,
  Play,
  Cpu,
  FileAudio,
  DownloadSimple,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import type { IconWeight } from "@phosphor-icons/react";

interface Step {
  icon: React.ComponentType<{ size?: number | string; weight?: IconWeight; className?: string }>;
  title: string;
  body: string;
}

const steps: Step[] = [
  {
    icon: UploadSimple,
    title: "1. Upload audio file",
    body: "Choose an MP3, WAV, OGG, FLAC, or AAC track up to 10 MB. Decoded instantly in client browser memory.",
  },
  {
    icon: Faders,
    title: "2. Choose a sound",
    body: "Select from 36 curated tools and presets across 9 categories or sculpt custom DSP parameters.",
  },
  {
    icon: Play,
    title: "3. Preview & A/B audition",
    body: "Audition the original dry source with genuine peak waveform scrubbing before committing to render.",
  },
  {
    icon: Cpu,
    title: "4. Process audio",
    body: "Our Web Audio DSP engine executes filters, convolution, and 8D spatial motion in OfflineAudioContext.",
  },
  {
    icon: FileAudio,
    title: "5. Choose export settings",
    body: "Format-aware options: WAV (16/24/32-bit float), MP3 (128–320 kbps), AIFF, mono downmixing, and peak protection.",
  },
  {
    icon: DownloadSimple,
    title: "6. Download finished master",
    body: "Download the rendered binary Blob directly from your browser. Zero cloud uploads, zero waitlists.",
  },
];

export function HowItSteps({ className }: { className?: string }) {
  return (
    <ol className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="relative rounded-xl border border-line bg-canvas p-5 flex flex-col justify-between hover:border-violet/40 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-violet">
                <step.icon aria-hidden="true" size={20} weight="duotone" />
              </span>
              <span aria-hidden="true" className="tnum font-mono text-xs font-semibold text-faint">
                0{index + 1}
              </span>
            </div>
            <h3 className="mt-3.5 text-sm font-semibold tracking-tight text-fg">{step.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}




