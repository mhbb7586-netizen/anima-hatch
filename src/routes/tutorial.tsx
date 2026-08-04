import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { CARDS } from "@/lib/game/data";

export const Route = createFileRoute("/tutorial")({
  head: () => ({
    meta: [
      { title: "강점 선택 안내 · ANIMA HATCH" },
      { name: "description", content: "카드를 스와이프하며 나를 닮은 강점을 골라보세요." },
      { property: "og:title", content: "강점 선택 안내" },
      { property: "og:description", content: "카드를 스와이프하며 나를 닮은 강점을 골라보세요." },
    ],
  }),
  component: Tutorial,
});

function Tutorial() {
  const navigate = useNavigate();
  return (
    <AppShell title="여정 안내" back="/profile">
      <div className="pt-4 pb-6 max-w-[360px] mx-auto space-y-4">
        <PixelFrame className="p-5">
          <div className="text-center text-[16px] text-[var(--purple-glow)]">강점 카드를 만나요</div>
          <p className="mt-3 text-[12px] leading-relaxed text-center text-[var(--fg)]/85">
            총 {CARDS.length}장의 카드가 당신을 기다립니다.<br />
            나를 닮은 카드는 <span className="text-[var(--humanity)]">오른쪽(O)</span>,<br />
            그렇지 않다면 <span className="text-[var(--danger)]">왼쪽(X)</span>으로 넘겨주세요.
          </p>
        </PixelFrame>

        <div className="grid grid-cols-2 gap-3">
          <PixelFrame className="p-4 flex flex-col items-center gap-2">
            <div className="pixel-btn pixel-btn-danger w-12 h-12 pointer-events-none">
              <PixelIcon name="x" size={22} color="#fff" />
            </div>
            <div className="text-[11px]">넘기기</div>
          </PixelFrame>
          <PixelFrame className="p-4 flex flex-col items-center gap-2">
            <div className="pixel-btn pixel-btn-success w-12 h-12 pointer-events-none">
              <PixelIcon name="check" size={22} color="#0b3d1e" />
            </div>
            <div className="text-[11px]">선택하기</div>
          </PixelFrame>
        </div>

        <PixelFrame className="p-4 flex items-center gap-3" tone="mid">
          <PixelIcon name="crystal" size={28} className="text-[var(--purple-glow)]" />
          <p className="text-[11px] leading-relaxed">
            선택은 정답이 없습니다. 지금의 나에게 솔직해질수록 알에서 나올 클래스가 선명해져요.
          </p>
        </PixelFrame>

        <div className="pt-2">
          <PixelButton
            full size="lg"
            onClick={() => navigate({ to: "/swipe" })}
            rightIcon={<PixelIcon name="arrow" size={14} />}
          >
            카드 만나러 가기
          </PixelButton>
        </div>
      </div>
    </AppShell>
  );
}
