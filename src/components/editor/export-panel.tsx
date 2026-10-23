"use client";

import { useMemo } from "react";
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
} from "@phosphor-icons/react";
import type {
  ExportFormat,
  ExportProfile,
  WavBitDepth,
  Mp3Bitrate,
  ExportSampleRate,
} from "@/types/export";

const FORMATS: Array<{ id: ExportFormat; label: string; hint: string }> = [
  { id: "wav", label: "WAV", hint: "PCM / float" },
  { id: "mp3", label: "MP3", hint: "Lossy CBR" },
  { id: "aiff", label: "AIFF", hint: "Big-endian PCM" },
];

const PROFILES: Array<{ id: ExportProfile; label: string }> = [
  { id: "sharing", label: "Sharing" },
  { id: "standard", label: "Standard" },
  { id: "production", label: "Production" },
];

function OptionButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 rounded-md border px-2 py-2 text-center text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-accent bg-accent-soft text-fg"
          : "border-line bg-canvas text-muted hover:border-line-strong hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  children,
  hint,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2 rounded-lg border border-line bg-canvas p-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium text-fg">{label}</span>
        <span className="font-mono text-[11px] uppercase tracking-wide text-muted">{value}</span>
      </div>
      {children}
      {hint && <p className="text-[11px] leading-snug text-faint">{hint}</p>}
    </div>
  );
}

