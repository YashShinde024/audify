import Link from "next/link";
import { ArrowRight, Faders } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "./hero-visual";
import { SonicCanvas } from "./sonic-canvas";
import { WaveField } from "./wave-field";

/**
 * The Stage.
 *
 * An always-dark hero: deep graphite canvas with the Living Sonic Canvas
 * mesh behind it, so the page opens with a deliberate contrast moment in
 * both themes (light-mode visitors get the dark "stage" as a statement
 * section; dark-mode visitors get a seamless near-black open. All colors
 * come from the design-token system via `.studio-theme` scoping.
 */
export function Hero() {
  return (
    <section className="studio-theme relative overflow-hidden border-b border-line bg-deep">
      <SonicCanvas className="opacity-90" />
      {/* Traveling wave layers along the base of the stage */}
      <WaveField className="opacity-80" />
      {/* Contrast veil over the mesh for text readability */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-full bg-gradient-to-r from-deep/80 via-deep/40 to-transparent max-lg:opacity-95"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-28">
        {/* Left: editorial content */}
        <div className="max-w-xl">
          <p className="eyebrow flex items-center gap-2 text-violet">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" />
            Free online audio processing · by Nyxen · Xpert Melody
          </p>

          <h1 className="display-title mt-5 text-5xl leading-[0.95] tracking-tight text-fg sm:text-6xl lg:text-7xl">
            Sound,
            <br />
            <span className="text-muted">reimagined.</span>
          </h1>

          <div className="mt-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-10 bg-accent" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
              web audio · local render · no uploads
            </span>
          </div>

          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Choose an effect, shape it with real controls, and download a
            finished master. Slowed + reverb nights, calibrated bass weight,
            cathedral tails — all computed by your browser, never a server.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/studio" aria-label="Open the Svaraya Studio">
                Open Studio
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/presets">
                <Faders className="h-4 w-4 text-muted" />
                Explore Presets
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-faint">
            Free · No account required · Up to 10 MB per file · WAV, AIFF & MP3 export
          </p>
        </div>

        {/* Right: file-to-result product composition */}
        <div className="relative">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
