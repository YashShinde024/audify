"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type SliderProps = ComponentProps<typeof SliderPrimitive.Root>;

export function Slider({ className, ...props }: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center py-1",
        "data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-1 w-full grow overflow-hidden rounded-full bg-line-strong data-disabled:bg-line"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute h-full rounded-full bg-accent",
            props.disabled && "bg-muted",
          )}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        className={cn(
          "relative block h-4 w-4 rounded-full border-2 border-primary bg-surface shadow-xs",
          "before:absolute before:-inset-2.5 before:content-['']",
          "transition-transform hover:scale-115 focus-visible:scale-115 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
          props.disabled && "pointer-events-none",
        )}
        aria-label={props["aria-label"]}
      />
    </SliderPrimitive.Root>
  );
}
