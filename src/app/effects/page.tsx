import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { effects, effectCategories } from "@/config/effects";
import { presetArticleRegistry } from "@/config/blog-registry";
import { EffectIcon } from "@/components/icons/preset-icons";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Effects Directory — Audify Audio DSP",
  description:
    "Comprehensive directory of supported audio DSP processing operations in Audify: Pitch & Speed, Reverb & Echo, Tone & EQ, Bass, Stereo, Creative, and Utility & Finishing.",
};

export default function EffectsPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="DSP Directory"
          title="Audio Effects Catalog"
          lead="Every audio transformation in Audify runs locally via browser Web Audio DSP nodes. Browse by sonic family, inspect parameters, and launch directly into the Studio."
        />

        <SectionSeam />

        {/* 7 Categories Breakdown */}
        <div className="space-y-12">
          {effectCategories.map((category) => {
            const items = effects.filter((effect) => effect.category === category);
            if (items.length === 0) return null;

            return (
              <section key={category} aria-labelledby={categoryToId(category)}>
                <div className="flex items-baseline justify-between border-b border-line pb-2.5">
                  <h2
                    id={categoryToId(category)}
                    className="text-base font-semibold tracking-tight text-fg flex items-center gap-2"
                  >
                    <span>{category}</span>
                    <span className="rounded bg-raised px-1.5 py-0.5 text-[11px] font-mono text-muted">
                      {items.length}
                    </span>
                  </h2>
                  <span className="text-xs text-muted">Web Audio Graph</span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {items.map((effect) => (
                    <div
                      key={effect.id}
                      className="surface-card glass-panel rounded-2xl border border-line p-5 sm:p-6 flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                              <EffectIcon effectId={effect.id} size={18} />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-fg group-hover:text-primary transition-colors">
                                {effect.name}
                              </h3>
                              <span className="text-[10px] font-mono text-muted">Web Audio Graph Node</span>
                            </div>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface border border-line px-2.5 py-0.5 text-[10px] font-medium text-muted font-mono">
                            <CheckCircle className="h-2.5 w-2.5 text-primary" weight="fill" />
                            Local DSP
                          </span>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-muted">
                          {effect.summary}
                        </p>

                        {/* Signal Node Chain */}
                        <div className="mt-3.5 bg-surface/80 p-2.5 rounded-xl border border-line/70">
                          <span className="text-[9px] uppercase tracking-wider text-faint block font-mono">
                            Signal Chain
                          </span>
                          <p className="text-[11px] font-mono text-primary font-medium mt-0.5">
                            {effect.dspNodeChain.join(" → ")}
                          </p>
                        </div>

                        {/* Parameters */}
                        <div className="mt-3.5 space-y-1.5 pt-2 border-t border-line/50">
                          {effect.parameters.map((param) => (
                            <div key={param.name} className="flex items-center justify-between text-[11px] text-muted">
                              <span className="font-medium text-fg">{param.name}</span>
                              <span className="font-mono text-faint">{param.range}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-line flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-faint">
                          {effect.parameters.length} parameter{effect.parameters.length > 1 ? "s" : ""}
                        </span>

                        {effect.targetPresetId && (
                          <div className="flex items-center gap-2.5">
                            <GuideLinkForPreset presetId={effect.targetPresetId} />
                            <Button asChild size="sm" variant="outline" className="h-7 px-3 text-xs shrink-0 rounded-lg border-line hover:border-primary/40">
                              <Link href={`/studio?preset=${effect.targetPresetId}`}>
                                Open in Studio
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function categoryToId(category: string): string {
  return `effects-${category.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
}

function GuideLinkForPreset({ presetId }: { presetId: string }) {
  const slug = presetArticleRegistry.find((a) => a.presetId === presetId)?.slug;
  if (!slug) return null;
  return (
    <Link
      href={`/blog/${slug}`}
      className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-accent hover:text-accent-hover transition-colors"
    >
      Read the guide
    </Link>
  );
}

