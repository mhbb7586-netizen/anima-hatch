import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { fetchSession } from "@/lib/game/api";
import { useGame } from "@/lib/game/store";

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

const SLOT_ICONS = ["mask", "ghost", "star"];

function Waiting() {
  const game = useGame();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["session", game.sessionId],
    queryFn: () => fetchSession(game.sessionId!),
    enabled: !!game.sessionId,
    refetchInterval: 4000,
  });

  const peers = data?.peers ?? [];
  const count = peers.length;

  return (
    <AppShell title="응답 대기" back="/invite">
      <div className="pt-4 pb-6 max-w-[360px] mx-auto space-y-4">
        <div className="text-center text-[14px] text-[var(--purple-glow)]">친구들의 응답을 기다리는 중...</div>

        <PixelFrame className="p-5">
          <div className="text-center text-[11px] text-[var(--fg)]/70">응답 현황</div>
          <div className="mt-1 text-center text-[32px]">
            <span className="text-[var(--purple-glow)]">{count}</span>
            <span className="text-[var(--fg)]/40"> / 3명</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {SLOT_ICONS.map((icon, i) => {
              const peer = peers[i];
              const done = !!peer;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-14 h-14 flex items-center justify-center"
                    style={{
                      background: done ? "#241540" : "#0a0416",
                      boxShadow: `inset 0 0 0 3px ${done ? "var(--pixel-border)" : "var(--pixel-border-dark)"}`,
                    }}
                  >
                    <PixelIcon name={done ? icon : "mask"} size={30}
                      color={done ? "var(--purple-glow)" : "var(--pixel-border-dark)"} />
                  </div>
                  <div className="text-[10px] truncate max-w-[70px]">{peer?.name ?? `친구 ${i + 1}`}</div>
                  <div className={`text-[10px] ${done ? "text-[var(--humanity)]" : "text-[var(--fg)]/50"}`}>
                    {done ? "완료" : "대기 중..."}
                  </div>
                </div>
              );
            })}
          </div>
          {count > 3 && (
            <div className="mt-3 text-center text-[10px] text-[var(--fg)]/60">+{count - 3}명이 더 답해줬어요</div>
          )}
        </PixelFrame>

        <div className="relative flex justify-center items-end gap-16 py-4">
          <TorchIcon />
          <div className="animate-float-egg">
            <PixelIcon name="egg" size={110} />
          </div>
          <TorchIcon />
        </div>

        <div className="text-center text-[12px] text-[var(--fg)]/80 leading-relaxed">
          {count === 0 && "아직 아무도 답하지 않았어요.\n링크를 친구에게 보내주세요!"}
          {count > 0 && count < 3 && "조금만 더 기다려줘!\n3명이 모이면 전체가 공개돼요."}
          {count >= 3 && "모든 응답이 도착했어요!"}
        </div>

        {count > 0 && (
          <PixelButton full size="lg" onClick={() => navigate({ to: "/hatch" })}
            rightIcon={<PixelIcon name="arrow" size={14} />}>
            {count >= 3 ? "알 부화시키기" : `지금 부화시키기 (${count}명 반영)`}
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
