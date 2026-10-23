"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, X, Sliders, Waveform, ShieldCheck, Question, Faders, Wrench } from "@phosphor-icons/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { FAQ_DATA, type FaqCategory } from "./faq-data";

const CATEGORIES: { id: FaqCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "All questions", icon: Question },
  { id: "getting-started", label: "Getting started", icon: Waveform },
  { id: "audio-processing", label: "Audio processing", icon: Sliders },
  { id: "presets-effects", label: "Presets & effects", icon: Faders },
  { id: "formats-exports", label: "Formats & exports", icon: Wrench },
  { id: "privacy-files", label: "Privacy & files", icon: ShieldCheck },
  { id: "troubleshooting", label: "Troubleshooting", icon: Wrench },
];

export function FaqClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>("all");
  const searchInputId = useId();

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_DATA.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answerText.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Toolbar */}
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <label htmlFor={searchInputId} className="sr-only">
            Search frequently asked questions
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted">
            <MagnifyingGlass className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            id={searchInputId}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords (e.g. 10 MB limit, MP3, 8D audio, latency)..."
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-9 text-sm text-fg placeholder:text-muted focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-fg"
              aria-label="Clear search input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div
          role="tablist"
          aria-label="FAQ categories"
          className="flex flex-wrap items-center gap-2"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === "all"
                ? FAQ_DATA.length
                : FAQ_DATA.filter((f) => f.category === cat.id).length;

            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-violet text-white shadow-sm"
                    : "bg-surface border border-line text-muted hover:text-fg hover:border-violet/40"
                )}
              >
                <span>{cat.label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] font-mono",
                    isSelected ? "bg-white/20 text-white" : "bg-black/5 dark:bg-white/10 text-muted"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results summary when filtered */}
      {(searchQuery || selectedCategory !== "all") && (
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? "result" : "results"}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-violet hover:underline font-medium"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* FAQ Accordion List or Empty State */}
      {filteredFaqs.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-3">
          {filteredFaqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left font-semibold text-fg">
                <span className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                  <span>{faq.question}</span>
                  <span className="inline-flex self-start rounded bg-violet/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-violet">
                    {faq.categoryLabel}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted leading-relaxed">
                {faq.answerNode}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet/10 text-violet">
            <Question className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-fg">No answers matched your query</h3>
          <p className="mt-2 text-xs text-muted max-w-sm mx-auto">
            We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;. Try another term, clear your search, or ask us directly.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="rounded-lg border border-line bg-canvas px-4 py-2 text-xs font-medium text-fg hover:border-violet"
            >
              Clear search & filters
            </button>
            <Link
              href="/contact"
              className="rounded-lg bg-violet px-4 py-2 text-xs font-semibold text-white hover:bg-violet-dark transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
