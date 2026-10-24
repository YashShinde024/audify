# Search Performance, Indexing & Webmaster Tools

This guide outlines the technical and operational procedures for monitoring search visibility, search impressions, crawl health, and indexing for **Audify** across Google Search Console and Bing Webmaster Tools.

---

## 1. Canonical Domain & Production Endpoints

Audify enforces a single canonical production origin:
- **Canonical Domain:** `https://audify.nyxen.in`
- **Sitemap Index:** `https://audify.nyxen.in/sitemap.xml`
- **Robots Directives:** `https://audify.nyxen.in/robots.txt`
- **Machine Factsheet:** `https://audify.nyxen.in/llms.txt`

All preview environments (e.g., `*.vercel.app`) inherit canonical metadata pointing to `https://audify.nyxen.in` to prevent preview duplicate indexation.

---

## 2. Google Search Console Setup & Verification

### Step 1: Add Property
1. Navigate to [Google Search Console](https://search.google.com/search-console).
2. Select **Domain** property or **URL prefix** property:
   - For complete subdomain coverage: Add `audify.nyxen.in`.
   - For URL prefix: Add `https://audify.nyxen.in/`.

### Step 2: Verification Methods
- **DNS TXT Record (Recommended):** Add the Google verification TXT record to your DNS zone on the `audify.nyxen.in` or `nyxen.in` host.
- **HTML Meta Tag:** Add `<meta name="google-site-verification" content="..." />` to `src/app/layout.tsx` metadata if DNS verification is unavailable.

### Step 3: Submit the Sitemap
1. Open **Sitemaps** in the left sidebar.
2. Under "Add a new sitemap", enter:
   ```text
   sitemap.xml
   ```
3. Click **Submit**. Verify that the status shows `Success` and that 96+ discovered URLs match the route manifest.

---

## 3. Bing Webmaster Tools Setup

1. Sign in to [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Choose **Import from Google Search Console** for instant sync, or add `https://audify.nyxen.in/` manually.
3. Submit the sitemap endpoint `https://audify.nyxen.in/sitemap.xml`.
4. Verify IndexNow integration if automated crawl pings are desired upon release tags.

---

## 4. Crawl Health & Indexing Inspection Workflow

### URL Inspection
When shipping updates to high-priority routes (e.g., `/`, `/studio`, `/presets`, `/tools`, `/seo`, `/aeo`, `/geo`):
1. In Search Console, paste the full URL into the top search bar (e.g. `https://audify.nyxen.in/seo`).
2. Run **Test Live URL** to confirm:
   - Status: `HTTP 200 OK`
   - Canonical selected by Google: `https://audify.nyxen.in/seo`
   - Mobile usability: Passed (responsive viewport, legible typography, touch targets ≥ 34px)
   - Structured data detected: `CollectionPage`, `BreadcrumbList`, `ItemList`
3. Click **Request Indexing** if the page was freshly published or updated.

### Monitoring Crawl & Coverage Issues
- Check the **Pages** report under Indexing:
  - **Indexed:** Expect canonical core pages (`/`, `/studio`, `/presets`, `/tools/*`, `/how-it-works`, `/faq`, `/about`, `/seo`, `/aeo`, `/geo`).
  - **Excluded / Disallowed:** The `/api/*` endpoint is intentionally disallowed in `robots.txt` because it serves JSON POST requests, not indexable HTML.
  - **Duplicate without user-selected canonical:** Should remain 0 since all pages declare explicit `alternates.canonical` pointing to `https://audify.nyxen.in`.

---

## 5. Performance Monitoring Metrics

Use Search Console's **Performance** tab to monitor:
- **Total Clicks & Total Impressions:** Track aggregate discovery growth over 28-day and 3-month rolling windows.
- **Average CTR (Click-Through Rate):** Evaluate title and meta description resonance across audio-related search queries.
- **Queries:** Identify real user queries (e.g., *"slowed and reverb online"*, *"8d audio converter"*, *"in-browser vocal remover"*).
- **Pages:** Monitor which dedicated tool and preset pages capture top organic impressions.

---

## 6. Boundary Between Code Implementation & Search Outcomes

- **Completed Technical Work:** Complete canonical domain consistency, App Router metadata with OpenGraph and Twitter cards, Schema.org JSON-LD (`WebSite`, `Organization`, `SoftwareApplication`, `FAQPage`, `CollectionPage`, `BreadcrumbList`), dynamic `sitemap.xml`, API-protecting `robots.txt`, and dedicated discoverable routes (`/seo`, `/aeo`, `/geo`).
- **External Dependencies:** Actual crawl rate, indexing timelines, query rankings, and search impressions are determined externally by search engine bots (Googlebot, Bingbot) and require domain verification in webmaster tools.
