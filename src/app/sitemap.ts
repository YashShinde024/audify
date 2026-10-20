import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { presetArticleRegistry } from "@/config/blog-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogGuideRoutes = presetArticleRegistry.map((entry) => `/blog/${entry.slug}`);
  const routes = [
    "",
    "/studio",
    "/presets",
    "/effects",
    "/about",
    "/how-it-works",
    "/faq",
    "/privacy",
    "/terms",
    "/blog",
    ...blogGuideRoutes,
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : route.startsWith("/blog") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/studio" ? 0.9 : 0.8,
  }));
}
