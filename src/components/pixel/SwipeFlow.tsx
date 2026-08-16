import { useEffect, useMemo, useRef, useState } from "react";
import { CARDS, CARD_BY_ID, MAX_PICKS, MIN_PICKS, STATS, type Card } from "@/lib/game/data";
import { SwipeDeck } from "./SwipeDeck";
import { PixelProgressBar } from "./PixelBars";
import { PixelFrame } from "./PixelFrame";
import { PixelButton } from "./PixelButton";
import { PixelIcon } from "./PixelIcon";

type Phase = "swipe" | "confirm";

type Draft = { i: number; picks: string[]; phase: Phase };

type Props = {
  /** Called ONLY when the user taps [선택 완료] with a valid selection. */
  onFinish: (picks: string[]) => void;
  busy?: boolean;
  footer?: React.ReactNode;
  /**
   * Where the in-progress selection is kept so leaving the screen (back button,
   * refresh, going forward and returning) never loses the answers.
   */
  draftKey: string;
};

function loadDraft(key: string): Draft {
  const empty: Draft = { i: 0, picks: [], phase: "swipe" };
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return {
      i: typeof parsed.i === "number" ? Math.max(0, Math.min(CARDS.length - 1, parsed.i)) : 0,
      picks: Array.isArray(parsed.picks) ? parsed.picks.filter((p) => !!CARD_BY_ID[p]) : [],
      phase: parsed.phase === "confirm" ? "confirm" : "swipe",
    };
  } catch {
    return empty;
  }
}

export function clearSwipeDraft(key: string) {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.removeItem(key); } catch { /* noop */ }
}

/** The one and only strength-selection flow — used identically for the user and for friends. */
export function SwipeFlow({ onFinish, busy, footer, draftKey }: Props) {
  const cards = useMemo(() => CARDS, []);
  const initial = useRef<Draft>(loadDraft(draftKey));
  const [i, setI] = useState(initial.current.i);
  const [picks, setPicks] = useState<string[]>(initial.current.picks);
  const [phase, setPhase] = useState<Phase>(initial.current.phase);

  // Keep the draft in sync so any kind of back navigation restores the answers.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(draftKey, JSON.stringify({ i, picks, phase } satisfies Draft));
    } catch { /* noop */ }
  }, [draftKey, i, picks, phase]);

  function handle(card: Card, choice: "yes" | "no") {
    const next = choice === "yes" && !picks.includes(card.id) ? [...picks, card.id] : picks;
    setPicks(next);
    const ni = i + 1;
    // Never auto-submit — always land on the confirmation screen.
    if (ni >= cards.length) { setPhase("confirm"); return; }
    setI(ni);
  }

  function remove(id: string) {
    setPicks((p) => p.filter((x) => x !== id));
  }

  if (phase === "confirm") {
    const tooFew = picks.length < MIN_PICKS;
    const tooMany = picks.length > MAX_PICKS;
    const valid = !tooFew && !tooMany;

    return (
      <div className="pt-2 pb-8 space-y-3">
        <PixelFrame className="p-4 text-center">
          <PixelIcon name="scroll" size={30} color="var(--purple-glow)" className="mx-auto" />
          <div className="mt-2 text-[13px] text-[var(--purple-glow)]">선택한 강점을 확인해주세요</div>
          <div className="mt-2 text-[18px] text-[var(--fg)]">{picks.length}개 선택</div>
          <div className="mt-1 text-[10px] text-[var(--fg)]/60">
            {MIN_PICKS}~{MAX_PICKS}개 · 카드를 눌러 뺄 수 있어요
          </div>
          {tooFew && (
            <div className="mt-3 text-[11px] text-[var(--danger)]">최소 {MIN_PICKS}개는 선택해주세요</div>
          )}
          {tooMany && (
            <div className="mt-3 text-[11px] text-[var(--danger)]">최대 {MAX_PICKS}개까지만 선택할 수 있어요</div>
          )}
        </PixelFrame>

        {picks.length === 0 ? (
          <PixelFrame className="p-4 text-center text-[11px] text-[var(--fg)]/60" tone="mid">
            아직 고른 강점이 없어요.
          </PixelFrame>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {picks.map((id) => {
              const c = CARD_BY_ID[id];
              if (!c) return null;
              const stat = STATS[c.stat];
              return (
                <button key={id} onClick={() => remove(id)} className="text-left">
                  <PixelFrame className="p-2 flex items-center gap-2 active:translate-y-[2px]">
                    <PixelIcon name={c.icon} size={20} color={stat.hex} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] truncate">{c.keyword}</div>
                      <div className="text-[9px] text-[var(--fg)]/50">{stat.label}</div>
                    </div>
                    <PixelIcon name="x" size={14} color="var(--danger)" />
                  </PixelFrame>
                </button>
              );
            })}
          </div>
        )}

        <div className="pt-2 space-y-2">
          <PixelButton
            full size="lg"
            disabled={!valid || busy}
            onClick={() => { if (valid && !busy) onFinish(picks); }}
            rightIcon={<PixelIcon name="arrow" size={14} />}
          >
            {busy ? "저장하는 중..." : "선택 완료"}
          </PixelButton>
          <PixelButton full size="md" variant="ghost" disabled={busy}
            onClick={() => setPhase("swipe")}>
            카드 계속 보기
          </PixelButton>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className="pt-1 pb-4">
      <PixelProgressBar value={i + 1} total={cards.length} />
      <div className="mt-1 text-center text-[11px] text-[var(--fg)]/70">
        {i + 1} / {cards.length}
      </div>
      <div className="mt-1">
        <SwipeDeck cards={cards} index={i} onChoose={handle} />
      </div>
      <div className="mt-3 text-center text-[10px] text-[var(--fg)]/60">
        ◂ 카드를 좌우로 스와이프하세요 ▸
      </div>
      <div className="mt-1 text-center text-[10px] text-[var(--fg)]/50">
        모은 강점 {picks.length}개 · {MIN_PICKS}~{MAX_PICKS}개를 골라주세요
      </div>
      <div className="mt-2">
        <PixelButton full size="sm" variant="ghost" onClick={() => setPhase("confirm")}>
          선택 확인하기
        </PixelButton>
      </div>
      {footer}
    </div>
  );
}
