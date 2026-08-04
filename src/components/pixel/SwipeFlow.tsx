import { useMemo, useState } from "react";
import { CARDS, CARD_BY_ID, MAX_PICKS, MIN_PICKS, STATS, type Card } from "@/lib/game/data";
import { SwipeDeck } from "./SwipeDeck";
import { PixelProgressBar } from "./PixelBars";
import { PixelFrame } from "./PixelFrame";
import { PixelButton } from "./PixelButton";
import { PixelIcon } from "./PixelIcon";
import { cn } from "@/lib/utils";

type Phase = "swipe" | "trim" | "add";

type Props = {
  /** Called once the picks satisfy the 5-15 rule. */
  onFinish: (picks: string[]) => void;
  busy?: boolean;
  footer?: React.ReactNode;
};

/** The one and only strength-selection flow — used identically for the user and for friends. */
export function SwipeFlow({ onFinish, busy, footer }: Props) {
  const cards = useMemo(() => CARDS, []);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("swipe");

  function settle(next: string[]) {
    if (next.length > MAX_PICKS) { setPicks(next); setPhase("trim"); return; }
    if (next.length < MIN_PICKS) { setPicks(next); setPhase("add"); return; }
    setPicks(next);
    onFinish(next);
  }

  function handle(card: Card, choice: "yes" | "no") {
    const next = choice === "yes" ? [...picks, card.id] : picks;
    setPicks(next);
    const ni = i + 1;
    if (ni >= cards.length) { settle(next); return; }
    setI(ni);
  }

  function remove(id: string) {
    const next = picks.filter((p) => p !== id);
    setPicks(next);
    if (next.length <= MAX_PICKS) onFinish(next);
  }

  function add(id: string) {
    const next = [...picks, id];
    setPicks(next);
    if (next.length >= MIN_PICKS) onFinish(next);
  }

  if (phase === "trim") {
    return (
      <div className="pt-2 pb-6 space-y-3">
        <PixelFrame className="p-4 text-center">
          <PixelIcon name="bomb" size={30} color="var(--courage)" className="mx-auto" />
          <div className="mt-2 text-[13px] text-[var(--courage)]">너무 많이 선택했어요</div>
          <div className="mt-1 text-[11px] text-[var(--fg)]/75 leading-relaxed">
            {MAX_PICKS}개까지만 남겨주세요.<br />카드를 눌러 지울 수 있어요.
          </div>
          <div className="mt-3 text-[14px] text-[var(--purple-glow)]">
            {picks.length} / {MAX_PICKS}
          </div>
        </PixelFrame>
        <CardGrid ids={picks} onPick={remove} mode="remove" />
        {footer}
      </div>
    );
  }

  if (phase === "add") {
    const rest = cards.filter((c) => !picks.includes(c.id)).map((c) => c.id);
    return (
      <div className="pt-2 pb-6 space-y-3">
        <PixelFrame className="p-4 text-center">
          <PixelIcon name="clover" size={30} color="var(--humanity)" className="mx-auto" />
          <div className="mt-2 text-[13px] text-[var(--humanity)]">너무 적어요</div>
          <div className="mt-1 text-[11px] text-[var(--fg)]/75 leading-relaxed">
            최소 {MIN_PICKS}개는 선택해주세요.<br />카드를 눌러 추가할 수 있어요.
          </div>
          <div className="mt-3 text-[14px] text-[var(--purple-glow)]">
            {picks.length} / {MIN_PICKS}
          </div>
        </PixelFrame>
        {picks.length > 0 && (
          <div className="text-[10px] text-[var(--fg)]/60 px-1">이미 고른 강점 {picks.length}개</div>
        )}
        <CardGrid ids={rest} onPick={add} mode="add" />
        {footer}
      </div>
    );
  }

  return (
    <div className="pt-2 pb-6">
      <PixelProgressBar value={i + 1} total={cards.length} />
      <div className="mt-2 text-center text-[12px] text-[var(--fg)]/70">
        {i + 1} / {cards.length}
      </div>
      <div className="mt-2">
        <SwipeDeck cards={cards} index={i} onChoose={handle} />
      </div>
      <div className="mt-6 text-center text-[10px] text-[var(--fg)]/60">
        ◂ 카드를 좌우로 스와이프하세요 ▸
      </div>
      <div className="mt-2 text-center text-[10px] text-[var(--fg)]/50">
        모은 강점 {picks.length}개 · {MIN_PICKS}~{MAX_PICKS}개를 골라주세요
      </div>
      {busy && <div className="mt-3 text-center text-[11px] text-[var(--purple-glow)]">저장하는 중...</div>}
      {footer}
    </div>
  );
}

function CardGrid({ ids, onPick, mode }: { ids: string[]; onPick: (id: string) => void; mode: "add" | "remove" }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ids.map((id) => {
        const c = CARD_BY_ID[id];
        if (!c) return null;
        const stat = STATS[c.stat];
        return (
          <button key={id} onClick={() => onPick(id)} className="text-left">
            <PixelFrame className={cn("p-2 flex items-center gap-2 active:translate-y-[2px]")}>
              <PixelIcon name={c.icon} size={20} color={stat.hex} />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] truncate">{c.keyword}</div>
                <div className="text-[9px] text-[var(--fg)]/50">{stat.label}</div>
              </div>
              <PixelIcon name={mode === "remove" ? "x" : "check"} size={14}
                color={mode === "remove" ? "var(--danger)" : "var(--humanity)"} />
            </PixelFrame>
          </button>
        );
      })}
    </div>
  );
}
