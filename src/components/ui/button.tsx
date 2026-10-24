import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium select-none cursor-pointer outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all duration-200",
  {
    variants: {
      variant: {
        primary:
          "btn-gradient-primary text-white font-semibold rounded-lg",
        secondary:
          "btn-secondary border border-line-strong bg-surface text-fg font-medium shadow-xs rounded-lg hover:border-primary/40 hover:text-fg",
        outline:
          "btn-outline border border-line-strong bg-surface/90 text-fg font-medium shadow-xs rounded-lg hover:border-primary/40 hover:text-fg",
        ghost:
          "btn-ghost text-fg hover:bg-black/5 dark:hover:bg-white/10 hover:text-primary font-medium rounded-lg",
        subtle:
          "btn-subtle border border-line bg-raised text-fg hover:bg-deep font-medium hover:border-primary/30 rounded-lg",
        danger:
          "bg-error text-white font-semibold hover:bg-error/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-xs focus-visible:ring-error transition-all rounded-lg",
      },
      size: {
        sm: "min-h-8 h-8 px-3 text-xs rounded-md",
        md: "min-h-9.5 h-9.5 px-4 text-sm rounded-lg",
        lg: "min-h-11 h-11 px-5 text-sm rounded-lg",
        icon: "btn-icon min-h-9.5 min-w-9.5 h-9.5 w-9.5 p-0 rounded-lg",
        "icon-sm": "btn-icon min-h-8 min-w-8 h-8 w-8 p-0 rounded-md",
        "icon-xs": "btn-icon min-h-6 min-w-6 h-6 w-6 p-0 rounded",
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
  const isDisabled = disabled || loading;

  if (asChild) {
    return (
      <Slot
        className={cn(buttonVariants({ variant, size }), className)}
        aria-busy={loading ? "true" : undefined}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isDisabled}
      aria-busy={loading ? "true" : undefined}
      {...props}
    >
      {loading ? (
        <span
          className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent will-change-transform"
          aria-hidden="true"
        />
      ) : (
        leftIcon && (
          <span className="inline-flex shrink-0 transition-transform duration-200">
            {leftIcon}
          </span>
        )
      )}
      {children}
      {!loading && rightIcon && (
        <span className="btn-arrow inline-flex shrink-0 transition-transform duration-200 ease-out">
          {rightIcon}
        </span>
      )}
    </button>
  );
}

export { buttonVariants };
