import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelInput } from "@/components/pixel/PixelInput";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { CARDS, MAX_PICKS, MIN_PICKS } from "@/lib/game/data";

type Search = { s?: string; from?: string };

export const Route = createFileRoute("/friend/")({
  head: () => ({
    meta: [
      { title: "친구 강점 골라주기 · ANIMA HATCH" },
      { name: "description", content: "친구의 눈에 비친 강점을 골라주세요." },
      { property: "og:title", content: "친구 강점 골라주기" },
      { property: "og:description", content: "친구의 눈에 비친 강점을 골라주세요." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    s: typeof s.s === "string" ? s.s : undefined,
    from: typeof s.from === "string" ? s.from : undefined,
  }),
  component: FriendLanding,
});

function FriendLanding() {
  const { s, from } = useSearch({ from: "/friend/" });
  const [name, setName] = useState("");
  const navigate = useNavigate();

  if (!s) {
    return (
      <AppShell hideHeader>
        <div className="pt-10 max-w-[340px] mx-auto">
          <PixelFrame className="p-6 text-center">
            <PixelIcon name="skull" size={44} color="var(--danger)" className="mx-auto" />
            <div className="mt-3 text-[14px] text-[var(--danger)]">링크가 올바르지 않아요</div>
            <p className="mt-2 text-[11px] text-[var(--fg)]/70">친구에게 초대 링크를 다시 받아주세요.</p>
          </PixelFrame>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell hideHeader>
      <div className="pt-6 pb-6 max-w-[340px] mx-auto">
        <PixelFrame className="p-6 text-center">
          <PixelIcon name="heart" size={44} color="var(--creativity)" className="mx-auto animate-glow-pulse" />
          <div className="mt-3 text-[16px] text-[var(--purple-glow)]">
            {from || "친구"}의 강점을<br />골라주세요
          </div>
          <p className="mt-3 text-[11px] text-[var(--fg)]/75 leading-relaxed">
            총 {CARDS.length}장의 카드 중<br />
            {MIN_PICKS}~{MAX_PICKS}개를 골라주면 돼요.<br />
            당신 눈에 비친 모습이 알을 부화시켜요.
          </p>

          <div className="mt-6 text-left">
            <div className="text-[11px] text-[var(--fg)]/70 mb-2">당신의 이름 (선택)</div>
            <PixelInput
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 12))}
              placeholder="예: 오래된동료"
            />
          </div>
        </PixelFrame>

        <div className="mt-5 space-y-2">
          <PixelButton
            full size="lg"
            disabled={name.trim().length < 1}
            onClick={() => navigate({ to: "/friend/swipe", search: { s, from, name: name.trim() } })}
            rightIcon={<PixelIcon name="arrow" size={14} />}
          >
            시작하기
          </PixelButton>
          <PixelButton
            full size="md" variant="ghost"
            onClick={() => navigate({ to: "/friend/swipe", search: { s, from, name: "익명" } })}
            leftIcon={<PixelIcon name="mask" size={14} />}
          >
            익명으로 참여하기
          </PixelButton>
        </div>

      </div>
    </AppShell>
  );
}
