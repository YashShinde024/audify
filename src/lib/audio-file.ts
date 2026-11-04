import { z } from "zod";
import { siteConfig } from "@/config/site";

/** Formats that the frontend explicitly acknowledges as planned support. */
export const supportedExtensions = ["mp3", "wav", "m4a", "aac", "ogg", "flac"] as const;
export type SupportedExtension = (typeof supportedExtensions)[number];

const MAX_FILE_SIZE = siteConfig.maxFileSizeBytes;

export const audioFileSchema = z
  .object({
    name: z.string().min(1),
    size: z
      .number({ message: "Invalid file." })
      .int()
      .positive("The selected file is empty.")
      .max(MAX_FILE_SIZE, `This file is larger than the 10 MB limit.`),
    type: z.string(),
  })
  .passthrough();

export type AudioFileValidation =
  | { ok: true; file: File }
  | { ok: false; reason: "too-large" | "unsupported" | "empty" };

export function isSupportedAudioFile(file: File): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const extOk = supportedExtensions.includes(extension as SupportedExtension);
  if (!extOk) return false;

  // Accept files when MIME is audio/*, application/octet-stream, or empty string (common in OS drag-and-drop).
  // Explicitly reject non-audio MIME types (e.g. text/plain, image/png, application/pdf).
  if (file.type && !file.type.startsWith("audio/") && file.type !== "application/octet-stream") {
    return false;
  }
  return true;
}

/** Client-side validation only — no upload happens in this frontend task. */
export function validateAudioFile(file: File): AudioFileValidation {
  if (file.size === 0) return { ok: false, reason: "empty" };
  if (file.size > MAX_FILE_SIZE) return { ok: false, reason: "too-large" };
  if (!isSupportedAudioFile(file)) return { ok: false, reason: "unsupported" };
  return { ok: true, file };
}

export function fileSizeError(reason: "too-large" | "unsupported" | "empty"): string {
  switch (reason) {
    case "too-large":
      return "This file exceeds the 10 MB limit. Choose a smaller file.";
    case "unsupported":
      return "This file type is not supported yet. Planned formats: " + supportedExtensions.join(", ").toUpperCase() + ".";
    case "empty":
      return "The selected file appears to be empty.";
  }
}
