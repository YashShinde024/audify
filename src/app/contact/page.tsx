import type { Metadata } from "next";
import Link from "next/link";
import {
  YoutubeLogo,
  Faders,
  Bug,
  ShieldCheck,
  ArrowRight,
  Headphones,
  Cpu,
  EnvelopeSimple,
  GlobeHemisphereWest,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { siteConfig } from "@/config/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact & Community Dispatch · Audify by Nyxen × Xpert Melody",
  description:
    "Official contact channels for Audify. Reach out to lead architect Nyxen (nyxen.in) and music partner Xpert Melody for preset requests, DSP bugs, or audio production inquiries.",
  openGraph: {
    title: "Contact & Community Dispatch · Audify",
    description:
      "Direct inquiries, nyxen.in official emails, preset requests, and technical support for Audify in-browser audio DSP platform.",
    url: `${siteConfig.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        <PageHeader
          eyebrow="Dispatch & Creator Contacts"
          title="Direct Contact & Channels"
          lead="Direct communication channels with Audify creators (Audify by Nyxen × Xpert Melody). Reach out for preset suggestions, DSP engine reports, sound collaborations, or platform licensing."
        />

        {/* Official nyxen.in Email Directory Banner */}
        <section
          aria-label="Official Email Channels"
          className="surface-card glass-panel p-6 sm:p-7 rounded-2xl border-primary/25 bg-primary/5 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/25 text-primary">
                <EnvelopeSimple size={22} weight="duotone" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-fg">Official nyxen.in Contact Directory</h2>
                <p className="text-xs text-muted">Direct email communication channels monitored daily</p>
              </div>
            </div>
            <a
              href="https://nyxen.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover font-mono"
            >
              <GlobeHemisphereWest size={14} />
              <span>nyxen.in portal</span>
              <ArrowUpRight size={12} weight="bold" />
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 pt-2">
            <a
              href="mailto:hello@nyxen.in"
              className="rounded-xl border border-line/70 bg-surface/80 p-3.5 hover:border-primary/50 hover:bg-surface transition-all group"
            >
              <span className="text-[10px] uppercase font-mono tracking-wider text-faint group-hover:text-primary">
                General Inquiries
              </span>
              <p className="mt-1 text-xs font-semibold text-fg group-hover:text-primary transition-colors font-mono">
                hello@nyxen.in
              </p>
              <p className="mt-1 text-[11px] text-muted">Partnerships, ecosystem & press</p>
            </a>

            <a
              href="mailto:support@nyxen.in"
              className="rounded-xl border border-line/70 bg-surface/80 p-3.5 hover:border-primary/50 hover:bg-surface transition-all group"
            >
              <span className="text-[10px] uppercase font-mono tracking-wider text-faint group-hover:text-primary">
                Technical Support
              </span>
              <p className="mt-1 text-xs font-semibold text-fg group-hover:text-primary transition-colors font-mono">
                support@nyxen.in
              </p>
              <p className="mt-1 text-[11px] text-muted">DSP issues, audio buffers & browsers</p>
            </a>

            <a
              href="mailto:build@nyxen.in"
              className="rounded-xl border border-line/70 bg-surface/80 p-3.5 hover:border-primary/50 hover:bg-surface transition-all group"
            >
              <span className="text-[10px] uppercase font-mono tracking-wider text-faint group-hover:text-primary">
                Partnership & Technical
              </span>
              <p className="mt-1 text-xs font-semibold text-fg group-hover:text-primary transition-colors font-mono">
                build@nyxen.in
              </p>
              <p className="mt-1 text-[11px] text-muted">Direct engineering inquiries & builds</p>
            </a>
          </div>
        </section>

        {/* 4 Direct Channel Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Channel 1: YouTube */}
          <div className="surface-card glass-panel flex flex-col justify-between p-5 rounded-2xl transition-all duration-200 hover:border-red-500/40">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                <YoutubeLogo size={22} weight="fill" />
              </div>
              <h3 className="mt-3.5 text-sm font-semibold text-fg tracking-tight">
                Studio Community & Media
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Official releases showcasing music edits, audio transformations, and sound design demos.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line/60">
              <a
                href={siteConfig.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 transition-colors"
              >
                <span>Visit Channel</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

          {/* Channel 2: Preset Lab */}
          <div className="surface-card glass-panel flex flex-col justify-between p-5 rounded-2xl transition-all duration-200 hover:border-primary/40">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Faders size={22} weight="duotone" />
              </div>
              <h3 className="mt-3.5 text-sm font-semibold text-fg tracking-tight">
                Preset Suggestions
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Have an idea for a vintage filter, cathedral acoustics, or specialized pitch curve? We tune new presets weekly.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line/60">
              <span className="text-[11px] font-mono text-faint">
                Use form below
              </span>
            </div>
          </div>

          {/* Channel 3: DSP & Bug Triage */}
          <div className="surface-card glass-panel flex flex-col justify-between p-5 rounded-2xl transition-all duration-200 hover:border-primary/40">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Bug size={22} weight="duotone" />
              </div>
              <h3 className="mt-3.5 text-sm font-semibold text-fg tracking-tight">
                Bug & DSP Triage
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Report browser decoding quirks, sample rate mismatches, or unexpected audio buffer behaviors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line/60">
              <span className="text-[11px] font-mono text-faint">
                Direct to support@nyxen.in
              </span>
            </div>
          </div>

          {/* Channel 4: Privacy & Ethics */}
          <div className="surface-card glass-panel flex flex-col justify-between p-5 rounded-2xl transition-all duration-200 hover:border-primary/40">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-fg border border-line/70">
                <ShieldCheck size={22} weight="duotone" className="text-primary" />
              </div>
              <h3 className="mt-3.5 text-sm font-semibold text-fg tracking-tight">
                Zero Cloud Uploads
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Audify never transmits your music to cloud storage. Your audio stays 100% inside your browser.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line/60">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-fg transition-colors"
              >
                <span>Privacy Policy</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        <SectionSeam />

        {/* Contact Form Section */}
        <div>
          <ContactForm />
        </div>

        {/* Quick FAQ / Common Clarifications */}
        <div className="surface-raised p-6 sm:p-8 rounded-2xl border border-line/70">
          <div className="flex items-center gap-2 mb-4">
            <Headphones size={20} className="text-primary" weight="duotone" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-fg">
              Quick Answers Before Messaging
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 text-xs leading-relaxed text-muted">
            <div>
              <p className="font-semibold text-fg mb-1">Do I need an account to use Audify?</p>
              <p>No accounts, no logins, and no subscriptions. Every tool and preset is free to use immediately in your browser.</p>
            </div>
            <div>
              <p className="font-semibold text-fg mb-1">Are exported tracks free for commercial use?</p>
              <p>Yes. Audify claims zero copyright over your processed masters. What you render is 100% yours.</p>
            </div>
            <div>
              <p className="font-semibold text-fg mb-1">Why is my file limit 10 MB?</p>
              <p>To guarantee responsive in-memory decoding on mobile devices and prevent browser tab memory crashes.</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-line/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-faint flex items-center gap-1.5">
              <Cpu size={14} className="text-primary" />
              Web Audio API DSP Engine · Developed by Nyxen
            </span>
            <Link
              href="/studio"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              <span>Ready to transform sound? Open Studio</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
