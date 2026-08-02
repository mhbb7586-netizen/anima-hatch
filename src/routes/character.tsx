import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { PixelTag } from "@/components/pixel/PixelInput";
import { CHARACTERS, STATS } from "@/lib/game/data";
import { useGame } from "@/lib/game/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/character")({
  head: () => ({
    meta: [
      { title: "캐릭터 도감 · ANIMA HATCH" },
      { name: "description", content: "6개의 클래스 도감을 확인하세요." },
      { property: "og:title", content: "캐릭터 도감" },
      { property: "og:description", content: "6개의 클래스 도감을 확인하세요." },
    ],
  }),
  component: Dex,
});

const toneMap: Record<string, "purple" | "orange" | "green" | "yellow" | "blue" | "pink"> = {
  wisdom: "purple", courage: "orange", humanity: "green",
  justice: "yellow", temperance: "blue", transcendence: "pink",
};

function Dex() {
  const game = useGame();
  return (
    <AppShell title="캐릭터 도감">
      <div className="pt-2 pb-4 space-y-3">
        <PixelFrame className="p-3" tone="mid">
          <div className="text-[11px] text-[var(--fg)]/80 text-center">
            총 6명의 동료 · {game.unlockedCharacterId ? 1 : 0}명 해금
          </div>
        </PixelFrame>
        <div className="grid grid-cols-2 gap-3">
          {CHARACTERS.map((c) => {
            const unlocked = game.unlockedCharacterId === c.id;
            return (
              <PixelFrame key={c.id} className={cn("p-3 flex flex-col items-center", !unlocked && "opacity-70")}>
                <PixelTag tone={toneMap[c.stat]}>{STATS[c.stat].label}</PixelTag>
                <div
                  className="mt-2 h-[100px] w-full flex items-end justify-center"
                  style={{
                    background: "#0a0416",
                    boxShadow: "inset 0 0 0 2px var(--pixel-border-dark)",
                  }}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className={unlocked ? "animate-float-slow" : ""}
                    style={{
                      height: 88,
                      imageRendering: "pixelated",
                      filter: unlocked ? "none" : "brightness(0) contrast(1)",
                    }}
                  />
                </div>
                <div className="mt-2 text-[14px] text-[var(--purple-glow)]">
                  {unlocked ? c.name : "???"}
                </div>
                <div className="text-[9px] text-[var(--fg)]/60 text-center">
                  {unlocked ? c.subtitle : "미해금"}
                </div>
              </PixelFrame>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
