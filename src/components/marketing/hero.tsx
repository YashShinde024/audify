import Link from "next/link";
import { ArrowRight, Faders } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "./hero-visual";

export function Hero() {
  return (
    <section className="relative border-b border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:px-8 lg:py-24">
        {/* Left Column: Editorial Content */}
        <div className="max-w-xl">
          <p className="eyebrow flex items-center gap-2 text-violet">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" />
            Free Online Audio Processing · By Nyxen × Xpert Melody
          </p>

          <h1 className="display-title mt-4 text-fg">
            Sound, reimagined.
          </h1>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
            Give your audio the sound you have in mind. Choose an effect, shape the result,
            and download your finished track.
          </p>

          {/* Action CTAs */}
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

          {/* Discreet product guarantees */}
          <p className="mt-5 text-xs text-faint">
            Free · No account required · Up to 10 MB per file · 100% in-browser processing
          </p>
        </div>

        {/* Right Column: Refined File-to-Result Product Composition */}
        <div className="mt-12 lg:mt-0">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
