import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Waveform,
  Sparkle,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  ShieldCheck,
  Cpu,
  ArrowsClockwise,
  CalendarBlank,
  Clock,
  User,
  ListNumbers,
  CheckCircle,
  FileAudio,
} from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/config/site";
import { getArticleBySlug } from "@/config/blog-posts";
import { AdBanner } from "@/components/advertising/ad-banner";
import { SectionSeam } from "@/components/marketing/page-header";

const articleMeta = getArticleBySlug("what-is-audify-browser-audio-workstation")!;
const canonicalUrl = `${siteConfig.url}/blog/${articleMeta.slug}`;

export const metadata: Metadata = {
  title: articleMeta.title,
  description: articleMeta.description,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: articleMeta.title,
    description: articleMeta.description,
    url: canonicalUrl,
    siteName: siteConfig.name,
    type: "article",
    publishedTime: `${articleMeta.publishedAt}T10:00:00.000Z`,
    modifiedTime: `${articleMeta.modifiedAt ?? articleMeta.publishedAt}T10:00:00.000Z`,
    authors: articleMeta.author.map((a) => a.name),
    images: [
      {
        url: `${siteConfig.url}${articleMeta.image}`,
        width: 1200,
        height: 630,
        alt: articleMeta.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: articleMeta.title,
    description: articleMeta.description,
    creator: "@buildnyxen",
    images: [`${siteConfig.url}${articleMeta.image}`],
  },
};

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${canonicalUrl}#article`,
      isPartOf: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      headline: articleMeta.headline,
      description: articleMeta.description,
      datePublished: `${articleMeta.publishedAt}T10:00:00.000Z`,
      dateModified: `${articleMeta.modifiedAt ?? articleMeta.publishedAt}T10:00:00.000Z`,
      mainEntityOfPage: canonicalUrl,
      image: `${siteConfig.url}${articleMeta.image}`,
      author: articleMeta.author.map((a) => ({
        "@type": a.name === "Nyxen" ? "Organization" : "Person",
        name: a.name,
        url: a.url,
      })),
      publisher: {
        "@type": "Organization",
        name: siteConfig.creators.nyxen.name,
        url: siteConfig.creators.nyxen.website,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/images/nyxen/nyxen-logo.png`,
        },
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumbs`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${siteConfig.url}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Audify Explained",
          item: canonicalUrl,
        },
      ],
    },
  ],
};

