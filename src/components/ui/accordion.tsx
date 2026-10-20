"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type AccordionRootProps = ComponentProps<typeof AccordionPrimitive.Root>;
export type AccordionItemProps = ComponentProps<typeof AccordionPrimitive.Item>;
export type AccordionTriggerProps = ComponentProps<typeof AccordionPrimitive.Trigger>;
export type AccordionContentProps = ComponentProps<typeof AccordionPrimitive.Content>;

export function Accordion({ className, children, ...props }: AccordionRootProps) {
  return (
    <AccordionPrimitive.Root className={className} {...props}>
      {children}
    </AccordionPrimitive.Root>
  );
}

export function AccordionItem({ className, children, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      className={cn("overflow-hidden rounded-xl border border-line bg-surface", className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Item>
  );
}

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-fg",
          "hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
          className,
        )}
        {...props}
      >
        {children}
        <CaretDown
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "px-5 pb-4 text-sm leading-relaxed text-muted overflow-hidden",
        "data-[state=closed]:animate-accordion-close data-[state=open]:animate-accordion-open",
        className,
      )}
      {...props}
    >
      <div className="pt-1">{children}</div>
    </AccordionPrimitive.Content>
  );
}
