import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-45 select-none focus-visible:outline-2 focus-visible:outline-violet focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-violet text-white shadow-sm hover:bg-accent-hover active:translate-y-[0.5px]",
        secondary:
          "border border-line-strong bg-surface text-fg hover:bg-raised hover:border-fg/25 active:translate-y-[0.5px]",
        outline:
          "border border-line bg-transparent text-fg hover:bg-raised hover:border-line-strong",
        ghost:
          "text-muted hover:bg-raised/80 hover:text-fg",
        subtle:
          "bg-raised text-fg hover:bg-deep",
        danger:
          "bg-error/90 text-white hover:bg-error",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-9.5 px-4 text-sm rounded-lg",
        lg: "h-11 px-5 text-sm rounded-lg",
        icon: "h-9.5 w-9.5 p-0 rounded-lg",
        "icon-sm": "h-8 w-8 p-0 rounded-md",
        "icon-xs": "h-6 w-6 p-0 rounded",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
