import type { Metadata } from "next";
import Link from "next/link";
import {
  EnvelopeSimple,
  GlobeHemisphereWest,
  ArrowUpRight,
  ShieldCheck,
  Question,
  ChatCircleText,
  Clock,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { siteConfig } from "@/config/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Audify — Let’s Talk Sound",
  description:
    "Have a question, found an issue, or want to work together? Send a direct message to the Audify engineering team (Nyxen × Xpert Melody).",
  openGraph: {
    title: "Contact Audify — Let’s Talk Sound",
    description:
      "Direct communication channel for technical support, acoustic preset requests, and music partnerships.",
    url: `${siteConfig.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        <PageHeader
          eyebrow="Get in Touch"
          title="Let’s talk sound."
          lead="Have a question, found an issue, or want to work together? Send us a message."
        />

        <SectionSeam />

        {/* Balanced Two-Column Layout */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Context, Verified Channels, Response Times (Cols 1-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="surface-card rounded-2xl border border-line bg-surface p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ChatCircleText size={20} weight="duotone" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-fg">Direct Creator Access</h2>
                  <p className="text-[11px] text-muted">Audify by Nyxen × Xpert Melody</p>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed">
                Audify is built by independent creators. Messages go straight to the engineering and sound design inbox without call centers or automated chatbot runarounds.
              </p>

              <div className="pt-2 border-t border-line space-y-2 text-xs">
                <div className="flex items-center gap-2 text-fg font-medium">
                  <Clock size={14} className="text-primary shrink-0" />
                  <span>Response expectation: 24–48 hours</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <ShieldCheck size={14} className="text-primary shrink-0" />
                  <span>Private and confidential · Zero marketing lists</span>
                </div>
              </div>
            </div>

            {/* Direct Email Channel Card */}
            <div className="surface-card rounded-2xl border border-line bg-surface p-6 space-y-3.5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                Direct Email Directory
              </h3>

              <div className="space-y-2.5">
                <a
                  href="mailto:hello@nyxen.in"
                  className="group flex items-center justify-between rounded-xl border border-line bg-canvas p-3 hover:border-primary/40 hover:bg-surface transition-all"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[11px] font-mono uppercase text-muted group-hover:text-primary">
                      General &amp; Partnerships
                    </p>
                    <p className="text-xs font-semibold text-fg font-mono">hello@nyxen.in</p>
                  </div>
                  <EnvelopeSimple size={16} className="text-muted group-hover:text-primary shrink-0" />
                </a>

                <a
                  href="mailto:support@nyxen.in"
                  className="group flex items-center justify-between rounded-xl border border-line bg-canvas p-3 hover:border-primary/40 hover:bg-surface transition-all"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[11px] font-mono uppercase text-muted group-hover:text-primary">
                      Technical &amp; DSP Issues
                    </p>
                    <p className="text-xs font-semibold text-fg font-mono">support@nyxen.in</p>
                  </div>
                  <EnvelopeSimple size={16} className="text-muted group-hover:text-primary shrink-0" />
                </a>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-line">
                <span className="text-muted text-[11px]">Parent organization:</span>
                <a
                  href="https://nyxen.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-hover text-[11px] font-mono"
                >
                  <GlobeHemisphereWest size={13} />
                  <span>nyxen.in</span>
                  <ArrowUpRight size={10} weight="bold" />
                </a>
              </div>
            </div>

            {/* Quick FAQ Link */}
            <div className="rounded-2xl border border-line bg-canvas p-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted">
                <Question size={16} className="text-primary shrink-0" />
                <span>Looking for answers on formats or privacy?</span>
              </div>
              <Link
                href="/faq"
                className="font-semibold text-primary hover:text-primary-hover shrink-0"
              >
                Browse FAQ →
              </Link>
            </div>
          </div>

          {/* Right Column: Contact Form (Cols 6-12) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
