"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WarningCircle, ArrowsClockwise, ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center bg-canvas px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-error/20 bg-error/10 text-error mb-5">
          <WarningCircle className="h-6 w-6" weight="duotone" />
        </div>

        <p className="eyebrow text-error font-mono">Application Error</p>
        <h1 className="display-title mt-2 text-2xl sm:text-3xl font-semibold text-fg">
          Something interrupted the session.
        </h1>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted max-w-sm mx-auto">
          An unexpected runtime error stopped playback or rendering. Your local audio files remain safe on your device.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="md" onClick={() => reset()}>
            <ArrowsClockwise className="h-4 w-4" />
            Reload Session
          </Button>
          <Button asChild size="md" variant="secondary">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
