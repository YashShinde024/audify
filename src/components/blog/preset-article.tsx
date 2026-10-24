import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Lightbulb,
  MagnifyingGlass,
  Sliders,
  Target,
  Waveform,
} from "@phosphor-icons/react/dist/ssr";
import { presets } from "@/config/presets";
import {
  presetArticleRegistry,
  type PresetArticleMeta,
} from "@/config/blog-registry";
import type { PresetArticleBody } from "@/config/preset-article-bodies/article-bodies-a";
import { siteConfig } from "@/config/site";

const CRUMB_JSON_LD = (title: string, slug: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "Guides", item: `${siteConfig.url}/blog` },
    { "@type": "ListItem", position: 3, name: title, item: `${siteConfig.url}/blog/${slug}` },
  ],
});

function RelatedGuideSlug({ slug }: { slug: string }) {
  const meta = presetArticleRegistry.find((a) => a.slug === slug);
  if (!meta) return null;
  return (
    <li>
      <Link
        href={`/blog/${slug}`}
        className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-raised px-4 py-3 transition hover:border-accent hover:bg-accent-soft"
      >
        <span className="font-medium text-fg text-sm sm:text-base">{meta.title}</span>
        <ArrowRight size={16} weight="bold" className="text-muted group-hover:text-accent shrink-0" />
      </Link>
    </li>
  );
}

export function PresetArticle({ meta, body }: { meta: PresetArticleMeta; body: PresetArticleBody }) {
  const preset = presets.find((p) => p.id === meta.presetId);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CRUMB_JSON_LD(meta.title, meta.slug)) }}
      />
      <article className="mx-auto w-full max-w-3xl px-4 sm:px-6 pt-10 pb-20">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-accent">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/blog" className="hover:text-accent">Guides</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-fg">{meta.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <header>
          <p className="mb-3 flex items-center gap-2 text-sm text-accent font-semibold tracking-wide uppercase">
            <BookOpenText size={16} weight="bold" />
            {meta.categoryLabel} · {meta.readMinutes} min read
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg text-balance">
            {meta.title}
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">{body.what}</p>
          {body.detail && (
            <p className="mt-4 text-base text-fg/80 leading-relaxed">{body.detail}</p>
          )}
        </header>

        {/* How it works — DSP */}
        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-fg mb-4">
            <Waveform size={20} className="text-accent" weight="duotone" />
            How it works: the DSP pipeline
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            This is exactly what the render pipeline in Audify does with your parameters —
            every step reflects the actual Web Audio graph, not marketing copy.
          </p>
          <ol className="space-y-3">
            {body.dsp.map((step, i) => (
              <li key={i} className="flex gap-3 rounded-lg border border-line bg-raised px-4 py-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-sm sm:text-[15px] text-fg leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* The sound */}
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-fg mb-4">
            <Target size={20} className="text-accent" weight="duotone" />
            The sound
          </h2>
          <p className="text-fg/90 leading-relaxed">{body.sound}</p>
        </section>

        {/* Parameters — derived live from the preset definitions */}
        {preset && preset.params.length > 0 && (
          <section className="mt-12">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-fg mb-2">
              <Sliders size={20} className="text-accent" weight="duotone" />
              Parameters in the Studio
            </h2>
            <p className="text-sm text-muted mb-4">
              Taken live from the preset definition, so this table never drifts from the app.
            </p>
            <div className="overflow-x-auto rounded-xl border border-line bg-raised">
              <table className="w-full text-sm min-w-[540px]">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
                    <th scope="col" className="px-4 py-3">Control</th>
                    <th scope="col" className="px-4 py-3">Range</th>
                    <th scope="col" className="px-4 py-3">What it does</th>
                  </tr>
                </thead>
                <tbody className="px-4">
                  {preset.params.map((param) => (
                    <tr key={param.id} className="border-b border-line/60 last:border-0">
                      <td className="px-4 py-3 font-medium text-fg align-top whitespace-nowrap">{param.label}</td>
                      <td className="px-4 py-3 text-muted align-top whitespace-nowrap">
                        {param.kind === "slider"
                          ? `${param.min}–${param.max}${param.unit ? ` ${param.unit}` : ""}`
                          : param.kind === "select"
                            ? param.options.map((o) => String(o.value)).join(" / ")
                            : "on / off"}
                      </td>
                      <td className="px-4 py-3 text-muted align-top">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tips */}
        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-fg mb-4">
            <Lightbulb size={20} className="text-accent" weight="duotone" />
            Practical tips
          </h2>
          <ul className="space-y-3">
            {body.tips.map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                <span className="text-sm sm:text-[15px] text-fg/90 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Use cases */}
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-fg mb-4">
            <MagnifyingGlass size={20} className="text-accent" weight="duotone" />
            Use cases
          </h2>
          <ul className="flex flex-wrap gap-2">
            {body.useCases.map((useCase) => (
              <li
                key={useCase}
                className="rounded-full border border-line bg-raised px-4 py-1.5 text-sm text-muted"
              >
                {useCase}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-accent/30 bg-accent-soft px-6 py-8 text-center">
          <h2 className="text-xl font-semibold text-fg">Try this preset in the Studio</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted leading-relaxed">
            All of this runs locally in your browser. Load your file, pick the preset, export —
            nothing is ever uploaded.
          </p>
          <Link
            href="/studio"
            className="btn-gradient-primary mt-5 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md active:scale-95 transition-all"
          >
            <span>Open in Studio</span>
            <ArrowRight size={16} weight="bold" className="btn-arrow transition-transform duration-200" />
          </Link>
        </section>

        {/* Related */}
        {body.related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-semibold text-fg mb-1">Related guides</h2>
            <p className="text-sm text-muted mb-4">Continue through the knowledge base.</p>
            <ul className="space-y-2">
              {body.related.map((slug) => (
                <RelatedGuideSlug key={slug} slug={slug} />
              ))}
            </ul>
          </section>
        )}

        {/* Footer note */}
        <footer className="mt-14 border-t border-line pt-6 text-xs text-muted">
          <p>
            Part of the Audify knowledge base ·{" "}
            <Link href="/blog" className="hover:text-accent">all guides</Link> ·{" "}
            <Link href="/presets" className="hover:text-accent">all presets</Link>
          </p>
          <p className="mt-1 text-muted/70">Last reviewed October 2026.</p>
        </footer>
      </article>
    </>
  );
}

export function generateArticleMetadata(meta: PresetArticleMeta): Metadata {
  return {
    title: `${meta.title} — ${siteConfig.name}`,
    description: meta.description,
    alternates: { canonical: `/blog/${meta.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/blog/${meta.slug}`,
      siteName: siteConfig.name,
      type: "article",
    },
  };
}
