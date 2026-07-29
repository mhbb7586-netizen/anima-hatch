import { cn } from "@/lib/utils";

/** Dotted diamond-node progress bar like in the mockup */
export function PixelProgressBar({
  value, total, className,
}: { value: number; total: number; className?: string }) {
  const nodes = Array.from({ length: total });
  return (
    <div className={cn("flex items-center gap-[3px] justify-center", className)}>
      {nodes.map((_, i) => {
        const active = i < value;
        return (
          <div key={i} className="flex items-center">
            <div
              className="w-[8px] h-[8px]"
              style={{
                background: active ? "var(--purple-glow)" : "#3d2478",
                transform: "rotate(45deg)",
                boxShadow: active ? "0 0 6px var(--purple-glow)" : undefined,
              }}
            />
            {i < total - 1 && (
              <div
                className="w-[10px] h-[2px]"
                style={{ background: active ? "var(--purple)" : "#3d2478" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Segmented RPG stat bar */
export function PixelStatBar({
  value, color, segments = 10, className,
}: { value: number; color: string; segments?: number; className?: string }) {
  const filled = Math.round((value / 100) * segments);
  return (
    <div
      className={cn("inline-flex gap-[2px] p-[2px]", className)}
      style={{ background: "#0a0416", boxShadow: "inset 0 0 0 2px #3d2478" }}
    >
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="w-[10px] h-[12px]"
          style={{
            background: i < filled ? color : "#1a1035",
            boxShadow: i < filled ? `inset 0 -3px 0 0 rgba(0,0,0,0.35), inset 0 3px 0 0 rgba(255,255,255,0.25)` : undefined,
          }}
        />
      ))}
    </div>
  );
}
