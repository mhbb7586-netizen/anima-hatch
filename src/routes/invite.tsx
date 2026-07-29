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
  const link = typeof window !== "undefined"
    ? `${window.location.origin}/friend?from=${encodeURIComponent(game.nickname || "친구")}`
    : "/friend";

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  }

  return (
    <AppShell title="친구 초대" back="/complete" showNav={false}>
      <div className="pt-4 pb-6 max-w-[360px] mx-auto space-y-4">
        <PixelFrame className="p-5 text-center">
          <PixelIcon name="heart" size={44} color="var(--creativity)" className="animate-glow-pulse" />
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
            style={{
              background: "#0a0416",
              boxShadow: "inset 0 0 0 2px var(--pixel-border-dark)",
            }}
          >
            {link}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <PixelButton size="md" variant="ghost" onClick={copy}>
              {copied ? "복사됨!" : "링크 복사"}
            </PixelButton>
            <PixelButton size="md" onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "ANIMA HATCH", text: `${game.nickname || "친구"}의 강점을 골라주세요!`, url: link }).catch(() => {});
              } else {
                copy();
              }
            }}>공유하기</PixelButton>
          </div>
        </PixelFrame>

        <PixelFrame className="p-4" tone="mid">
          <div className="text-[11px] leading-relaxed">
            테스트 중이라 친구가 없나요?<br />
            <span className="text-[var(--purple-glow)]">모의 친구</span>가 대신 답해줄 수 있어요.
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
