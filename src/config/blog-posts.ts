/**
 * Audify Published Blog Articles
 * Contains authentic editorial publications for Audify.
 */

export interface BlogPostMeta {
  slug: string;
  title: string;
  headline: string;
  description: string;
  publishedAt: string;
  modifiedAt?: string;
  author: {
    name: string;
    role: string;
    url: string;
  }[];
  category: string;
  readingTime: string;
  image: string;
}

export const PUBLISHED_ARTICLES: BlogPostMeta[] = [
  {
    slug: "what-is-audify-browser-audio-workstation",
    title: "Audify Explained: A Browser-Based Audio Workstation Built for Creative Sound Processing",
    headline: "Audify Explained: A Browser-Based Audio Workstation Built for Creative Sound Processing",
    description:
      "Discover Audify, a browser-based audio processing workstation by Nyxen × Xpert Melody. Explore its creative effects, audio utilities, local DSP architecture, supported formats, and privacy-first processing approach.",
    publishedAt: "2026-11-04",
    modifiedAt: "2026-11-04",
    author: [
      {
        name: "Nyxen",
        role: "Software Architecture & DSP Engineering",
        url: "https://nyxen.in",
      },
      {
        name: "Xpert Melody",
        role: "Music Production & Sound Design",
        url: "https://www.youtube.com/@xpertmelody",
      },
    ],
    category: "Architecture & Audio DSP",
    readingTime: "7 min read",
    image: "/images/audify-og.png",
  },
];

export function getArticleBySlug(slug: string): BlogPostMeta | undefined {
  return PUBLISHED_ARTICLES.find((a) => a.slug === slug);
}

