import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { Sparkle } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Terms of Service — 100% Creator Ownership · Svaraya",
  description:
    "Terms of service governing the usage of Svaraya browser audio tools: 100% intellectual property retention for creators, fair use, and local client execution.",
  keywords: [
    "Svaraya terms of service",
    "audio editor licensing",
    "creator ownership terms",
    "free audio editor commercial rights",
  ],
  openGraph: {
    title: "Terms of Service — Svaraya Audio Processing",
    description: "Terms governing access to Svaraya by Nyxen × Xpert Melody. Clear, creator-first legal conditions.",
    url: "https://svaraya.vercel.app/terms",
    siteName: "Svaraya",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "Svaraya Terms of Service",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "Svaraya Terms of Service",
      "description":
        "Legal terms governing the use of Svaraya client-side Web Audio software and creator intellectual property ownership.",
      "url": "https://svaraya.vercel.app/terms",
    },
  ],
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
          <PageHeader
            eyebrow="Legal & Terms"
            title="Terms of Service"
            lead="Terms governing your access to and use of Svaraya by Nyxen × Xpert Melody. Clear, concise conditions built for creative professionals."
          />

          <SectionSeam />

          {/* AEO Quick Summary */}
          <section
            aria-label="AEO Quick Summary"
            className="rounded-2xl border border-violet/30 bg-violet/5 p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-violet font-semibold text-xs uppercase tracking-wider">
              <Sparkle size={16} weight="duotone" />
              <span>AEO Executive Summary · Creator IP Guarantee</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-fg/90">
              <strong>You retain 100% full copyright, commercial rights, and ownership</strong> over all audio files and stems
              you import into or export from Svaraya. Neither Nyxen nor Xpert Melody nor Svaraya claims any royalties, licensing rights,
              or intellectual property stakes in your musical creations. Svaraya is a local-first software utility that runs solely on your device.
            </p>
          </section>

          <article className="space-y-8 text-xs sm:text-sm leading-relaxed text-muted">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-fg">1. Nature of the Service</h2>
              <p>
                Svaraya is a free, browser-based digital audio workstation (DAW) utility provided by Nyxen and Xpert Melody.
                All audio transformation, DSP node processing, and file exports are executed locally
                within the user&apos;s browser client. Svaraya does not host, store, or re-transmit your audio files.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-fg">2. Ownership and Intellectual Property</h2>
              <p>
                You retain 100% full ownership, copyright, and intellectual property rights over all audio files,
                stems, samples, and musical recordings you process with Svaraya. Nyxen, Xpert Melody, and Svaraya claim no rights,
                licenses, or royalties over your input files or rendered output files. You are free to use your exported masters for
                personal, commercial, streaming, and broadcast purposes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-fg">3. Acceptable Use and Copyright Compliance</h2>
              <p>
                You agree to use Svaraya in compliance with all applicable local and international copyright laws.
                You must possess the requisite rights, licenses, or fair-use permissions to process, alter, and export any audio material
                you import into the software. Svaraya does not bypass DRM or copy protection schemes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-fg">4. Disclaimer and Limitation of Liability</h2>
              <p>
                Svaraya is provided &ldquo;as is&rdquo; without warranties of any kind, whether express or implied.
                Because DSP processing relies upon your client device&apos;s CPU and browser Web Audio implementation,
                Svaraya cannot guarantee uninterrupted performance or compatibility across every hardware configuration.
                Always maintain independent backup copies of your source audio files.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-fg">5. Questions and Inquiries</h2>
              <p>
                For data protection and architecture details, please consult our{" "}
                <Link href="/privacy" className="text-violet hover:underline font-medium">
                  Privacy Policy
                </Link>
                , read{" "}
                <Link href="/how-it-works" className="text-violet hover:underline font-medium">
                  How It Works
                </Link>
                , or learn more on our{" "}
                <Link href="/about" className="text-violet hover:underline font-medium">
                  About
                </Link>{" "}
                page.
              </p>
            </section>
          </article>
        </div>
      </div>
    </>
  );
}
