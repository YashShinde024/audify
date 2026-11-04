import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Waveform, ArrowRight, CalendarBlank, Clock, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { siteConfig } from "@/config/site";
import { PUBLISHED_ARTICLES } from "@/config/blog-posts";

export const metadata: Metadata = {
  title: "Audify Blog — Audio Engineering & Acoustic Editorial",
  description:
    "In-depth articles, DSP architecture guides, and acoustic research on browser-based sound manipulation from Nyxen × Xpert Melody.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: "Audify Blog — Audio Engineering & Acoustic Editorial",
    description:
      "In-depth articles, DSP architecture guides, and acoustic research on browser-based sound manipulation from Nyxen × Xpert Melody.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/images/audify-og.png`,
        width: 1200,
        height: 630,
        alt: "Audify Blog — Audio Engineering & Acoustic Editorial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Audify Blog — Audio Engineering & Acoustic Editorial",
    description:
      "In-depth articles, DSP architecture guides, and acoustic research on browser-based sound manipulation from Nyxen × Xpert Melody.",
    creator: "@buildnyxen",
    images: [`${siteConfig.url}/images/audify-og.png`],
  },
};

const BLOG_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": `${siteConfig.url}/blog#blog`,
      name: "Audify Editorial & Acoustic Research",
      description:
        "Technical articles and acoustic essays exploring in-browser Web Audio DSP, spatial soundscapes, and creative audio tools.",
      url: `${siteConfig.url}/blog`,
      publisher: {
        "@type": "Organization",
        name: "Nyxen",
        url: "https://nyxen.in",
      },
    },
    {
      "@type": "ItemList",
      itemListElement: PUBLISHED_ARTICLES.map((article, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${siteConfig.url}/blog/${article.slug}`,
        name: article.title,
      })),
    },
  ],
};

export default function BlogIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_JSON_LD) }}
      />
      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <PageHeader
            eyebrow="Editorial & Acoustic Research"
            title="Audify Blog"
            lead="Technical deep dives, DSP pipeline walkthroughs, and acoustic sound design insights authored by the engineers and producers behind Audify."
          />

          <SectionSeam />

          {/* Featured Editorial Article */}
          <section aria-labelledby="featured-articles-heading" className="space-y-6">
            <h2 id="featured-articles-heading" className="sr-only">
              Featured Articles
            </h2>

            <div className="grid gap-6">
              {PUBLISHED_ARTICLES.map((article) => (
                <article
                  key={article.slug}
                  className="group relative rounded-2xl border border-line bg-surface/80 p-6 sm:p-8 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-surface hover:shadow-lg flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className="relative w-full md:w-72 h-44 shrink-0 overflow-hidden rounded-xl border border-line bg-canvas">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 288px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-canvas/90 px-2 py-0.5 text-[10px] font-mono font-medium text-primary backdrop-blur-xs border border-line">
                      <Sparkle size={11} weight="fill" />
                      <span>{article.category}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <CalendarBlank size={13} />
                        <time dateTime={article.publishedAt}>November 4, 2026</time>
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={13} />
                        <span>{article.readingTime}</span>
                      </span>
                      <span>·</span>
                      <span className="font-medium text-fg">
                        By {article.author.map((a) => a.name).join(" × ")}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-fg group-hover:text-primary transition-colors">
                      <Link href={`/blog/${article.slug}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                      {article.description}
                    </p>

                    <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <span>Read Full Analysis</span>
                      <ArrowRight size={13} weight="bold" className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <SectionSeam />

          {/* Practical Studio Bridge Section */}
          <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-fg">
                Experience in-browser DSP first-hand
              </h3>
              <p className="text-xs text-muted max-w-lg leading-relaxed">
                Audify executes all 32-bit float audio sculpting locally in your browser. Load any track to test creative presets, spatial 8D orbits, and file utilities.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-canvas px-4 py-2.5 text-xs font-semibold text-fg hover:border-primary transition-colors"
              >
                <BookOpen size={15} />
                <span>Audio Pipeline Guide</span>
              </Link>
              <Link
                href="/studio"
                className="btn-gradient-primary btn-sweep-reverse inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-sm"
              >
                <Waveform size={15} weight="bold" />
                <span>Open Audify Studio</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
