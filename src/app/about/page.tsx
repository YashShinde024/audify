import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkle,
  Waveform,
  ArrowRight,
  Globe,
  EnvelopeSimple,
  ArrowUpRight,
  MusicNotes,
  LockKey,
  Lightning,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Audify — Audify by Nyxen",
  description:
    "Discover Audify, the privacy-first local audio DSP platform developed by parent brand Nyxen with acoustic partner Xpert Melody. Explore the Nyxen product ecosystem.",
  keywords: [
    "Audify",
    "About Audify",
    "Audify by Nyxen",
    "Nyxen",
    "nyxen.in",
    "Xpert Melody",
    "browser audio DSP",
    "local audio effects",
    "slowed and reverb",
    "8D audio maker",
    "Nyxen ecosystem",
    "Nychat",
    "Rankly",
    "Venz",
  ],
  openGraph: {
    title: "About Audify — Audify by Nyxen",
    description:
      "Client-side audio manipulation engineered by Nyxen. In-browser DSP, zero audio uploads, 32-bit floating point headroom.",
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    type: "profile",
  },
};

const NYXEN_PRODUCTS = [
  {
    name: "Rankly",
    tagline: "Web Intelligence — SEO, GEO and AEO",
    badge: "Live Platform",
    desc: "Understand and improve how your website performs across classic search, generative engines (GEO), and AI answer surfaces (AEO) like ChatGPT, Claude, and Perplexity.",
    logo: "/images/nyxen/rankly-logo.png",
    link: "https://rankly.nyxen.in",
    highlight: "SEO Audits · GEO & AEO Tracking · AI Recommendations",
  },
  {
    name: "NyChat",
    tagline: "Private & Ephemeral Communication",
    badge: "Live Platform",
    desc: "Clean, ephemeral, and privacy-first conversational workspace engineered free from ad-trackers, corporate telemetry, and permanent data hoarding.",
    logo: "/images/nyxen/nychat-logo.png",
    link: "https://nychat.nyxen.in",
    highlight: "Ephemeral Chat · Zero Telemetry · Privacy-First",
  },
  {
    name: "Venz AI",
    tagline: "AI Prompt Workspace & Tools",
    badge: "Live Platform",
    desc: "Thoughtful prompt engineering workflows, everyday creator utilities, and AI productivity tools engineered for speed and simplicity.",
    logo: "/images/nyxen/venz-logo.png",
    link: "https://venz.nyxen.in",
    highlight: "Prompt Workspaces · Creator Utilities · High Speed",
  },
];

