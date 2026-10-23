import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  GithubLogo,
  YoutubeLogo,
  Globe,
  EnvelopeSimple,
  Waveform,
} from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Audify & The Nyxen Ecosystem — Independent Digital Studio",
  description:
    "Discover the story behind Audify: engineered by Nyxen, in creative partnership with Xpert Melody, as part of an independent ecosystem building focused software for the modern web.",
  openGraph: {
    title: "About Audify & The Nyxen Ecosystem",
    description:
      "Independent by design. Built with purpose. Learn who builds Audify, its music partnership with Xpert Melody, and the wider Nyxen product suite.",
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    type: "website",
  },
};

interface OtherProduct {
  name: string;
  url: string;
  tagline: string;
  description: string;
  logo: string;
  category: string;
  displayUrl: string;
}

const NYXEN_PRODUCTS: OtherProduct[] = [
  {
    name: "Rankly",
    url: "https://rankly.nyxen.in/",
    displayUrl: "rankly.nyxen.in",
    category: "Web Intelligence",
    tagline: "Search & generative visibility engine",
    description:
      "Website intelligence for SEO, answer-engine readiness, and generative search visibility.",
    logo: "/images/nyxen/rankly-logo.png",
  },
  {
    name: "NyChat",
    url: "https://nychat.nyxen.in/",
    displayUrl: "nychat.nyxen.in",
    category: "Ephemeral Comms",
    tagline: "Private & disposable chat rooms",
    description:
      "Anonymous, ephemeral chat designed for quick conversations without a traditional account.",
    logo: "/images/nyxen/nychat-logo.png",
  },
  {
    name: "Venz AI",
    url: "https://venzai.tech/",
    displayUrl: "venzai.tech",
    category: "AI Productivity",
    tagline: "Prompt engineering workspace",
    description:
      "An AI workspace for prompt refinement and productivity workflows.",
    logo: "/images/nyxen/venz-logo.png",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-full bg-canvas py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-20">
        {/* ========================================================= */}
        {/* SECTION 1: TOP HERO — BY NYXEN LOGO (DARK/LIGHT MODE)     */}
        {/* ========================================================= */}
        <section aria-labelledby="nyxen-intro-heading" className="space-y-6">
          {/* Top By-Nyxen Logo with automatic dark/light mode switching */}
          <div className="inline-block">
            <Logo variant="by-nyxen" height={44} priority />
          </div>

          <div className="space-y-3">
            <h1
              id="nyxen-intro-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-fg text-balance leading-tight"
            >
              Independent by design. <br className="hidden sm:inline" />
              Built with purpose.
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
              Nyxen is an independent technology studio building focused software products for the modern web.
            </p>
          </div>

          <div>
            <a
              href="https://nyxen.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-violet hover:underline underline-offset-4"
            >
              <span>Explore Nyxen</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </section>

        <div className="h-px w-full bg-line" aria-hidden="true" />

        {/* ========================================================= */}
        {/* SECTION 2: INTRODUCE AUDIFY                               */}
        {/* ========================================================= */}
        <section aria-labelledby="audify-heading" className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-violet font-semibold">
              A Nyxen product
            </p>
            <h2
              id="audify-heading"
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-fg"
            >
              Meet Audify.
            </h2>
          </div>

          <div className="space-y-3 max-w-2xl text-sm sm:text-base text-muted leading-relaxed">
            <p>
              A browser-based audio tool for reshaping sound with creative effects, presets, and a straightforward editing workflow.
            </p>
            <p className="font-medium text-fg italic">
              Slow it down. Add space. Shape your sound.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-semibold text-white hover:bg-violet-dark transition-colors shadow-sm"
            >
              <Waveform size={15} weight="bold" />
              <span>Explore Audify Studio</span>
            </Link>
          </div>
        </section>

        <div className="h-px w-full bg-line" aria-hidden="true" />

        {/* ========================================================= */}
        {/* SECTION 3: MUSIC PARTNER (CONCISELY)                      */}
        {/* ========================================================= */}
        <section aria-labelledby="music-partner-heading" className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
              Music partner
            </p>
            <h2
              id="music-partner-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-fg"
            >
              Made with a love for music.
            </h2>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <p className="text-sm text-muted leading-relaxed">
                Xpert Melody brings a music-creator perspective to Audify, connecting the product with the people who enjoy experimenting with sound.
              </p>
              <div className="text-xs font-mono text-muted">
                <span className="font-semibold text-fg">Audify</span> by Nyxen × Xpert Melody
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              <div className="relative h-14 w-28 flex items-center justify-center">
                <Image
                  src="/images/xpert-melody.png"
                  alt="Xpert Melody Logo"
                  width={112}
                  height={56}
                  className="h-12 w-auto object-contain"
                />
              </div>
              <a
                href={siteConfig.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-violet hover:underline underline-offset-4"
              >
                <YoutubeLogo size={15} weight="fill" className="text-red-500" />
                <span>Visit Xpert Melody Channel</span>
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-line" aria-hidden="true" />

        {/* ========================================================= */}
        {/* SECTION 4: ABOUT NYXEN                                    */}
        {/* ========================================================= */}
        <section aria-labelledby="about-nyxen-heading" className="space-y-4">
          <p className="text-xs font-mono uppercase tracking-widest text-violet font-semibold">
            About the Studio
          </p>
          <h2
            id="about-nyxen-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-fg"
          >
            Small studio. Thoughtful software.
          </h2>

          <div className="space-y-3 max-w-2xl text-sm sm:text-base text-muted leading-relaxed">
            <p>
              Nyxen builds independent digital products focused on utility, thoughtful design, and solving real problems. Audify is part of a wider ecosystem spanning audio, AI, communication, and web intelligence.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="https://nyxen.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-violet hover:underline underline-offset-4"
            >
              <span>Discover Nyxen</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </section>

        <div className="h-px w-full bg-line" aria-hidden="true" />

        {/* ========================================================= */}
        {/* SECTION 5: OTHER PRODUCTS (REAL LOGOS & INFO)              */}
        {/* ========================================================= */}
        <section aria-labelledby="ecosystem-heading" className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-violet font-semibold">
              The Product Lineup
            </p>
            <h2
              id="ecosystem-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-fg"
            >
              Other products from Nyxen.
            </h2>
            <p className="text-sm text-muted">
              Focused, privacy-conscious tools engineered for specific tasks on the modern web.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {NYXEN_PRODUCTS.map((product) => (
              <a
                key={product.name}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 transition-all hover:border-violet/50 hover:bg-surface/90"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-canvas p-1.5">
                      <Image
                        src={product.logo}
                        alt={`${product.name} logo`}
                        width={36}
                        height={36}
                        className="h-8 w-auto object-contain rounded-lg"
                      />
                    </div>
                    <span className="text-[10px] font-mono uppercase text-muted tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-fg group-hover:text-violet transition-colors flex items-center gap-1">
                      <span>{product.name}</span>
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-semibold text-violet">
                  <span>Visit website</span>
                  <span className="font-mono text-[11px] text-muted group-hover:text-violet">
                    {product.displayUrl}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="pt-2 text-center sm:text-left">
            <a
              href="https://nyxen.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-violet hover:underline underline-offset-4"
            >
              <span>Explore the Nyxen ecosystem</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </section>

        <div className="h-px w-full bg-line" aria-hidden="true" />

        {/* ========================================================= */}
        {/* SECTION 6: SOCIAL MEDIA                                   */}
        {/* ========================================================= */}
        <section aria-labelledby="community-heading" className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-violet font-semibold">
              Community & Channels
            </p>
            <h2
              id="community-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-fg"
            >
              Follow what we&apos;re building.
            </h2>
            <p className="text-sm text-muted">
              Updates from Audify, music from Xpert Melody, and new products from Nyxen.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Audify */}
            <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
              <div className="flex items-center gap-2 text-violet">
                <Waveform size={16} weight="bold" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-fg">
                  Audify
                </h3>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="https://github.com/YashShinde024/audify"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-muted hover:text-fg transition-colors"
                  >
                    <GithubLogo size={15} />
                    <span className="group-hover:underline">GitHub Repository</span>
                    <ArrowUpRight size={11} className="opacity-60" />
                  </a>
                </li>
                <li>
                  <Link
                    href="/"
                    className="group inline-flex items-center gap-2 text-muted hover:text-fg transition-colors"
                  >
                    <Globe size={15} />
                    <span className="group-hover:underline">audify.nyxen.in</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Xpert Melody */}
            <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-500">
                <YoutubeLogo size={16} weight="fill" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-fg">
                  Xpert Melody
                </h3>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="https://www.youtube.com/@xpertmelody"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-muted hover:text-fg transition-colors"
                  >
                    <YoutubeLogo size={15} weight="fill" className="text-red-500" />
                    <span className="group-hover:underline">Official YouTube Channel</span>
                    <ArrowUpRight size={11} className="opacity-60" />
                  </a>
                </li>
                <li>
                  <span className="text-[11px] font-mono text-muted">
                    Handle: @xpertmelody
                  </span>
                </li>
              </ul>
            </div>

            {/* Nyxen */}
            <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
              <div className="flex items-center gap-2 text-violet">
                <Globe size={16} />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-fg">
                  Nyxen Studio
                </h3>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="https://nyxen.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-muted hover:text-fg transition-colors"
                  >
                    <Globe size={15} />
                    <span className="group-hover:underline">Official Website</span>
                    <ArrowUpRight size={11} className="opacity-60" />
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@nyxen.in"
                    className="group inline-flex items-center gap-2 text-muted hover:text-fg transition-colors"
                  >
                    <EnvelopeSimple size={15} />
                    <span className="group-hover:underline">hello@nyxen.in</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
