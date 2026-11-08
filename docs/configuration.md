# Configuration Reference

This document provides a verified reference for all environment variables, site configuration constants, and application settings in Audify.

---

## 1. Environment Variables

Every variable listed below has been verified against the current codebase in `src/`. Audify does not require any environment variables for local development or for running the browser DSP audio workstation.

| Variable Name | Required | Default Value | Scope | Purpose & Usage | Used In |
| :--- | :---: | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | No | `https://audify.nyxen.in` | Client & Server | Canonical site URL used for OpenGraph tags, JSON-LD structured metadata, and sitemaps. | `src/config/site.ts` |
| `RESEND_API_KEY` | No | *None* | Server-Only | API Key for Resend email dispatch service. When omitted, `/api/contact` logs safely to stdout and returns `{ delivered: false, simulated: true }`. | `src/app/api/contact/route.ts` |
| `CONTACT_TO_EMAIL` | No | `support@nyxen.in` | Server-Only | Destination email address where contact inquiries are sent when Resend is configured. | `src/app/api/contact/route.ts` |
| `CONTACT_FROM_EMAIL` | No | `Audify Contact <support@nyxen.in>` | Server-Only | Verified sender email address configured in Resend. | `src/app/api/contact/route.ts` |
| `CONTACT_WEBHOOK_URL` | No | *None* | Server-Only | Optional external webhook endpoint. When present, contact payloads are forwarded as HTTP POST requests. | `src/app/api/contact/route.ts` |
| `NEXT_PUBLIC_ADS_ENABLED` | No | `false` | Client & Server | Set to `"true"` in production builds to enable Adsterra banner placements. Disabled in dev/test. | `src/config/ads.ts` |
| `NEXT_PUBLIC_ADS_CONSENT_REQUIRED` | No | `false` | Client & Server | Conservative consent gate requiring prior explicit consent before serving ads if enabled. | `src/config/ads.ts` |

---

## 2. Site Configuration Constants

Central application constants are declared in [`src/config/site.ts`](../src/config/site.ts):

| Property | Value | Description |
| :--- | :--- | :--- |
| `name` | `"Audify"` | Brand name of the platform. |
| `tagline` | `"Sound, reimagined."` | Official brand tagline. |
| `attribution` | `"Audify by Nyxen × Xpert Melody"` | Full brand attribution string. |
| `by` | `"Nyxen"` | Primary developer / engineering entity. |
| `musicPartner` | `"Xpert Melody"` | Sound designer and music partner. |
| `url` | `process.env.NEXT_PUBLIC_SITE_URL ?? "https://audify.nyxen.in"` | Canonical URL. |
| `maxFileSizeBytes` | `10 * 1024 * 1024` (10 MB) | Strict maximum audio file ingestion limit to prevent mobile browser memory crashes. |

---

## 3. Client Storage Keys

Audify stores strictly non-sensitive configuration values in client `localStorage` and cookies:

| Key | Storage Type | Allowed Values | Purpose |
| :--- | :--- | :--- | :--- |
| `audify-theme` | Cookie & LocalStorage | `"dark"` \| `"light"` | Persists the user's active UI color theme across visits and pre-hydration. |
| `audify-cookie-consent` | LocalStorage | JSON / `"all"` / `"reject"` | Stores the user's GDPR/CCPA cookie and telemetry authorization preferences. |
| `audify-custom-presets-v1` | LocalStorage | JSON array | Stores user-created custom DSP presets and parameter slider values. |