export default function AudifyExplainerArticlePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }}
      />

      <article className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted flex items-center gap-2">
            <Link href="/" className="hover:text-fg transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-fg transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-fg font-medium truncate">Audify Explained</span>
          </nav>

          {/* Article Header */}
          <header className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkle size={13} weight="fill" />
              <span>{articleMeta.category}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-fg leading-tight">
              {articleMeta.title}
            </h1>

            <p className="text-sm sm:text-base text-muted leading-relaxed">
              {articleMeta.description}
            </p>

            {/* Author & Timestamp Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-line text-xs text-muted">
              <span className="inline-flex items-center gap-1 font-medium text-fg">
                <User size={14} className="text-primary" />
                <span>By {articleMeta.author.map((a) => a.name).join(" × ")}</span>
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <CalendarBlank size={14} />
                <time dateTime={articleMeta.publishedAt}>November 4, 2026</time>
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} />
                <span>{articleMeta.readingTime}</span>
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
            <Image
              src={articleMeta.image}
              alt="Audify Audio Workstation Quartz and Sonic Architecture"
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          {/* Table of Contents */}
          <nav
            aria-label="Table of contents"
            className="rounded-2xl border border-line bg-surface/70 p-5 backdrop-blur-sm space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <ListNumbers size={16} weight="bold" />
              <span>Table of Contents</span>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 text-xs text-muted">
              <li>
                <a href="#what-is-audify" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="text-primary font-mono">1.</span>
                  <span>What Is Audify?</span>
                </a>
              </li>
              <li>
                <a href="#why-we-created-audify" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="text-primary font-mono">2.</span>
                  <span>Why We Created Audify</span>
                </a>
              </li>
              <li>
                <a href="#how-audify-works" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="text-primary font-mono">3.</span>
                  <span>How Audify Works (DSP Pipeline)</span>
                </a>
              </li>
              <li>
                <a href="#features-and-differences" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="text-primary font-mono">4.</span>
                  <span>Features &amp; What Makes Audify Different</span>
                </a>
              </li>
            </ul>
          </nav>

          <AdBanner id="blog-under-toc" className="my-4" />

          {/* Main Editorial Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12 text-fg text-sm sm:text-base leading-relaxed">
            {/* SECTION 1 */}
            <section id="what-is-audify" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg border-b border-line pb-2 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-mono font-bold">1</span>
                <span>What Is Audify?</span>
              </h2>

              <p>
                <strong>Audify</strong> is a browser-based audio digital signal processing (DSP) workstation designed to make creative audio sculpting, spatial acoustics, and task-oriented audio editing immediately accessible through a modern web interface. Built using the native W3C Web Audio API, Audify empowers creators, music producers, and audio enthusiasts to transform recordings directly inside client device memory.
              </p>

              <p>
                In a single browser tab, Audify unites three core acoustic workflows:
              </p>

              <div className="grid gap-4 sm:grid-cols-3 not-prose my-6">
                <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkle size={18} weight="duotone" />
                  </span>
                  <h3 className="text-xs font-semibold text-fg">Creative Sound Presets</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Acoustic transformations including Slowed + Reverb, Nightcore, Daycore, 8D Spatial Audio, Lo-Fi Tape, Cathedral Reverb, and 432 Hz Pythagorean pitch tuning.
                  </p>
                </div>

                <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <SlidersHorizontal size={18} weight="duotone" />
                  </span>
                  <h3 className="text-xs font-semibold text-fg">Task-Oriented Utilities</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    15 dedicated standalone utilities for trimming, merging, splitting, normalization, sample-rate resampling, channel downmixing, phase cancellation vocal removal, and dynamic range compression.
                  </p>
                </div>

                <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileAudio size={18} weight="duotone" />
                  </span>
                  <h3 className="text-xs font-semibold text-fg">Multi-Format Mastering Export</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Client-side binary encoding to uncompressed 16-bit, 24-bit, and 32-bit float WAV, broadcast AIFF, and variable/constant bitrate MP3 up to 320 kbps.
                  </p>
                </div>
              </div>

              <p>
                Framed in Audify&apos;s tactile <em>Quartz &amp; Sonic</em> design language, the interface emphasizes immediate parameter telemetry, real-time dry/wet A/B waveform comparison, and responsive controls without visual clutter.
              </p>

              <div className="rounded-xl border border-line/80 bg-raised/50 p-4 not-prose text-xs text-muted space-y-1">
                <strong className="text-fg font-semibold flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-primary" />
                  Scope &amp; Positioning Clarification
                </strong>
                <p>
                  Audify does not claim to replace a multi-track desktop digital audio workstation (such as Pro Tools, Logic Pro, or Ableton Live) for 64-track studio tracking, MIDI orchestration, or proprietary VST hosting. Instead, Audify replaces the cumbersome process of installing heavy software or uploading confidential audio to dubious online converters just to perform rapid, sample-accurate acoustic edits and creative renders.
                </p>
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="why-we-created-audify" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg border-b border-line pb-2 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-mono font-bold">2</span>
                <span>Why We Created Audify</span>
              </h2>

              <p>
                Every day, millions of musicians, video editors, podcasters, and listeners need to perform focused audio adjustments: slowing down a backing track for vocal rehearsal, trimming an intro, transcoding a master for distribution, testing an 8D spatial pan, or adding lush convolution reverb to a dry sample.
              </p>

              <p>
                Historically, users were forced to choose between two unsatisfactory extremes:
              </p>

              <ol className="list-decimal pl-5 space-y-2 text-muted">
                <li>
                  <strong className="text-fg">Complex Desktop DAWs:</strong> Software suites requiring multi-gigabyte installations, expensive licensing dongles, steep learning curves, and significant CPU overhead just to apply a basic acoustic filter or change sample rate.
                </li>
                <li>
                  <strong className="text-fg">Cloud Audio Converters:</strong> Ad-saturated websites that force you to upload private audio files to remote servers. This introduces waiting queues, server bandwidth bottlenecks, lossy re-encoding compression, and significant privacy concerns regarding who owns or trains models on your uploaded audio.
                </li>
              </ol>

              <p>
                Audify was conceived to resolve this dilemma: delivering studio-grade signal processing directly within the web browser sandbox, executing at hardware speed with zero server uploads.
              </p>

              <h3 className="text-base font-semibold text-fg pt-2">The Collaboration: Software Engineering Meets Acoustic Direction</h3>

              <p>
                Audify is built through a direct partnership between software engineering and music production:
              </p>

              <div className="grid gap-4 sm:grid-cols-2 not-prose my-4">
                <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-fg text-sm">Nyxen</span>
                    <span className="text-[10px] font-mono text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">Engineering</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Lead software architecture, Web Audio graph compilation, 32-bit linear PCM buffer memory lifecycle, Web Workers encoder pipelines, rate-limiting safeguards, and reactive UI development.
                  </p>
                </div>

                <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-fg text-sm">Xpert Melody</span>
                    <span className="text-[10px] font-mono text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">Acoustic Curation</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Acoustic direction, signature frequency curves, convolution reverb impulse curation, resonant filter tuning, Slowed+Reverb aesthetic modeling, and mastering headroom validation.
                  </p>
                </div>
              </div>

              <p>
                By coupling rigorous TypeScript software engineering with practical sound design expertise, Audify bridges the gap between academic DSP formulas and the real-world sonic expectations of modern creators.
              </p>
            </section>

            {/* SECTION 3 */}
            <section id="how-audify-works" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg border-b border-line pb-2 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-mono font-bold">3</span>
                <span>How Audify Works (The DSP Pipeline)</span>
              </h2>

              <p>
                Audify replaces remote cloud compute with client-side digital signal processing. Understanding how audio travels through the browser clarifies both its lightning speed and its privacy guarantees.
              </p>

              <h3 className="text-base font-semibold text-fg pt-2">The 7-Step Client DSP Pipeline</h3>

              <div className="space-y-3 not-prose my-6">
                <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">1</span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-fg">Local File Selection &amp; Validation</h4>
                    <p className="text-xs text-muted">
                      The user selects an audio file (up to the documented 10 MB limit) via drag-and-drop or system file picker. Audify validates the file size and container format locally in JavaScript without dispatching network calls.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">2</span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-fg">Hardware AudioBuffer Decoding</h4>
                    <p className="text-xs text-muted">
                      The browser&apos;s native C++ decoding engine unpacks the compressed bitstream (MP3, WAV, FLAC, AAC, OGG, or M4A) into an uncompressed multi-channel <code>AudioBuffer</code>. Each channel is represented as an IEEE 754 32-bit floating-point linear PCM array (values between −1.0 and +1.0).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">3</span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-fg">Audio Processing Graph Compilation</h4>
                    <p className="text-xs text-muted">
                      Audify instantiates an audio node graph configured for the selected preset or utility. Nodes include <code>BiquadFilterNode</code> (parametric lowpass, highpass, peaking filters), <code>ConvolverNode</code> (convolution reverb with synthetic acoustic impulse responses), <code>StereoPannerNode</code> (azimuth modulation), and gain stages.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">4</span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-fg">Signal Transformation &amp; Parametric DSP</h4>
                    <p className="text-xs text-muted">
                      The audio stream flows through the compiled graph. Time-stretching, varispeed playback rate scaling, spatial phase modulation, and mid/side algebraic channel operations are calculated in real-time or offline blocks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">5</span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-fg">OfflineAudioContext Accelerated Rendering</h4>
                    <p className="text-xs text-muted">
                      When rendering the master file, Audify routes the graph into an <code>OfflineAudioContext</code>. The browser processes all mathematical transforms as fast as client CPU cores can compute—typically rendering a 3-minute audio file in 1 to 4 seconds (up to 50× playback speed).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">6</span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-fg">Peak Limiting &amp; Headroom Protection (−0.3 dBFS Ceiling)</h4>
                    <p className="text-xs text-muted">
                      Before binary serialization, the rendered buffer passes through a look-ahead peak limiter. Signals exceeding 0 dBFS (which would cause harsh digital square-wave clipping on consumer speakers) are smoothly clamped to a documented −0.3 dBFS ceiling.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">7</span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-fg">Client-Side Binary Encoding &amp; Instant Download</h4>
                    <p className="text-xs text-muted">
                      The normalized PCM samples are formatted into RIFF WAV headers, AIFF chunks, or encoded to CBR MP3 via <code>lamejs</code> in a Web Worker. A <code>blob:</code> URL is generated directly from browser RAM, allowing instant download with zero server network egress.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-line/80 bg-raised/50 p-4 not-prose text-xs text-muted space-y-1.5">
                <strong className="text-fg font-semibold flex items-center gap-1.5">
                  <Cpu size={15} className="text-primary" />
                  Precise Privacy Definition: Zero Audio Uploads
                </strong>
                <p>
                  When Audify states &ldquo;Zero Audio Uploads,&rdquo; it means that your uploaded audio files, raw PCM samples, and rendered audio masters remain exclusively in your client device&apos;s volatile RAM. They are never transmitted over the Internet to any backend server, API, cloud bucket, or AI dataset.
                </p>
                <p>
                  This does not mean the website itself makes no HTTP requests: web hosting assets (HTML, CSS, JS bundles), non-audio analytics telemetry, third-party advertising banners, and user-initiated contact forms communicate with servers via standard HTTPS requests.
                </p>
              </div>
            </section>

            {/* SECTION 4 */}
            <section id="features-and-differences" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg border-b border-line pb-2 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-mono font-bold">4</span>
                <span>Features &amp; What Makes Audify Different</span>
              </h2>

              <p>
                Audify distinguishes itself through verifiable technical capabilities implemented directly in its current codebase:
              </p>

              <h3 className="text-base font-semibold text-fg pt-2">1. Verified Creative Sound Presets</h3>
              <p>
                Curated in collaboration with Xpert Melody, every preset maps directly to physical acoustic operations:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-muted text-xs sm:text-sm">
                <li><strong className="text-fg">Slowed + Reverb:</strong> 0.85× varispeed playback rate reduction, −2.78 semitone pitch drop, 3.2s synthetic convolution reverb.</li>
                <li><strong className="text-fg">Nightcore:</strong> 1.25× speed acceleration, +3.86 semitone high-energy pitch lift, high-frequency exciter curve.</li>
                <li><strong className="text-fg">Daycore:</strong> 0.78× heavy deceleration with low-end resonance preservation.</li>
                <li><strong className="text-fg">8D Audio:</strong> Binaural azimuth orbital panning driven by low-frequency oscillation between 0.12 Hz and 0.25 Hz.</li>
                <li><strong className="text-fg">Bass Boost:</strong> Dual low-shelf parametric EQ boost at 60 Hz and 120 Hz paired with peak limiter protection.</li>
                <li><strong className="text-fg">Lo-Fi Tape:</strong> Bandpass filtering (300 Hz – 3,500 Hz), subtle pitch flutter modulation, and vintage warmth.</li>
                <li><strong className="text-fg">Cathedral Reverb:</strong> Long 5.5s acoustic decay tail simulating monumental stone sanctuary reflections.</li>
                <li><strong className="text-fg">432 Hz Sacred Tuning:</strong> Precise mathematical pitch transposition downward by −31.766 cents (432/440 ratio).</li>
                <li><strong className="text-fg">Underwater:</strong> Steep 450 Hz 4th-order lowpass Butterworth attenuation mimicking submerged sound conduction.</li>
              </ul>

              <h3 className="text-base font-semibold text-fg pt-2">2. The 15 Standalone Audio Utilities</h3>
              <p>
                Audify includes 15 task-specific tools operating under <Link href="/tools" className="text-primary hover:underline">/tools</Link>:
              </p>
              <div className="grid gap-2 sm:grid-cols-2 text-xs text-muted not-prose my-3">
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Audio Converter:</strong> Transcode audio between WAV, MP3, and AIFF.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Sample Rate Converter:</strong> Resample between 44.1 kHz, 48 kHz, and 96 kHz.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Channel Converter:</strong> True summed mono to stereo and stereo to mono downmixing.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Audio Trimmer:</strong> Sample-accurate start and end boundary extraction.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Audio Merger:</strong> Seamless multi-track sequential concatenation.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Audio Splitter:</strong> Slice longer recordings into equal duration segments.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Reverse Audio:</strong> Buffer inversion for backwards reverse audio effects.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Audio Fades:</strong> Smooth linear and exponential fade-in / fade-out ramps.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Audio Compressor:</strong> Dynamic range threshold, ratio, attack, and release control.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Audio Normalizer:</strong> Peak normalization to target dBFS thresholds.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Volume Changer:</strong> Linear dB gain scaling without digital clipping.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Audio Equalizer:</strong> 3-band parametric EQ (low shelf, mid peaking, high shelf).
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Bass Booster:</strong> Dedicated low-end acoustic harmonic saturation.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Vocal Remover:</strong> Mid/Side phase cancellation with 160 Hz low-end preservation.
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <strong className="text-fg">Audio Metadata Viewer:</strong> Inspect sample rates, channels, duration, and BPM.
                </div>
              </div>

              <h3 className="text-base font-semibold text-fg pt-2">3. Master Export Formats</h3>
              <p>
                Audify exports files adhering to industry audio specifications:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted text-xs sm:text-sm">
                <li><strong className="text-fg">WAV:</strong> 16-bit signed integer (CD quality), 24-bit signed integer (studio mastering), and 32-bit float (infinite dynamic range headroom).</li>
                <li><strong className="text-fg">AIFF:</strong> Uncompressed Apple/Broadcast big-endian PCM at 16, 24, or 32-bit precision.</li>
                <li><strong className="text-fg">MP3:</strong> Constant Bitrate (CBR) encoding at 128 kbps, 192 kbps, and 320 kbps.</li>
                <li><strong className="text-fg">Ingest Formats:</strong> MP3, WAV, FLAC, OGG, AAC, and M4A up to 10 MB per file.</li>
              </ul>

              <h3 className="text-base font-semibold text-fg pt-2">4. Summary of Technical Benchmarks</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted text-xs sm:text-sm">
                <li><strong className="text-fg">Engine:</strong> 100% W3C Web Audio API &amp; Web Workers.</li>
                <li><strong className="text-fg">Internal Precision:</strong> 32-bit floating-point linear PCM.</li>
                <li><strong className="text-fg">Ceiling Protection:</strong> Look-ahead peak limiter locked to −0.3 dBFS.</li>
                <li><strong className="text-fg">Memory Constraint:</strong> Documented 10 MB upload ceiling to prevent mobile browser memory pressure.</li>
                <li><strong className="text-fg">Custom Presets:</strong> Saved locally in browser <code>localStorage</code>.</li>
                <li><strong className="text-fg">Accounts &amp; Fees:</strong> 100% free with no account creation or login required.</li>
              </ul>
            </section>
          </div>

          <SectionSeam />

          {/* Internal Links & CTA Section */}
          <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-fg">Ready to explore Audify?</h3>
                <p className="text-xs text-muted max-w-md mt-0.5">
                  Launch the studio right now in your browser. No downloads, no subscriptions, zero audio uploaded.
                </p>
              </div>
              <Link
                href="/studio"
                className="btn-gradient-primary btn-sweep-reverse inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold text-white shadow-sm shrink-0"
              >
                <Waveform size={16} weight="bold" />
                <span>Open Audify Studio</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-line grid gap-3 sm:grid-cols-3 text-xs">
              <Link
                href="/presets"
                className="flex items-center justify-between rounded-xl border border-line bg-canvas p-3 hover:border-primary transition-colors text-fg"
              >
                <span>Browse Acoustic Presets</span>
                <ArrowRight size={13} className="text-primary" />
              </Link>
              <Link
                href="/tools"
                className="flex items-center justify-between rounded-xl border border-line bg-canvas p-3 hover:border-primary transition-colors text-fg"
              >
                <span>Explore 15 Audio Tools</span>
                <ArrowRight size={13} className="text-primary" />
              </Link>
              <Link
                href="/how-it-works"
                className="flex items-center justify-between rounded-xl border border-line bg-canvas p-3 hover:border-primary transition-colors text-fg"
              >
                <span>DSP Architecture Guide</span>
                <ArrowRight size={13} className="text-primary" />
              </Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
