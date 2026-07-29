import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Pixel frame — outer box with 4-color pixel border */
export function PixelFrame({
  children, className, tone = "panel", ...rest
}: HTMLAttributes<HTMLDivElement> & { tone?: "panel" | "deep" | "mid" }) {
  const bg = tone === "deep" ? "bg-[var(--bg-deep)]" : tone === "mid" ? "bg-[var(--bg-mid)]" : "bg-[var(--bg-panel)]";
  return (
    <div {...rest} className={cn("relative", bg, className)}
      style={{
        boxShadow: [
          // outer black
          "0 -3px 0 0 #0a0416",
          "0 3px 0 0 #0a0416",
          "-3px 0 0 0 #0a0416",
          "3px 0 0 0 #0a0416",
          // inner light purple
          "inset 0 3px 0 0 var(--pixel-border)",
          "inset 0 -3px 0 0 var(--pixel-border-dark)",
          "inset 3px 0 0 0 var(--pixel-border)",
          "inset -3px 0 0 0 var(--pixel-border-dark)",
        ].join(","),
      }}
    >
      {children}
    </div>
  );
}

export function PixelCard({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <PixelFrame {...rest} className={cn("p-4", className)}>
      {children}
    </PixelFrame>
  );
}

/** A framed window with a title bar in the top border */
export function PixelWindow({
  title, children, className, action,
}: { title?: ReactNode; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <PixelFrame className={cn("pt-3 pb-4 px-4", className)}>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <div className="text-[13px] text-[var(--purple-glow)]">{title}</div>
          {action}
        </div>
      )}
      {children}
    </PixelFrame>
  );
}

/** Dialog / Modal — same style, rendered as centered overlay wrapper elsewhere */
export function PixelDialog({
  open, onClose, title, children, actions,
}: {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 pb-8 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-[360px] animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <PixelFrame className="px-5 py-5">
          {title && <div className="text-center text-[15px] mb-3 text-[var(--purple-glow)]">{title}</div>}
          <div className="text-[12px] leading-relaxed text-center text-[var(--fg)]/90">{children}</div>
          {actions && <div className="mt-5 flex gap-2 justify-center">{actions}</div>}
        </PixelFrame>
      </div>
    </div>
  );
}
