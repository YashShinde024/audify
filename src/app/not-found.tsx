import type { Metadata } from "next";
import Link from "next/link";
import { Question, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 — Page Not Found · Svaraya",
};

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center bg-canvas px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-surface text-muted mb-5">
          <Question className="h-6 w-6 text-violet" weight="duotone" />
        </div>

        <p className="eyebrow text-violet font-mono">404 · Silent Route</p>
        <h1 className="display-title mt-2 text-2xl sm:text-3xl font-semibold text-fg">
          This track does not exist.
        </h1>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted max-w-sm mx-auto">
          The requested page could not be located. You can head straight into the Studio to begin processing your audio, or explore our preset library.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="md">
            <Link href="/studio">
              Open Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="md" variant="secondary">
            <Link href="/presets">
              Browse Presets
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
