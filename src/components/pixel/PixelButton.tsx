import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "danger" | "success" | "warning" | "ghost" | "disabled";
type Size = "sm" | "md" | "lg" | "icon";

export type PixelButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variantClass: Record<Variant, string> = {
  primary: "pixel-btn",
  danger: "pixel-btn pixel-btn-danger",
  success: "pixel-btn pixel-btn-success",
  warning: "pixel-btn pixel-btn-warning",
  ghost: "pixel-btn pixel-btn-ghost",
  disabled: "pixel-btn pixel-btn-disabled",
};

const sizeClass: Record<Size, string> = {
  sm: "text-[11px] px-3 py-2",
  md: "text-[13px] px-4 py-3",
  lg: "text-[15px] px-6 py-4",
  icon: "w-14 h-14 p-0",
};

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ variant = "primary", size = "md", full, className, children, leftIcon, rightIcon, disabled, ...rest }, ref) => {
    const v = disabled ? "disabled" : variant;
    return (
      <button
        ref={ref}
        {...rest}
        disabled={disabled}
        className={cn(
          variantClass[v],
          sizeClass[size],
          "active:pixel-btn-press select-none",
          full && "w-full",
          className,
        )}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  },
);
PixelButton.displayName = "PixelButton";
