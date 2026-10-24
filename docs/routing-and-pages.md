# Routing & Pages Reference

Audify uses the **Next.js 16 App Router**. Every public route, dynamic slug, and API handler in the repository is documented below.

---

## 1. Route Map

| Path | File Location | Render Strategy | Description |
| :--- | :--- | :---: | :--- |
| `/` | `src/app/page.tsx` | SSR / Dynamic | Landing page with Hero, interactive Studio preview, acoustic signatures, and capabilities. |
| `/studio` | `src/app/studio/page.tsx` | SSR / Client Workstation | Primary audio DSP workstation for file import, preset selection, fine-tuning, and export. |
| `/tools` | `src/app/tools/page.tsx` | SSR / Static Shell | Directory of task-oriented audio tools with category filters and search. |
| `/tools/[slug]` | `src/app/tools/[slug]/page.tsx` | SSG (`generateStaticParams`) | Standalone workspaces for 15 audio utilities (Merger, Splitter, Normalizer, Resampler, etc.). |
| `/presets` | `src/app/presets/page.tsx` | SSR / Static Shell | Categorized preset catalog with in-browser audio auditions and filter rails. |
| `/effects` | `src/app/effects/page.tsx` | SSR / Client Workstation | Dedicated DSP effects rack and parameter shaping interface. |
| `/how-it-works` | `src/app/how-it-works/page.tsx` | Static | Interactive technical breakdown of 32-bit float Web Audio DSP and filter math. |
| `/about` | `src/app/about/page.tsx` | Static | Information about the creators (Nyxen ecosystem & Xpert Melody music partnership). |
| `/blog` | `src/app/blog/page.tsx` | Static | Educational audio engineering articles index. |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | SSG (`generateStaticParams`) | 38 in-depth acoustic engineering and preset guides. |
| `/contact` | `src/app/contact/page.tsx` | Static | Contact dispatch form. |
| `/faq` | `src/app/faq/page.tsx` | Static | Frequently asked questions with structured FAQ schema. |
| `/privacy` | `src/app/privacy/page.tsx` | Static | Local-first zero-server privacy policy and transparency report. |
| `/terms` | `src/app/terms/page.tsx` | Static | Terms of service and licensing notice. |
| `/sitemap.xml` | `src/app/sitemap.ts` | Dynamic XML | Auto-generated sitemap indexing all public pages and blog guides. |
| `/robots.txt` | `src/app/robots.ts` | Dynamic Text | Robots.txt declaring search engine crawl rules. |
| `/api/contact` | `src/app/api/contact/route.ts` | API Route (POST) | Hardened contact dispatch endpoint. |

---

## 2. Dynamic Route Details

### Standalone Tools (`/tools/[slug]`)
Defined in `src/config/tools-registry.ts`. Next.js pre-renders all 15 tools at build time via `generateStaticParams()`:
- `audio-converter`: Multi-format transcoder (WAV, MP3, AIFF)
- `audio-merger`: Multi-track sequential concatenator with silence gaps
- `audio-splitter`: Interval and parts-based audio partitioner
- `audio-trimmer`: Millisecond-accurate audio crop and trimmer
- `audio-normalizer`: EBU R128 and peak normalizer
- `bpm-detector`: Autocorrelation BPM detection
- `pitch-shifter`: Semitone musical transposition
- `tempo-changer`: Varispeed speed lift/drop
- `vocal-remover`: Mid/Side center-channel vocal attenuation
- `audio-reverser`: Reverse PCM sample buffer
- `sample-rate-converter`: Windowed-sinc resampling (22.05, 32, 44.1, 48 kHz)
- `volume-changer`: Linear gain adjustment
- `audio-compressor`: Dynamic range limiter and compressor
- `fade-in-out`: Exponential head and tail volume envelopes
- `audio-metadata-viewer`: Diagnostic technical analyzer (sample rate, channels, peak, RMS, duration)

### Educational Guides (`/blog/[slug]`)
Defined in `src/config/blog-registry.ts`. Contains 38 in-depth guides covering acoustic principles:
- `/blog/slowed-reverb`
- `/blog/nightcore-daycore`
- `/blog/8d-audio`
- `/blog/432hz-tuning`
- `/blog/bass-boost`
- `/blog/lofi-tape`
- And 32 additional preset-specific guides.

---

## 3. Contact API Endpoint (`/api/contact`)

### Specification
- **Method:** `POST`
- **Path:** `/api/contact`
- **Content-Type:** `application/json`
- **Max Payload:** 64 KB
- **Rate Limit:** 5 requests per 10-minute sliding window per client IP

### Request Schema
```json
{
  "name": "Jane Producer",
  "email": "jane@example.com",
  "topic": "Audio DSP / Quality Feedback",
  "message": "The look-ahead limiter operates cleanly on high-pass stems.",
  "audioFormat": "WAV 24-bit",
  "website": ""
}
```
*Note: `website` is an invisible honeypot field. If populated by an automated spam bot, the request is dropped silently with `{ success: true, delivered: false, simulated: true }`.*

### Responses
- **`200 OK`**: `{ "success": true, "delivered": true, "simulated": false, "message": "Message dispatched successfully." }`
- **`400 Bad Request`**: Validation errors or malformed JSON.
- **`413 Payload Too Large`**: Request body exceeds 64 KB.
- **`415 Unsupported Media Type`**: Content-Type is not `application/json`.
- **`429 Too Many Requests`**: Rate limit exceeded (includes `Retry-After` header).
