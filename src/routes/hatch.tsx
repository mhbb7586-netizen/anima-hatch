import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { characterFor } from "@/lib/game/data";
import { setState, useGame } from "@/lib/game/store";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/hatch")({
  head: () => ({
    meta: [
      { title: "부화 · ANIMA HATCH" },
      { name: "description", content: "알에서 당신의 클래스가 깨어납니다." },
      { property: "og:title", content: "부화" },
      { property: "og:description", content: "알에서 당신의 클래스가 깨어납니다." },
    ],
  }),
  component: HatchPage,
});

function HatchPage() {
  const game = useGame();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"shake" | "flash" | "reveal">("shake");

  // The unlocked class comes from the user's OWN selections only.
  const character = useMemo(() => characterFor(game.myPicks), [game.myPicks]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("flash"), 2000);
    const t2 = setTimeout(() => setPhase("reveal"), 3200);
    const t3 = setTimeout(() => {
      setState({ hatched: true });
      navigate({ to: "/result" });
    }, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [navigate]);

  return (
    <AppShell hideHeader>
      <div className="pt-2 pb-6 flex flex-col items-center gap-4">
        <div className="text-[16px] text-[var(--purple-glow)]">알이 깨어나요...</div>
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
          <div
            className="absolute bottom-4 w-[260px] h-[70px] animate-spin-slow"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, var(--purple) 30deg, transparent 90deg, transparent 180deg, var(--purple) 210deg, transparent 270deg)",
              maskImage: "radial-gradient(ellipse 50% 100%, transparent 55%, black 58%, black 74%, transparent 76%)",
              WebkitMaskImage: "radial-gradient(ellipse 50% 100%, transparent 55%, black 58%, black 74%, transparent 76%)",
              filter: "drop-shadow(0 0 16px var(--purple))",
            }}
          />
          {phase !== "reveal" ? (
            <div className={phase === "shake" ? "animate-egg-shake" : ""}>
              <PixelIcon name="egg" size={180} />
            </div>
          ) : (
            <img
              src={character.image}
              alt={character.name}
              className="animate-rise"
              style={{ height: 200, imageRendering: "pixelated", filter: "drop-shadow(0 0 20px var(--purple-glow))" }}
            />
          )}
          {phase === "flash" && (
            <div className="absolute inset-0 animate-hatch-flash pointer-events-none"
              style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 60%)" }} />
          )}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="absolute w-[4px] h-[4px] animate-sparkle"
              style={{
                left: `${20 + ((i * 37) % 60)}%`,
                top: `${20 + ((i * 53) % 60)}%`,
                background: "var(--purple-glow)",
                boxShadow: "0 0 6px var(--purple-glow)",
                animationDelay: `${i * 0.2}s`,
              }} />
          ))}
        </div>

        <PixelFrame className="p-4 max-w-[320px] text-center">
          <div className="text-[11px] text-[var(--fg)]/80 leading-relaxed">
            {phase === "shake" && "알에서 뭔가 꿈틀거려요..."}
            {phase === "flash" && "눈부신 빛이 터져나옵니다!"}
            {phase === "reveal" && `${character.name}이(가) 깨어났어요!`}
          </div>
        </PixelFrame>

        {phase === "reveal" && (
          <PixelButton size="md" onClick={() => navigate({ to: "/result" })}
            rightIcon={<PixelIcon name="arrow" size={14} />}>
            결과 보러 가기
          </PixelButton>
        )}
      </div>
    </AppShell>
  );
}
