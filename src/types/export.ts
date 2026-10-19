export type ExportFormat = "wav" | "mp3" | "aiff" | "opus";

export type WavBitDepth = 16 | 24 | 32;

export type AiffBitDepth = 16 | 24;

export type Mp3Bitrate = 128 | 192 | 256 | 320;

export type OpusBitrate = 96 | 128 | 160;

export type ExportSampleRate = 0 | 44100 | 48000 | 96000; // 0 = match source

export type ExportChannels = "stereo" | "mono";

export type ExportProfile = "custom" | "sharing" | "standard" | "production";

export interface ExportConfig {
  format: ExportFormat;
  wavBitDepth: WavBitDepth;
  aiffBitDepth: AiffBitDepth;
  mp3Bitrate: Mp3Bitrate;
  opusBitrate: OpusBitrate;
  sampleRate: ExportSampleRate;
  channels: ExportChannels;
  profile: ExportProfile;
  outputFilename: string;
  peakProtection: boolean; // Soft-clipper limiter ceiling at -0.1 dBFS
  loudnessNormalize: boolean; // Clean peak make-up gain to -0.5 dBFS
}

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  format: "wav",
  wavBitDepth: 16,
  aiffBitDepth: 16,
  mp3Bitrate: 320,
  opusBitrate: 128,
  sampleRate: 0,
  channels: "stereo",
  profile: "standard",
  outputFilename: "",
  peakProtection: true,
  loudnessNormalize: false,
};
