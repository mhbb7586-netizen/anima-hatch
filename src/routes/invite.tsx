import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { useGame } from "@/lib/game/store";
import { useState } from "react";

export const Route = createFileRoute("/invite")({
  head: () => ({
    meta: [
      { title: "친구 초대 · ANIMA HATCH" },
      { name: "description", content: "친구에게 링크를 보내 나를 보는 눈을 모아보세요." },
      { property: "og:title", content: "친구 초대" },
      { property: "og:description", content: "친구에게 링크를 보내 나를 보는 눈을 모아보세요." },
    ],
  }),
  component: Invite,
});

function Invite() {
  const game = useGame();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const link = typeof window !== "undefined" && game.sessionId
    ? `${window.location.origin}/friend?s=${game.sessionId}&from=${encodeURIComponent(game.nickname || "친구")}`
    : "";

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* noop */ }
  }

  return (
    <AppShell title="친구 초대" back="/complete">
      <div className="pt-4 pb-6 max-w-[360px] mx-auto space-y-4">
        <PixelFrame className="p-5 text-center">
          <PixelIcon name="heart" size={44} color="var(--creativity)" className="mx-auto animate-glow-pulse" />
          <div className="mt-2 text-[15px] text-[var(--purple-glow)]">3명의 눈이 필요해요</div>
          <p className="mt-2 text-[11px] text-[var(--fg)]/75 leading-relaxed">
            친구가 답할수록<br />
            알에서 나올 클래스가 또렷해져요.
          </p>
        </PixelFrame>

        <PixelFrame className="p-4">
          <div className="text-[11px] text-[var(--fg)]/70 mb-2">공유 링크</div>
          <div
            className="text-[11px] p-3 break-all"
            style={{ background: "#0a0416", boxShadow: "inset 0 0 0 2px var(--pixel-border-dark)" }}
          >
            {link || "링크를 만드는 중..."}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <PixelButton size="md" variant="ghost" disabled={!link} onClick={copy}>
              {copied ? "복사됨!" : "링크 복사"}
            </PixelButton>
            <PixelButton size="md" disabled={!link} onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "ANIMA HATCH",
                  text: `${game.nickname || "친구"}의 강점을 골라주세요!`,
                  url: link,
                }).catch(() => {});
              } else { copy(); }
            }}>공유하기</PixelButton>
          </div>
        </PixelFrame>

        <PixelFrame className="p-4" tone="mid">
          <div className="text-[11px] leading-relaxed text-[var(--fg)]/80">
            친구는 링크를 열어 이름을 적고, 나와 같은 카드를 스와이프해요.
            응답은 실시간으로 내 결과에 반영돼요.
          </div>
        </PixelFrame>

        <PixelButton full size="lg" onClick={() => navigate({ to: "/waiting" })}
          rightIcon={<PixelIcon name="arrow" size={14} />}>
          응답 기다리기
        </PixelButton>
      </div>
    </AppShell>
  );
}
