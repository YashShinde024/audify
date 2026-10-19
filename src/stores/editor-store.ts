"use client";

import { create } from "zustand";
import { getPresetById, presets } from "@/config/presets";
import {
  decodeAudioFile,
  renderProcessedAudio,
  interpretSoundPrompt,
  type DecodedAudio,
  type ProcessedAudioResult,
} from "@/lib/audio-engine";
import type { EffectValue, EffectValues, Preset, PresetCategoryId, PresetKind } from "@/types/preset";
import { DEFAULT_EXPORT_CONFIG, type ExportConfig, type ExportProfile } from "@/types/export";

export type FileStatus = "none" | "selected";

export interface AudioFileMeta {
  name: string;
  size: number;
  type: string;
  duration?: number;
  sampleRate?: number;
  channels?: number;
  detectedBpm?: number;
}

interface EditorState {
  /* File & Decoding */
  status: FileStatus;
  file: AudioFileMeta | null;
  rawFile: File | null;
  decodedAudio: DecodedAudio | null;
  isDecoding: boolean;
  decodeError: string | null;
  originalAudioUrl: string | null;

  /* Preset, Tool & Sound Search */
  selectedPresetId: string | null;
  activeCategory: PresetCategoryId | "all";
  activeKind: "all" | "preset" | "tool";
  searchQuery: string;
  naturalPrompt: string;
  matchedPromptLabel: string | null;

  /* Effect values for currently selected preset or custom controls */
  effectValues: EffectValues;

  /* Export Configuration */
  exportConfig: ExportConfig;

  /* Processing Lifecycle */
  isProcessing: boolean;
  processingProgress: number; // 0..1
  processingStatus: string;
  processingError: string | null;
  processedResult: ProcessedAudioResult | null;

  /* Real Playback & Comparison State */
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0..100
  showAfter: boolean; // false = original, true = processed

  /* Actions */
  selectFile: (file: File) => Promise<void>;
  clearFile: () => void;

  selectPreset: (presetId: string | null) => void;
  setActiveCategory: (category: PresetCategoryId | "all") => void;
  setActiveKind: (kind: "all" | "preset" | "tool") => void;
  setSearchQuery: (query: string) => void;
  setNaturalPrompt: (prompt: string) => void;
  applyNaturalPrompt: () => boolean;
  setEffectValue: (paramId: string, value: EffectValue) => void;
  resetEffects: () => void;

  /* Export Actions */
  setExportConfig: (partial: Partial<ExportConfig>) => void;
  applyExportProfile: (profile: ExportProfile) => void;

  processAudio: () => Promise<void>;
  clearProcessedResult: () => void;