export function ExportPanel() {
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
  const mp3SampleRateBlocked = isMp3 && exportConfig.sampleRate === 96000;

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
    // MP3 cannot encode 96 kHz: fall back to 48 kHz instead of silently failing.
    if (format === "mp3" && exportConfig.sampleRate === 96000) {
      setExportConfig({ format, sampleRate: 48000 });
      return;
    }
    setExportConfig({ format });
  };

  const qualityValue =
    exportConfig.format === "wav"
      ? exportConfig.wavBitDepth === 32
        ? "32-bit float"
        : `${exportConfig.wavBitDepth}-bit PCM`
      : exportConfig.format === "aiff"
        ? `${exportConfig.aiffBitDepth}-bit PCM`
        : `${exportConfig.mp3Bitrate} kbps CBR`;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal aria-hidden="true" size={16} className="text-accent" />
            <h3 className="text-sm font-semibold text-fg">Export configuration</h3>
          </div>
          <p className="mt-1 text-xs text-muted">
            The rendered file matches these settings exactly — container, rate, channels, and
            quality.
          </p>
        </div>

        <div
          role="group"
          aria-label="Export profile"
          className="flex shrink-0 items-center gap-1 self-start rounded-lg border border-line bg-canvas p-1 sm:self-auto"
        >
          {PROFILES.map((profile) => (
            <button
              key={profile.id}
              type="button"
              aria-pressed={exportConfig.profile === profile.id}
              onClick={() => applyExportProfile(profile.id)}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                exportConfig.profile === profile.id
                  ? "bg-accent font-medium text-white"
                  : "text-muted hover:text-fg"
              }`}
            >
              {profile.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Container format" value={exportConfig.format}>
          <div className="grid grid-cols-3 gap-1.5">
            {FORMATS.map((format) => (
              <OptionButton
                key={format.id}
                active={exportConfig.format === format.id}
                onClick={() => changeFormat(format.id)}
              >
                <span className="font-semibold">{format.label}</span>
                <span className="text-[10px] text-faint">{format.hint}</span>
              </OptionButton>
            ))}
          </div>
        </Field>

        <Field label="Quality" value={qualityValue}>
          {exportConfig.format === "wav" && (
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { depth: 16 as WavBitDepth, label: "16-bit", hint: "CD" },
                { depth: 24 as WavBitDepth, label: "24-bit", hint: "Studio" },
                { depth: 32 as WavBitDepth, label: "32-bit", hint: "Float" },
              ].map((item) => (
                <OptionButton
                  key={item.depth}
                  active={exportConfig.wavBitDepth === item.depth}
                  onClick={() => setExportConfig({ wavBitDepth: item.depth })}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[10px] text-faint">{item.hint}</span>
                </OptionButton>
              ))}
            </div>
          )}

          {exportConfig.format === "mp3" && (
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { rate: 128 as Mp3Bitrate, label: "128k" },
                { rate: 192 as Mp3Bitrate, label: "192k" },
                { rate: 256 as Mp3Bitrate, label: "256k" },
                { rate: 320 as Mp3Bitrate, label: "320k" },
              ].map((item) => (
                <OptionButton
                  key={item.rate}
                  active={exportConfig.mp3Bitrate === item.rate}
                  onClick={() => setExportConfig({ mp3Bitrate: item.rate })}
                >
                  <span className="font-medium">{item.label}</span>
                </OptionButton>
              ))}
            </div>
          )}

          {exportConfig.format === "aiff" && (
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { depth: 16 as const, label: "16-bit", hint: "Standard" },
                { depth: 24 as const, label: "24-bit", hint: "High-res" },
              ].map((item) => (
                <OptionButton
                  key={item.depth}
                  active={exportConfig.aiffBitDepth === item.depth}
                  onClick={() => setExportConfig({ aiffBitDepth: item.depth })}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[10px] text-faint">{item.hint}</span>
                </OptionButton>
              ))}
            </div>
          )}
        </Field>

        <Field
          label="Sample rate"
          value={
            exportConfig.sampleRate === 0
              ? `Source · ${(sourceSampleRate / 1000).toFixed(1)} kHz`
              : `${exportConfig.sampleRate / 1000} kHz`
          }
          hint={
            mp3SampleRateBlocked
              ? "MP3 cannot encode 96 kHz. Pick 44.1 or 48 kHz, or switch to WAV/AIFF."
              : exportConfig.sampleRate === 96000
                ? "Resampled with a windowed-sinc kernel. Higher rates do not add detail that was not in the source."
                : "Resampling runs only when the target rate differs from the source."
          }
        >
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {[
              { rate: 0 as ExportSampleRate, label: "Match" },
              { rate: 44100 as ExportSampleRate, label: "44.1k" },
              { rate: 48000 as ExportSampleRate, label: "48k" },
              { rate: 96000 as ExportSampleRate, label: "96k" },
            ].map((option) => (
              <OptionButton
                key={option.rate}
                active={exportConfig.sampleRate === option.rate}
                disabled={isMp3 && option.rate === 96000}
                title={isMp3 && option.rate === 96000 ? "MP3 supports up to 48 kHz" : undefined}
                onClick={() => setExportConfig({ sampleRate: option.rate })}
              >
                <span className="font-medium">{option.label}</span>
              </OptionButton>
            ))}
          </div>
        </Field>

        <Field
          label="Channels"
          value={exportConfig.channels}
          hint={
            exportConfig.channels === "mono"
              ? "Downmixed to 0.5 × (L + R). Stereo-only effects run before the downmix."
              : "Stereo is preserved end to end. Mono sources are never faked into stereo."
          }
        >
          <div className="grid grid-cols-2 gap-1.5">
            <OptionButton
              active={exportConfig.channels === "stereo"}
              onClick={() => setExportConfig({ channels: "stereo" })}
            >
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Stack size={12} aria-hidden="true" />
                Stereo
              </span>
              <span className="text-[10px] text-faint">2 channels</span>
            </OptionButton>
            <OptionButton
              active={exportConfig.channels === "mono"}
              onClick={() => setExportConfig({ channels: "mono" })}
            >
              <span className="font-medium">Mono</span>
              <span className="text-[10px] text-faint">1 channel</span>
            </OptionButton>
          </div>
        </Field>
      </div>

      <div className="space-y-3 rounded-lg border border-line bg-canvas p-3.5">
        <div className="flex flex-col justify-between gap-3 border-b border-line pb-3 sm:flex-row sm:items-center">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" size={15} className="text-accent" />
              <span className="text-xs font-medium text-fg">Peak protection</span>
            </div>
            <p className="text-[11px] leading-snug text-muted">
              Look-ahead limiter (5 ms, 80 ms release) holding the final samples under −0.3 dBFS.
              Sample-peak, not true-peak: inter-sample overshoots are not measured.
            </p>
          </div>
          <Switch
            checked={exportConfig.peakProtection}
            onCheckedChange={(checked) => setExportConfig({ peakProtection: checked })}
            aria-label="Peak protection limiter"
          />
        </div>

        <div className="flex flex-col justify-between gap-3 border-b border-line pb-3 sm:flex-row sm:items-center">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sparkle aria-hidden="true" size={15} className="text-accent" />
              <span className="text-xs font-medium text-fg">Peak normalize</span>
            </div>
            <p className="text-[11px] leading-snug text-muted">
              Applies make-up gain so the loudest sample sits at −0.5 dBFS. Peak-based only — it
              does not match perceived loudness (no LUFS).
            </p>
          </div>
          <Switch
            checked={exportConfig.peakNormalize}
            onCheckedChange={(checked) => setExportConfig({ peakNormalize: checked })}
            aria-label="Peak normalization"
          />
        </div>

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div className="w-full space-y-1 sm:max-w-md">
            <label htmlFor="export-filename" className="text-xs font-medium text-fg">
              Custom filename <span className="font-normal text-faint">(optional)</span>
            </label>
            <input
              id="export-filename"
              type="text"
              placeholder={`audify-${presetSlug}-${baseName}.${exportConfig.format}`}
              value={exportConfig.outputFilename}
              onChange={(event) => setExportConfig({ outputFilename: event.target.value })}
              className="w-full rounded-md border border-line bg-raised px-3 py-1.5 font-mono text-xs text-fg placeholder:text-faint focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
            <p className="flex items-start gap-1.5 text-[11px] text-faint">
              <Info aria-hidden="true" size={12} className="mt-0.5 shrink-0" />
              Leave empty to use the preset name and source filename. The correct extension is
              added automatically.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-start rounded-md border border-line bg-raised px-3 py-1.5 sm:self-auto">
            <DownloadSimple aria-hidden="true" size={16} className="text-muted" />
            <div>
              <span className="block text-[10px] font-medium uppercase tracking-wide text-faint">
                Estimated size
              </span>
              <span className="font-mono text-xs font-semibold text-fg">{estimatedSize}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="flex items-start gap-1.5 text-[11px] text-faint">
        <FileAudio aria-hidden="true" size={13} className="mt-0.5 shrink-0" />
        {exportConfig.format === "mp3"
          ? "MP3 is encoded with lamejs at the selected CBR bitrate. 32, 44.1 and 48 kHz are supported."
          : "WAV and AIFF are written as uncompressed PCM with verified headers."}{" "}
        Opus is not offered yet.
      </p>
    </div>
  );
}
