import Link from "next/link";
import { ArrowRight, Faders } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "./hero-visual";
import { SonicCanvas } from "./sonic-canvas";

/**
 * The Stage.
 *
 * An always-dark hero: deep graphite canvas with the Living Sonic Canvas
 * mesh and traveling ruby-wire wave layers.
 * Branded for Audify: Audify by Nyxen × Xpert Melody.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-canvas">
      {/* Purposeful, restrained sonic wave mesh — secondary to headline */}
      <SonicCanvas className="opacity-20 dark:opacity-35" />

      {/* Subtle directional vignette for clean text contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-r from-canvas via-canvas/70 to-transparent max-lg:opacity-95"
      />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        {/* Left: Editorial Content */}
        <div className="max-w-xl">
          {/* Compact brand attribution eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-surface/80 px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span>Audify by Nyxen × Xpert Melody</span>
          </div>

          {/* Art-directed headline */}
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-fg sm:text-5xl lg:text-[3.75rem] leading-[1.04]">
            Sound,
            <span className="block font-extrabold bg-gradient-to-r from-[#6b00f5] via-[#a81dfc] via-35% to-[#ff2a5f] bg-clip-text text-transparent">
              reimagined.
            </span>
          </h1>

          {/* Concise, confident description */}
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted max-w-lg">
            Slow it down. Add space. Shape your sound. Create slowed + reverb, 8D audio, bass boosts, and more — right in your browser.
          </p>

          {/* Action CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-11 px-6 rounded-xl btn-gradient-primary text-white font-medium group"
            >
              <Link href="/studio" aria-label="Open Audify Studio">
                <span>Open Audify Studio</span>
                <ArrowRight aria-hidden="true" className="ml-1.5 h-4 w-4 btn-arrow transition-transform duration-200" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 px-5 rounded-xl border-line/80 bg-surface/60 hover:bg-surface text-fg font-medium transition-colors"
            >
              <Link href="#presets">
                <Faders className="mr-1.5 h-4 w-4 text-muted" />
                <span>Explore Presets</span>
              </Link>
            </Button>
          </div>

          {/* Verified supporting metadata row */}
          <div className="mt-6 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5 font-medium text-fg">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Up to 10 MB per file
            </span>
            <span className="text-line-strong" aria-hidden="true">·</span>
            <span>WAV, AIFF &amp; MP3 export</span>
            <span className="text-line-strong" aria-hidden="true">·</span>
            <span>No account required</span>
          </div>
        </div>

        {/* Right: macOS Browser Window Showcasing Real Audify Studio */}
        <div className="relative w-full">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
