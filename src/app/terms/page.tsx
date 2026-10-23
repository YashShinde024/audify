import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout, type LegalSectionItem } from "@/components/legal/legal-page-layout";
import { siteConfig } from "@/config/site";
import {
  Sparkle,
  ShieldCheck,
  CheckCircle,
  WarningCircle,
  Cpu,
  Scales,
  FileAudio,
  Waveform,
  GlobeHemisphereWest,
  EnvelopeSimple,
  Info,
  ClockAfternoon,
  Key,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Terms of Service — Creator Ownership, Fair Use & Service Terms",
  description:
    "Terms of Service governing the use of Audify by Nyxen × Xpert Melody. Clear, transparent legal conditions with 100% creator ownership, client DSP limits, and fair use guidelines.",
  keywords: [
    "Audify terms of service",
    "audio editor licensing",
    "creator ownership terms",
    "audio processing rights",
    "free audio editor commercial rights",
    "client-side DSP terms",
  ],
  openGraph: {
    title: "Terms of Service — Audify Audio Processing",
    description: "Terms governing access to Audify by Nyxen × Xpert Melody. Transparent, creator-first legal terms.",
    url: `${siteConfig.url}/terms`,
    siteName: siteConfig.name,
  },
  other: {
    "geo.region": "GLOBAL",
    "DC.title": "Audify Terms of Service & Creator Licensing",
  },
};

