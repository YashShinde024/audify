import {
  ArrowDown,
  CheckCircle,
  DownloadSimple,
  FileAudio,
} from "@phosphor-icons/react/dist/ssr";
import { PresetIcon } from "@/components/icons/preset-icons";

export function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-lg lg:max-w-none">
      {/* Studio hardware-inspired transformation panel */}
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-line pb-3 text-xs text-muted">
          <span className="font-mono uppercase tracking-wider text-[11px] font-semibold text-fg">
            Workflow Preview
          </span>
          <span className="rounded bg-raised px-2 py-0.5 text-[10px] font-medium text-violet">
            Browser DSP Pipeline
          </span>
        </div>

        {/* Step 1: Input Track */}
        <div className="mt-4 rounded-xl border border-line bg-deep/50 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-fg">
                <FileAudio className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-fg font-mono">sunset_demo_take3.wav</p>
                <p className="text-[11px] text-muted">Original audio · 8.4 MB · 44.1 kHz</p>
              </div>
            </div>
            <span className="rounded bg-surface border border-line px-2 py-0.5 text-[10px] text-muted">
              Input
            </span>
          </div>
        </div>

        {/* Directional Step Connector */}
        <div className="my-2.5 flex items-center justify-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface text-muted">
            <ArrowDown className="h-3 w-3" />
          </div>
        </div>

        {/* Step 2: Transformation / DSP node */}
        <div className="rounded-xl border border-violet/30 bg-violet/[0.04] p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PresetIcon presetId="slowed-reverb" size={16} className="text-violet" />
              <span className="text-xs font-semibold text-violet">
                Preset: Slowed + Reverb
              </span>
            </div>
            <span className="rounded bg-violet/15 px-2 py-0.5 text-[10px] font-semibold text-violet">
              Active DSP
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-2 text-[11px]">
            <div className="rounded border border-line bg-surface p-2">
              <span className="text-muted block text-[10px]">Tempo</span>
              <span className="font-mono font-medium text-fg">80%</span>
            </div>
            <div className="rounded border border-line bg-surface p-2">
              <span className="text-muted block text-[10px]">Reverb Mix</span>
              <span className="font-mono font-medium text-fg">40%</span>
            </div>
            <div className="rounded border border-line bg-surface p-2">
              <span className="text-muted block text-[10px]">Room Size</span>
              <span className="font-mono font-medium text-fg">70%</span>
            </div>
          </div>
        </div>

        {/* Directional Step Connector */}
        <div className="my-2.5 flex items-center justify-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface text-muted">
            <ArrowDown className="h-3 w-3" />
          </div>
        </div>

        {/* Step 3: Finished Output Track */}
        <div className="rounded-xl border border-line bg-surface p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet text-white">
                <CheckCircle className="h-4 w-4" weight="bold" />
              </div>
              <div>
                <p className="text-xs font-semibold text-fg font-mono">
                  svaraya-slowed-reverb-sunset.wav
                </p>
                <p className="text-[11px] text-muted">WAV 16-bit PCM · Ready to export</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-raised border border-line px-2.5 py-1 text-[11px] font-medium text-fg">
              <DownloadSimple className="h-3 w-3 text-violet" />
              Download
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
