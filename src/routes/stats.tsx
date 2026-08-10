import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { CARD_BY_ID, CHARACTERS, CHAR_BY_STAT, STATS } from "@/lib/game/data";
import { fetchGlobalStats, fetchSession } from "@/lib/game/api";
import { weightedResult } from "@/lib/game/johari";
import { useGame } from "@/lib/game/store";

/** Below this many adventurers the sample is too small to show percentages. */
const MIN_SAMPLE = 20;

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "전체 통계 · ANIMA HATCH" },
      { name: "description", content: "모험가들의 캐릭터 분포와 인기 강점 키워드를 확인하세요." },
      { property: "og:title", content: "전체 통계 · ANIMA HATCH" },
      { property: "og:description", content: "모험가들의 캐릭터 분포와 인기 강점 키워드를 확인하세요." },
    ],
  }),
  component: StatsPage,
});

function StatsPage() {
  const game = useGame();
  const navigate = useNavigate();

  const { data: global, isLoading } = useQuery({ queryKey: ["global-stats"], queryFn: fetchGlobalStats });
  const { data: session } = useQuery({
    queryKey: ["session", game.sessionId],
    queryFn: () => fetchSession(game.sessionId!),
    enabled: !!game.sessionId,
  });

  const myPicks = session?.self_picks?.length ? session.self_picks : game.myPicks;
  const myWeighted = useMemo(
    () => (myPicks.length ? weightedResult(myPicks, session?.peers ?? []) : null),
    [myPicks, session],
  );
  const myCharacter = myWeighted ? CHAR_BY_STAT[myWeighted.stat] : null;

  const total = global?.total_sessions ?? 0;
  const enough = total >= MIN_SAMPLE;

  const charCounts = new Map((global?.characters ?? []).map((c) => [c.character_id, c.count]));
  const charTotal = (global?.characters ?? []).reduce((a, c) => a + c.count, 0) || 1;
  const kwTotal = total || 1;
  const myPickSet = new Set(myPicks);

  const myPct = myCharacter ? Math.round(((charCounts.get(myCharacter.id) ?? 0) / charTotal) * 100) : 0;
  const myTopCards = myPicks
    .map((id) => CARD_BY_ID[id])
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 3);

  function keywordPct(cardId: string) {
    const row = (global?.keywords ?? []).find((k) => k.card_id === cardId);
    return Math.round(((row?.count ?? 0) / kwTotal) * 100);
  }

  return (
    <AppShell title="전체 통계" back="/">
      <div className="pt-2 pb-8 space-y-4 max-w-[380px] mx-auto">
        {/* My summary */}
        {myCharacter && myWeighted && (
          <PixelFrame className="p-4"
            style={{ boxShadow: `0 -3px 0 0 #0a0416,0 3px 0 0 #0a0416,-3px 0 0 0 #0a0416,3px 0 0 0 #0a0416, inset 0 0 0 3px ${STATS[myWeighted.stat].hex}` }}>
            <div className="text-[12px]" style={{ color: STATS[myWeighted.stat].hex }}>내 결과 요약</div>
            <div className="mt-2 flex items-center gap-3">
              <img src={myCharacter.image} alt={myCharacter.name}
                style={{ height: 70, imageRendering: "pixelated" }} />
              <div className="min-w-0">
                <div className="text-[14px] text-[var(--purple-glow)]">내 캐릭터: {myCharacter.name}</div>
                {enough && <div className="text-[10px] text-[var(--fg)]/70">전체의 {myPct}%가 같은 캐릭터예요</div>}
              </div>
            </div>
            {myTopCards.length > 0 && (
              <div className="mt-3 text-[10px] leading-relaxed text-[var(--fg)]/80">
                내 대표 강점:{" "}
                {myTopCards.map((c, i) => (
                  <span key={c.id} style={{ color: STATS[c.stat].hex }}>
                    {i > 0 && <span className="text-[var(--fg)]/50">, </span>}
                    {c.keyword}
                    {enough && <span className="text-[var(--fg)]/50"> ({keywordPct(c.id)}%)</span>}
                  </span>
                ))}
              </div>
            )}
          </PixelFrame>
        )}

        <PixelFrame className="p-3 text-center" tone="mid">
          <div className="text-[11px] text-[var(--fg)]/80">
            지금까지 <span className="text-[var(--purple-glow)]">{total}</span>명의 모험가가 알을 부화시켰어요
          </div>
        </PixelFrame>

        {isLoading && (
          <PixelFrame className="p-5 text-center text-[11px] text-[var(--fg)]/60">불러오는 중...</PixelFrame>
        )}

        {!isLoading && !enough && (
          <PixelFrame className="p-6 text-center">
            <PixelIcon name="hourglass" size={40} color="var(--temperance)" className="mx-auto animate-glow-pulse" />
            <div className="mt-3 text-[12px] text-[var(--purple-glow)]">아직 데이터가 쌓이는 중이에요</div>
            <div className="mt-1 text-[11px] text-[var(--fg)]/70">조금 뒤 다시 만나요</div>
          </PixelFrame>
        )}

        {!isLoading && enough && (
          <>
            {/* Character distribution */}
            <PixelFrame className="p-4">
              <div className="text-[12px] text-[var(--purple-glow)] mb-3">캐릭터 분포</div>
              <div className="space-y-2">
                {CHARACTERS.map((ch) => {
                  const pct = Math.round(((charCounts.get(ch.id) ?? 0) / charTotal) * 100);
                  const mine = myCharacter?.id === ch.id;
                  const hex = STATS[ch.stat].hex;
                  return (
                    <div key={ch.id} className="flex items-center gap-2 p-1"
                      style={mine ? { boxShadow: `inset 0 0 0 2px ${hex}` } : undefined}>
                      <div className="w-[58px] text-[10px] shrink-0" style={{ color: mine ? hex : undefined }}>
                        {ch.name}
                      </div>
                      <div className="flex-1 h-[14px]" style={{ background: "#0a0416", boxShadow: "inset 0 0 0 2px #3d2478" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: hex }} />
                      </div>
                      <div className="text-[10px] text-[var(--fg)]/60 w-[30px] text-right">{pct}%</div>
                      {mine && (
                        <div className="text-[9px] px-1 shrink-0" style={{ background: hex, color: "#0a0416" }}>내 결과</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </PixelFrame>

            {/* Keyword ranking */}
            <PixelFrame className="p-4">
              <div className="text-[12px] text-[var(--purple-glow)] mb-1">강점 키워드 TOP 10</div>
              <div className="text-[9px] text-[var(--fg)]/55 mb-3">전체 모험가 중 몇 %가 선택했는지</div>
              <div className="space-y-2">
                {(global?.keywords ?? []).slice(0, 10).map((k, i) => {
                  const card = CARD_BY_ID[k.card_id];
                  if (!card) return null;
                  const pct = Math.round((k.count / kwTotal) * 100);
                  const mine = myPickSet.has(card.id);
                  const hex = STATS[card.stat].hex;
                  return (
                    <div key={k.card_id} className="flex items-center gap-2">
                      <div className="w-[16px] text-[10px] text-[var(--fg)]/50 shrink-0">{i + 1}</div>
                      <PixelIcon name={card.icon} size={14} color={hex} />
                      <div className="w-[92px] text-[10px] truncate shrink-0" style={{ color: mine ? hex : undefined }}>
                        {mine ? "★ " : ""}{card.keyword}
                      </div>
                      <div className="flex-1 h-[12px]" style={{ background: "#0a0416", boxShadow: "inset 0 0 0 2px #3d2478" }}>
                        <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: hex }} />
                      </div>
                      <div className="text-[10px] text-[var(--fg)]/60 w-[30px] text-right">{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </PixelFrame>
          </>
        )}

        <PixelButton full size="md" variant="ghost" onClick={() => navigate({ to: "/" })}>
          홈으로
        </PixelButton>
      </div>
    </AppShell>
  );
}
