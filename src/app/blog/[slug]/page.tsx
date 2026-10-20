import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  presetArticleRegistry,
} from "@/config/blog-registry";
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

export default async function PresetGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = presetArticleRegistry.find((a) => a.slug === slug);
  if (!meta || meta.legacyStatic) notFound();

  const presetId = meta.presetId;
  if (!presetId) {
    // Extra overview entries (e.g. the legacy bass-boost overview) are
    // static pages; dynamic rendering has no body for them.
    notFound();
  }

  const body = articleBodies[presetId];
  if (!body) notFound();

  return <PresetArticle meta={meta} body={body} />;
}
