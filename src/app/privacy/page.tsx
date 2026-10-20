import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import {
  CloudSlash,
  EyeSlash,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Privacy Policy — Zero-Server Audio Security · Svaraya",
  description:
    "Svaraya's local-first privacy policy: 100% in-browser audio DSP processing, zero server uploads, no session recording, and zero audio telemetry.",
  keywords: [
    "Svaraya privacy policy",
    "private audio editor",
    "client-side audio privacy",
    "local audio processing security",
    "no server upload audio tool",
  ],
  openGraph: {
    title: "Privacy Policy — 100% In-Browser Audio Security",
    description: "Your audio files never leave your device. Zero cloud uploads, zero telemetry.",
    url: "https://svaraya.vercel.app/privacy",
    siteName: "Svaraya",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "Svaraya Privacy Policy & Local-First Commitment",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "Svaraya Privacy Policy",
      "description":
        "Commitment to client-side local audio processing with zero remote file transfers or telemetry.",
      "url": "https://svaraya.vercel.app/privacy",
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
            lead="How Svaraya handles your audio files, browser data, and session security. Simple, transparent, and built with local-first privacy."
          />

          <SectionSeam />

          {/* AEO Quick Summary */}
          <section
            aria-label="AEO Quick Summary"
            className="rounded-2xl border border-violet/30 bg-violet/5 p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-violet font-semibold text-xs uppercase tracking-wider">
              <Sparkle size={16} weight="duotone" />
              <span>AEO Executive Summary · Privacy Commitments</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-fg/90">
              <strong>Svaraya never transmits, stores, or analyzes your audio files on external servers</strong>.
              All digital signal processing, reverb convolutions, filter sweeps, and audio file encodings run exclusively
              inside your web browser&apos;s isolated memory space via the native W3C Web Audio API.
              When you close or refresh your browser tab, all in-memory audio buffers are instantly and irreversibly cleared.
            </p>
          </section>

          {/* Core Principles */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface p-4">
              <CloudSlash className="h-5 w-5 text-violet mb-2" weight="duotone" />
              <h3 className="text-xs font-semibold text-fg">Zero Server Uploads</h3>
              <p className="mt-1 text-[11px] text-muted leading-relaxed">
                Audio files are processed strictly inside your device&apos;s RAM. Files are never transmitted over HTTP or WebSocket connections.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4">
              <EyeSlash className="h-5 w-5 text-violet mb-2" weight="duotone" />
              <h3 className="text-xs font-semibold text-fg">No Audio Telemetry</h3>
              <p className="mt-1 text-[11px] text-muted leading-relaxed">
                We do not track file names, metadata tags, waveform shapes, or musical contents. Your creative work remains your confidential property.
              </p>
            </div>
          </div>

          {/* Detailed Longform Content */}
          <article className="space-y-8 text-xs sm:text-sm leading-relaxed text-muted">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-fg">1. In-Browser Local Audio Processing</h2>
              <p>
                When you load an audio file into Svaraya, your browser decodes the binary data using the native
                Web Audio API (<code className="text-xs font-mono text-violet">AudioContext.decodeAudioData</code>).
                All transformations, filters, convolution reverbs, and WAV/MP3 file encodings execute in local client memory.
                At no point is your audio data sent to any remote server or third-party cloud infrastructure.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-fg">2. Session Data & Volatility</h2>
              <p>
                Svaraya does not require user registration, logins, or account creation. We do not store audio history,
                project files, or personal identifiers in remote persistent databases. When you refresh or close your browser tab,
                all in-memory audio buffers and rendered output objects are immediately and irreversibly purged by your browser&apos;s
                garbage collection engine.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-fg">3. Client File Limits & Safety</h2>
              <p>
                The 10 MB per-file limitation is enforced directly within your client browser before decoding to safeguard
                your system against memory exhaustion and ensure high-speed real-time processing performance.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-fg">4. Advertising and Analytics</h2>
              <p>
                To keep Svaraya free for all creators worldwide, non-intrusive advertising placeholders are positioned below editor controls.
                No advertising provider in Svaraya is ever granted access to your audio files, editor parameters, or audio buffers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-fg">5. Questions & Architecture Details</h2>
              <p>
                If you have inquiries regarding our data handling or architecture, please reference our{" "}
                <Link href="/how-it-works" className="text-violet hover:underline font-medium">
                  How It Works
                </Link>{" "}
                documentation, explore our{" "}
                <Link href="/about" className="text-violet hover:underline font-medium">
                  About
                </Link>{" "}
                page, or check the{" "}
                <Link href="/faq" className="text-violet hover:underline font-medium">
                  FAQ
                </Link>
                .
              </p>
            </section>
          </article>
        </div>
      </div>
    </>
  );
}
