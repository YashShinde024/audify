"use client";

import { useMemo } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { estimateExportFileSize } from "@/lib/audio-engine";
import { Switch } from "@/components/ui/switch";
import {
  FileAudio,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
  Stack,
  DownloadSimple,
  Info,
} from "@phosphor-icons/react";
import type { ExportFormat, ExportProfile, WavBitDepth, Mp3Bitrate, ExportSampleRate } from "@/types/export";

export function ExportPanel() {
  const {
    exportConfig,
    setExportConfig,
    applyExportProfile,
    decodedAudio,
    file,
  } = useEditorStore();

  const duration = decodedAudio?.duration || 0;
  const sourceSampleRate = decodedAudio?.sampleRate || 44100;
  const baseName = file?.name ? file.name.replace(/\.[^/.]+$/, "") : "audio";

  const estimatedSize = useMemo(() => {
    return estimateExportFileSize(
      duration,
      exportConfig.format,
      exportConfig.wavBitDepth,
      exportConfig.mp3Bitrate,
      exportConfig.sampleRate,
      exportConfig.channels
    );
  }, [
    duration,
    exportConfig.format,
    exportConfig.wavBitDepth,
    exportConfig.mp3Bitrate,
    exportConfig.sampleRate,
    exportConfig.channels,
  ]);

  return (
    <div className="space-y-6">
      {/* Header & Quick Profiles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-neutral-100 tracking-wide uppercase">
              Export Configuration
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Format-dependent encoding, channel downmixing, and sample rate mastering.
          </p>
        </div>

        {/* Profiles */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-neutral-900/90 p-1 rounded-lg border border-neutral-800">
          <button
            type="button"
            onClick={() => applyExportProfile("sharing")}
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              exportConfig.profile === "sharing"
                ? "bg-violet-600 text-white font-medium"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Sharing
          </button>
          <button
            type="button"
            onClick={() => applyExportProfile("standard")}
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              exportConfig.profile === "standard"
                ? "bg-violet-600 text-white font-medium"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Standard
          </button>
          <button
            type="button"
            onClick={() => applyExportProfile("production")}
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              exportConfig.profile === "production"
                ? "bg-violet-600 text-white font-medium"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Production
          </button>
        </div>
      </div>

      {/* Grid of Main Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Format Selection */}
        <div className="space-y-2 bg-neutral-900/50 p-3.5 rounded-lg border border-neutral-800/80">
          <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
            <span>Container Format</span>
            <span className="text-[11px] font-mono text-violet-400 uppercase">
              {exportConfig.format}
            </span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "wav", label: "WAV", hint: "Uncompressed PCM" },
              { id: "mp3", label: "MP3", hint: "MPEG-1 Layer 3" },
              { id: "aiff", label: "AIFF", hint: "Apple Big-Endian" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setExportConfig({ format: f.id as ExportFormat })}
                className={`flex flex-col items-center justify-center p-2 rounded border text-center transition-all ${
                  exportConfig.format === f.id
                    ? "bg-violet-950/60 border-violet-500 text-white shadow-sm"
                    : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                }`}
              >
                <span className="text-xs font-semibold">{f.label}</span>
                <span className="text-[10px] text-neutral-400 mt-0.5">{f.hint}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Format-Specific Quality Controls */}
        <div className="space-y-2 bg-neutral-900/50 p-3.5 rounded-lg border border-neutral-800/80">
          {exportConfig.format === "wav" && (
            <>
              <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
                <span>PCM Bit Depth</span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {exportConfig.wavBitDepth === 32 ? "IEEE Float" : `${exportConfig.wavBitDepth}-bit Integer`}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { depth: 16, label: "16-bit", tag: "CD Audio" },
                  { depth: 24, label: "24-bit", tag: "Studio Res" },
                  { depth: 32, label: "32-bit", tag: "32-bit Float" },
                ].map((item) => (
                  <button
                    key={item.depth}
                    type="button"
                    onClick={() => setExportConfig({ wavBitDepth: item.depth as WavBitDepth })}
                    className={`p-2 rounded border text-center transition-all ${
                      exportConfig.wavBitDepth === item.depth
                        ? "bg-violet-950/60 border-violet-500 text-white"
                        : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{item.tag}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {exportConfig.format === "mp3" && (
            <>
              <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
                <span>CBR Encoding Bitrate</span>
                <span className="text-[11px] font-mono text-neutral-400">{exportConfig.mp3Bitrate} kbps</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { rate: 128, label: "128k", hint: "Compact" },
                  { rate: 192, label: "192k", hint: "Good" },
                  { rate: 256, label: "256k", hint: "High" },
                  { rate: 320, label: "320k", hint: "Max" },
                ].map((item) => (
                  <button
                    key={item.rate}
                    type="button"
                    onClick={() => setExportConfig({ mp3Bitrate: item.rate as Mp3Bitrate })}
                    className={`p-1.5 rounded border text-center transition-all ${
                      exportConfig.mp3Bitrate === item.rate
                        ? "bg-violet-950/60 border-violet-500 text-white"
                        : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="text-[9px] text-neutral-400">{item.hint}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {exportConfig.format === "aiff" && (
            <>
              <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
                <span>AIFF Bit Depth (Big-Endian)</span>
                <span className="text-[11px] font-mono text-neutral-400">{exportConfig.aiffBitDepth}-bit PCM</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { depth: 16, label: "16-bit Integer", hint: "Standard Audio" },
                  { depth: 24, label: "24-bit Integer", hint: "High-Res Master" },
                ].map((item) => (
                  <button
                    key={item.depth}
                    type="button"
                    onClick={() => setExportConfig({ aiffBitDepth: item.depth as 16 | 24 })}
                    className={`p-2 rounded border text-center transition-all ${
                      exportConfig.aiffBitDepth === item.depth
                        ? "bg-violet-950/60 border-violet-500 text-white"
                        : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="text-[10px] text-neutral-400">{item.hint}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 3. Sample Rate */}
        <div className="space-y-2 bg-neutral-900/50 p-3.5 rounded-lg border border-neutral-800/80">
          <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
            <span>Sample Rate</span>
            <span className="text-[11px] font-mono text-neutral-400">
              {exportConfig.sampleRate === 0
                ? `${sourceSampleRate} Hz (Source)`
                : `${exportConfig.sampleRate / 1000} kHz`}
            </span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { rate: 0, label: "Match Source" },
              { rate: 44100, label: "44.1 kHz (CD)" },
              { rate: 48000, label: "48.0 kHz (Video)" },
            ].map((sr) => (
              <button
                key={sr.rate}
                type="button"
                onClick={() => setExportConfig({ sampleRate: sr.rate as ExportSampleRate })}
                className={`p-2 rounded border text-center transition-all ${
                  exportConfig.sampleRate === sr.rate
                    ? "bg-violet-950/60 border-violet-500 text-white"
                    : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                }`}
              >
                <div className="text-xs font-medium">{sr.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Channels */}
        <div className="space-y-2 bg-neutral-900/50 p-3.5 rounded-lg border border-neutral-800/80">
          <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
            <span>Audio Channels</span>
            <span className="text-[11px] font-mono text-neutral-400 capitalize">
              {exportConfig.channels}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setExportConfig({ channels: "stereo" })}
              className={`p-2 rounded border text-center transition-all ${
                exportConfig.channels === "stereo"
                  ? "bg-violet-950/60 border-violet-500 text-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
              }`}
            >
              <div className="text-xs font-medium">Stereo</div>
              <div className="text-[10px] text-neutral-400">2 Channels (L + R)</div>
            </button>
            <button
              type="button"
              onClick={() => setExportConfig({ channels: "mono" })}
              className={`p-2 rounded border text-center transition-all ${
                exportConfig.channels === "mono"
                  ? "bg-violet-950/60 border-violet-500 text-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
              }`}
            >
              <div className="text-xs font-medium">Mono Downmix</div>
              <div className="text-[10px] text-neutral-400">0.5 * (L + R) Summed</div>
            </button>
          </div>
        </div>
      </div>

      {/* Mastering Toggles & Output Filename */}
      <div className="space-y-3 bg-neutral-900/30 p-3.5 rounded-lg border border-neutral-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/60">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-neutral-200">Peak Protection Ceiling</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Soft-knee saturation limits peaks above -0.1 dBFS, preventing harsh digital clipping.
            </p>
          </div>
          <Switch
            checked={exportConfig.peakProtection}
            onCheckedChange={(checked) => setExportConfig({ peakProtection: checked })}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/60">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sparkle size={16} weight="duotone" className="text-violet-400" />
              <span className="text-xs font-medium text-neutral-200">Loudness Normalization</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Applies clean make-up gain so maximum peak amplitude touches -0.5 dBFS headroom.
            </p>
          </div>
          <Switch
            checked={exportConfig.loudnessNormalize}
            onCheckedChange={(checked) => setExportConfig({ loudnessNormalize: checked })}
          />
        </div>

        {/* Output Filename & Estimated Size */}
        <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="w-full sm:max-w-md space-y-1">
            <label className="text-xs font-medium text-neutral-300">
              Custom Export Filename (Optional)
            </label>
            <input
              type="text"
              placeholder={`svaraya-master-${baseName}.${exportConfig.format}`}
              value={exportConfig.outputFilename}
              onChange={(e) => setExportConfig({ outputFilename: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-1.5 rounded focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto bg-neutral-900/80 px-3 py-1.5 rounded border border-neutral-800">
            <DownloadSimple size={16} className="text-neutral-400" />
            <div>
              <span className="text-[10px] uppercase text-neutral-400 block font-medium">Est. File Size</span>
              <span className="text-xs font-mono font-semibold text-neutral-200">{estimatedSize}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
