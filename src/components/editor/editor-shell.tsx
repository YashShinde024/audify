"use client";

import { AudioUploader } from "./audio-uploader";
import { AudioPlayer } from "./audio-player";
import { SoundSelector } from "./sound-selector";
import { ProcessAndOutput } from "./process-and-output";
import { AdPlaceholder } from "@/components/advertising/ad-placeholder";
import { useEditorStore } from "@/stores/editor-store";
import {
  UploadSimple,
  Faders,
  Play,
  Cpu,
  FileAudio,
  DownloadSimple,
} from "@phosphor-icons/react";

export function EditorShell() {
  const file = useEditorStore((s) => s.file);
  const isProcessing = useEditorStore((s) => s.isProcessing);
  const processedResult = useEditorStore((s) => s.processedResult);

  // Determine current active step (1 to 6)
  let currentStep = 1;
  if (file) currentStep = 2;
  if (file && isProcessing) currentStep = 4;
  if (processedResult) currentStep = 6;

  const steps = [
    { num: 1, label: "Upload File", icon: UploadSimple },
    { num: 2, label: "Choose Sound", icon: Faders },
    { num: 3, label: "Preview Track", icon: Play },
    { num: 4, label: "Process Audio", icon: Cpu },
    { num: 5, label: "Export Settings", icon: FileAudio },
    { num: 6, label: "Download", icon: DownloadSimple },
  ];

  return (
    <div id="editor" className="py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Studio Editorial Intro */}
        <header className="mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-violet">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" />
            Browser-based DSP Workspace
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Svaraya Studio
          </h1>
          <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted">
            Upload an audio track, choose or fine-tune sound effects, process with our client-side audio engine,
            and download the finished master.
          </p>
        </header>

        {/* 6-Step Workflow Guide Indicator */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center justify-between min-w-[620px] rounded-xl border border-line/80 bg-deep/60 p-2 backdrop-blur-sm">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div key={step.num} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-colors ${
                      isCurrent
                        ? "bg-violet text-white font-semibold shadow-xs"
                        : isPast
                        ? "bg-violet/10 font-medium text-violet"
                        : "text-faint hover:text-muted"
                    }`}
                  >
                    <Icon size={14} weight={isCurrent ? "duotone" : "regular"} />
                    <span>{step.label}</span>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="h-px w-4 bg-line-strong" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* The Guided Processing Workflow Components */}
        <div className="space-y-6">
          {/* Step 1: Input Audio File */}
          <AudioUploader />

          {/* When file is uploaded, render subsequent steps */}
          {file && (
            <>
              {/* Step 2 & 3: Original Track Preview & Sound Selection */}
              {!processedResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Source Track Audition
                    </p>
                    <span className="text-[11px] text-faint">Decoded PCM buffer</span>
                  </div>
                  <AudioPlayer />
                </div>
              )}

              {/* Step 2: Choose Sound / Preset / DSP Customization */}
              {!processedResult && <SoundSelector />}

              {/* Step 4, 5 & 6: Export Configuration, Process Audio, & Download */}
              <ProcessAndOutput />
            </>
          )}
        </div>

        {/* Respectful Ad Slot placed cleanly below the entire editing experience */}
        <div className="mt-14 border-t border-line pt-8">
          <AdPlaceholder
            size="banner"
            note="Unobtrusive banner placement strictly below all workspace controls"
          />
        </div>
      </div>
    </div>
  );
}
