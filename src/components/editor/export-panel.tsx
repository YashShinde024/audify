"use client";

import { useMemo, useState } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { estimateExportFileSize } from "@/lib/audio-engine";
import { Switch } from "@/components/ui/switch";
import { getPresetById } from "@/config/presets";
import {
  FileAudio,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
  Stack,
  DownloadSimple,
  Info,
  CaretDown,
  CaretUp,
  Faders,
} from "@phosphor-icons/react";
import type {
  ExportFormat,
  ExportProfile,
  WavBitDepth,
  Mp3Bitrate,
  ExportSampleRate,
} from "@/types/export";
import { cn } from "@/lib/utils";
import { SoundSettings } from "@/components/ui/sound-settings";
import { formatExportFilename } from "@/lib/audio/export-filename";

const FORMATS: Array<{ id: ExportFormat; label: string; hint: string }> = [
  { id: "wav", label: "WAV", hint: "Lossless PCM" },
  { id: "mp3", label: "MP3", hint: "Universal CBR" },
  { id: "aiff", label: "AIFF", hint: "Broadcast PCM" },
];

const PROFILES: Array<{ id: ExportProfile; label: string }> = [
  { id: "sharing", label: "Sharing" },
  { id: "standard", label: "Standard" },
  { id: "production", label: "Studio Master" },
];

