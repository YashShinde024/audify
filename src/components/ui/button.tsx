import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-45 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white font-semibold shadow-xs hover:bg-primary-hover hover:shadow-sm active:translate-y-[0.5px]",
        secondary:
          "border border-line-strong bg-surface text-fg font-medium shadow-xs hover:bg-raised hover:border-primary/40 hover:text-fg active:translate-y-[0.5px]",
        outline:
          "border border-line-strong bg-surface/90 text-fg font-medium shadow-xs hover:bg-raised hover:border-primary/40 active:translate-y-[0.5px]",
        ghost:
          "text-fg hover:bg-black/5 dark:hover:bg-white/10 hover:text-primary font-medium rounded-lg",
        subtle:
          "border border-line bg-raised text-fg hover:bg-deep font-medium hover:border-primary/30",
        danger:
          "bg-error text-white font-semibold hover:bg-error/90 shadow-xs focus-visible:ring-error",
      },
      size: {
        sm: "min-h-8 h-8 px-3 text-xs rounded-md",
        md: "min-h-9.5 h-9.5 px-4 text-sm rounded-lg",
        lg: "min-h-11 h-11 px-5 text-sm rounded-lg",
        icon: "min-h-9.5 min-w-9.5 h-9.5 w-9.5 p-0 rounded-lg",
        "icon-sm": "min-h-8 min-w-8 h-8 w-8 p-0 rounded-md",
        "icon-xs": "min-h-6 min-w-6 h-6 w-6 p-0 rounded",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span
          className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

export { buttonVariants };
