import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelInput } from "@/components/pixel/PixelInput";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { setState, useGame } from "@/lib/game/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "닉네임 입력 · ANIMA HATCH" },
      { name: "description", content: "여정을 함께할 이름을 정해주세요." },
      { property: "og:title", content: "닉네임 입력 · ANIMA HATCH" },
      { property: "og:description", content: "여정을 함께할 이름을 정해주세요." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const game = useGame();
  const [name, setName] = useState(game.nickname);
  const navigate = useNavigate();
  return (
    <AppShell title="모험가 등록" back="/">
      <div className="pt-4 pb-6 max-w-[340px] mx-auto">
        <PixelFrame className="p-6 flex flex-col items-center">
          <PixelIcon name="mask" size={56} className="text-[var(--purple-glow)] animate-glow-pulse" />
          <div className="mt-4 text-[16px] text-[var(--purple-glow)]">이름을 알려주세요</div>
          <div className="mt-2 text-[11px] text-[var(--fg)]/70 text-center">
            여정 곳곳에서 당신을 부를 이름이에요
          </div>
          <div className="mt-6 w-full">
            <PixelInput
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 12))}
              placeholder="예: 별을줍는아이"
              maxLength={12}
            />
            <div className="mt-1 text-right text-[10px] text-[var(--fg)]/50">{name.length}/12</div>
          </div>
        </PixelFrame>

        <div className="mt-6">
          <PixelButton
            full
            size="lg"
            disabled={name.trim().length < 2}
            onClick={() => {
              setState({ nickname: name.trim() });
              navigate({ to: "/tutorial" });
            }}
            rightIcon={<PixelIcon name="arrow" size={14} />}
          >
            모험 시작
          </PixelButton>
        </div>
      </div>
    </AppShell>
  );
}
