import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { CloudSlash, EyeSlash } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Privacy Policy — Svaraya Audio Processing",
  description:
    "How Svaraya handles your audio and data: 100% in-browser processing, zero server uploads, no session tracking, and no audio telemetry.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Trust & Security"
          title="Privacy Policy"
          lead="How Svaraya handles your audio files, browser data, and session security. Simple, transparent, and built with local-first privacy."
        />

        <SectionSeam />

        {/* Core Principles */}
        <div className="grid gap-3 sm:grid-cols-2 mb-10">
          <div className="rounded-xl border border-line bg-surface p-4">
            <CloudSlash className="h-5 w-5 text-violet mb-2" weight="duotone" />
            <h3 className="text-xs font-semibold text-fg">Zero Server Uploads</h3>
            <p className="mt-1 text-[11px] text-muted leading-relaxed">
              Audio files are processed strictly inside your device&apos;s browser memory. Files are never transmitted over the network.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <EyeSlash className="h-5 w-5 text-violet mb-2" weight="duotone" />
            <h3 className="text-xs font-semibold text-fg">No Session Tracking</h3>
            <p className="mt-1 text-[11px] text-muted leading-relaxed">
              We do not track which files you process, what presets you use, or your audio contents.
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
              All transformations, filters, convolution reverbs, and WAV file encodings execute in local memory.
              At no point is your audio data sent to any remote server or third-party service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-fg">2. Session Data & Volatility</h2>
            <p>
              Svaraya does not require user registration or account creation. We do not store audio history,
              project files, or personal identifiers in local persistent databases. When you refresh or close your browser tab,
              all in-memory audio buffers and rendered output objects are immediately and irreversibly purged from memory.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-fg">3. Advertising and Third-Party Assets</h2>
            <p>
              To keep Svaraya free for all creators, non-intrusive advertising placeholders are positioned below editor controls.
              No advertising provider in Svaraya is ever granted access to your audio files or editor DSP parameters.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-fg">4. File Limits & Safety</h2>
            <p>
              The 10 MB per-file limitation is enforced directly within your client browser before decoding to safeguard
              your system against memory exhaustion and ensure high-speed real-time processing performance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-fg">5. Questions & Contact</h2>
            <p>
              If you have inquiries regarding our data handling or architecture, please reference our{" "}
              <Link href="/how-it-works" className="text-violet hover:underline font-medium">
                How It Works
              </Link>{" "}
              documentation or check the{" "}
              <Link href="/faq" className="text-violet hover:underline font-medium">
                FAQ
              </Link>
              .
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
