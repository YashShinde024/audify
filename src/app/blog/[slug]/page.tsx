import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { presetArticleRegistry } from "@/config/blog-registry";
import { articleBodies } from "@/config/preset-article-bodies";
import {
  generateArticleMetadata,
  PresetArticle,
} from "@/components/blog/preset-article";

/**
 * Dynamic route for preset guides that do not already ship a hand-written
 * static page (the six legacy static pages under `src/app/blog/<slug>/`
 * win over this route when both exist).
 */

export function generateStaticParams() {
  return presetArticleRegistry
    .filter((entry) => !entry.legacyStatic)
    .map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = presetArticleRegistry.find((a) => a.slug === slug);
  if (!entry || entry.legacyStatic) return {};
  return generateArticleMetadata(entry);
}

async function PresetGuideContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = presetArticleRegistry.find((a) => a.slug === slug);
  if (!meta || meta.legacyStatic) notFound();

  const presetId = meta.presetId;
  if (!presetId) {
    notFound();
  }

  const body = articleBodies[presetId];
  if (!body) notFound();

  return <PresetArticle meta={meta} body={body} />;
}

export default function PresetGuidePage(props: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <PresetGuideContent params={props.params} />
    </Suspense>
  );
}
