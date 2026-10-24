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
    "/seo",
    "/aeo",
    "/geo",
    "/about",
    "/how-it-works",
    "/faq",
    "/privacy",
    "/terms",
    "/contact",
    "/blog",
    ...blogGuideRoutes,
  ];

  return routes.map((route) => {
    let priority = 0.7;
    let changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "weekly";
    } else if (route === "/studio") {
      priority = 0.95;
      changeFrequency = "weekly";
    } else if (route === "/tools" || route === "/presets") {
      priority = 0.9;
      changeFrequency = "weekly";
    } else if (route.startsWith("/tools/")) {
      priority = 0.85;
      changeFrequency = "weekly";
    } else if (route === "/seo" || route === "/aeo" || route === "/geo") {
      priority = 0.85;
      changeFrequency = "weekly";
    } else if (route === "/about" || route === "/how-it-works") {
      priority = 0.8;
      changeFrequency = "monthly";
    } else if (route === "/faq") {
      priority = 0.75;
      changeFrequency = "monthly";
    } else if (route.startsWith("/blog/")) {
      priority = 0.75;
      changeFrequency = "weekly";
    } else if (route === "/privacy" || route === "/terms" || route === "/contact") {
      priority = 0.5;
      changeFrequency = "monthly";
    }

    return {
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });
}
