/**
 * Central preset → article registry.
 *
 * The editorial blog has been intentionally retired: `/blog` remains only as
 * an empty, noindex shell and no article routes are served. The registry is
 * kept (empty) so existing type-level consumers keep compiling without churn;
 * every runtime consumer must treat an empty registry as "no articles".
 */
import type { PresetId } from "./presets";

export interface PresetArticleMeta {
  /** Preset this article documents. `null` for extra overview guides. */
  presetId: PresetId | null;
  slug: string;
  title: string;
  /** ~150-character meta description used for SEO + OG. */
  description: string;
  categoryLabel: string;
  readMinutes: number;
  /** Static pages that already ship their own hand-written route. */
  legacyStatic?: boolean;
}

export const presetArticleRegistry: PresetArticleMeta[] = [];

/** Unique slugs across the registry (used by the sitemap and validation tests). */
export const registrySlugs: string[] = presetArticleRegistry.map((a) => a.slug);

/** All preset ids that have an article. */
export const articlePresetIds: PresetId[] = presetArticleRegistry
  .map((a) => a.presetId)
  .filter((id): id is PresetId => id !== null);

/** Try to find the meta for a preset id (returns undefined for presets without articles). */
export function articleForPreset(presetId: PresetId): PresetArticleMeta | undefined {
  return presetArticleRegistry.find((a) => a.presetId === presetId);
}
