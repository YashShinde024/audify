"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root>;

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-5.5 w-10 shrink-0 cursor-pointer items-center rounded-full border border-line-strong",
        "bg-surface transition-colors data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-fg data-[state=checked]:bg-white shadow-xs transition-transform",
          "translate-x-0.5 data-[state=checked]:translate-x-[1.25rem]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
