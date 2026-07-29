import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { CHAR_BY_STAT, computeStats, topStat } from "@/lib/game/data";
import { resetState, useGame } from "@/lib/game/store";

export const Route = createFileRoute("/mypage")({
  head: () => ({
    meta: [
      { title: "마이페이지 · ANIMA HATCH" },
      { name: "description", content: "나의 여정 기록을 확인하세요." },
      { property: "og:title", content: "마이페이지" },
      { property: "og:description", content: "나의 여정 기록을 확인하세요." },
    ],
  }),
  component: MyPage,
});

function MyPage() {
  const game = useGame();
  const navigate = useNavigate();
  const combined = computeStats([...game.myPicks, ...game.friends.flatMap((f) => f.picks)]);
  const top = game.myPicks.length ? topStat(combined) : null;
  const character = top ? CHAR_BY_STAT[top] : null;

  return (
    <AppShell title="마이페이지">
      <div className="pt-2 pb-4 space-y-3">
        <PixelFrame className="p-5 flex items-center gap-4">
          <div
            className="w-16 h-16 flex items-center justify-center"
            style={{ background: "#0a0416", boxShadow: "inset 0 0 0 3px var(--pixel-border)" }}
          >
            {character ? (
              <img src={character.image} alt={character.name} style={{ height: 56, imageRendering: "pixelated" }} />
            ) : (
              <PixelIcon name="mask" size={36} className="text-[var(--purple-glow)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] text-[var(--purple-glow)] truncate">
              {game.nickname || "이름 없는 모험가"}
            </div>
            <div className="text-[11px] text-[var(--fg)]/70">
              클래스 · {character?.name ?? "미부화"}
            </div>
          </div>
        </PixelFrame>

        <div className="grid grid-cols-3 gap-2">
          <StatMini label="선택한 강점" value={game.myPicks.length} />
          <StatMini label="친구 응답" value={game.friends.length} />
          <StatMini label="해금 캐릭터" value={game.unlockedCharacterId ? 1 : 0} />
        </div>

        <PixelFrame className="p-4 space-y-2">
          <PixelButton full size="md" variant="ghost" onClick={() => navigate({ to: "/result" })}
            rightIcon={<PixelIcon name="arrow" size={14} />}>
            결과 다시보기
          </PixelButton>
          <PixelButton full size="md" variant="ghost" onClick={() => navigate({ to: "/character" })}
            rightIcon={<PixelIcon name="arrow" size={14} />}>
            캐릭터 도감
          </PixelButton>
          <PixelButton full size="md" variant="danger" onClick={() => {
            if (confirm("모든 데이터를 초기화할까요?")) {
              resetState();
              navigate({ to: "/" });
            }
          }}>
            초기화
          </PixelButton>
        </PixelFrame>

        <PixelFrame className="p-3" tone="mid">
          <div className="text-[10px] text-center text-[var(--fg)]/60">
            ANIMA HATCH · 픽셀 판타지 자기이해 여정
          </div>
        </PixelFrame>
      </div>
    </AppShell>
  );
}

function StatMini({ label, value }: { label: string; value: number }) {
  return (
    <PixelFrame className="p-3 text-center">
      <div className="text-[22px] text-[var(--purple-glow)]">{value}</div>
      <div className="text-[10px] text-[var(--fg)]/70">{label}</div>
    </PixelFrame>
  );
}