const SECTIONS: LegalSectionItem[] = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "eligibility", title: "Eligibility & Permitted Use" },
  { id: "user-conduct", title: "User Conduct & Prohibited Activities" },
  { id: "audio-rights", title: "Uploaded Audio & Source Rights" },
  { id: "creator-ownership", title: "Creator Ownership & Commercial Rights" },
  { id: "service-license", title: "Limited Processing Permission" },
  { id: "audify-ip", title: "Audify Intellectual Property & Branding" },
  { id: "technical-limits", title: "File Limits & Technical Availability" },
  { id: "export-quality", title: "Export Quality & Audio Limitations" },
  { id: "third-parties", title: "Third-Party Services & Links" },
  { id: "service-availability", title: "Availability, Changes & Maintenance" },
  { id: "disclaimers", title: "Disclaimers & Statutory Liability" },
  { id: "suspension", title: "Suspension & Abuse Prevention" },
  { id: "changes", title: "Modifications to Terms" },
  { id: "governing-law", title: "Governing Law & Dispute Resolution" },
  { id: "contact", title: "Contact & Legal Inquiries" },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Terms & Creator Rights"
      title="Terms of Service"
      lead="Transparent legal conditions for using Audify by Nyxen × Xpert Melody. Built to protect creator ownership while clearly defining technical operational boundaries."
      effectiveDate="October 2026"
      lastUpdated="October 24, 2026"
      sections={SECTIONS}
      otherDocumentLink={{
        href: "/privacy",
        label: "Review Privacy Policy",
      }}
    >
      <div className="space-y-10 text-xs sm:text-sm text-muted leading-relaxed">
        {/* Core Creator Guarantee Callout */}
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Sparkle size={16} weight="duotone" />
            <span>Core Commitment · 100% Creator Ownership</span>
          </div>
          <p className="text-sm leading-relaxed text-fg/90">
            <strong>You retain 100% ownership, copyright, and commercial distribution rights</strong> over all audio
            recordings, stems, and music files you process, edit, or master using Audify. We assert zero royalties,
            zero copyright claims, and zero derivative ownership over your creative output.
          </p>
        </div>

        {/* Section 1: Acceptance */}
        <section id="acceptance" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <CheckCircle size={20} className="text-primary" weight="duotone" />
            <h2>1. Acceptance of Terms</h2>
          </div>
          <p>
            By accessing or using the Audify web application (available at{" "}
            <code className="text-fg font-mono text-[11px] bg-canvas-subtle px-1.5 py-0.5 rounded border border-line">
              audify.nyxen.in
            </code>{" "}
            and associated subdomains), accessing the Audify Studio, or utilizing any audio processing features provided
            by Nyxen in collaboration with Xpert Melody (&quot;Audify&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
            you acknowledge that you have read, understood, and agree to be bound by these Terms of Service
            (&quot;Terms&quot;) and our accompanying{" "}
            <Link href="/privacy" className="text-primary hover:underline font-medium">
              Privacy Policy
            </Link>
            .
          </p>
          <p>
            If you do not agree to these Terms in their entirety, you must discontinue your use of Audify immediately.
            These Terms form a legally binding contract between you (either as an individual creator or on behalf of a
            legal entity you represent) and the operators of Audify.
          </p>
        </section>

        {/* Section 2: Eligibility */}
        <section id="eligibility" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <ShieldCheck size={20} className="text-primary" weight="duotone" />
            <h2>2. Eligibility & Permitted Use</h2>
          </div>
          <p>
            You may use Audify only if you are of legal age to form a binding contract in your jurisdiction (at least 13
            years old in the United States, 16 years old in relevant European jurisdictions, or the applicable age of
            majority in your region, whichever is higher). If you are under the required age, you may only use Audify
            under the active supervision of a parent or legal guardian who agrees to be bound by these Terms.
          </p>
          <p>
            <strong>Permitted Uses:</strong> You are granted a personal, non-exclusive, revocable, non-transferable, and
            royalty-free license to use the Audify software interface in modern web browsers for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Personal audio production, editing, and experimentation.</li>
            <li>Commercial audio production, including music releases, podcasts, broadcast mixing, and commercial video sound design.</li>
            <li>Educational demonstration and audio engineering instruction.</li>
          </ul>
        </section>

        {/* Section 3: User Conduct */}
        <section id="user-conduct" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <WarningCircle size={20} className="text-rose-400" weight="duotone" />
            <h2>3. User Conduct & Prohibited Activities</h2>
          </div>
          <p>
            You agree to use Audify solely for lawful purposes. You agree not to engage in, attempt, or encourage any of
            the following prohibited conduct:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Denial of Service & Abuse:</strong> Automated scraping, botting, flooding contact forms, or
              attempting to overwhelm the hosting infrastructure or content delivery network.
            </li>
            <li>
              <strong>Reverse Engineering of Proprietary Assets:</strong> Decompiling, extracting, or appropriating Audify&apos;s
              proprietary branding, UI illustrations, logos, or commercial trade dress without authorization.
            </li>
            <li>
              <strong>Unlawful or Infringing Content:</strong> Using Audify to process, amplify, or package audio that
              violates criminal statutes, constitutes hate speech, harassment, defamation, or facilitates copyright
              infringement at scale.
            </li>
            <li>
              <strong>Security Tampering:</strong> Bypassing rate-limiting mechanisms, tampering with HTTP headers, or
              introducing malicious payloads via web form inputs.
            </li>
          </ul>
        </section>

        {/* Section 4: Uploaded Audio Rights */}
        <section id="audio-rights" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <FileAudio size={20} className="text-primary" weight="duotone" />
            <h2>4. Uploaded Audio & Source Rights</h2>
          </div>
          <p>
            You are exclusively responsible for all audio files that you select, drag, import, or decode into the Audify
            Studio interface. You represent and warrant that:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>
              You own all intellectual property rights (including master recording and underlying musical composition
              rights) in the audio you process, <em>OR</em>
            </li>
            <li>
              You have obtained all required licenses, clearances, written consents, or legal authorizations from the
              relevant copyright holders, <em>OR</em>
            </li>
            <li>
              Your use qualifies under applicable statutory exceptions such as Fair Use or Fair Dealing in your legal
              jurisdiction.
            </li>
          </ol>
          <div className="p-4 rounded-xl border border-line/80 bg-canvas-subtle text-xs space-y-1.5">
            <p className="font-semibold text-fg flex items-center gap-1.5">
              <Info size={15} className="text-primary" />
              <span>Important Copyright Clarity:</span>
            </p>
            <p>
              Applying reverb, bass boosts, pitch shifts, stereo widening, or EQ curves in Audify to a third-party
              copyrighted sound recording <strong>does not create a new copyright</strong> and does not grant you the right
              to redistribute, monetize, or publish that track. You remain solely liable for any infringement claims
              arising from unauthorized distribution of copyrighted material.
            </p>
          </div>
        </section>

        {/* Section 5: Creator Ownership */}
        <section id="creator-ownership" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <Sparkle size={20} className="text-primary" weight="duotone" />
            <h2>5. Creator Ownership & Commercial Rights</h2>
          </div>
          <p>
            Audify is built on creator-first principles. We acknowledge and agree that:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>100% IP Retention:</strong> You retain complete, unrestricted ownership of your raw source files and
              any output files rendered or exported by Audify.
            </li>
            <li>
              <strong>Zero Royalties:</strong> Audify does not claim any publishing rights, producer points, royalties,
              attribution tags, or revenue splits from your rendered audio.
            </li>
            <li>
              <strong>Commercial Distribution:</strong> You may commercially release, distribute on streaming platforms
              (Spotify, Apple Music, Tidal, etc.), broadcast on television/radio, license for sync, or distribute as sound
              libraries any audio processed using Audify, subject only to your own underlying legal rights in the source
              material.
            </li>
            <li>
              <strong>Zero Audify Branding on Output:</strong> Output audio files contain no audio watermarks, frequency
              stamps, or injected metadata claiming Audify ownership.
            </li>
          </ul>
        </section>

        {/* Section 6: Limited Processing Permission */}
        <section id="service-license" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <Cpu size={20} className="text-primary" weight="duotone" />
            <h2>6. Limited Permission to Process Audio</h2>
          </div>
          <p>
            To provide the requested digital signal processing services, you grant Audify the temporary, technically
            necessary permission to read, decode, buffer, transform, and render your audio files locally within your
            client browser.
          </p>
          <p>
            Because Audify executes using the client-side W3C Web Audio API, this permission is strictly limited to
            temporary in-memory volatile execution within your browser process. You <strong>do not</strong> grant Audify
            any license to store, archive, index, train machine learning models, publicly display, or distribute your audio
            files.
          </p>
        </section>

        {/* Section 7: Audify IP */}
        <section id="audify-ip" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <Key size={20} className="text-primary" weight="duotone" />
            <h2>7. Audify Intellectual Property & Branding</h2>
          </div>
          <p>
            While you own your audio, all right, title, and interest in and to Audify itself — including the web
            application, source code, DSP algorithms, filter graphs, preset configurations, user interface designs, visual
            assets, gradients, documentation, and the &quot;Audify&quot;, &quot;Nyxen&quot;, and &quot;Xpert Melody&quot; marks, logos,
            and brand assets — are the exclusive property of Nyxen, Xpert Melody, and their licensors.
          </p>
          <p>
            You may not copy, reproduce, frame, mirror, scrape, or commercially redistribute the Audify codebase or
            interface without prior written permission from Nyxen.
          </p>
        </section>

        {/* Section 8: Technical Limits */}
        <section id="technical-limits" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <Waveform size={20} className="text-primary" weight="duotone" />
            <h2>8. File Limits, Formats & Technical Availability</h2>
          </div>
          <p>
            Audify provides in-browser audio capabilities subject to technical constraints enforced for system stability:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-line text-[11px] sm:text-xs">
              <thead>
                <tr className="bg-canvas-subtle border-b border-line text-fg">
                  <th className="p-2 sm:p-3 font-semibold">Parameter</th>
                  <th className="p-2 sm:p-3 font-semibold">Specification</th>
                  <th className="p-2 sm:p-3 font-semibold">Operational Caveat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                <tr>
                  <td className="p-2 sm:p-3 font-mono text-fg">Max File Size</td>
                  <td className="p-2 sm:p-3">10 MB default client ingest limit</td>
                  <td className="p-2 sm:p-3">Prevents browser WebAssembly / ArrayBuffer out-of-memory crashes</td>
                </tr>
                <tr>
                  <td className="p-2 sm:p-3 font-mono text-fg">Supported Formats</td>
                  <td className="p-2 sm:p-3">WAV, MP3, FLAC, OGG, AAC</td>
                  <td className="p-2 sm:p-3">Subject to host browser codec support via BaseAudioContext.decodeAudioData</td>
                </tr>
                <tr>
                  <td className="p-2 sm:p-3 font-mono text-fg">DSP Latency</td>
                  <td className="p-2 sm:p-3">Hardware dependent</td>
                  <td className="p-2 sm:p-3">Dependent on device CPU power, audio thread buffer size, and OS audio subsystem</td>
                </tr>
                <tr>
                  <td className="p-2 sm:p-3 font-mono text-fg">Rendering Engine</td>
                  <td className="p-2 sm:p-3">OfflineAudioContext</td>
                  <td className="p-2 sm:p-3">Deterministic non-real-time rendering in background worker threads</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 9: Export Quality */}
        <section id="export-quality" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <Scales size={20} className="text-primary" weight="duotone" />
            <h2>9. Export Quality, Audio Encoding & Limitations</h2>
          </div>
          <p>
            Audify utilizes high-precision 32-bit floating-point audio processing within the Web Audio DSP graph. However,
            we explicitly <strong>do not guarantee mathematically lossless or artifact-free output</strong> for all
            formats and browser environments:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Lossy Encoding (MP3 / AAC):</strong> When exporting to MP3 or compressed containers, psychoacoustic
              data compression inherently discards inaudible high-frequency audio components. Bitrate settings (128 kbps,
              192 kbps, 320 kbps) alter the final frequency response.
            </li>
            <li>
              <strong>Hardware Sample Rates:</strong> Browsers operate at varying hardware clock rates (typically 44.1 kHz
              or 48.0 kHz). Resampling operations performed by browser audio engines may introduce subtle phase or
              anti-aliasing filters.
            </li>
            <li>
              <strong>Mastering Verification:</strong> You are strongly advised to audition, monitor, and meter all
              exported files on calibrated studio monitors and reference headphones before distributing masters to streaming
              services or broadcast media.
            </li>
          </ul>
        </section>

        {/* Section 10: Third Parties */}
        <section id="third-parties" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <GlobeHemisphereWest size={20} className="text-primary" weight="duotone" />
            <h2>10. Third-Party Services & Links</h2>
          </div>
          <p>
            Audify may link to external websites, social platforms, developer profiles, or audio repositories (including
            GitHub, X/Twitter, or artist portfolios). These third-party sites are governed exclusively by their own terms
            and privacy policies. We do not endorse, monitor, or accept liability for any content, policies, or practices
            of external third-party websites.
          </p>
        </section>

        {/* Section 11: Service Availability */}
        <section id="service-availability" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <ClockAfternoon size={20} className="text-primary" weight="duotone" />
            <h2>11. Service Availability, Changes & Maintenance</h2>
          </div>
          <p>
            Audify is provided on an &quot;as available&quot; basis. We reserve the right to modify, update, pause, or
            discontinue any portion of the service or specific audio features (such as experimental DSP filters or export
            formats) at any time without notice. We are not liable to you or any third party for any service interruptions,
            downtime, browser incompatibilities, or lost data resulting from page refreshes.
          </p>
        </section>

        {/* Section 12: Disclaimers & Liability */}
        <section id="disclaimers" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <ShieldCheck size={20} className="text-primary" weight="duotone" />
            <h2>12. Disclaimers & Statutory Liability Limitations</h2>
          </div>
          <div className="p-4 rounded-xl border border-line/80 bg-canvas-subtle uppercase text-[11px] leading-relaxed tracking-wide space-y-2 text-muted">
            <p className="font-semibold text-fg">Statutory Disclaimer of Warranties:</p>
            <p>
              To the maximum extent permitted by applicable law, Audify is provided &quot;as is&quot; and &quot;as
              available,&quot; without express or implied warranties of any kind, including merchantability, fitness for a
              particular purpose, non-infringement, or error-free audio processing.
            </p>
            <p>
              Under no circumstances shall Nyxen, Xpert Melody, or their developers be liable for indirect, incidental,
              special, punitive, or consequential damages (including loss of audio recordings, lost profits, project
              deadlines, or data corruption) arising out of your use or inability to use the application.
            </p>
          </div>
          <p className="text-xs text-muted">
            <em>Legal Review Note:</em> Nothing in these Terms excludes or limits liability that cannot legally be excluded
            under applicable consumer protection law in your jurisdiction (including fraud, gross negligence, or death and
            personal injury caused by willful misconduct).
          </p>
        </section>

        {/* Section 13: Suspension */}
        <section id="suspension" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <WarningCircle size={20} className="text-amber-400" weight="duotone" />
            <h2>13. Suspension & Abuse Prevention</h2>
          </div>
          <p>
            We reserve the right to restrict, rate-limit, or block access to our hosting endpoints or contact forms for any
            IP address or user engaging in abusive behavior, bot attacks, automated form spam, or security probing.
          </p>
        </section>

        {/* Section 14: Modifications */}
        <section id="changes" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <ClockAfternoon size={20} className="text-primary" weight="duotone" />
            <h2>14. Modifications to These Terms</h2>
          </div>
          <p>
            We may revise these Terms from time to time to reflect product enhancements, audio architectural updates, or
            statutory legal requirements. Whenever material changes are introduced, we will update the &quot;Last updated&quot;
            date at the top and bottom of this document.
          </p>
          <p>
            Your continued use of Audify after the publication of revised Terms constitutes your acceptance of the
            modified terms.
          </p>
        </section>

        {/* Section 15: Governing Law */}
        <section id="governing-law" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <Scales size={20} className="text-primary" weight="duotone" />
            <h2>15. Governing Law & Dispute Handling</h2>
          </div>
          <p>
            These Terms shall be interpreted and governed by the laws of <strong>India</strong> (specifically the
            jurisdiction of Mumbai, Maharashtra), without regard to conflict of law principles. Any dispute arising out
            of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts in
            Mumbai, Maharashtra, India.
          </p>
        </section>

        {/* Section 16: Contact */}
        <section id="contact" className="scroll-mt-28 space-y-3">
          <div className="flex items-center gap-2 text-fg font-semibold text-base sm:text-lg">
            <EnvelopeSimple size={20} className="text-primary" weight="duotone" />
            <h2>16. Contact & Legal Inquiries</h2>
          </div>
          <p>
            For questions, legal notices, creator inquiries, or licensing requests regarding these Terms, contact the
            Audify team:
          </p>
          <div className="p-4 rounded-xl border border-line bg-canvas-subtle space-y-2 text-xs">
            <p>
              <strong>Product & Brand:</strong> Audify by Nyxen × Xpert Melody
            </p>
            <p>
              <strong>General Inquiries:</strong>{" "}
              <a href="mailto:hello@nyxen.in" className="text-primary hover:underline font-mono">
                hello@nyxen.in
              </a>
            </p>
            <p>
              <strong>Legal Notices:</strong>{" "}
              <a href="mailto:legal@nyxen.in" className="text-primary hover:underline font-mono">
                legal@nyxen.in
              </a>{" "}
              <span className="text-faint">(routed to support@nyxen.in)</span>
            </p>
            <p>
              <strong>Online Contact Form:</strong>{" "}
              <Link href="/contact" className="text-primary hover:underline">
                audify.nyxen.in/contact
              </Link>
            </p>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
}
