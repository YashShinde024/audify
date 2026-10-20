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
          "block h-3.5 w-3.5 rounded-full border-2 border-accent bg-surface shadow-xs",
          "transition-transform hover:scale-115 focus-visible:scale-115 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
          props.disabled && "pointer-events-none",
        )}
        aria-label={props["aria-label"]}
      />
    </SliderPrimitive.Root>
  );
}
