import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelInput } from "@/components/pixel/PixelInput";
import { PixelIcon } from "@/components/pixel/PixelIcon";

type Search = { from?: string; name?: string };

export const Route = createFileRoute("/friend/")({
  head: () => ({
    meta: [
      { title: "친구 초대 · ANIMA HATCH" },
      { name: "description", content: "친구의 강점을 골라주세요." },
      { property: "og:title", content: "친구 여정" },
      { property: "og:description", content: "친구의 강점을 골라주세요." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    from: typeof s.from === "string" ? s.from : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
  }),
  component: FriendLanding,
});

function FriendLanding() {
  const { from } = useSearch({ from: "/friend/" });
  const [name, setName] = useState("");
  const navigate = useNavigate();
  return (
    <AppShell hideHeader showNav={false}>
      <div className="pt-8 pb-6 max-w-[340px] mx-auto">
        <PixelFrame className="p-6 text-center">
          <PixelIcon name="heart" size={44} color="var(--creativity)" className="mx-auto animate-glow-pulse" />
          <div className="mt-3 text-[16px] text-[var(--purple-glow)]">
            {from || "친구"}의 강점을<br />골라주세요
          </div>
          <p className="mt-3 text-[11px] text-[var(--fg)]/75 leading-relaxed">
            당신 눈에 비친 모습이<br />
            {from || "친구"}의 알을 부화시키는 열쇠예요.
          </p>

          <div className="mt-6 text-left">
            <div className="text-[11px] text-[var(--fg)]/70 mb-2">당신의 이름</div>
            <PixelInput
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 12))}
              placeholder="예: 오래된동료"
            />
          </div>
        </PixelFrame>

        <div className="mt-5">
          <PixelButton
            full size="lg"
            disabled={name.trim().length < 1}
            onClick={() => navigate({ to: "/friend/tutorial", search: { from, name: name.trim() } })}
            rightIcon={<PixelIcon name="arrow" size={14} />}
          >
            시작하기
          </PixelButton>
        </div>
      </div>
    </AppShell>
  );
}