  togglePlay: (playing?: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleAfter: () => void;
  setShowAfter: (show: boolean) => void;
}

export function defaultValuesFor(presetId: string | null): EffectValues {
  if (!presetId) return {};
  const preset = getPresetById(presetId);
  if (!preset) return {};
  const values: EffectValues = {};
  for (const param of preset.params) {
    values[param.id] = preset.defaults[param.id] ?? (param.kind === "toggle" ? false : 0);
  }
  return values;
}

export function isPresetModified(presetId: string | null, currentValues: EffectValues): boolean {
  if (!presetId) return false;
  const preset = getPresetById(presetId);
  if (!preset) return false;

  for (const [key, defaultVal] of Object.entries(preset.defaults)) {
    if (currentValues[key] !== undefined && currentValues[key] !== defaultVal) {
      return true;
    }
  }
  return false;
}

export function useSelectedPreset(): Preset | null {
  const selectedPresetId = useEditorStore((s) => s.selectedPresetId);
  return getPresetById(selectedPresetId ?? "") ?? null;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  status: "none",
  file: null,
  rawFile: null,
  decodedAudio: null,
  isDecoding: false,
  decodeError: null,
  originalAudioUrl: null,

  selectedPresetId: "slowed-reverb",
  activeCategory: "all",
  activeKind: "all",
  searchQuery: "",
  naturalPrompt: "",
  matchedPromptLabel: null,
  effectValues: defaultValuesFor("slowed-reverb"),

  exportConfig: { ...DEFAULT_EXPORT_CONFIG },

  isProcessing: false,
  processingProgress: 0,
  processingStatus: "Idle",
  processingError: null,
  processedResult: null,

  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 85,
  showAfter: false,

  selectFile: async (file: File) => {
    const prevOrig = get().originalAudioUrl;
    if (prevOrig) URL.revokeObjectURL(prevOrig);
    const prevResult = get().processedResult;
    if (prevResult?.url) URL.revokeObjectURL(prevResult.url);

    const origUrl = URL.createObjectURL(file);

    set({
      status: "selected",
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      rawFile: file,
      originalAudioUrl: origUrl,
      decodedAudio: null,
      isDecoding: true,
      decodeError: null,
      processedResult: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      showAfter: false,
    });

    try {
      const decoded = await decodeAudioFile(file);
      const initialValues = { ...get().effectValues };

      // Initialize trimmer defaults if trimmer tool is selected
      if (get().selectedPresetId === "trimmer-cutter") {
        initialValues["trim-start"] = 0;
        initialValues["trim-end"] = Math.round(decoded.duration);
      }

      set({
        decodedAudio: decoded,
        isDecoding: false,
        duration: decoded.duration,
        effectValues: initialValues,
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          duration: decoded.duration,
          sampleRate: decoded.sampleRate,
          channels: decoded.numberOfChannels,
          detectedBpm: decoded.detectedBpm,
        },
      });
    } catch (err) {
      console.error("Audio decoding error:", err);
      set({
        isDecoding: false,
        decodeError:
          "Could not decode audio data. Please ensure the file is an uncorrupted MP3, WAV, OGG, FLAC, or AAC track under 10 MB.",
      });
    }
  },

  clearFile: () => {
    const prevOrig = get().originalAudioUrl;
    if (prevOrig) URL.revokeObjectURL(prevOrig);
    const prevResult = get().processedResult;
    if (prevResult?.url) URL.revokeObjectURL(prevResult.url);

    set({
      status: "none",
      file: null,
      rawFile: null,
      decodedAudio: null,
      isDecoding: false,
      decodeError: null,
      originalAudioUrl: null,
      processedResult: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      showAfter: false,
      processingError: null,
    });
  },

  selectPreset: (presetId) => {
    const valid = presetId && presets.some((p) => p.id === presetId);
    const finalId = valid ? presetId : null;
    const defaults = defaultValuesFor(finalId);

    // If trimmer, set default end to audio duration if available
    const decoded = get().decodedAudio;
    if (finalId === "trimmer-cutter" && decoded) {
      defaults["trim-start"] = 0;
      defaults["trim-end"] = Math.round(decoded.duration);
    }

    set({
      selectedPresetId: finalId,
      effectValues: defaults,
      matchedPromptLabel: null,
    });
  },

