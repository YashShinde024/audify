"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { CheckCircle, DownloadSimple, SpinnerGap, XCircle } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { downloadFile } from "@/lib/download";

import { isNativeAndroid } from "@/lib/download";
import { playCompletionSound, primeCompletionSound } from "@/lib/audio/completion-sound";

type DownloadButtonProps = {
  /** Blob/object/remote URL of the resource to save. */
  url: string;
  /** Suggested filename for the saved file. */
  filename: string;
  /** Optional label override. Defaults to "Download". */
  label?: string;
  /** Visual variant matching the design system. */
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
  className?: string;
  icon?: Icon;
  /** Fixed label for Android share-sheet flow (e.g. "Save / Share"). */
  androidLabel?: string;
};

/**
 * Download affordance with honest, lightweight feedback:
 * tap → brief "saving" state → success check + toast naming the saved file.
 * Self-recovering: if the click throws, shows an error state but the file
 * can be re-triggered from the same button.
 */
export function DownloadButton({
  url,
  filename,
  label = "Download",
  variant = "primary",
  size = "md",
  className,
  icon: IconComponent = DownloadSimple,
  androidLabel,
}: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const native = useMemo(() => isNativeAndroid(), []);
  const idleLabel = native && androidLabel ? androidLabel : label;

  const handleClick = useCallback(async () => {
    if (status === "saving") return;
    primeCompletionSound();
    setStatus("saving");
    try {
      await downloadFile(url, filename);
      setStatus("done");
      void playCompletionSound("export-download-" + filename);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setStatus("idle"), 3200);
    } catch {
      setStatus("error");
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setStatus("idle"), 4200);
    }
  }, [filename, status, url]);

  const icon =
    status === "saving" ? (
      <SpinnerGap size={15} className="shrink-0 animate-spin" />
    ) : status === "done" ? (
      <CheckCircle size={15} weight="fill" className="shrink-0 text-emerald-400" />
    ) : status === "error" ? (
      <XCircle size={15} weight="fill" className="shrink-0 text-error" />
    ) : (
      <IconComponent size={15} weight={variant === "primary" ? "bold" : undefined} className="shrink-0" />
    );

  const text =
    status === "saving" ? "Saving…" : status === "done" ? "Saved" : status === "error" ? "Retry" : idleLabel;

  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Download ${filename}`}
        className={cn(
          "btn-gradient-primary btn-sweep-offset-b inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold text-white transition-all shadow-glow-wire hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer active:scale-95",
          className,
        )}
      >
        {icon}
        <span>{text}</span>
      </button>
    );
  }

  if (variant === "ghost") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Download ${filename}`}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] font-medium text-muted transition-colors hover:text-fg hover:border-primary/40 cursor-pointer active:scale-95",
          size === "sm" && "px-2.5 py-1 text-[10px] gap-1",
          className,
        )}
      >
        {icon}
        <span>{text}</span>
      </button>
    );
  }

  // outline (default)
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Download ${filename}`}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-canvas px-4 py-2 text-xs font-medium text-fg transition-all hover:bg-raised hover:border-primary/40 cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        size === "sm" && "px-3 py-1 text-[11px] gap-1.5",
        className,
      )}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
