import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const PixelInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...rest }, ref) => (
    <input
      ref={ref}
      {...rest}
      className={cn(
        "w-full bg-[var(--bg-deep)] text-[var(--fg)] px-4 py-3 text-[15px] outline-none placeholder:text-[var(--fg)]/40",
        "border-0",
        className,
      )}
      style={{
        boxShadow: [
          "inset 0 3px 0 0 #0a0416",
          "inset 0 -3px 0 0 var(--pixel-border)",
          "inset 3px 0 0 0 #0a0416",
          "inset -3px 0 0 0 var(--pixel-border)",
        ].join(","),
      }}
    />
  ),
);
PixelInput.displayName = "PixelInput";

export function PixelTag({
  children, tone = "purple", className,
}: { children: React.ReactNode; tone?: "purple" | "orange" | "green" | "yellow" | "blue" | "pink"; className?: string }) {
  const map: Record<string, string> = {
    purple: "var(--purple)",
    orange: "var(--courage)",
    green: "var(--humanity)",
    yellow: "var(--justice)",
    blue: "var(--temperance)",
    pink: "var(--creativity)",
  };
  return (
    <span
      className={cn("inline-block text-[11px] px-3 py-1 text-white", className)}
      style={{
        background: map[tone],
        boxShadow: `inset 0 2px 0 0 rgba(255,255,255,0.3), inset 0 -2px 0 0 rgba(0,0,0,0.3), 0 2px 0 0 #0a0416, -2px 0 0 0 #0a0416, 2px 0 0 0 #0a0416, 0 -2px 0 0 #0a0416`,
      }}
    >
      {children}
    </span>
  );
}
