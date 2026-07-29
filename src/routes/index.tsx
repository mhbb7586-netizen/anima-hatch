import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { useGame, resetState } from "@/lib/game/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ANIMA HATCH — 나를 부화시키는 픽셀 여정" },
      { name: "description", content: "카드를 스와이프해 나의 강점을 모으고, 알을 부화시켜 나만의 RPG 클래스를 얻어보세요." },
      { property: "og:title", content: "ANIMA HATCH" },
      { property: "og:description", content: "픽셀 판타지 속에서 나를 부화시키는 여정" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const game = useGame();
  const navigate = useNavigate();
  const inProgress = game.myPicks.length > 0 && !game.hatched;

  return (
    <AppShell hideHeader>
      <div className="flex flex-col items-center pt-6 pb-6">
        {/* moon */}
        <div className="w-full flex justify-end pr-2">
          <PixelIcon name="moon" size={40} className="text-[var(--purple-glow)]" />
        </div>

        {/* Title */}
        <h1
          className="mt-2 text-[44px] tracking-[0.08em] text-[var(--purple-glow)] text-center"
          style={{
            textShadow:
              "3px 3px 0 #0a0416, 3px 0 0 #0a0416, 0 3px 0 #0a0416, -3px 0 0 #0a0416, 0 -3px 0 #0a0416, 0 0 18px rgba(168,85,247,0.6)",
          }}
        >
          ANIMA<br />HATCH
        </h1>
        <div className="mt-3 text-[12px] text-[var(--fg)]/80">너를 이해하는 새로운 모험</div>

        {/* Egg */}
        <div className="relative mt-10 mb-10 flex items-center justify-center">
          <div
            className="absolute w-[220px] h-[40px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(168,85,247,0.45), transparent 70%)",
              bottom: -10,
              filter: "blur(2px)",
            }}
          />
          {/* magic circle underneath */}
          <div
            className="absolute w-[220px] h-[80px] animate-spin-slow"
            style={{
              bottom: -6,
              background:
                "conic-gradient(from 0deg, transparent, var(--purple), transparent 40deg, transparent 120deg, var(--purple) 160deg, transparent 200deg, transparent 320deg, var(--purple) 340deg, transparent)",
              maskImage: "radial-gradient(ellipse 50% 100%, transparent 60%, black 62%, black 70%, transparent 72%)",
              WebkitMaskImage: "radial-gradient(ellipse 50% 100%, transparent 60%, black 62%, black 70%, transparent 72%)",
              filter: "drop-shadow(0 0 12px var(--purple))",
              opacity: 0.9,
            }}
          />
          <div className="animate-float-egg">
            <PixelEgg />
          </div>
        </div>

        {/* CTA */}
        <div className="w-full max-w-[320px] mx-auto">
          <PixelButton full size="lg" onClick={() => {
            if (!game.nickname) navigate({ to: "/profile" });
            else if (inProgress) navigate({ to: "/swipe" });
            else navigate({ to: "/profile" });
          }} rightIcon={<PixelIcon name="arrow" size={14} />}>
            {inProgress ? "여정 이어하기" : "시작하기"}
          </PixelButton>

          {game.myPicks.length > 0 && (
            <div className="mt-3">
              <PixelButton full size="sm" variant="ghost" onClick={() => {
                if (confirm("여정을 처음부터 다시 시작할까요?")) resetState();
              }}>
                처음부터 다시
              </PixelButton>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-[340px]">
          <MiniStep to="/tutorial" icon="book" label="강점 선택" />
          <MiniStep to="/invite" icon="heart" label="친구 초대" />
          <MiniStep to="/character" icon="ghost" label="캐릭터 도감" />
        </div>
      </div>
    </AppShell>
  );
}

function MiniStep({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <Link to={to}>
      <PixelFrame className="flex flex-col items-center py-3 gap-1">
        <PixelIcon name={icon} size={22} className="text-[var(--purple-glow)]" />
        <div className="text-[10px]">{label}</div>
      </PixelFrame>
    </Link>
  );
}

/** Big pixel-egg drawn in SVG */
function PixelEgg() {
  const P = (x: number, y: number, c: string) => <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c} />;
  const shape: [number, number, string][] = [];
  // simple oval fill map (16x20)
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 16; x++) {
      const cx = 7.5;
      const cy = 12;
      const dx = (x - cx) / 7;
      const dy = (y - cy) / 9;
      const inside = dx * dx + dy * dy <= 1;
      if (!inside) continue;
      const edge = dx * dx + dy * dy > 0.85;
      const top = y < 8;
      let c = "#5b21b6";
      if (top) c = "#7c3aed";
      if (edge) c = "#3b1178";
      // scales pattern
      if (!edge && (x + y) % 3 === 0) c = "#3b1178";
      if (!edge && (x + y) % 5 === 0) c = "#a855f7";
      // highlight
      if (x >= 3 && x <= 4 && y >= 3 && y <= 5) c = "#c8a7ff";
      shape.push([x, y, c]);
    }
  }
  return (
    <svg width={180} height={220} viewBox="0 0 16 20" shapeRendering="crispEdges" style={{ filter: "drop-shadow(0 0 20px rgba(168,85,247,0.4))" }}>
      {shape.map(([x, y, c]) => P(x, y, c))}
    </svg>
  );
}
