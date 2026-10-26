import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout, type LegalSectionItem } from "@/components/legal/legal-page-layout";
import { CookiePreferencesButton } from "@/components/layout/cookie-preferences-button";
import { siteConfig } from "@/config/site";
import {
  CloudSlash,
  EyeSlash,
  ShieldCheck,
  Cpu,
  Cookie,
  HardDrives,
  LockKey,
  GlobeHemisphereWest,
  EnvelopeSimple,
  Info,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Privacy Policy — Client-Side Audio DSP & Data Practices",
  description:
    "Comprehensive privacy policy for Audify by Nyxen × Xpert Melody. Clear legal disclosure on in-browser Web Audio DSP processing, client memory lifecycle, cookies, and data rights.",
  keywords: [
    "Audify privacy policy",
    "audio processing privacy",
    "client-side audio DSP",
    "browser audio security",
    "local audio editor privacy",
  ],
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy — Audify Audio Workstation",
    description: "Detailed legal disclosure of local-first audio processing, client storage, and privacy guarantees.",
    url: `${siteConfig.url}/privacy`,
    siteName: siteConfig.name,
  },
  other: {
    "geo.region": "GLOBAL",
    "DC.title": "Audify Privacy Policy & Data Disclosure",
  },
};

const SECTIONS: LegalSectionItem[] = [
  { id: "scope", title: "Introduction & Scope" },
  { id: "information-provided", title: "Information You Provide" },
  { id: "audio-processing", title: "Audio File Ingest & Processing" },
  { id: "zero-cloud-guarantee", title: "Client-Side vs Server Transmission" },
  { id: "technical-data", title: "Technical Data & Diagnostics" },
  { id: "cookies-storage", title: "Cookies & Local Storage" },
  { id: "third-parties", title: "Third-Party Services & Hosting" },
  { id: "legal-bases", title: "Purposes & Lawful Bases" },
  { id: "retention", title: "Data Retention & Erasure" },
  { id: "security", title: "Security Measures & Limits" },
  { id: "children", title: "Children's Privacy" },
  { id: "user-rights", title: "Your Privacy Rights" },
  { id: "international", title: "International Data Transfers" },
  { id: "contact-changes", title: "Policy Changes & Contact" },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="Privacy & Data Governance"
      title="Privacy Policy"
      lead="How Audify by Nyxen × Xpert Melody handles audio data, client-side memory, local storage, and contact inquiries with an architectural local-first guarantee."
      effectiveDate="October 2026"
      lastUpdated="October 24, 2026"
      sections={SECTIONS}
      otherDocumentLink={{
        href: "/terms",
        label: "Review Terms of Service",
      }}
    >
      <div className="space-y-10 text-xs sm:text-sm text-muted leading-relaxed">
        {/* Core Architecture Callout */}
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck size={18} weight="duotone" />
            <span>Summary: Local-First Audio Processing</span>
          </div>
          <p className="text-fg/90 leading-relaxed">
            <strong>Audify does not upload, copy, inspect, or store your audio files on remote servers.</strong> All
            signal transformations—including decoding, pitch transposition, convolution reverb, equalizer filtering,
            and export encoding—execute entirely within your web browser using the W3C Web Audio API.
          </p>
        </div>

        {/* 1. Introduction & Scope */}
        <section id="scope" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">01.</span>
            Introduction and Scope
          </h2>
          <p>
            This Privacy Policy (&quot;Policy&quot;) explains the privacy practices for <strong>Audify</strong> (&quot;Audify&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
            an interactive web-based audio digital signal processing (DSP) application engineered by <strong>Nyxen</strong> in collaboration with sound curator <strong>Xpert Melody</strong>.
          </p>
          <p>
            This Policy applies to your interaction with the Audify web application, accessible at{" "}
            <code className="font-mono text-primary bg-surface px-1.5 py-0.5 rounded border border-line">https://audify.nyxen.in</code>,
            and all associated tools, documentation, blogs, and contact dispatch endpoints.
          </p>
        </section>

        {/* 2. Information You Provide */}
        <section id="information-provided" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">02.</span>
            Information You Provide
          </h2>
          <p>We receive information directly from you in two specific contexts:</p>
          <div className="grid gap-3.5 sm:grid-cols-2 pt-1">
            <div className="rounded-xl border border-line bg-surface p-4 space-y-1.5">
              <h3 className="font-semibold text-fg text-xs sm:text-sm flex items-center gap-1.5">
                <Cpu size={16} className="text-primary" />
                Local Audio Selection
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                When you select or drag-and-drop an audio file (e.g., MP3, WAV, FLAC, OGG, or AAC) into Audify Studio,
                your browser provides the file handle directly to local client memory. This file is never sent to our servers.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4 space-y-1.5">
              <h3 className="font-semibold text-fg text-xs sm:text-sm flex items-center gap-1.5">
                <EnvelopeSimple size={16} className="text-primary" />
                Contact Inquiries
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                When you submit feedback or bug reports via our Contact page, you provide your name, email address,
                subject category, message body, and optional audio format notes.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Audio File Ingest & Processing */}
        <section id="audio-processing" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">03.</span>
            Audio File Ingest, Memory Lifecycle, and Export
          </h2>
          <p>
            Audify is engineered to run as a client-side audio workstation. The end-to-end lifecycle of an audio file is as follows:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-1">
            <li>
              <strong className="text-fg">Ingestion:</strong> The browser reads selected file bytes into an ephemeral in-memory <code className="font-mono text-primary text-xs">ArrayBuffer</code>.
            </li>
            <li>
              <strong className="text-fg">Decoding:</strong> The browser Web Audio API decodes the buffer into raw uncompressed Pulse Code Modulation (PCM) float samples (<code className="font-mono text-primary text-xs">AudioBuffer</code>) and computes visual peaks for the waveform display.
            </li>
            <li>
              <strong className="text-fg">DSP Graph Computation:</strong> When auditioning or mastering, our audio graph executes Web Audio nodes (biquad filters, convolvers, dynamics compressors, delay lines, and stereo panners) on your local CPU.
            </li>
            <li>
              <strong className="text-fg">Master Encoding &amp; Download:</strong> Exported files are written by client-side encoders (WAV PCM, LAME MP3, or AIFF) directly into a local <code className="font-mono text-primary text-xs">Blob</code> and delivered via an in-memory object URL (<code className="font-mono text-primary text-xs">blob:https://...</code>).
            </li>
            <li>
              <strong className="text-fg">Purge &amp; Cleanup:</strong> When you click &quot;Remove Track&quot;, load a new file, refresh the page, or close your browser tab, all allocated object URLs are revoked via <code className="font-mono text-primary text-xs">URL.revokeObjectURL()</code>, and the audio buffer is released to the browser&apos;s garbage collector.
            </li>
          </ol>
        </section>

        {/* 4. Client-Side vs Server Transmission */}
        <section id="zero-cloud-guarantee" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">04.</span>
            Whether Audio is Processed Locally or Transmitted to Servers
          </h2>
          <div className="rounded-xl border border-line bg-surface p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <CloudSlash size={22} className="text-primary shrink-0 mt-0.5" weight="duotone" />
              <div className="space-y-1">
                <h3 className="font-semibold text-fg text-xs sm:text-sm">Verified Zero Remote Audio Transmission</h3>
                <p className="text-xs text-muted leading-relaxed">
                  We explicitly verify and confirm: <strong>No audio files, audio chunks, stems, or acoustic samples are transmitted to Nyxen, Xpert Melody, or any cloud server.</strong> Network traffic inspection (via browser DevTools Network tab) confirms that file processing operations produce zero outbound HTTP POST, PUT, or WebSocket uploads.
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs">
            In contrast, communication sent through the <strong>Contact Dispatch</strong> form (<code className="font-mono text-primary">/api/contact</code>) is transmitted securely over HTTPS (TLS encryption) directly to our server infrastructure so that our team can review and respond to your inquiry.
          </p>
        </section>

        {/* 5. Technical Data & Diagnostics */}
        <section id="technical-data" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">05.</span>
            Technical Data, Server Logs, and Abuse Prevention
          </h2>
          <p>
            When you visit Audify, our edge hosting provider (Vercel) automatically receives standard technical request data necessary to deliver web assets. This includes:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
            <li>Internet Protocol (IP) address</li>
            <li>Browser type and version (User-Agent)</li>
            <li>Operating system and device platform</li>
            <li>Referring URL and requested page paths</li>
            <li>HTTP response status and timestamps</li>
          </ul>
          <p>
            <strong>Contact Form Rate Limiting:</strong> To safeguard the contact endpoint against automated denial-of-service and spam attacks, our API server maintains an ephemeral, in-memory sliding-window bucket that limits dispatches to 5 requests per 10-minute window per client IP. IP addresses are masked in logs (e.g. <code className="font-mono text-primary">198.51.*.*</code>) and automatically discarded after 10 minutes of inactivity.
          </p>
        </section>

        {/* 6. Cookies & Local Storage */}
        <section id="cookies-storage" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">06.</span>
            Cookies, Local Storage, and Client State
          </h2>
          <p>
            Audify utilizes client-side cookies and browser <code className="font-mono text-primary">localStorage</code> exclusively for essential functionality and user interface preferences:
          </p>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-xs">
              <thead className="bg-raised text-fg font-semibold border-b border-line">
                <tr>
                  <th className="p-3 font-mono">Identifier</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Lifespan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-muted">
                <tr>
                  <td className="p-3 font-mono font-medium text-fg">audify-theme</td>
                  <td className="p-3">Cookie / LocalStorage</td>
                  <td className="p-3">Persists Dark/Light visual theme preference to prevent page flicker.</td>
                  <td className="p-3">1 year</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-medium text-fg">audify-cookie-consent</td>
                  <td className="p-3">LocalStorage</td>
                  <td className="p-3">
                    Remembers your consent choices (essential, analytics, workstation cache),
                    the time of your decision, and the consent-policy version. A policy update increments
                    the version and re-prompts the banner.
                  </td>
                  <td className="p-3">180 days</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-medium text-fg">audify-sidebar-*</td>
                  <td className="p-3">LocalStorage</td>
                  <td className="p-3">Remembers Studio rack docked and width configuration.</td>
                  <td className="p-3">Persistent</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs">
            This table lists cookies and storage set <em>by Audify itself</em>. Third-party advertising
            scripts (Adsterra sponsor placements, Section 7) load as part of the free service in
            eligible production builds and are managed by the deployment-level{" "}
            <code className="font-mono text-primary bg-surface px-1 py-0.5 rounded border border-line">NEXT_PUBLIC_ADS_ENABLED</code>{" "}
            flag, not by an optional cookie preference. Those scripts may set their own cookies or
            client-side identifiers independently of Audify. We do not embed web analytics,
            session-replay scripts, or behavioral profiling tags of our own beyond what you opt
            into. You can adjust your optional-cookie choices at any time via the Cookie Preferences
            link in our footer, or directly here:
          </p>
          <div className="pt-1">
            <CookiePreferencesButton className="px-3.5 py-1.5 rounded-xl border border-line bg-surface text-fg hover:border-primary font-medium shadow-xs" />
          </div>
        </section>

        {/* 7. Third-Party Services & Hosting */}
        <section id="third-parties" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">07.</span>
            Third-Party Infrastructure and Content Delivery
          </h2>
          <p>
            We rely on trusted infrastructure providers to deliver Audify reliably:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-1">
            <li>
              <strong className="text-fg">Edge Hosting &amp; CDN (Vercel Inc.):</strong> Hosts our Next.js frontend code and executes serverless API routes on a global edge network. Vercel adheres to rigorous enterprise security standards.
            </li>
            <li>
              <strong className="text-fg">External Media Links (YouTube):</strong> Links to acoustic demonstrations, tutorials, and music tracks curated by Xpert Melody redirect to YouTube (Google LLC), where Google&apos;s independent privacy policy applies.
            </li>
            <li>
              <strong className="text-fg">Sponsor Placements (Advertising):</strong> In production environments where advertising is
              explicitly enabled (via the{" "}
              <code className="font-mono text-primary bg-surface px-1 py-0.5 rounded border border-line">NEXT_PUBLIC_ADS_ENABLED</code>{" "}
              deployment flag), banner advertisement containers marked &quot;Advertisement&quot; are rendered on some pages and served by a
              third-party advertising network (Adsterra). These placements:
              <ul className="list-disc list-inside pl-2 pt-1.5 space-y-1">
                <li>Never receive your audio files, audio buffers, filenames, or audio metadata — audio processing is fully local and advertising code has no access to it.</li>
                <li>Load third-party JavaScript from the advertiser&apos;s servers, which can observe standard browser-level information (IP address, device characteristics, referrer, cookies) plausibly needed to serve ads, as with any advertising network.</li>
                <li>May cause the advertising network to set its own cookies or local identifiers for ad delivery, frequency capping, and fraud prevention; these are the vendor&apos;s processing operations and are governed by the vendor&apos;s privacy policy, not ours.</li>
              </ul>
              <span className="block pt-1.5">
                Advertising display is <strong>part of the free service</strong>: in eligible
                production builds it is enabled by default and is not gated by the cookie banner;
                optional analytics and workstation-cache cookies remain separately manageable.
                Advertising is disabled by default in development and test environments. The
                third-party network may use cookies or device identifiers for ad delivery, and it
                is the operator&apos;s responsibility to confirm with the vendor how such
                processing is permitted in regions where consent to personalized advertising is
                legally required. On-device privacy controls (browser ad-blockers, tracking
                protection, cookie clearing) continue to apply to these third-party containers.
              </span>
            </li>
          </ul>
        </section>

        {/* 8. Purposes & Lawful Bases */}
        <section id="legal-bases" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">08.</span>
            Purposes and Lawful Bases for Processing
          </h2>
          <p>
            Under applicable data protection frameworks (such as the EU/UK General Data Protection Regulation (GDPR) and the Indian Digital Personal Data Protection Act (DPDP)), we process information under the following legal bases:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-xs">
            <li>
              <strong className="text-fg">Performance of Service:</strong> Executing DSP transformations in local memory as requested by user actions.
            </li>
            <li>
              <strong className="text-fg">Legitimate Interests:</strong> Protecting the application against abuse, diagnosing client compatibility issues, and responding to direct inquiries.
            </li>
            <li>
              <strong className="text-fg">Consent:</strong> Where required for optional non-essential cookies or analytics technologies.
            </li>
          </ul>
        </section>

        {/* 9. Data Retention & Erasure */}
        <section id="retention" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">09.</span>
            Data Retention and Deletion Practices
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-1">
            <li>
              <strong className="text-fg">Audio Data:</strong> Retained for exactly <strong>zero seconds</strong> on any server. Exists solely in your local browser tab RAM and is erased when you close the session.
            </li>
            <li>
              <strong className="text-fg">Contact Messages:</strong> Stored securely in our support inbox only for as long as necessary to address your inquiry or technical bug report, after which messages are periodically archived and purged.
            </li>
            <li>
              <strong className="text-fg">Browser Storage:</strong> LocalStorage keys remain on your device until cleared through your browser settings or overridden by your preferences.
            </li>
          </ul>
        </section>

        {/* 10. Security Measures & Limits */}
        <section id="security" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">10.</span>
            Security Measures and Architectural Limitations
          </h2>
          <p>
            We implement comprehensive technical protections: HTTPS-only delivery via modern TLS, strict Content Security Policies, client-side CPU rate limiting via look-ahead peak limiting (−0.3 dBFS ceiling) to prevent audio distortion and hardware damage, and sandboxed memory handling.
          </p>
          <p className="text-xs">
            <em>Limitations:</em> Because audio processing runs locally inside your browser, the ultimate security of your local files depends on the security of your device, operating system, and browser extensions. We recommend keeping your web browser updated and using caution with untrusted third-party browser extensions.
          </p>
        </section>

        {/* 11. Children's Privacy */}
        <section id="children" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">11.</span>
            Children&apos;s Privacy
          </h2>
          <p>
            Audify is not structured for or directed at children under the age of 13 (or under 16 in certain European jurisdictions). We do not knowingly collect personal information from children. If you believe a child has submitted personal details through our contact form, please notify us at <a href="mailto:support@nyxen.in" className="text-primary hover:underline">support@nyxen.in</a> and we will promptly delete the data.
          </p>
        </section>

        {/* 12. Your Privacy Rights */}
        <section id="user-rights" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">12.</span>
            Your Privacy Rights
          </h2>
          <p>
            Depending on your jurisdiction (including the European Economic Area, the United Kingdom, California, and India), you hold statutory rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-xs">
            <li>Right to access personal information held about you.</li>
            <li>Right to request rectification or correction of inaccurate information.</li>
            <li>Right to request deletion (erasure) of personal correspondence.</li>
            <li>Right to object to or restrict certain types of processing.</li>
            <li>Right to withdraw consent at any time without affecting lawful prior processing.</li>
          </ul>
          <p className="text-xs">
            Because we do not maintain user accounts or store your audio files, we cannot retrieve or supply copies of audio processed in past sessions. To exercise your rights regarding contact inquiries, email <a href="mailto:support@nyxen.in" className="text-primary hover:underline">support@nyxen.in</a>.
          </p>
        </section>

        {/* 13. International Transfers */}
        <section id="international" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">13.</span>
            International Transfers
          </h2>
          <p>
            Static web assets (HTML, JavaScript, CSS) are served via globally distributed Content Delivery Network (CDN) edge locations. Contact submissions may be processed by edge serverless nodes located across international jurisdictions where our cloud infrastructure providers maintain operations, subject to appropriate contractual and security safeguards.
          </p>
        </section>

        {/* 14. Policy Changes & Contact */}
        <section id="contact-changes" className="space-y-3 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
            <span className="font-mono text-primary text-sm">14.</span>
            Policy Modifications and Contact Information
          </h2>
          <p>
            We may periodically revise this Privacy Policy to reflect technical updates, new DSP tools, or statutory changes. Any revisions will be published on this page with an updated &quot;Last updated&quot; timestamp.
          </p>
          <div className="rounded-xl border border-line bg-surface p-4 sm:p-5 space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-fg">Audify Privacy &amp; Data Governance Contacts</h3>
            <div className="grid gap-2 sm:grid-cols-2 text-xs font-mono">
              <div>
                <span className="text-faint block text-[10px] uppercase font-sans">General Privacy Inquiries</span>
                <a href="mailto:hello@nyxen.in" className="text-primary hover:underline font-medium">hello@nyxen.in</a>
              </div>
              <div>
                <span className="text-faint block text-[10px] uppercase font-sans">Data Rights &amp; Technical Support</span>
                <a href="mailto:support@nyxen.in" className="text-primary hover:underline font-medium">support@nyxen.in</a>
              </div>
            </div>
            <p className="text-[11px] text-faint pt-1 border-t border-line/60">
              Audify by Nyxen × Xpert Melody · Mumbai, Maharashtra, India.
            </p>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
}
