"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ReactNode } from "react";

export interface FaqEntry {
  question: string;
  answer: ReactNode;
}

const defaultFaqs: FaqEntry[] = [
  {
    question: "Is AudioMorph free to use?",
    answer: (
      <p>
        Yes. AudioMorph is a completely free, browser-based audio tool with no subscriptions,
        no required accounts, and no paywalls.
      </p>
    ),
  },
  {
    question: "What file formats and sizes are supported?",
    answer: (
      <p>
        AudioMorph accepts MP3, WAV, OGG, FLAC, and AAC files up to 10 MB in size. Files are
        validated immediately in your browser.
      </p>
    ),
  },
  {
    question: "What export formats can I download?",
    answer: (
      <p>
        You can export in <strong>WAV (16-bit, 24-bit integer, and 32-bit float PCM)</strong>,
        <strong> MP3 (128, 192, 256, and 320 kbps CBR)</strong>, and <strong>AIFF (16/24-bit)</strong>.
        You can also customize sample rates (44.1 kHz, 48.0 kHz) and apply mono downmixing.
      </p>
    ),
  },
  {
    question: "Does my audio ever get uploaded to a server?",
    answer: (
      <p>
        Never. All decoding, DSP effect application, and multi-format file export happen 100% locally
        within your browser tab using Web Audio API buffers. Your audio never touches an external server.
      </p>
    ),
  },
  {
    question: "What are Peak Protection and Peak Normalization?",
    answer: (
      <p>
        <strong>Peak Protection</strong> engages a look-ahead peak limiter at −0.3 dBFS with a sliding minimum deque to ensure
        heavy bass or boosted effects do not digitally clip. <strong>Peak Normalization</strong> calculates
        the peak amplitude and applies clean linear make-up gain so the loudest sample sits at −0.5 dBFS (0.944 linear peak;
        this is a sample-peak process, not perceived LUFS loudness matching).
      </p>
    ),
  },
  {
    question: "How does the A/B comparison feature work?",
    answer: (
      <p>
        In the audition player, toggle between &ldquo;Original&rdquo; and &ldquo;Processed&rdquo;
        to immediately hear how the chosen DSP parameters transformed your sound with zero latency.
      </p>
    ),
  },
  {
    question: "What happens when I close the tab?",
    answer: (
      <p>
        Because AudioMorph maintains zero server logs and zero remote session tracking, closing the tab
        safely clears all in-memory buffers. Make sure to download your processed audio before navigating away.
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
