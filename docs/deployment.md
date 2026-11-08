# Deployment & Production Readiness

Audify is optimized for deployment on **Vercel** with the Next.js 16 App Router and Turbopack compiler.

---

## 1. Verified Production Setup

- **Canonical Domain:** `https://audify.nyxen.in` (configurable via `NEXT_PUBLIC_SITE_URL`).
- **Hosting Environment:** Vercel (Edge & Serverless Node.js runtime).
- **Node.js Version:** `20.x` or `22.x`.
- **Build Command:** `next build` (`npm run build`).
- **Output Directory:** `.next` (Standard Next.js App Router bundle).

---

## 2. Vercel Deployment Configuration

When importing the repository to Vercel:
1. **Framework Preset:** `Next.js`.
2. **Root Directory:** `./`.
3. **Build Command:** `npm run build`.
4. **Install Command:** `npm install`.
5. **Environment Variables:**
   - `NEXT_PUBLIC_SITE_URL`: `https://audify.nyxen.in`
   - `RESEND_API_KEY`: *(Optional)* Your Resend API key for contact submissions.
   - `CONTACT_TO_EMAIL`: *(Optional)* `support@nyxen.in`.
   - `CONTACT_FROM_EMAIL`: *(Optional)* `Audify Contact <support@nyxen.in>`.
   - `CONTACT_WEBHOOK_URL`: *(Optional)* Webhook URL endpoint.
   - `NEXT_PUBLIC_ADS_ENABLED`: *(Optional)* `true` to enable Adsterra ads in production.
   - `NEXT_PUBLIC_ADS_CONSENT_REQUIRED`: *(Optional)* `false` by default.

---

## 3. Production Verification Checklist

Before tagging a production release:
1. **Type Check:** Run `npx tsc --noEmit` (Must output 0 errors).
2. **Unit Tests:** Run `npm test` (All 23 suites / 301 tests must pass).
3. **Audio Math Harness:** Run `npx tsx scripts/verify-audio.ts` (All DSP assertions pass).
4. **Production Build:** Run `npm run build` (All static and dynamic routes compile cleanly).
5. **Sitemap & Robots:** Check `https://audify.nyxen.in/sitemap.xml` and `https://audify.nyxen.in/robots.txt`.
