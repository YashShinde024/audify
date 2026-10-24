import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { presetArticleRegistry } from "@/config/blog-registry";
import { getAllToolSlugs } from "@/config/tools-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogGuideRoutes = presetArticleRegistry.map((entry) => `/blog/${entry.slug}`);
  const toolRoutes = getAllToolSlugs().map((slug) => `/tools/${slug}`);

  const routes = [
    "",
    "/studio",
    "/tools",
    ...toolRoutes,
    "/presets",
    "/effects",
    "/about",
    "/how-it-works",
    "/faq",
    "/privacy",
    "/terms",
    "/contact",
    "/blog",
    ...blogGuideRoutes,
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "" ? "weekly" : route.startsWith("/blog") || route.startsWith("/tools") ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/studio" || route === "/tools"
        ? 0.9
        : route.startsWith("/tools/")
        ? 0.85
        : 0.8,
  }));
}