const NYXEN_CHANNELS = [
  {
    title: "Nyxen Official Portal",
    handle: "nyxen.in",
    role: "Parent Brand & Innovation Lab",
    desc: "Explore sibling intelligence platforms, software architectural deep-dives, and tech breakthroughs.",
    href: "https://nyxen.in",
    icon: Globe,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/25",
    buttonText: "Visit nyxen.in Portal",
  },
  {
    title: "Authorized General Inquiries",
    handle: "hello@nyxen.in",
    role: "General & Studio Inquiries",
    desc: "Official contact email for inquiries regarding Nyxen, studio platforms, and ecosystem collaborations.",
    href: "mailto:hello@nyxen.in",
    icon: EnvelopeSimple,
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/25",
    buttonText: "Email hello@nyxen.in",
  },
  {
    title: "Partnership & Technical",
    handle: "build@nyxen.in",
    role: "Engineering & Custom Builds",
    desc: "Direct channel for developer partnerships, API integrations, and bespoke technical builds.",
    href: "mailto:build@nyxen.in",
    icon: EnvelopeSimple,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/25",
    buttonText: "Email build@nyxen.in",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">

        {/* ════ HERO: AUDIFY BY NYXEN (DARK-COMPATIBLE) ══════════════════ */}
        <section className="text-center space-y-5 pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary tracking-wide shadow-xs">
            <Sparkle size={13} weight="fill" />
            <span>Parent Brand: Nyxen · Sound Partner: Xpert Melody</span>
          </div>

          {/* Theme-specific Audify by Nyxen brand artwork (light: audify-logo-by-nyxen.png, dark: audify-logo-by-nyxen-dark.png) */}
          <div className="flex flex-col items-center justify-center pt-2 pb-1">
            <div className="relative group p-2">
              <Logo variant="by-nyxen" height={54} priority />
              <span className="absolute -inset-2 rounded-2xl bg-primary/15 blur-lg opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-fg max-w-2xl mx-auto leading-tight">
            Next-Generation Browser Audio DSP
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted leading-relaxed">
            Audify is an uncompromising, in-browser audio workstation created by parent brand{" "}
            <a
              href="https://nyxen.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-fg hover:text-primary underline underline-offset-2 transition-colors"
            >
              Nyxen
            </a>
            . Zero cloud uploads, zero audio compression, and 100% private local digital signal processing.
          </p>
        </section>

        {/* ════ AUDIFY CORE ARCHITECTURE ═════════════════════════════════ */}
        <section
          aria-labelledby="audify-overview-heading"
          className="surface-card glass-panel rounded-3xl border border-line-strong p-6 sm:p-9 space-y-7"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/25 text-primary">
                <Waveform size={24} weight="duotone" />
              </span>
              <div>
                <h2 id="audify-overview-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
                  The Audify Philosophy
                </h2>
                <p className="text-xs text-muted">High-Fidelity Client-Side Audio Engineering</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-surface border border-line px-3 py-1 text-xs font-mono text-muted">
                32-Bit Float · Zero Uploads
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 text-xs sm:text-sm text-muted leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-semibold text-fg text-sm flex items-center gap-2">
                <LockKey size={16} className="text-primary" weight="bold" />
                Pure Local-First Privacy
              </h3>
              <p>
                Unlike traditional online audio converters that upload your songs to remote servers, Audify processes
                everything in your browser&apos;s memory using the <strong>W3C Web Audio API</strong>. Your files are decoded,
                manipulated, and encoded entirely on your local machine.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-fg text-sm flex items-center gap-2">
                <Lightning size={16} className="text-primary" weight="bold" />
                Uncompressed Dynamic Headroom
              </h3>
              <p>
                All filtering and modulation operate with 32-bit floating point precision, providing up to +6 dBFS of internal
                headroom. A true peak lookahead limiter safely prevents digital clipping distortion before exporting to WAV,
                LAME MP3, or AIFF.
              </p>
            </div>
          </div>

          {/* Quick Feature Grid */}
          <div className="grid gap-3.5 sm:grid-cols-4 pt-2 border-t border-line/60">
            <div className="rounded-xl border border-line bg-surface/60 p-3.5 text-center space-y-1">
              <div className="text-xs font-semibold text-fg">0 Bytes Uploaded</div>
              <div className="text-[11px] text-muted">100% In-Browser DSP</div>
            </div>
            <div className="rounded-xl border border-line bg-surface/60 p-3.5 text-center space-y-1">
              <div className="text-xs font-semibold text-fg">18+ Presets</div>
              <div className="text-[11px] text-muted">Slowed, 8D, 432 Hz, Bass</div>
            </div>
            <div className="rounded-xl border border-line bg-surface/60 p-3.5 text-center space-y-1">
              <div className="text-xs font-semibold text-fg">32-Bit Float</div>
              <div className="text-[11px] text-muted">Peak Lookahead Limiter</div>
            </div>
            <div className="rounded-xl border border-line bg-surface/60 p-3.5 text-center space-y-1">
              <div className="text-xs font-semibold text-fg">Multi-Format</div>
              <div className="text-[11px] text-muted">WAV · MP3 320k · AIFF</div>
            </div>
          </div>
        </section>

        {/* ════ TASTEFUL, SMALL MENTION OF XPERT MELODY (MUSIC PARTNER) ═══ */}
        <section
          aria-label="Music Partner Collaboration"
          className="rounded-2xl border border-line bg-surface/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs"
        >
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Image
                src="/images/xpert-melody.png"
                alt="Xpert Melody"
                width={48}
                height={48}
                className="h-12 w-12 rounded-xl object-cover border border-line-strong shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white shadow-xs">
                <MusicNotes size={9} weight="fill" />
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-fg">Xpert Melody</span>
                <span className="rounded-full bg-red-500/10 border border-red-500/25 px-2 py-0.2 text-[10px] font-mono text-red-500">
                  Music Partner
                </span>
              </div>
              <p className="text-xs text-muted max-w-xl leading-relaxed">
                Sound designer and producer collaborating on Audify&apos;s signature acoustic presets, room impulse response
                decays, and binaural 8D spatial panning orbits.
              </p>
            </div>
          </div>

          <a
            href={siteConfig.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 font-mono shrink-0 transition-colors"
          >
            <span>@xpertmelody on YouTube</span>
            <ArrowUpRight size={12} weight="bold" />
          </a>
        </section>

        {/* ════ PARENT BRAND: NYXEN & ECOSYSTEM ══════════════════════════ */}
        <section aria-labelledby="nyxen-brand-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                Parent Brand
              </span>
              <h2 id="nyxen-brand-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg mt-1">
                The Nyxen Ecosystem
              </h2>
            </div>
            <a
              href="https://nyxen.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline font-mono"
            >
              <span>Explore all Nyxen products at nyxen.in</span>
              <ArrowRight size={12} weight="bold" />
            </a>
          </div>

          <div className="surface-card glass-panel rounded-3xl border border-line-strong p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-line pb-5">
              <div className="flex items-center justify-center p-2 rounded-xl bg-surface border border-line">
                <Image
                  src="/images/nyxen/nyxen-logo.png"
                  alt="Nyxen"
                  width={52}
                  height={34}
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-fg">Nyxen</h3>
                <p className="text-xs text-muted">
                  Creator and parent technology studio engineering high-performance web software and intelligent platforms.
                </p>
              </div>
            </div>

            {/* Sibling Products with Real Logos */}
            <div className="grid gap-4 sm:grid-cols-3">
              {NYXEN_PRODUCTS.map((prod) => (
                <div
                  key={prod.name}
                  className="rounded-2xl border border-line bg-surface/70 p-5 flex flex-col justify-between hover:border-primary/40 hover:shadow-sm transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="h-11 w-11 rounded-xl bg-surface border border-line p-1.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <Image
                          src={prod.logo}
                          alt={prod.name}
                          width={36}
                          height={36}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="rounded-full bg-surface border border-line px-2 py-0.5 text-[9px] font-mono text-muted">
                        {prod.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-fg group-hover:text-primary transition-colors">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] font-medium text-accent mt-0.5">{prod.tagline}</p>
                      <p className="text-xs text-muted leading-relaxed mt-2">{prod.desc}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-faint text-[10px]">{prod.highlight}</span>
                    <a
                      href={prod.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowUpRight size={11} weight="bold" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ NYXEN SOCIAL & OFFICIAL CHANNELS ═════════════════════════ */}
        <section aria-labelledby="nyxen-channels-heading" className="space-y-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              Connect &amp; Inquiries
            </span>
            <h2 id="nyxen-channels-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-fg mt-1">
              Nyxen Official Channels
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {NYXEN_CHANNELS.map((channel) => {
              const Icon = channel.icon;
              return (
                <div
                  key={channel.title}
                  className="surface-card glass-panel rounded-2xl p-5 border border-line flex flex-col justify-between hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", channel.bg, channel.color)}>
                        <Icon size={20} weight="fill" />
                      </div>
                      <span className="text-[10px] font-mono text-faint">{channel.role}</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-fg">{channel.title}</h3>
                      <p className="text-xs font-mono text-primary">{channel.handle}</p>
                      <p className="text-xs text-muted leading-relaxed mt-1">{channel.desc}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-line/60">
                    <a
                      href={channel.href}
                      target={channel.href.startsWith("http") ? "_blank" : undefined}
                      rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover font-mono"
                    >
                      <span>{channel.buttonText}</span>
                      <ArrowUpRight size={12} weight="bold" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ════ CALL TO ACTION ═══════════════════════════════════════════ */}
        <section className="surface-card glass-panel rounded-3xl p-7 sm:p-9 border border-primary/25 bg-gradient-to-br from-primary/10 via-surface to-accent/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-lg">
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              Instant Processing
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-fg">
              Try Audify Studio in your browser
            </h2>
            <p className="text-xs text-muted max-w-lg">
              Load an audio file and experience slowed + reverb, 8D binaural orbits, sacred pitch shifting, and bass boost with 0 uploads.
            </p>
          </div>

          <Button
            asChild
            size="md"
            className="rounded-full bg-primary hover:bg-primary-hover text-white shadow-md shrink-0 px-5"
          >
            <Link href="/studio" className="flex items-center gap-2">
              <span>Open Studio</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </Button>
        </section>

      </div>
    </div>
  );
}
