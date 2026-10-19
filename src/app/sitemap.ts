import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
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
    "/blog/slowed-reverb",
    "/blog/8d-audio",
    "/blog/nightcore-daycore",
    "/blog/432hz-tuning",
    "/blog/bass-boost",
    "/blog/lofi-tape",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : route.startsWith("/blog") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/studio" ? 0.9 : 0.8,
  }));
}
