"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Clock,
  MagnifyingGlass,
  Sliders,
  Sparkle,
  Waveform,
  X,
} from "@phosphor-icons/react";
import { PresetIcon } from "@/components/icons/preset-icons";
import type { PresetArticleMeta } from "@/config/blog-registry";
import { cn } from "@/lib/utils";

interface BlogClientProps {
  articles: PresetArticleMeta[];
}

const CATEGORY_TABS = [
  { id: "all", label: "All Guides" },
  { id: "Speed & Viral Edits", label: "Speed & Viral" },
  { id: "Spatial Audio", label: "Spatial Audio" },
  { id: "Bass & Equalizer", label: "Bass & EQ" },
  { id: "Reverb & Echo", label: "Reverb & Echo" },
  { id: "Pitch & Tuning", label: "Pitch & Tuning" },
  { id: "Creative Filters", label: "Creative Filters" },
  { id: "Acoustic Spaces & Lofi", label: "Acoustic Spaces" },
];

export function BlogClient({ articles }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputId = useId();

  // Flagship featured articles (Slowed + Reverb & 8D Audio)
  const featuredSlugs = ["slowed-reverb", "8d-audio"];
  const featuredArticles = useMemo(
    () => articles.filter((a) => featuredSlugs.includes(a.slug)),
    [articles]
  );

  // Core spotlight articles
  const spotlightSlugs = ["nightcore-daycore", "bass-boost-heavy", "432hz-tuning"];
  const spotlightArticles = useMemo(
    () => articles.filter((a) => spotlightSlugs.includes(a.slug)),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "all" || article.categoryLabel === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [articles, selectedCategory, searchQuery]);

  const isFiltering = searchQuery.trim().length > 0 || selectedCategory !== "all";

  return (
    <div className="space-y-12">
      {/* Search and Category Filter Navigation */}
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <label htmlFor={searchInputId} className="sr-only">
            Search articles and guides
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted">
            <MagnifyingGlass className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            id={searchInputId}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 38 audio guides by topic, formula, or effect (e.g. slowed, binaural, 432 Hz, low-shelf)..."
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-9 text-sm text-fg placeholder:text-muted focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-fg"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div
          role="tablist"
          aria-label="Article categories"
          className="flex flex-wrap items-center gap-2"
        >
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            const count =
              tab.id === "all"
                ? articles.length
                : articles.filter((a) => a.categoryLabel === tab.id).length;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-violet text-white shadow-sm"
                    : "bg-surface border border-line text-muted hover:text-fg hover:border-violet/40"
                )}
              >
                <span>{tab.label}</span>
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

      {/* FILTERED VIEW */}
      {isFiltering ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              Showing {filteredArticles.length}{" "}
              {filteredArticles.length === 1 ? "guide" : "guides"}
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
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

          {filteredArticles.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <article
                  key={article.slug}
                  className="group flex flex-col justify-between rounded-xl border border-line bg-surface p-5 transition-all hover:border-violet/50 hover:bg-surface/90"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-violet">
                        <PresetIcon
                          presetId={article.presetId ?? ""}
                          size={15}
                          weight="duotone"
                          className="shrink-0"
                        />
                        <span>{article.categoryLabel}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-muted">
                        <Clock size={12} />
                        <span>{article.readMinutes} min</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-fg group-hover:text-violet transition-colors">
                      <Link href={`/blog/${article.slug}`} className="focus:outline-none">
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-muted leading-relaxed line-clamp-3">
                      {article.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="font-medium text-violet group-hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read guide</span>
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    {article.presetId && (
                      <Link
                        href={`/studio?preset=${article.presetId}`}
                        className="text-[11px] text-muted hover:text-fg inline-flex items-center gap-1"
                      >
                        <Sliders size={12} />
                        <span>Studio</span>
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-line bg-surface p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet/10 text-violet">
                <BookOpenText className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-fg">No guides found</h3>
              <p className="mt-2 text-xs text-muted max-w-sm mx-auto">
                No articles matched &ldquo;{searchQuery}&rdquo;. Try another term or reset your filters to see all 38 guides.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet px-4 py-2 text-xs font-semibold text-white hover:bg-violet-dark transition-colors"
              >
                Show all guides
              </button>
            </div>
          )}
        </div>
      ) : (
        /* EDITORIAL COMPOSITION (DEFAULT UNFILTERED VIEW) */
        <div className="space-y-14">
          {/* 1. Flagship Featured Pair */}
          <section aria-labelledby="featured-guides-heading" className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkle className="h-4 w-4 text-violet" />
              <h2 id="featured-guides-heading" className="text-xs font-semibold uppercase tracking-wider text-violet">
                Flagship Research Guides
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {featuredArticles.map((article) => (
                <article
                  key={article.slug}
                  className="group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 sm:p-7 transition-all hover:border-violet/60 hover:shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet/10 px-2.5 py-1 text-xs font-semibold text-violet">
                        <PresetIcon
                          presetId={article.presetId ?? ""}
                          size={16}
                          weight="duotone"
                          className="shrink-0"
                        />
                        <span>{article.categoryLabel}</span>
                      </span>
                      <span className="flex items-center gap-1 text-xs font-mono text-muted">
                        <Clock size={13} />
                        <span>{article.readMinutes} min read</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-fg group-hover:text-violet transition-colors">
                      <Link href={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-sm text-muted leading-relaxed">
                      {article.description}
                    </p>

                    <div className="pt-2 text-xs text-muted/80">
                      <span>By </span>
                      <strong className="text-fg font-medium">Nyxen & Xpert Melody</strong>
                      <span className="mx-2">•</span>
                      <span>Verified Web Audio DSP</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-line/60 flex items-center justify-between">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet group-hover:underline"
                    >
                      <span>Read comprehensive breakdown</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    {article.presetId && (
                      <Link
                        href={`/studio?preset=${article.presetId}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-fg"
                      >
                        <Waveform size={13} />
                        <span>Open in Studio</span>
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 2. Editorial Spotlight Trio */}
          <section aria-labelledby="spotlight-heading" className="space-y-4">
            <h2 id="spotlight-heading" className="text-xs font-semibold uppercase tracking-wider text-muted">
              Deep Dives & Acoustics
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              {spotlightArticles.map((article) => (
                <article
                  key={article.slug}
                  className="group flex flex-col justify-between rounded-xl border border-line bg-surface p-5 transition-all hover:border-violet/40"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-violet uppercase tracking-wide">
                        {article.categoryLabel}
                      </span>
                      <span className="text-[11px] font-mono text-muted">
                        {article.readMinutes}m
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-fg group-hover:text-violet transition-colors">
                      <Link href={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3">
                      {article.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="font-medium text-violet group-hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read guide</span>
                      <ArrowRight size={12} />
                    </Link>
                    {article.presetId && (
                      <Link
                        href={`/studio?preset=${article.presetId}`}
                        className="text-muted hover:text-fg inline-flex items-center gap-1 text-[11px]"
                      >
                        <Sliders size={12} />
                        <span>Test</span>
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 3. The Full Registry Collection */}
          <section aria-labelledby="all-articles-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 id="all-articles-heading" className="text-xs font-semibold uppercase tracking-wider text-muted">
                Complete Engineering Archive ({articles.length} guides)
              </h2>
              <span className="text-xs text-muted">Sorted by acoustic domain</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles
                .filter(
                  (a) =>
                    !featuredSlugs.includes(a.slug) &&
                    !spotlightSlugs.includes(a.slug)
                )
                .map((article) => (
                  <article
                    key={article.slug}
                    className="group flex flex-col justify-between rounded-xl border border-line bg-surface p-4 transition-all hover:border-violet/40"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-violet">
                          <PresetIcon
                            presetId={article.presetId ?? ""}
                            size={14}
                            weight="duotone"
                          />
                          <span className="truncate max-w-[140px]">{article.categoryLabel}</span>
                        </span>
                        <span className="text-[10px] font-mono text-muted shrink-0">
                          {article.readMinutes} min
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-fg group-hover:text-violet transition-colors line-clamp-2">
                        <Link href={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-muted leading-relaxed line-clamp-2">
                        {article.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-line/60 flex items-center justify-between text-xs">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="font-medium text-violet group-hover:underline inline-flex items-center gap-1"
                      >
                        <span>Read</span>
                        <ArrowRight size={11} />
                      </Link>
                      {article.presetId && (
                        <Link
                          href={`/studio?preset=${article.presetId}`}
                          className="text-[11px] text-muted hover:text-fg"
                        >
                          Studio →
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
