import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { SwipeDeck } from "@/components/pixel/SwipeDeck";
import { PixelProgressBar } from "@/components/pixel/PixelBars";
import { CARDS } from "@/lib/game/data";
import { setState, useGame } from "@/lib/game/store";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/swipe")({
  head: () => ({
    meta: [
      { title: "강점 카드 · ANIMA HATCH" },
      { name: "description", content: "카드를 스와이프해 나의 강점을 골라주세요." },
      { property: "og:title", content: "강점 카드" },
      { property: "og:description", content: "카드를 스와이프해 나의 강점을 골라주세요." },
    ],
  }),
  component: SwipePage,
});

function SwipePage() {
  const game = useGame();
  const navigate = useNavigate();
  const cards = useMemo(() => CARDS, []);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);

  function handle(card: { id: string }, choice: "yes" | "no") {
    const nextPicks = choice === "yes" ? [...picks, card.id] : picks;
    setPicks(nextPicks);
    const ni = i + 1;
    if (ni >= cards.length) {
      setState({ myPicks: nextPicks });
      navigate({ to: "/complete" });
      return;
    }
    setI(ni);
  }

  return (
    <AppShell title="강점 키워드 선택" back="/tutorial" showNav={false}>
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
        <div className="mt-2 flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, k) => (
            <div key={k} className="w-[6px] h-[6px]"
              style={{ background: k === (i % 5) ? "var(--purple-glow)" : "#3d2478", transform: "rotate(45deg)" }} />
          ))}
        </div>
        <div className="mt-2 text-center text-[10px] text-[var(--fg)]/50">
          모은 강점 {picks.length}개 · {game.nickname && <>모험가 {game.nickname}</>}
        </div>
      </div>
    </AppShell>
  );
}
