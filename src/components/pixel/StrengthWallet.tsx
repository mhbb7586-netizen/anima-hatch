import { useMemo, useState } from "react";
import { CARD_BY_ID, STATS, countByStat, type Card, type StatKey } from "@/lib/game/data";
import { PixelFrame } from "./PixelFrame";
import { PixelButton } from "./PixelButton";
import { PixelIcon } from "./PixelIcon";
import { cn } from "@/lib/utils";

/**
 * Top 5 strengths: cards of the highest-scoring virtues first, then selection order.
 * `scoreByStat` defaults to the raw self-selection counts.
 */
export function topFiveCards(picks: string[], scoreByStat?: Record<StatKey, number>): Card[] {
  const counts = scoreByStat ?? countByStat(picks);
  return picks
    .map((id, order) => ({ card: CARD_BY_ID[id], order }))
    .filter((e): e is { card: Card; order: number } => Boolean(e.card))
    .sort((a, b) => (counts[b.card.stat] - counts[a.card.stat]) || (a.order - b.order))
    .slice(0, 5)
    .map((e) => e.card);
}

export function StrengthWallet({ picks, scoreByStat }: { picks: string[]; scoreByStat?: Record<StatKey, number> }) {
  const cards = useMemo(() => topFiveCards(picks, scoreByStat), [picks, scoreByStat]);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const start = useState<{ x: number } | null>(null)[0];
  const [dragStart, setDragStart] = useState<number | null>(start?.x ?? null);

  if (cards.length === 0) return null;
  const card = cards[Math.min(index, cards.length - 1)]!;
  const stat = STATS[card.stat];
  const isFlipped = !!flipped[card.id];

  function go(dir: number) {
    setIndex((i) => Math.max(0, Math.min(cards.length - 1, i + dir)));
  }

  return (
    <PixelFrame className="p-4">
      <div className="text-[12px] text-[var(--purple-glow)] mb-3">나의 강점 카드 지갑</div>

      <div
        className="flex justify-center select-none touch-pan-y"
        onPointerDown={(e) => setDragStart(e.clientX)}
        onPointerUp={(e) => {
          if (dragStart === null) return;
          const dx = e.clientX - dragStart;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          setDragStart(null);
        }}
      >
        <button
          onClick={() => setFlipped((f) => ({ ...f, [card.id]: !f[card.id] }))}
          className="w-[220px] h-[280px] text-left"
          aria-label={`${card.keyword} 카드 뒤집기`}
        >
          <div className="relative h-full w-full" style={{ perspective: 800 }}>
            <div
              className="relative h-full w-full transition-transform duration-500"
              style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : undefined }}
            >
              {/* front */}
              <WalletFace hex={stat.hex} style={{ backfaceVisibility: "hidden" }}>
                <div className="text-[10px]" style={{ color: "#0a0416" }}>#{stat.label}</div>
                <div className="my-3 flex h-20 w-20 items-center justify-center" style={{ background: "#0a0416" }}>
                  <PixelIcon name={card.icon} size={58} color={stat.hex} />
                </div>
                <div className="text-[22px] leading-tight text-center" style={{ color: "#0a0416" }}>
                  {card.keyword}
                </div>
                <div className="mt-auto text-[9px]" style={{ color: "#0a0416" }}>탭하면 뒤집혀요</div>
              </WalletFace>
              {/* back */}
              <WalletFace
                hex="#120825"
                border={stat.hex}
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", inset: 0 }}
              >
                <div className="text-[11px]" style={{ color: stat.hex }}>{card.keyword}</div>
                <p className="mt-4 text-[12px] leading-relaxed text-center text-[var(--fg)]/90 px-2">
                  {card.description}
                </p>
                <div className="mt-auto text-[9px] text-[var(--fg)]/50">탭하면 되돌아가요</div>
              </WalletFace>
            </div>
          </div>
        </button>
      </div>

      {/* dots */}
      <div className="mt-3 flex justify-center gap-2">
        {cards.map((c, k) => (
          <button
            key={c.id}
            aria-label={`${k + 1}번째 카드`}
            onClick={() => setIndex(k)}
            className="w-[10px] h-[10px]"
            style={{ background: k === index ? "var(--purple-glow)" : "#3d2478", transform: "rotate(45deg)" }}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <PixelButton size="sm" variant="ghost" onClick={() => go(-1)} disabled={index === 0}>이전</PixelButton>
        <PixelButton size="sm" variant="ghost" onClick={() => go(1)} disabled={index === cards.length - 1}>다음</PixelButton>
      </div>
    </PixelFrame>
  );
}

function WalletFace({
  children, hex, border, style,
}: { children: React.ReactNode; hex: string; border?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("flex h-full w-full flex-col items-center px-4 py-5")}
      style={{
        background: hex,
        boxShadow: `inset 0 0 0 4px #0a0416, inset 0 0 0 8px ${border ?? "#0a0416"}`,
        borderRadius: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
