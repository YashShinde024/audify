import type { PresetArticleBody } from "./article-bodies-a";
import { articleBodiesA } from "./article-bodies-a";
import { articleBodiesB } from "./article-bodies-b";
import { articleDetails } from "./details";

/** Combined structured article bodies, keyed by preset id, with detail paragraphs merged in. */
export const articleBodies: Record<string, PresetArticleBody> = Object.fromEntries(
  [...articleBodiesA, ...articleBodiesB].map((body) => [
    body.presetId,
    { ...body, detail: articleDetails[body.slug] },
  ] as const),
);

export type { PresetArticleBody };
