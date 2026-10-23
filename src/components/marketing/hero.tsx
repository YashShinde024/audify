import Link from "next/link";
import { ArrowRight, Faders, Sparkle } from "@phosphor-icons/react/dist/ssr";
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
    <section className="relative overflow-hidden border-b border-line bg-canvas/40">
      {/* Living Sonic Canvas mesh with crimson light source */}
      <SonicCanvas className="opacity-40 dark:opacity-80" />

      {/* Subtle directional veil for text contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-r from-canvas/90 via-canvas/50 to-transparent max-lg:opacity-95"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-28">
        {/* Left: editorial content */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-xs">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>Audify by Nyxen × Xpert Melody · 100% Client-Side DSP</span>
          </div>

          <h1 className="display-title mt-5 text-5xl leading-[0.95] tracking-tight text-fg sm:text-6xl lg:text-7xl">
            Sound,
            <br />
            <span className="text-sonic-gradient font-extrabold">reimagined.</span>
          </h1>

          <div className="mt-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-10 bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
              Audify · 32-bit float dsp · zero server uploads
            </span>
          </div>

          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Sculpt acoustic spaces, spatial 8D orbits, and slowed+reverb warmth directly inside your browser.
            Instant in-memory decoding and CPU-accelerated rendering — your creative tracks never leave your machine.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-primary hover:bg-primary-hover text-white shadow-sm">
              <Link href="/studio" aria-label="Open Audify Studio">
                Open Audify Studio
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="border-line-strong hover:border-primary/50">
              <Link href="/presets">
                <Faders className="h-4 w-4 text-primary" />
                Explore 36+ Presets
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-faint flex items-center gap-2">
            <Sparkle size={13} className="text-primary" weight="fill" />
            <span>100% Free · No account needed · Up to 10 MB per file · WAV, AIFF &amp; MP3 export</span>
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
