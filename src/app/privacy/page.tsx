import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import {
  CloudSlash,
  EyeSlash,
  Sparkle,
  Cookie,
  ShieldCheck,
  EnvelopeSimple,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy — Zero-Server Audio Security · Audify",
  description:
    "Audify's local-first privacy policy: 100% in-browser audio DSP processing, zero server uploads, no session recording, and zero audio telemetry. Audify by Nyxen × Xpert Melody.",
  keywords: [
    "Audify privacy policy",
    "private audio editor",
    "client-side audio privacy",
    "local audio processing security",
    "no server upload audio tool",
  ],
  openGraph: {
    title: "Privacy Policy — 100% In-Browser Audio Security · Audify",
    description: "Your audio files never leave your device. Zero cloud uploads, zero audio telemetry.",
    url: `${siteConfig.url}/privacy`,
    siteName: siteConfig.name,
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "Audify Privacy Policy & Local-First Commitment",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "Audify Privacy Policy",
      "description":
        "Commitment to client-side local audio processing with zero remote file transfers or telemetry.",
      "url": `${siteConfig.url}/privacy`,
    },
  ],
};

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
          <PageHeader
            eyebrow="Trust & Security"
            title="Privacy Policy"
            lead="How Audify handles your audio files, browser storage, and session privacy. Built with an uncompromising local-first architectural guarantee."
          />

          <SectionSeam />

          {/* Quick Summary Block */}
          <section
            aria-label="Privacy Summary"
            className="surface-card glass-panel rounded-2xl border-primary/25 bg-primary/5 p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <Sparkle size={16} weight="duotone" />
              <span>Core Privacy Guarantee</span>
            </div>
            <p className="text-sm leading-relaxed text-fg/90">
              <strong>Audify never uploads, inspects, or transmits your creative audio to any remote server or cloud bucket.</strong>
              All waveform decoding, DSP node graphs, filtering, convolution reverb, and audio file packaging execute
              100% inside your local web browser memory.
            </p>
          </section>

          {/* Key Principles */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="surface-card glass-panel rounded-2xl p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                <CloudSlash size={20} weight="duotone" />
              </div>
              <h2 className="text-sm font-semibold text-fg">Zero Cloud Storage</h2>
              <p className="text-xs text-muted leading-relaxed">
                When you drag and drop an MP3, WAV, FLAC, or AAC track into Audify, the binary buffer remains strictly
                within your browser&apos;s allocated memory sandbox. When you close the tab, the buffer is purged.
              </p>
            </div>

            <div className="surface-card glass-panel rounded-2xl p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                <EyeSlash size={20} weight="duotone" />
              </div>
              <h2 className="text-sm font-semibold text-fg">Zero Audio Telemetry</h2>
              <p className="text-xs text-muted leading-relaxed">
                We collect zero metadata, acoustic fingerprints, or biometric information about your music. No advertising
                networks are given access to your sound files or creative workflow.
              </p>
            </div>
          </section>

          {/* Cookies & Local Storage Policy */}
          <section className="surface-card glass-panel rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cookie size={18} weight="duotone" />
              </span>
              <h2 className="text-base font-semibold text-fg">Cookies & Local Storage</h2>
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Audify uses minimal client-side <code className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">localStorage</code> keys solely to preserve your user preferences:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-muted pl-2">
              <li><strong className="text-fg font-mono">audify-theme:</strong> Remembers your chosen theme (Light, Dark, or System).</li>
              <li><strong className="text-fg font-mono">audify-sidebar-docked:</strong> Preserves your Studio Rack sidebar docked/collapsed state.</li>
              <li><strong className="text-fg font-mono">audify-sidebar-width:</strong> Remembers your custom resized sidebar width preference.</li>
              <li><strong className="text-fg font-mono">audify-cookie-consent:</strong> Stores your cookie consent selection.</li>
            </ul>
            <p className="text-xs text-muted leading-relaxed">
              None of these stored keys contain personally identifiable information (PII) or track your web activity across external domains.
            </p>
          </section>

          {/* Contact & DPO */}
          <section className="surface-card glass-panel rounded-2xl p-6 sm:p-7 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" weight="duotone" />
              <h2 className="text-base font-semibold text-fg">Privacy Inquiries & Data Rights</h2>
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              If you have any questions regarding client-side data security or our open DSP architecture, reach out directly to our engineering team:
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
              <a href="mailto:support@nyxen.in" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                <EnvelopeSimple size={14} />
                <span>support@nyxen.in</span>
              </a>
              <a href="mailto:hello@nyxen.in" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                <EnvelopeSimple size={14} />
                <span>hello@nyxen.in</span>
              </a>
              <Link href="/contact" className="inline-flex items-center gap-1 text-muted hover:text-fg underline ml-auto font-sans">
                <span>Visit Contact Dispatch</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
