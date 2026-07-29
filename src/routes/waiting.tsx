import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { CARDS } from "@/lib/game/data";
import { setState, useGame } from "@/lib/game/store";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/waiting")({
  head: () => ({
    meta: [
      { title: "친구 응답 대기 · ANIMA HATCH" },
      { name: "description", content: "친구들이 답하는 동안 잠시 기다려주세요." },
      { property: "og:title", content: "친구 응답 대기" },
      { property: "og:description", content: "친구들이 답하는 동안 잠시 기다려주세요." },
    ],
  }),
  component: Waiting,
});

const FRIEND_AVATARS = ["mask", "ghost", "star"];
const FRIEND_NAMES = ["사람1", "사람2", "사람3"];

function Waiting() {
  const game = useGame();
  const navigate = useNavigate();
  const [count, setCount] = useState(game.friends.length);

  useEffect(() => {
    if (count >= 3) return;
    const t = setTimeout(() => {
      // simulate a friend answering: pick 10-14 random cards biased slightly toward user's picks
      const bias = new Set(game.myPicks);
      const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
      const size = 10 + Math.floor(Math.random() * 5);
      const picks: string[] = [];
      for (const card of shuffled) {
        if (picks.length >= size) break;
        const roll = Math.random();
        if (bias.has(card.id)) { if (roll < 0.7) picks.push(card.id); }
        else if (roll < 0.35) picks.push(card.id);
      }
      const nextFriends = [...game.friends, { name: FRIEND_NAMES[count], picks }];
      setState({ friends: nextFriends });
      setCount(nextFriends.length);
    }, 1400 + Math.random() * 900);
    return () => clearTimeout(t);
  }, [count, game.friends, game.myPicks]);

  return (
    <AppShell title="응답 대기" back="/invite" showNav={false}>
      <div className="pt-4 pb-6 max-w-[360px] mx-auto space-y-4">
        <div className="text-center text-[14px] text-[var(--purple-glow)]">친구들의 응답을 기다리는 중...</div>

        <PixelFrame className="p-5">
          <div className="text-center text-[11px] text-[var(--fg)]/70">응답 현황</div>
          <div className="mt-1 text-center text-[32px] text-[var(--purple-glow)]">
            <span className="text-[var(--purple-glow)]">{count}</span>
            <span className="text-[var(--fg)]/40"> / 3명</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {FRIEND_NAMES.map((n, i) => {
              const done = i < count;
              return (
                <div key={n} className="flex flex-col items-center gap-1">
                  <div
                    className="w-14 h-14 flex items-center justify-center"
                    style={{
                      background: done ? "#241540" : "#0a0416",
                      boxShadow: `inset 0 0 0 3px ${done ? "var(--pixel-border)" : "var(--pixel-border-dark)"}`,
                    }}
                  >
                    <PixelIcon name={done ? FRIEND_AVATARS[i] : "mask"} size={30}
                      color={done ? "var(--purple-glow)" : "var(--pixel-border-dark)"} />
                  </div>
                  <div className="text-[10px]">{i === 0 ? "나" : n}</div>
                  <div className={`text-[10px] ${done ? "text-[var(--humanity)]" : "text-[var(--fg)]/50"}`}>
                    {done ? "완료 ✓" : "대기 중..."}
                  </div>
                </div>
              );
            })}
          </div>
        </PixelFrame>

        {/* torch scene */}
        <div className="relative flex justify-center items-end gap-16 py-4">
          <TorchIcon />
          <div className="animate-float-egg">
            <PixelIcon name="egg" size={110} />
          </div>
          <TorchIcon />
        </div>

        <div className="text-center text-[12px] text-[var(--fg)]/80">
          {count < 3 ? "조금만 더 기다려줘!\n알이 곧 부화할 거야" : "모든 응답이 도착했어요!"}
        </div>

        {count < 3 && (
          <PixelButton full size="md" variant="ghost" onClick={() => {
            // fast forward
            const need = 3 - count;
            const bias = new Set(game.myPicks);
            const extras = Array.from({ length: need }).map((_, k) => {
              const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
              const size = 10 + Math.floor(Math.random() * 5);
              const picks: string[] = [];
              for (const card of shuffled) {
                if (picks.length >= size) break;
                const roll = Math.random();
                if (bias.has(card.id)) { if (roll < 0.7) picks.push(card.id); }
                else if (roll < 0.35) picks.push(card.id);
              }
              return { name: FRIEND_NAMES[count + k], picks };
            });
            const nextFriends = [...game.friends, ...extras];
            setState({ friends: nextFriends });
            setCount(nextFriends.length);
          }}>
            모의 친구로 채우기
          </PixelButton>
        )}

        {count >= 3 && (
          <PixelButton full size="lg" onClick={() => navigate({ to: "/hatch" })}
            rightIcon={<PixelIcon name="arrow" size={14} />}>
            알 부화시키기
          </PixelButton>
        )}
      </div>
    </AppShell>
  );
}

function TorchIcon() {
  return (
    <div className="flex flex-col items-center">
      <div className="animate-flame">
        <PixelIcon name="fire" size={36} />
      </div>
      <div className="w-4 h-16 mt-[-8px]" style={{ background: "linear-gradient(#5a3f1a, #3b2510)", boxShadow: "inset 0 0 0 2px #2a1b0a" }} />
    </div>
  );
}
