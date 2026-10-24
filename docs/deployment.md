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
   - `CONTACT_TO_EMAIL`: *(Optional)* `team@nyxen.in`.
   - `CONTACT_FROM_EMAIL`: *(Optional)* `Audify Contact <onboarding@resend.dev>`.

---

## 3. Production Verification Checklist

Before tagging a production release:
1. **Type Check:** Run `npx tsc --noEmit` (Must output 0 errors).
2. **Unit Tests:** Run `npm test` (All 16 suites / 196 tests must pass).
3. **Audio Math Harness:** Run `npx tsx scripts/verify-audio.ts` (All 16 assertions pass).
4. **Production Build:** Run `npm run build` (All 96 static/dynamic routes compile cleanly).
5. **Sitemap & Robots:** Check `https://audify.nyxen.in/sitemap.xml` and `https://audify.nyxen.in/robots.txt`.
