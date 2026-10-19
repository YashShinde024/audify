import type { Metadata } from "next";
import Link from "next/link";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Svaraya",
  description:
    "Everything you need to know about Svaraya: local audio processing, file formats, export fidelity, and privacy guarantees.",
};

export default function FAQPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Help & Information"
          title="Questions & Answers"
          lead="Everything you need to know about Svaraya, from supported audio formats and local browser DSP to export downloads and privacy."
        />

        <SectionSeam />

        <div className="mt-8">
          <FAQAccordion />
        </div>

        <div className="mt-12 rounded-xl border border-line bg-surface p-5 text-xs leading-relaxed text-muted">
          <p>
            Have more questions about architecture or data handling? Read our{" "}
            <Link href="/how-it-works" className="font-medium text-violet hover:underline">
              How It Works
            </Link>{" "}
            pipeline guide or inspect our{" "}
            <Link href="/privacy" className="font-medium text-violet hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
