import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { siteConfig } from "@/config/site";
import { AdBanner } from "@/components/advertising/ad-banner";
import {
  ArrowRight,
  BookOpen,
  EnvelopeSimple,
  Question,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";
import { HELP_TOPICS } from "./topic-data";

export const metadata: Metadata = {
  title: "Audio Processing & Performance Help — Audify",
  description:
    "Troubleshoot Audify performance: slow processing, browser memory limits, the 10 MB studio / 50 MB tool upload limits, playback issues, failed exports, hot mobile devices, slow ad loading, and 100% local privacy.",
  alternates: {
    canonical: `${siteConfig.url}/help/performance`,
  },
  openGraph: {
    title: "Audio Processing & Performance Help — Audify",
    description:
      "Troubleshooting guide for Audify: slow processing, browser memory limits, upload limits, playback and export issues, and 100% local processing privacy.",
    url: `${siteConfig.url}/help/performance`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const RESOURCE_LINKS = [
  {
    href: "/faq",
    icon: Question,
    title: "FAQ",
    desc: "Common questions about formats, exports, 8D audio and privacy.",
  },
  {
    href: "/tools",
    icon: Wrench,
    title: "Audio Tools",
    desc: "Converters, trimmers and analyzers — each accepting up to 50 MB.",
  },
  {
    href: "/contact",
    icon: EnvelopeSimple,
    title: "Contact",
    desc: "Still stuck? Send us a message and we'll help you out.",
  },
];

export default function PerformanceHelpPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 pb-24">
      <PageHeader
        eyebrow="Help Center"
        title="Audio Processing & Performance Help"
        lead={
          <>
            Audio processing performance depends on your device, browser, file
            size, and selected effects. If Audify feels slow or something
            doesn&apos;t work as expected, use this guide to troubleshoot common
            issues.
          </>
        }
      />

      <AdBanner
        id="help-performance-top"
        className="mt-8"
        note="Audify is free thanks to sponsors."
      />

      {/* Symptom picker / table of contents — plain anchor links, works without JavaScript */}
      <nav aria-label="Troubleshooting topics" className="my-10">
        <p className="eyebrow text-accent">Find your problem</p>
        <ul
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          role="list"
        >
          {HELP_TOPICS.map((topic) => (
            <li key={topic.id}>
              <a
                href={`#${topic.id}`}
                className="group block h-full rounded-lg border border-line bg-surface/60 p-4 transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span className="block text-sm font-semibold text-fg group-hover:text-accent">
                  {topic.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">
                  {topic.blurb}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <SectionSeam />

      {HELP_TOPICS.map((topic, index) => (
        <section
          key={topic.id}
          id={topic.id}
          aria-labelledby={`${topic.id}-heading`}
          className="scroll-mt-24 py-8 sm:py-10"
        >
          <h2
            id={`${topic.id}-heading`}
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-fg"
          >
            <span className="mr-2 text-sm font-medium text-muted">
              {index + 1}.
            </span>
            {topic.title}
          </h2>
          <ul
            className="mt-5 space-y-2.5 max-w-2xl"
            role="list"
          >
            {topic.steps.map((step) => (
              <li
                key={step}
                className="flex gap-3 text-sm leading-relaxed text-muted"
              >
                <span
                  aria-hidden="true"
                  className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70"
                />
                <span>{step}</span>
              </li>
            ))}
          </ul>
          {topic.notes?.map((note) => (
            <p
              key={note}
              className="mt-4 max-w-2xl rounded-lg border border-line bg-surface/60 p-4 text-sm leading-relaxed text-muted"
            >
              {note}
            </p>
          ))}
          {topic.id === "slow-processing" && (
            <p className="mt-4 max-w-2xl text-sm text-muted">
              New to effect settings? Browse the{" "}
              <Link
                href="/presets"
                className="text-accent underline-offset-4 hover:underline"
              >
                Presets &amp; Tools Matrix
              </Link>{" "}
              to learn what each preset layers before you render.
            </p>
          )}
          {topic.id === "upload-fails" && (
            <p className="mt-4 max-w-2xl text-sm text-muted">
              The Studio ({" "}
              <Link
                href="/studio"
                className="text-accent underline-offset-4 hover:underline"
              >
                /studio
              </Link>{" "}
              ) enforces the 10 MB limit; the individual{" "}
              <Link
                href="/tools"
                className="text-accent underline-offset-4 hover:underline"
              >
                audio tools
              </Link>{" "}
              accept up to 50 MB per file.
            </p>
          )}
        </section>
      ))}

      <SectionSeam />

      {/* Still having trouble? */}
      <section
        id="still-having-trouble"
        aria-labelledby="still-having-trouble-heading"
        className="py-10"
      >
        <h2
          id="still-having-trouble-heading"
          className="text-2xl sm:text-3xl font-semibold tracking-tight text-fg"
        >
          Still having trouble?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          If nothing above resolves your issue, tell us what happened. The
          more detail you share — file size, browser, the step that failed —
          the faster we can help.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3 max-w-2xl">
          {RESOURCE_LINKS.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="group rounded-lg border border-line bg-surface/60 p-4 transition-colors hover:border-accent/50"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-fg group-hover:text-accent">
                <resource.icon size={18} aria-hidden="true" />
                {resource.title}
              </span>
              <span className="mt-1.5 block text-xs leading-relaxed text-muted">
                {resource.desc}
              </span>
              <span
                aria-hidden="true"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent"
              >
                Visit <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-xs text-muted">
          For content questions, the{" "}
          <Link
            href="/faq"
            className="text-accent underline-offset-4 hover:underline"
          >
            FAQ
          </Link>{" "}
          and{" "}
          <Link
            href="/how-it-works"
            className="text-accent underline-offset-4 hover:underline"
          >
            How it works
          </Link>{" "}
          pages explain the engine in more depth.
        </p>
        <p className="mt-2 max-w-2xl text-xs text-muted">
          <BookOpen size={12} className="mr-1 inline" aria-hidden="true" />
          Audio is processed 100% locally in your browser — nothing is uploaded
          to any server. Your audio files never leave your device.
        </p>
      </section>

      <AdBanner
        id="help-performance-bottom"
        className="mt-8"
      />
    </div>
  );
}
