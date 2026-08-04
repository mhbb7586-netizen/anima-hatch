import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { PixelTag } from "@/components/pixel/PixelInput";
import { CARDS, STATS, computeStats, topStat } from "@/lib/game/data";
import { useGame } from "@/lib/game/store";

export const Route = createFileRoute("/complete")({
  head: () => ({
    meta: [
      { title: "선택 완료 · ANIMA HATCH" },
      { name: "description", content: "당신이 모은 강점 카드를 확인하세요." },
      { property: "og:title", content: "선택 완료" },
      { property: "og:description", content: "당신이 모은 강점 카드를 확인하세요." },
    ],
  }),
  component: CompletePage,
});

function CompletePage() {
  const game = useGame();
  const navigate = useNavigate();
  const stats = computeStats(game.myPicks);
  const top = topStat(stats);
  const topStatInfo = STATS[top];

  const chosen = game.myPicks
    .map((id) => CARDS.find((c) => c.id === id))
    .filter(Boolean)
    .slice(0, 8);

  return (
    <AppShell title="선택 완료">
      <div className="pt-4 pb-6 max-w-[360px] mx-auto space-y-4">
        <PixelFrame className="p-5 text-center">
          <PixelIcon name="star" size={40} color={topStatInfo.color} className="animate-glow-pulse" />
          <div className="mt-2 text-[16px] text-[var(--purple-glow)]">
            {game.nickname || "모험가"}님의 첫 여정 완료
          </div>
          <div className="mt-1 text-[11px] text-[var(--fg)]/70">
            {game.myPicks.length}개의 강점을 마음에 담았어요
          </div>
          <div className="mt-4 flex justify-center">
            <PixelTag tone="purple">가장 강한 결 · {topStatInfo.label}</PixelTag>
          </div>
        </PixelFrame>

        <PixelFrame className="p-4">
          <div className="text-[12px] text-[var(--purple-glow)] mb-3">모은 강점 카드</div>
          <div className="flex flex-wrap gap-2">
            {chosen.map((c) => c && (
              <div key={c.id} className="flex items-center gap-1 px-2 py-1 text-[11px]"
                style={{
                  background: "#0a0416",
                  boxShadow: "inset 0 0 0 2px var(--pixel-border-dark)",
                }}>
                <PixelIcon name={c.icon} size={14} color={STATS[c.stat].color} />
                {c.keyword}
              </div>
            ))}
            {game.myPicks.length > 8 && (
              <div className="text-[11px] text-[var(--fg)]/60 px-2 py-1">+{game.myPicks.length - 8}개 더</div>
            )}
          </div>
        </PixelFrame>

        <PixelFrame className="p-4" tone="mid">
          <div className="flex items-center gap-3">
            <PixelIcon name="heart" size={24} color="var(--creativity)" />
            <div className="text-[11px] leading-relaxed">
              이제 친구 3명에게도 물어볼 시간!<br />
              나만 아는 나 vs 남이 보는 나를 비교해봐요.
            </div>
          </div>
        </PixelFrame>

        <PixelButton full size="lg" onClick={() => navigate({ to: "/invite" })}
          rightIcon={<PixelIcon name="arrow" size={14} />}>
          친구에게 물어보기
        </PixelButton>
      </div>
    </AppShell>
  );
}
