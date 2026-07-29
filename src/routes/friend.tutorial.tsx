import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelIcon } from "@/components/pixel/PixelIcon";

type Search = { from?: string; name?: string };

export const Route = createFileRoute("/friend/tutorial")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    from: typeof s.from === "string" ? s.from : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
  }),
  head: () => ({
    meta: [
      { title: "친구 안내 · ANIMA HATCH" },
      { name: "description", content: "친구의 강점 카드를 골라보세요." },
      { property: "og:title", content: "친구 여정 안내" },
      { property: "og:description", content: "친구의 강점 카드를 골라보세요." },
    ],
  }),
  component: FriendTutorial,
});

function FriendTutorial() {
  const search = useSearch({ from: "/friend/tutorial" });
  const navigate = useNavigate();
  return (
    <AppShell title="친구 여정" showNav={false}>
      <div className="pt-4 pb-6 max-w-[360px] mx-auto space-y-4">
        <PixelFrame className="p-5 text-center">
          <div className="text-[15px] text-[var(--purple-glow)]">
            {search.from || "친구"}의 강점을 골라주세요
          </div>
          <p className="mt-3 text-[11px] text-[var(--fg)]/80 leading-relaxed">
            당신 눈에 비친 <span className="text-[var(--purple-glow)]">{search.from || "그"}</span>의 모습을 골라주세요.<br />
            정답은 없어요.
          </p>
        </PixelFrame>

        <PixelFrame className="p-4">
          <div className="flex items-center gap-3">
            <div className="pixel-btn pixel-btn-danger w-10 h-10 pointer-events-none">
              <PixelIcon name="x" size={20} color="#fff" />
            </div>
            <div className="text-[11px]">닮지 않았어요</div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="pixel-btn pixel-btn-success w-10 h-10 pointer-events-none">
              <PixelIcon name="check" size={20} color="#0b3d1e" />
            </div>
            <div className="text-[11px]">이건 정말 그 사람 같아요</div>
          </div>
        </PixelFrame>

        <PixelButton full size="lg"
          onClick={() => navigate({ to: "/friend/swipe", search })}
          rightIcon={<PixelIcon name="arrow" size={14} />}>
          카드 만나러 가기
        </PixelButton>
      </div>
    </AppShell>
  );
}
