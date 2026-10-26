"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarBlank, ListNumbers, ShieldCheck } from "@phosphor-icons/react";
import { AdBanner } from "@/components/advertising/ad-banner";

export interface LegalSectionItem {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  lead: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: LegalSectionItem[];
  otherDocumentLink: {
    href: string;
    label: string;
  };
  children: ReactNode;
}

export function LegalPageLayout({
  eyebrow,
  title,
  lead,
  effectiveDate,
  lastUpdated,
  sections,
  otherDocumentLink,
  children,
}: LegalPageLayoutProps) {
  const docPrefix = eyebrow.toLowerCase().includes("terms") ? "terms" : "privacy";

  return (
    <div className="min-h-full bg-canvas py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 text-xs">
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 font-medium text-muted hover:text-fg transition-colors group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            <span>Return to Studio</span>
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-faint font-mono text-[11px]">
            <span className="inline-flex items-center gap-1">
              <CalendarBlank size={13} className="text-muted" />
              <span>Effective: {effectiveDate}</span>
            </span>
            <span aria-hidden="true" className="text-line-strong">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={13} className="text-muted" />
              <span>Last updated: {lastUpdated}</span>
            </span>
          </div>
        </div>

        {/* Document Header */}
        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>{eyebrow}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-fg">
            {title}
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-muted">
            {lead}
          </p>
        </header>

        {/* Mobile Jump Menu (Collapsible / Horizontal scrollable) */}
        {sections.length > 0 && (
          <nav aria-label="Table of contents jump links" className="lg:hidden rounded-xl border border-line bg-surface/70 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-fg">
              <ListNumbers size={16} className="text-primary" />
              <span>Quick Section Directory</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sections.map((sec, idx) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="rounded-md border border-line bg-raised px-2.5 py-1 text-[11px] text-muted hover:text-fg hover:border-primary/40 transition-colors"
                >
                  <span className="font-mono text-primary font-bold mr-1">{idx + 1}.</span>
                  <span>{sec.title}</span>
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* Top Legal Ad Placement */}
        <AdBanner id={`${docPrefix}-top`} className="my-2" />

        {/* 2-Column Desktop Document Layout with Sticky Table of Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Desktop Sticky Table of Contents (Col 1-4) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="rounded-2xl border border-line bg-surface/80 p-5 space-y-3.5 shadow-xs backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fg">
                <ListNumbers size={16} className="text-primary" />
                <span>Contents &amp; Clauses</span>
              </div>
              <nav aria-label="Desktop table of contents" className="space-y-1 text-xs">
                {sections.map((sec, idx) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block py-1.5 px-2 rounded-lg text-muted hover:text-fg hover:bg-raised transition-colors truncate"
                  >
                    <span className="font-mono text-primary font-semibold mr-1.5">{idx + 1}.</span>
                    <span>{sec.title}</span>
                  </a>
                ))}
              </nav>

              <div className="pt-3 border-t border-line/70">
                <Link
                  href={otherDocumentLink.href}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                >
                  <ShieldCheck size={14} />
                  <span>{otherDocumentLink.label}</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Legal Document Body (Col 5-12) */}
          <main className="lg:col-span-8 min-w-0 space-y-8">
            {children}

            {/* Bottom Legal Ad Placement */}
            <AdBanner id={`${docPrefix}-bottom`} className="my-4" />

            {/* Document Verification & Assistance Footer */}
            <footer className="mt-12 pt-8 border-t border-line space-y-4 text-xs text-muted">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-fg">Audify Legal &amp; Compliance</p>
                  <p className="text-[11px] text-faint mt-0.5">
                    Operated by Nyxen in partnership with Xpert Melody · Mumbai, Maharashtra, India
                  </p>
                </div>
                <Link
                  href={otherDocumentLink.href}
                  className="rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-fg hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {otherDocumentLink.label}
                </Link>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
