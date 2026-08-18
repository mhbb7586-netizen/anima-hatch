import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelIcon } from "@/components/pixel/PixelIcon";

type Search = { from?: string; name?: string };

export const Route = createFileRoute("/friend/complete")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    from: typeof s.from === "string" ? s.from : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
  }),
  head: () => ({
    meta: [
      { title: "응답 완료 · ANIMA HATCH" },
      { name: "description", content: "친구에게 응답이 전달되었어요." },
      { property: "og:title", content: "응답 완료" },
      { property: "og:description", content: "친구에게 응답이 전달되었어요." },
    ],
  }),
  component: FriendComplete,
});

function FriendComplete() {
  const search = useSearch({ from: "/friend/complete" });
  const navigate = useNavigate();
  return (
    <AppShell hideHeader>
      <div className="pt-8 pb-8 max-w-[340px] mx-auto text-center space-y-5">
        <div className="animate-float-slow">
          <PixelIcon name="heart" size={68} color="var(--creativity)" />
        </div>
        <PixelFrame className="p-5">
          <div className="text-[16px] text-[var(--purple-glow)]">응답 전송 완료!</div>
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--fg)]/80">
            {search.name || "당신"}의 눈으로 본<br />
            <span className="text-[var(--purple-glow)]">{search.from || "친구"}</span>의 강점이<br />
            알을 부화시키러 갔어요.
          </p>
        </PixelFrame>
        <PixelButton
          full
          size="lg"
          onClick={() => navigate({ to: "/profile" })}
          rightIcon={<PixelIcon name="arrow" size={14} />}
        >
          나도 하러가기
        </PixelButton>
        <p className="text-[10px] text-[var(--fg)]/60">이 창은 닫아도 괜찮아요.</p>
      </div>
    </AppShell>
  );
}