export function ExportPanel() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const exportConfig = useEditorStore((s) => s.exportConfig);
  const setExportConfig = useEditorStore((s) => s.setExportConfig);
  const applyExportProfile = useEditorStore((s) => s.applyExportProfile);
  const decodedAudio = useEditorStore((s) => s.decodedAudio);
  const file = useEditorStore((s) => s.file);
  const selectedPresetId = useEditorStore((s) => s.selectedPresetId);

  const duration = decodedAudio?.duration || 0;
  const sourceSampleRate = decodedAudio?.sampleRate || 44100;
  const baseName = file?.name ? file.name.replace(/\.[^/.]+$/, "") : "audio";
  const presetSlug = getPresetById(selectedPresetId ?? "")?.id ?? "studio";
  const isMp3 = exportConfig.format === "mp3";

  const estimatedSize = useMemo(
    () =>
      estimateExportFileSize(
        duration,
        exportConfig.format,
        exportConfig.format === "aiff" ? exportConfig.aiffBitDepth : exportConfig.wavBitDepth,
        exportConfig.mp3Bitrate,
        exportConfig.sampleRate,
        exportConfig.channels,
      ),
    [
      duration,
      exportConfig.format,
      exportConfig.aiffBitDepth,
      exportConfig.wavBitDepth,
      exportConfig.mp3Bitrate,
      exportConfig.sampleRate,
      exportConfig.channels,
    ],
  );

  const changeFormat = (format: ExportFormat) => {
    if (format === "mp3" && exportConfig.sampleRate === 96000) {
      setExportConfig({ format, sampleRate: 48000 });
      return;
    }
    setExportConfig({ format });
  };

  return (
    <div className="space-y-3.5">
      {/* Top Header: Title & Profile Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-line">
        <div className="flex items-center gap-2">
          <Faders size={15} className="text-primary shrink-0" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-fg">
            Master Export Format
          </h4>
        </div>

        {/* Profiles Pill Group */}
        <div
          role="group"
          aria-label="Export profile presets"
          className="flex items-center gap-1 rounded-lg border border-line bg-canvas/80 p-0.5"
        >
          {PROFILES.map((profile) => (
            <button
              key={profile.id}
              type="button"
              aria-pressed={exportConfig.profile === profile.id}
              onClick={() => applyExportProfile(profile.id)}
              className={cn(
                "rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer",
                exportConfig.profile === profile.id
                  ? "bg-primary text-white font-semibold shadow-xs"
                  : "text-muted hover:text-fg",
              )}
            >
              {profile.label}
            </button>
          ))}
        </div>
      </div>

      {/* Format Selector: 3 Segments */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-3 gap-1.5">
          {FORMATS.map((format) => {
            const isSelected = exportConfig.format === format.id;
            return (
              <button
                key={format.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => changeFormat(format.id)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-line bg-canvas hover:bg-raised text-muted hover:text-fg",
                )}
              >
                <span className="text-xs">{format.label}</span>
                <span className="text-[10px] opacity-75 font-normal">{format.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bit Depth / Bitrate & Sample Rate (Compact 2-col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Bit Depth or MP3 Bitrate */}
        <div className="rounded-xl border border-line bg-canvas p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-fg">Bit Resolution</span>
            <span className="font-mono text-muted uppercase">
              {exportConfig.format === "wav"
                ? exportConfig.wavBitDepth === 32
                  ? "32-bit float"
                  : `${exportConfig.wavBitDepth}-bit`
                : exportConfig.format === "aiff"
                  ? `${exportConfig.aiffBitDepth}-bit`
                  : `${exportConfig.mp3Bitrate} kbps`}
            </span>
          </div>

          {exportConfig.format === "wav" && (
            <div className="grid grid-cols-3 gap-1">
              {([16, 24, 32] as WavBitDepth[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setExportConfig({ wavBitDepth: d })}
                  className={cn(
                    "py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer text-center",
                    exportConfig.wavBitDepth === d
                      ? "bg-surface border-primary text-primary font-bold shadow-xs"
                      : "border-line bg-raised/50 text-muted hover:text-fg",
                  )}
                >
                  {d === 32 ? "32-bit Float" : `${d}-bit`}
                </button>
              ))}
            </div>
          )}

          {exportConfig.format === "mp3" && (
            <div className="grid grid-cols-4 gap-1">
              {([128, 192, 256, 320] as Mp3Bitrate[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setExportConfig({ mp3Bitrate: r })}
                  className={cn(
                    "py-1 rounded-md text-[10px] font-medium border transition-colors cursor-pointer text-center font-mono",
                    exportConfig.mp3Bitrate === r
                      ? "bg-surface border-primary text-primary font-bold shadow-xs"
                      : "border-line bg-raised/50 text-muted hover:text-fg",
                  )}
                >
                  {r}k
                </button>
              ))}
            </div>
          )}

          {exportConfig.format === "aiff" && (
            <div className="grid grid-cols-2 gap-1">
              {([16, 24] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setExportConfig({ aiffBitDepth: d })}
                  className={cn(
                    "py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer text-center",
                    exportConfig.aiffBitDepth === d
                      ? "bg-surface border-primary text-primary font-bold shadow-xs"
                      : "border-line bg-raised/50 text-muted hover:text-fg",
                  )}
                >
                  {d}-bit PCM
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sample Rate */}
        <div className="rounded-xl border border-line bg-canvas p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-fg">Sample Rate</span>
            <span className="font-mono text-muted">
              {exportConfig.sampleRate === 0
                ? `${(sourceSampleRate / 1000).toFixed(1)}k (Source)`
                : `${exportConfig.sampleRate / 1000} kHz`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {[
              { rate: 0 as ExportSampleRate, label: "Match" },
              { rate: 44100 as ExportSampleRate, label: "44.1k" },
              { rate: 48000 as ExportSampleRate, label: "48k" },
              { rate: 96000 as ExportSampleRate, label: "96k" },
            ].map((opt) => (
              <button
                key={opt.rate}
                type="button"
                disabled={isMp3 && opt.rate === 96000}
                onClick={() => setExportConfig({ sampleRate: opt.rate })}
                className={cn(
                  "py-1 rounded-md text-[10px] font-medium border transition-colors cursor-pointer text-center font-mono disabled:opacity-30 disabled:cursor-not-allowed",
                  exportConfig.sampleRate === opt.rate
                    ? "bg-surface border-primary text-primary font-bold shadow-xs"
                    : "border-line bg-raised/50 text-muted hover:text-fg",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collapsible Advanced Mastering & Options Toggle */}
      <div className="rounded-xl border border-line bg-canvas overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-2.5 text-xs text-muted hover:text-fg transition-colors cursor-pointer select-none"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck size={14} className="text-primary" />
            <span>Mastering Safeguards &amp; Output Options</span>
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-faint">
            {exportConfig.peakProtection ? "Limiter Armed" : "Limiter Off"} · {exportConfig.channels}
            {showAdvanced ? <CaretUp size={12} /> : <CaretDown size={12} />}
          </span>
        </button>

        {showAdvanced && (
          <div className="p-3 border-t border-line/70 space-y-3 bg-surface/40">
            {/* Peak Limiter Switch */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div>
                <label htmlFor="peak-limiter-toggle" className="font-semibold text-fg cursor-pointer">
                  Look-Ahead Peak Limiter (-0.3 dBFS)
                </label>
                <p className="text-[11px] text-muted">
                  Strict look-ahead ceiling prevents DAC distortion on loud masters.
                </p>
              </div>
              <Switch
                id="peak-limiter-toggle"
                checked={exportConfig.peakProtection}
                onCheckedChange={(checked) => setExportConfig({ peakProtection: checked })}
                aria-label="Look-ahead peak limiter"
              />
            </div>

            {/* Peak Normalize Switch */}
            <div className="flex items-center justify-between gap-3 text-xs pt-2 border-t border-line/50">
              <div>
                <label htmlFor="peak-norm-toggle" className="font-semibold text-fg cursor-pointer">
                  Peak Normalization (-0.5 dBFS)
                </label>
                <p className="text-[11px] text-muted">
                  Scales gain so loudest transient sits safely at -0.5 dBFS headroom.
                </p>
              </div>
              <Switch
                id="peak-norm-toggle"
                checked={exportConfig.peakNormalize}
                onCheckedChange={(checked) => setExportConfig({ peakNormalize: checked })}
                aria-label="Peak headroom normalization"
              />
            </div>

            {/* Channels Switch */}
            <div className="flex items-center justify-between gap-3 text-xs pt-2 border-t border-line/50">
              <div>
                <label htmlFor="mono-toggle" className="font-semibold text-fg cursor-pointer">
                  Mono Downmixing
                </label>
                <p className="text-[11px] text-muted">
                  Sums L + R channels (0.5 * L + 0.5 * R) for mono speaker compatibility.
                </p>
              </div>
              <Switch
                id="mono-toggle"
                checked={exportConfig.channels === "mono"}
                onCheckedChange={(c) => setExportConfig({ channels: c ? "mono" : "stereo" })}
                aria-label="Summed mono downmixing"
              />
            </div>

            {/* Custom Filename */}
            <div className="pt-2 border-t border-line/50 space-y-1">
              <label htmlFor="export-custom-name" className="text-[11px] font-medium text-muted">
                Custom Output Filename (Optional)
              </label>
              <input
                id="export-custom-name"
                type="text"
                placeholder={formatExportFilename({
                  editType: presetSlug,
                  originalFileName: baseName,
                  extension: exportConfig.format,
                })}
                value={exportConfig.outputFilename}
                onChange={(e) => setExportConfig({ outputFilename: e.target.value })}
                className="w-full rounded-lg border border-line bg-raised px-2.5 py-1.5 font-mono text-xs text-fg placeholder:text-faint focus:border-primary focus:outline-none"
              />
            
            </div>

            {/* Completion Sound Preference */}
            <div className="pt-2 border-t border-line/50">
              <SoundSettings variant="inline" />
            </div>
          </div>
        )}
      </div>

      {/* Footer Info: Estimated Size & Privacy */}
      <div className="flex items-center justify-between text-[11px] text-muted pt-1">
        <span className="flex items-center gap-1 font-mono">
          <DownloadSimple size={13} />
          <span>Estimated size: <strong className="text-fg">{estimatedSize}</strong></span>
        </span>
        <span className="font-mono text-[10px] text-faint uppercase">
          Client-Side PCM
        </span>
      </div>
    </div>
  );
}
