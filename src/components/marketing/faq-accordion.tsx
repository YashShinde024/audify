"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ReactNode } from "react";

export interface FaqEntry {
  question: string;
  answer: ReactNode;
}

const defaultFaqs: FaqEntry[] = [
  {
    question: "Do my audio uploads ever leave my computer or device?",
    answer: (
      <p>
        Never. All audio decoding, parameter shaping, effects calculation, and export rendering happen
        strictly inside your browser&apos;s memory using the Web Audio API and OfflineAudioContext. No audio
        bytes are ever transmitted over the network to external servers or cloud storage.
      </p>
    ),
  },
  {
    question: "Which audio formats and file sizes are supported?",
    answer: (
      <p>
        Audify imports <strong>MP3, WAV, OGG, FLAC, and AAC</strong> files up to a maximum limit of
        <strong> 10 MB</strong> and 10 minutes in duration. The 10 MB boundary ensures browser memory
        safety and avoids tab crashes on mobile devices or memory-constrained environments.
      </p>
    ),
  },
  {
    question: "How do Audify presets work under the hood?",
    answer: (
      <p>
        Presets are pre-configured chains of real Web Audio DSP nodes—including biquad filter cascades,
        stereo convolution impulses for spatial reverb, dynamic LFO-modulated stereo panners for 8D motion,
        and playback rate manipulation. You can use any preset as a foundation and further tweak its parameters in Studio.
      </p>
    ),
  },
  {
    question: "Does changing audio speed also change the pitch?",
    answer: (
      <p>
        By default in standard varispeed mode (such as <em>Slowed + Reverb</em> or <em>Nightcore</em>), speed and pitch are
        acoustically linked just like an analog tape deck or vinyl turntable—slowing playback lowers the pitch, and speeding it up
        raises the pitch. When decoupled pitch shifting is required, our polyphase sinc resampling pipeline modulates pitch independently.
      </p>
    ),
  },
  {
    question: "How is output audio quality determined upon export?",
    answer: (
      <p>
        Output quality depends on your selected export profile. For bit-accurate, uncompressed fidelity, export in
        <strong> WAV (24-bit or 32-bit float)</strong> or <strong>AIFF</strong> at 44.1 kHz or 48.0 kHz. If you choose MP3,
        Audify uses a client-side LAME encoder with selectable bitrates up to <strong>320 kbps CBR</strong>. All exports pass through
        our Look-Ahead Sample-Peak Limiter at −0.3 dBFS to prevent clipping distortion.
      </p>
    ),
  },
  {
    question: "What audio utilities are available beyond creative presets?",
    answer: (
      <p>
        In addition to creative presets, Audify provides precision engineering utilities: a
        <strong> Dynamic Compressor</strong> with threshold and ratio controls, an <strong>Audio Trimmer &amp; Cutter</strong>, a
        <strong> Multi-Format Audio Converter</strong> (WAV, MP3, AIFF), a <strong>Vocal Remover</strong> with Mid/Side center extraction, a
        <strong> DC Offset Remover</strong>, an interactive <strong>3-Band Parametric EQ</strong>, and <strong>Fade In/Out</strong> tools.
      </p>
    ),
  },
  {
    question: "What is the difference between audio compression and normalization?",
    answer: (
      <p>
        <strong>Peak normalization</strong> multiplies the entire waveform by a single fixed gain factor so the highest transient reaches
        a ceiling (−0.3 dBFS) without changing the internal dynamics. <strong>Dynamic compression</strong> selectively attenuates loud peaks
        above a threshold to reduce the dynamic range, allowing makeup gain to increase perceived punch and leveling out quiet and loud passages.
      </p>
    ),
  },
  {
    question: "Why is there a 10 MB file-size limitation?",
    answer: (
      <p>
        Because all processing occurs uncompressed in client RAM (where a 5-minute stereo 44.1 kHz WAV consumes ~50 MB of raw PCM buffers,
        and multi-pass convolution impulse processing requires duplicate working buffers), the 10 MB compressed file ceiling ensures
        flawless performance without exceeding mobile browser memory quotas.
      </p>
    ),
  },
];

export function FAQAccordion({ items = defaultFaqs, className }: { items?: FaqEntry[]; className?: string }) {
  return (
    <Accordion type="single" collapsible className={className}>
      {items.map((faq, index) => (
        <AccordionItem key={faq.question} value={`faq-${index}`}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
