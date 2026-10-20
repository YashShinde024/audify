import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  footerCompanyNav,
  footerProductNav,
  legalNav,
  primaryNav,
} from "../navigation";

const appDir = path.resolve(__dirname, "../../app");

/** Next.js app router: a href `/x` ships if `src/app/x/page.tsx` (or `page.mdx`) exists. */
function routeShips(href: string): boolean {
  if (href === "/") return existsSync(path.join(appDir, "page.tsx"));
  return (
    existsSync(path.join(appDir, href.slice(1), "page.tsx")) ||
    existsSync(path.join(appDir, href.slice(1), "page.mdx"))
  );
}

describe("navigation targets real routes", () => {
  it("every header and footer href resolves to a shipped app-router page", () => {
    for (const item of [...primaryNav, ...footerProductNav, ...footerCompanyNav, ...legalNav]) {
      expect(routeShips(item.href), item.href).toBe(true);
    }
  });

  it("every nav label is non-empty and hrefs start with a slash", () => {
    for (const item of [...primaryNav, ...footerProductNav, ...footerCompanyNav, ...legalNav]) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.href.startsWith("/")).toBe(true);
      expect(item.href.endsWith("/") && item.href !== "/").toBe(false);
    }
  });
});
