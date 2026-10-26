import type { ReactNode } from "react";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { toast } from "sonner";
import { CheckCircle, ShareNetwork } from "@phosphor-icons/react";

/**
 * True when the app runs inside the Capacitor native Android WebView shell.
 * Regular browser behavior (anchor `download`) is unreliable in that context,
 * so we route through the Filesystem plugin + system share/save sheet.
 */
export function isNativeAndroid(): boolean {
  return Capacitor.getPlatform() === "android";
}

/**
 * Triggers a browser "Save As" download for an object/blob/remote URL.
 * Must be called from a user-gesture context. Safe to call repeatedly
 * for the same URL (never revokes it — lifetime supervision of blob URLs
 * stays with the owner).
 */
export function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.substring(dataUrl.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("Could not read rendered audio buffer"));
    reader.readAsDataURL(blob);
  });
}

function androidShareReadyToast() {
  toast.custom(() => <AndroidShareToast filename="" />, { duration: 4200 });
}
function androidShareSavedToast(filename: string) {
  toast.custom(() => <AndroidShareToast filename={filename} />, { duration: 4200 });
}

function AndroidShareToast({ filename }: { filename: string }): ReactNode {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-primary/30 bg-[#15131f] px-4 py-2.5 shadow-lg">
      <ShareNetwork size={16} weight="fill" className="shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#f7f5ff]">
          File ready — pick a save location
        </p>
        <p className="truncate max-w-[260px] text-[11px] text-white/55 font-mono">{filename}</p>
      </div>
    </div>
  );
}

/**
 * Small confirmation toast rendered after a browser download starts so the
 * user gets feedback that the save actually began (browsers are silent).
 */
export function notifyDownloadStarted(filename: string) {
  toast.custom(
    () => (
      <DownloadConfirmedToast filename={filename} />
    ),
    { duration: 4200 },
  );
}

function DownloadConfirmedToast({ filename }: { filename: string }): ReactNode {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-[#15131f] px-4 py-2.5 shadow-lg">
      <CheckCircle size={16} weight="fill" className="shrink-0 text-emerald-500" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#f7f5ff]">Download started</p>
        <p className="truncate max-w-[260px] text-[11px] text-white/55 font-mono">{filename}</p>
      </div>
    </div>
  );
}

export type DownloadOutcome = "browser" | "android-share";

/**
 * Platform-aware download entry point.
 *
 * - Web browsers: classic anchor click + confirmation toast.
 * - Capacitor Android: fetch the blob, hand it to the native Filesystem
 *   plugin, open the system share/save sheet so the user can save to
 *   Downloads/anywhere (avoids the WebView's broken blob-download path).
 */
export async function downloadFile(
  url: string,
  filename: string,
): Promise<DownloadOutcome> {
  if (isNativeAndroid()) {
    androidShareReadyToast();
    const res = await fetch(url);
    if (!res.ok) throw new Error("Could not re-read the rendered master file");
    const blob = await res.blob();
    const base64 = await blobToBase64(blob);
    const file = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Cache,
      recursive: true,
    });
    try {
      await Share.share({
        url: file.uri,
        title: "Save Audify file",
        dialogTitle: "Save Audify export",
      });
      androidShareSavedToast(filename);
    } catch {
      // User dismissed the sheet — cache entry is left for the OS to evict.
    }
    // Temporary cache file is left to Android's cache eviction rather than
    // deleted immediately, because the share sheet may still be open.
    return "android-share";
  }

  triggerDownload(url, filename);
  notifyDownloadStarted(filename);
  return "browser";
}
