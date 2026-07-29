import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { PixelStatBar } from "@/components/pixel/PixelBars";
import { CARDS, CHAR_BY_STAT, STATS, STAT_ORDER, computeStats, topStat, type StatKey } from "@/lib/game/data";
import { resetState, useGame } from "@/lib/game/store";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "결과 · ANIMA HATCH" },
      { name: "description", content: "당신의 강점과 조하리의 창을 확인하세요." },
      { property: "og:title", content: "나의 결과" },
      { property: "og:description", content: "당신의 강점과 조하리의 창을 확인하세요." },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const game = useGame();
  const navigate = useNavigate();

  if (!game.hatched && game.myPicks.length === 0) {
    return (
      <AppShell title="결과 보기">
        <div className="pt-10 max-w-[320px] mx-auto text-center space-y-4">
          <PixelFrame className="p-6">
            <PixelIcon name="egg" size={60} className="mx-auto" />
            <div className="mt-3 text-[13px]">아직 부화한 알이 없어요</div>
            <div className="mt-1 text-[11px] text-[var(--fg)]/70">여정을 시작하면 결과가 나타납니다.</div>
          </PixelFrame>
          <PixelButton full size="lg" onClick={() => navigate({ to: "/" })}>여정 시작하기</PixelButton>
        </div>
      </AppShell>
    );
  }

  const selfStats = computeStats(game.myPicks);
  const friendsPickIds = game.friends.flatMap((f) => f.picks);
  const others = new Set(friendsPickIds);
  const mine = new Set(game.myPicks);

  // Johari-like categorization based on card selections
  const open: string[] = [];       // 나·남 모두 선택
  const hidden: string[] = [];     // 나만 선택
  const blind: string[] = [];      // 남만 선택
  const unknown: string[] = [];    // 아무도 선택 안함
  for (const c of CARDS) {
    const me = mine.has(c.id);
    const other = others.has(c.id);
    if (me && other) open.push(c.id);
    else if (me && !other) hidden.push(c.id);
    else if (!me && other) blind.push(c.id);
    else unknown.push(c.id);
  }

  const combinedStats = computeStats([...game.myPicks, ...friendsPickIds]);
  const top = topStat(combinedStats);
  const character = CHAR_BY_STAT[top];

  return (
    <AppShell title="결과 보기">
      <div className="pt-2 pb-6 space-y-4">
        {/* Character reveal */}
        <PixelFrame className="p-5 flex flex-col items-center">
          <div
            className="inline-block px-6 py-1 text-[12px] mb-3 text-[var(--purple-glow)]"
            style={{
              background: "#0a0416",
              boxShadow: "inset 0 0 0 2px var(--pixel-border)",
              clipPath: "polygon(6% 0, 94% 0, 100% 50%, 94% 100%, 6% 100%, 0 50%)",
            }}
          >
            당신의 캐릭터
          </div>
          <div className="relative flex items-end justify-center h-[190px] w-full">
            <div className="absolute bottom-2 w-[220px] h-[60px] animate-spin-slow"
              style={{
                background: "conic-gradient(from 0deg, transparent, var(--purple) 30deg, transparent 90deg, transparent 180deg, var(--purple) 210deg, transparent 270deg)",
                maskImage: "radial-gradient(ellipse 50% 100%, transparent 55%, black 58%, black 74%, transparent 76%)",
                WebkitMaskImage: "radial-gradient(ellipse 50% 100%, transparent 55%, black 58%, black 74%, transparent 76%)",
                filter: "drop-shadow(0 0 16px var(--purple))",
              }}
            />
            <img
              src={character.image}
              alt={character.name}
              className="animate-float-slow"
              style={{ height: 160, imageRendering: "pixelated" }}
            />
          </div>
          <div className="mt-3 text-[26px] text-[var(--justice)]" style={{ textShadow: "2px 2px 0 #0a0416" }}>
            {character.name}
          </div>
          <div className="text-[11px] text-[var(--fg)]/80 mt-1">{character.tags}</div>
          <p className="mt-3 text-[11px] leading-relaxed text-center text-[var(--fg)]/75 max-w-[280px]">
            {character.description}
          </p>
        </PixelFrame>

        <div className="grid grid-cols-2 gap-3">
          <PixelFrame className="p-4">
            <div className="text-[12px] text-[var(--purple-glow)] mb-3">나의 스탯 분포</div>
            <div className="space-y-2">
              {STAT_ORDER.map((k) => (
                <StatRow key={k} k={k} value={combinedStats[k]} />
              ))}
            </div>
          </PixelFrame>

          <PixelFrame className="p-4">
            <div className="text-[12px] text-[var(--purple-glow)] mb-3">조하리의 창</div>
            <JohariPanel color="var(--purple)" title="열린 스탯" desc="나와 남이 모두 아는 나의 강점" count={open.length} />
            <JohariPanel color="var(--creativity)" title="미지의 스탯" desc={"나만 아직 모르는\n숨겨진 가능성"} count={unknown.length} />
            <JohariPanel color="var(--courage)" title="보이지 않는 스탯" desc={"남이 보는 나지만\n내가 모르는 부분"} count={blind.length} />
            <JohariPanel color="var(--humanity)" title="숨겨진 스탯" desc={"내가 알지만\n남이 모르는 나"} count={hidden.length} />
          </PixelFrame>
        </div>

        <PixelFrame className="p-4">
          <div className="text-[12px] text-[var(--purple-glow)] mb-3">열린 스탯 — 함께 발견한 나</div>
          <div className="flex flex-wrap gap-2">
            {open.slice(0, 12).map((id) => {
              const c = CARDS.find((x) => x.id === id);
              if (!c) return null;
              return (
                <div key={id} className="flex items-center gap-1 px-2 py-1 text-[11px]"
                  style={{ background: "#0a0416", boxShadow: "inset 0 0 0 2px var(--pixel-border-dark)" }}>
                  <PixelIcon name={c.icon} size={14} color={STATS[c.stat].color} />
                  {c.keyword}
                </div>
              );
            })}
            {open.length === 0 && (
              <div className="text-[11px] text-[var(--fg)]/60">겹치는 강점이 아직 없어요.</div>
            )}
          </div>
        </PixelFrame>

        <div className="space-y-2">
          <PixelButton full size="md" onClick={() => navigate({ to: "/character" })}
            rightIcon={<PixelIcon name="arrow" size={14} />}>
            결과 상세 · 캐릭터 도감
          </PixelButton>
          <PixelButton full size="md" variant="ghost" onClick={() => {
            if (confirm("다시 테스트할까요? 지금 결과는 사라져요.")) {
              resetState();
              navigate({ to: "/" });
            }
          }}>
            다시 테스트하기
          </PixelButton>
        </div>
      </div>
    </AppShell>
  );
}

function StatRow({ k, value }: { k: StatKey; value: number }) {
  const s = STATS[k];
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <PixelIcon name={s.icon} size={16} color={s.color} />
      <div className="w-[42px] shrink-0 text-[var(--fg)]/90 whitespace-nowrap">{s.label}</div>
      <PixelStatBar value={value} color={s.color} segments={6} />
      <div className="ml-auto text-[10px] text-[var(--fg)]/70 shrink-0">{value}%</div>
    </div>
  );
}

function JohariPanel({ color, title, desc, count }: { color: string; title: string; desc: string; count: number }) {
  return (
    <div
      className="mb-2 p-2 text-center"
      style={{
        background: "#0a0416",
        boxShadow: `inset 0 0 0 2px ${color}`,
      }}
    >
      <div className="text-[11px]" style={{ color }}>{title}</div>
      <div className="text-[9px] text-[var(--fg)]/70 whitespace-pre-line leading-tight mt-0.5">{desc}</div>
      <div className="text-[10px] text-[var(--fg)]/60 mt-1">{count}개</div>
    </div>
  );
}
