"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ReactNode } from "react";

export interface FaqEntry {
  question: string;
  answer: ReactNode;
}

export function FAQAccordion({ items, className }: { items: FaqEntry[]; className?: string }) {
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
