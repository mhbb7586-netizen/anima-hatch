import { useState, useRef, useMemo } from "react";
import type { Card } from "@/lib/game/data";
import { STATS } from "@/lib/game/data";
import { PixelFrame } from "./PixelFrame";
import { PixelIcon } from "./PixelIcon";
import { PixelTag } from "./PixelInput";
import { cn } from "@/lib/utils";

const toneByStat: Record<string, "purple" | "orange" | "green" | "yellow" | "blue" | "pink"> = {
  wisdom: "purple", courage: "orange", humanity: "green",
  justice: "yellow", temperance: "blue", creativity: "pink",
};

type Props = {
  cards: Card[];
  index: number;
  onChoose: (card: Card, choice: "yes" | "no") => void;
};

export function SwipeDeck({ cards, index, onChoose }: Props) {
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const [leaving, setLeaving] = useState<{ dir: number } | null>(null);

  const current = cards[index];
  const next = cards[index + 1];
  const nextNext = cards[index + 2];

  const rotation = useMemo(() => (drag ? drag.dx * 0.06 : 0), [drag]);
  const opacityHint = drag ? Math.min(1, Math.abs(drag.dx) / 100) : 0;

  function onPointerDown(e: React.PointerEvent) {
    if (leaving) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag({ dx: 0, dy: 0 });
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!startRef.current) return;
    setDrag({ dx: e.clientX - startRef.current.x, dy: e.clientY - startRef.current.y });
  }
  function onPointerUp() {
    if (!drag || !current) { startRef.current = null; setDrag(null); return; }
    const threshold = 80;
    if (Math.abs(drag.dx) > threshold) {
      const dir = drag.dx > 0 ? 1 : -1;
      setLeaving({ dir });
      setTimeout(() => {
        onChoose(current, dir > 0 ? "yes" : "no");
        setLeaving(null);
        setDrag(null);
        startRef.current = null;
      }, 220);
    } else {
      setDrag(null);
      startRef.current = null;
    }
  }

  function trigger(choice: "yes" | "no") {
    if (!current || leaving) return;
    const dir = choice === "yes" ? 1 : -1;
    setLeaving({ dir });
    setTimeout(() => {
      onChoose(current, choice);
      setLeaving(null);
      setDrag(null);
    }, 220);
  }

  return (
    <div className="relative">
      {/* Peek neighbours */}
      <div className="relative h-[380px] flex items-center justify-center select-none touch-none">
        {nextNext && (
          <CardShell card={nextNext} className="absolute scale-[0.9] opacity-40" style={{ transform: "translateX(-14%) rotate(-6deg) scale(0.85)" }} />
        )}
        {next && (
          <CardShell card={next} className="absolute scale-[0.95] opacity-70" style={{ transform: "translateX(14%) rotate(6deg) scale(0.9)" }} />
        )}
        {current && (
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              transform: leaving
                ? `translateX(${leaving.dir * 500}px) rotate(${leaving.dir * 25}deg)`
                : drag
                  ? `translate(${drag.dx}px, ${drag.dy * 0.3}px) rotate(${rotation}deg)`
                  : undefined,
              transition: leaving ? "transform 220ms ease-out" : drag ? "none" : "transform 200ms ease-out",
            }}
          >
            <CardShell card={current} />
            {/* choice hint overlays */}
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              style={{ opacity: drag && drag.dx > 0 ? opacityHint : 0 }}
            >
              <div className="text-[80px] text-[var(--humanity)]" style={{ textShadow: "3px 3px 0 #0a0416" }}>O</div>
            </div>
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              style={{ opacity: drag && drag.dx < 0 ? opacityHint : 0 }}
            >
              <div className="text-[80px] text-[var(--danger)]" style={{ textShadow: "3px 3px 0 #0a0416" }}>X</div>
            </div>
          </div>
        )}
      </div>

      {/* Choice buttons */}
      <div className="mt-8 flex items-center justify-center gap-12">
        <button
          onClick={() => trigger("no")}
          className="pixel-btn pixel-btn-danger w-16 h-16 active:pixel-btn-press"
          aria-label="넘기기"
        >
          <PixelIcon name="x" size={30} color="#ffffff" />
        </button>
        <button
          onClick={() => trigger("yes")}
          className="pixel-btn pixel-btn-success w-16 h-16 active:pixel-btn-press"
          aria-label="선택하기"
        >
          <PixelIcon name="check" size={30} color="#0b3d1e" />
        </button>
      </div>
    </div>
  );
}

function CardShell({
  card, className, style,
}: { card: Card; className?: string; style?: React.CSSProperties }) {
  const stat = STATS[card.stat];
  return (
    <div className={cn("w-[260px]", className)} style={style}>
      <PixelFrame className="px-4 py-5 flex flex-col items-center gap-3">
        <PixelTag tone={toneByStat[card.stat]}>#{stat.label}</PixelTag>
        <div className="text-[28px] mt-2 text-[var(--fg)]" style={{ textShadow: "2px 2px 0 #0a0416" }}>
          {card.keyword}
        </div>
        <div
          className="my-2 flex h-24 w-24 items-center justify-center"
          style={{
            background: "#0a0416",
            boxShadow: "inset 0 0 0 3px var(--pixel-border-dark)",
          }}
        >
          <PixelIcon name={card.icon} size={72} color={stat.color} />
        </div>
        <p className="text-[11px] leading-relaxed text-center text-[var(--fg)]/80 min-h-[36px] px-2">
          {card.description}
        </p>
      </PixelFrame>
    </div>
  );
}
