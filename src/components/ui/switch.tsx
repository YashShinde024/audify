"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root>;

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent",
        "bg-line-strong transition-colors data-[state=checked]:bg-accent data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-3.5 w-3.5 rounded-full bg-white dark:bg-canvas shadow-xs transition-transform",
          "translate-x-0.5 data-[state=checked]:translate-x-[1.125rem]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
