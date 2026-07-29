import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { SwipeDeck } from "@/components/pixel/SwipeDeck";
import { PixelProgressBar } from "@/components/pixel/PixelBars";
import { CARDS } from "@/lib/game/data";
import { setState, getState } from "@/lib/game/store";
import { useMemo, useState } from "react";

type Search = { from?: string; name?: string };

export const Route = createFileRoute("/friend/swipe")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    from: typeof s.from === "string" ? s.from : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
  }),
  head: () => ({
    meta: [
      { title: "친구가 보는 강점 · ANIMA HATCH" },
      { name: "description", content: "친구의 강점 카드를 골라주세요." },
      { property: "og:title", content: "친구가 보는 강점" },
      { property: "og:description", content: "친구의 강점 카드를 골라주세요." },
    ],
  }),
  component: FriendSwipe,
});

function FriendSwipe() {
  const search = useSearch({ from: "/friend/swipe" });
  const navigate = useNavigate();
  const cards = useMemo(() => CARDS, []);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);

  function handle(card: { id: string }, choice: "yes" | "no") {
    const nextPicks = choice === "yes" ? [...picks, card.id] : picks;
    setPicks(nextPicks);
    const ni = i + 1;
    if (ni >= cards.length) {
      const cur = getState();
      const friendName = search.name || `사람${cur.friends.length + 1}`;
      setState({ friends: [...cur.friends, { name: friendName, picks: nextPicks }] });
      navigate({ to: "/friend/complete", search });
      return;
    }
    setI(ni);
  }

  return (
    <AppShell title={`${search.from || "친구"}의 강점 찾기`} showNav={false}>
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
      </div>
    </AppShell>
  );
}
