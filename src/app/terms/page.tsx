import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";

export const metadata: Metadata = {
  title: "Terms of Service — Svaraya Audio Processing",
  description:
    "Terms of service governing the usage of Svaraya browser audio tools, acceptable use, and intellectual property ownership.",
};

export default function TermsPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Legal & Terms"
          title="Terms of Service"
          lead="Terms governing your access to and use of Svaraya by Nyxen. Clear, concise conditions built for creative professionals."
        />

        <SectionSeam />

        <article className="space-y-8 text-xs sm:text-sm leading-relaxed text-muted">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-fg">1. Nature of the Service</h2>
            <p>
              Svaraya is a free, browser-based audio transformation tool provided by Nyxen.
              All audio transformation, DSP node processing, and file exports are executed locally
              within the user&apos;s browser client. Svaraya does not host, store, or re-transmit your audio files.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-fg">2. Ownership and Intellectual Property</h2>
            <p>
              You retain 100% full ownership, copyright, and intellectual property rights over all audio files,
              stems, samples, and musical recordings you process with Svaraya. Nyxen and Svaraya claim no rights,
              licenses, or royalties over your input files or rendered output files.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-fg">3. Acceptable Use</h2>
            <p>
              You agree to use Svaraya in compliance with all applicable local and international copyright laws.
              You must have the requisite rights or permissions to process, alter, and export any audio material
              you import into the software.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-fg">4. Disclaimer and Limitation of Liability</h2>
            <p>
              Svaraya is provided &ldquo;as is&rdquo; without warranties of any kind. Because processing is dependent
              on client hardware capabilities and browser Web Audio implementation, Svaraya cannot guarantee
              uninterrupted performance on every device. Always keep backup copies of your source audio files.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-fg">5. Questions</h2>
            <p>
              For data and architecture details, please consult our{" "}
              <Link href="/privacy" className="text-violet hover:underline font-medium">
                Privacy Policy
              </Link>{" "}
              or{" "}
              <Link href="/how-it-works" className="text-violet hover:underline font-medium">
                How It Works
              </Link>
              .
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