  setActiveCategory: (category) => set({ activeCategory: category }),
  setActiveKind: (kind) => set({ activeKind: kind }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setNaturalPrompt: (prompt) => set({ naturalPrompt: prompt }),

  applyNaturalPrompt: () => {
    const prompt = get().naturalPrompt;
    const match = interpretSoundPrompt(prompt);
    if (match) {
      const defaults = defaultValuesFor(match.presetId);
      const decoded = get().decodedAudio;
      if (match.presetId === "trimmer-cutter" && decoded) {
        defaults["trim-start"] = 0;
        defaults["trim-end"] = Math.round(decoded.duration);
      }

      set({
        selectedPresetId: match.presetId,
        effectValues: defaults,
        matchedPromptLabel: match.matchedLabel,
      });
      return true;
    }
    return false;
  },

  setEffectValue: (paramId, value) =>
    set((state) => ({ effectValues: { ...state.effectValues, [paramId]: value } })),

  resetEffects: () =>
    set((state) => {
      const defaults = defaultValuesFor(state.selectedPresetId);
      if (state.selectedPresetId === "trimmer-cutter" && state.decodedAudio) {
        defaults["trim-start"] = 0;
        defaults["trim-end"] = Math.round(state.decodedAudio.duration);
      }
      return { effectValues: defaults };
    }),

  setExportConfig: (partial) =>
    set((state) => ({
      exportConfig: {
        ...state.exportConfig,
        ...partial,
        profile: partial.profile ?? "custom",
      },
    })),

  applyExportProfile: (profile) => {
    if (profile === "sharing") {
      set((state) => ({
        exportConfig: {
          ...state.exportConfig,
          profile: "sharing",
          format: "mp3",
          mp3Bitrate: 192,
          sampleRate: 44100,
          channels: "stereo",
          loudnessNormalize: true,
          peakProtection: true,
        },
      }));
    } else if (profile === "standard") {
      set((state) => ({
        exportConfig: {
          ...state.exportConfig,
          profile: "standard",
          format: "wav",
          wavBitDepth: 16,
          sampleRate: 0,
          channels: "stereo",
          loudnessNormalize: false,
          peakProtection: true,
        },
      }));
    } else if (profile === "production") {
      set((state) => ({
        exportConfig: {
          ...state.exportConfig,
          profile: "production",
          format: "wav",
          wavBitDepth: 24,
          sampleRate: 48000,
          channels: "stereo",
          loudnessNormalize: false,
          peakProtection: true,
        },
      }));
    }
  },

  processAudio: async () => {
    const { decodedAudio, selectedPresetId, effectValues, file, isProcessing, exportConfig } = get();
    if (!decodedAudio || !file || isProcessing) return;

    set({
      isProcessing: true,
      processingProgress: 0.15,
      processingStatus: "Constructing Web Audio DSP graph…",
      processingError: null,
      isPlaying: false,
    });

    try {
      set({
        processingProgress: 0.35,
        processingStatus: "Configuring Biquad filters, impulses & spatial channels…",
      });

      await new Promise((r) => setTimeout(r, 60));

      set({
        processingProgress: 0.65,
        processingStatus: `Rendering offline & encoding to ${exportConfig.format.toUpperCase()}…`,
      });

      const result = await renderProcessedAudio(
        decodedAudio.buffer,
        selectedPresetId,
        effectValues,
        file.name,
        exportConfig
      );

      set({
        processingProgress: 1.0,
        processingStatus: "Complete",
        isProcessing: false,
        processedResult: result,
        duration: result.duration,
        currentTime: 0,
        showAfter: true,
      });
    } catch (err) {
      console.error("Audio processing failure:", err);
      set({
        isProcessing: false,
        processingProgress: 0,
        processingStatus: "Error",
        processingError:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while processing the audio.",
      });
    }
  },

  clearProcessedResult: () => {
    const prev = get().processedResult;
    if (prev?.url) URL.revokeObjectURL(prev.url);
    const decoded = get().decodedAudio;
    set({
      processedResult: null,
      isPlaying: false,
      currentTime: 0,
      duration: decoded ? decoded.duration : 0,
      showAfter: false,
    });
  },

  togglePlay: (playing) =>
    set((state) => ({ isPlaying: playing ?? !state.isPlaying })),

  setCurrentTime: (time) =>
    set({ currentTime: Math.max(0, Number.isFinite(time) ? time : 0) }),

  setDuration: (duration) =>
    set({ duration: Math.max(0, Number.isFinite(duration) ? duration : 0) }),

  setVolume: (volume) =>
    set({ volume: Math.min(100, Math.max(0, volume)) }),

  toggleAfter: () =>
    set((state) => {
      const nextShowAfter = !state.showAfter;
      const targetDuration =
        nextShowAfter && state.processedResult
          ? state.processedResult.duration
          : state.decodedAudio?.duration || 0;
      return {
        showAfter: nextShowAfter,
        duration: targetDuration,
        currentTime: 0,
        isPlaying: false,
      };
    }),

  setShowAfter: (show) =>
    set((state) => {
      const targetDuration =
        show && state.processedResult
          ? state.processedResult.duration
          : state.decodedAudio?.duration || 0;
      return {
        showAfter: show,
        duration: targetDuration,
        currentTime: 0,
        isPlaying: false,
      };
    }),
}));
