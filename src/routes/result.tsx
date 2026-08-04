import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { PixelTag } from "@/components/pixel/PixelInput";
import { PixelStatBar } from "@/components/pixel/PixelBars";
import { StrengthWallet } from "@/components/pixel/StrengthWallet";
import {
  CARD_BY_ID, CHAR_BY_ID, STATS, STAT_KEYS, characterFor, computeStats, countByStat, topStat, type Card,
} from "@/lib/game/data";
import { computeJohari, peerStatCounts, toPercent } from "@/lib/game/johari";
import { fetchGlobalStats, fetchSession } from "@/lib/game/api";
import { useGame } from "@/lib/game/store";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "나의 결과 · ANIMA HATCH" },
      { name: "description", content: "나만 아는 나, 남이 보는 나 — 조하리의 창 결과를 확인하세요." },
      { property: "og:title", content: "나의 결과 · ANIMA HATCH" },
      { property: "og:description", content: "나만 아는 나, 남이 보는 나 — 조하리의 창 결과를 확인하세요." },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const game = useGame();
  const navigate = useNavigate();
  const [showDebug, setShowDebug] = useState(true);

  const { data: session } = useQuery({
    queryKey: ["session", game.sessionId],
    queryFn: () => fetchSession(game.sessionId!),
    enabled: !!game.sessionId,
    refetchInterval: 8000,
  });
  const { data: global } = useQuery({ queryKey: ["global-stats"], queryFn: fetchGlobalStats });

  const selfPicks = session?.self_picks?.length ? session.self_picks : game.myPicks;
  const peers = session?.peers ?? [];
  const johari = useMemo(() => computeJohari(selfPicks, peers), [selfPicks, peers]);

  const character = session?.character_id
    ? CHAR_BY_ID[session.character_id] ?? characterFor(selfPicks)
    : characterFor(selfPicks);

  const selfCounts = countByStat(selfPicks);
  const selfPct = computeStats(selfPicks);
  const top = topStat(selfCounts);
  const peerPct = toPercent(peerStatCounts(peers));

  if (selfPicks.length === 0) {
    return (
      <AppShell title="결과" back="/">
        <div className="pt-10 max-w-[340px] mx-auto">
          <PixelFrame className="p-6 text-center">
            <PixelIcon name="egg" size={60} className="mx-auto" />
            <div className="mt-3 text-[13px] text-[var(--purple-glow)]">아직 여정을 시작하지 않았어요</div>
            <div className="mt-4">
              <PixelButton full onClick={() => navigate({ to: "/profile" })}>시작하기</PixelButton>
            </div>
          </PixelFrame>
        </div>
      </AppShell>
    );
  }

  const shareUrl = typeof window !== "undefined" && game.sessionId
    ? `${window.location.origin}/result?s=${game.sessionId}`
    : typeof window !== "undefined" ? window.location.origin : "";

  function share() {
    const text = `나는 ${character.name}! ANIMA HATCH에서 내 강점을 확인해보세요.`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "ANIMA HATCH", text, url: shareUrl }).catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(`${text} ${shareUrl}`).catch(() => {});
    }
  }

  return (
    <AppShell title="나의 결과" back="/" action={
      <button onClick={share} aria-label="결과 공유하기" className="flex h-10 w-10 items-center justify-center">
        <PixelIcon name="share" size={20} color="var(--purple-glow)" />
      </button>
    }>
      <div className="pt-2 pb-8 space-y-4 max-w-[380px] mx-auto">
        {/* Character */}
        <PixelFrame className="p-5 text-center">
          <PixelTag tone="purple">{STATS[top].label}의 결</PixelTag>
          <div className="mt-3 flex justify-center">
            <img src={character.image} alt={character.name} className="animate-float-slow"
              style={{ height: 170, imageRendering: "pixelated", filter: "drop-shadow(0 0 18px var(--purple-glow))" }} />
          </div>
          <div className="mt-2 text-[22px] text-[var(--purple-glow)]">{character.name}</div>
          <div className="text-[11px] text-[var(--fg)]/70">{character.subtitle} · {character.tags}</div>
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--fg)]/85">{character.description}</p>
          <div className="mt-2 text-[10px] text-[var(--fg)]/55">
            {game.nickname || session?.nickname || "모험가"}님이 고른 {selfPicks.length}개의 강점에서 태어났어요
          </div>
        </PixelFrame>

        {/* Virtue bars */}
        <PixelFrame className="p-4">
          <div className="text-[12px] text-[var(--purple-glow)] mb-3">나의 덕목 분포</div>
          <div className="space-y-2">
            {STAT_KEYS.map((k) => (
              <div key={k} className="flex items-center gap-2">
                <div className="w-[46px] text-[10px] shrink-0">{STATS[k].label}</div>
                <PixelStatBar value={selfPct[k]} color={STATS[k].hex} />
                <div className="text-[10px] text-[var(--fg)]/60 w-[34px] text-right">{selfPct[k]}%</div>
              </div>
            ))}
          </div>
          {johari.peerCount > 0 && (
            <>
              <div className="mt-4 text-[12px] text-[var(--purple-glow)] mb-2">친구들이 본 나</div>
              <div className="space-y-2">
                {STAT_KEYS.map((k) => (
                  <div key={k} className="flex items-center gap-2">
                    <div className="w-[46px] text-[10px] shrink-0">{STATS[k].label}</div>
                    <PixelStatBar value={peerPct[k]} color={STATS[k].hex} />
                    <div className="text-[10px] text-[var(--fg)]/60 w-[34px] text-right">{peerPct[k]}%</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </PixelFrame>

        {/* Johari */}
        <JohariSection johari={johari} onInvite={() => navigate({ to: "/invite" })} />

        {/* Wallet */}
        <StrengthWallet picks={selfPicks} />

        {/* Global stats */}
        <PixelFrame className="p-4">
          <div className="text-[12px] text-[var(--purple-glow)] mb-1">통계</div>
          <div className="text-[10px] text-[var(--fg)]/60 mb-3">
            지금까지 {global?.total_sessions ?? 0}명의 모험가가 알을 부화시켰어요
          </div>
          {global && global.characters.length > 0 && (
            <div className="space-y-2">
              {global.characters.map((c) => {
                const ch = CHAR_BY_ID[c.character_id];
                const total = global.characters.reduce((a, x) => a + x.count, 0) || 1;
                const pct = Math.round((c.count / total) * 100);
                const mine = ch?.id === character.id;
                return (
                  <div key={c.character_id} className="flex items-center gap-2">
                    <div className="w-[54px] text-[10px] shrink-0" style={{ color: mine ? "var(--purple-glow)" : undefined }}>
                      {ch?.name ?? c.character_id}
                    </div>
                    <div className="flex-1 h-[12px]" style={{ background: "#0a0416", boxShadow: "inset 0 0 0 2px #3d2478" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: ch ? STATS[ch.stat].hex : "#a855f7" }} />
                    </div>
                    <div className="text-[10px] text-[var(--fg)]/60 w-[32px] text-right">{pct}%</div>
                  </div>
                );
              })}
            </div>
          )}
          {global && global.keywords.length > 0 && (
            <>
              <div className="mt-4 text-[11px] text-[var(--fg)]/70 mb-2">가장 많이 선택된 강점</div>
              <div className="flex flex-wrap gap-2">
                {global.keywords.slice(0, 8).map((k) => {
                  const card = CARD_BY_ID[k.card_id];
                  if (!card) return null;
                  return (
                    <div key={k.card_id} className="flex items-center gap-1 px-2 py-1 text-[10px]"
                      style={{ background: "#0a0416", boxShadow: "inset 0 0 0 2px var(--pixel-border-dark)" }}>
                      <PixelIcon name={card.icon} size={12} color={STATS[card.stat].hex} />
                      {card.keyword}
                      <span className="text-[var(--fg)]/50">{k.count}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </PixelFrame>

        <PixelButton full size="lg" onClick={share} leftIcon={<PixelIcon name="share" size={14} />}>
          결과 공유하기
        </PixelButton>

        {/* Debug */}
        <PixelFrame className="p-3" tone="mid">
          <button className="text-[10px] text-[var(--fg)]/60" onClick={() => setShowDebug((v) => !v)}>
            [디버그 정보 {showDebug ? "숨기기" : "보기"}]
          </button>
          {showDebug && (
            <pre className="mt-2 text-[9px] leading-relaxed whitespace-pre-wrap break-all text-[var(--fg)]/70">
{JSON.stringify({
  sessionId: game.sessionId,
  nickname: game.nickname,
  selfPickCount: selfPicks.length,
  selfPicks,
  selfCounts,
  topStat: top,
  characterId: character.id,
  peerCount: johari.peerCount,
  peers: peers.map((p) => ({ name: p.name, picks: p.picks.length })),
  johari: { open: johari.open.length, hidden: johari.hidden.length, blind: johari.blind.length, level: johari.level },
}, null, 1)}
            </pre>
          )}
        </PixelFrame>
      </div>
    </AppShell>
  );
}

function JohariSection({ johari, onInvite }: { johari: ReturnType<typeof computeJohari>; onInvite: () => void }) {
  if (johari.level === 0) {
    return (
      <PixelFrame className="p-5 text-center">
        <PixelIcon name="hourglass" size={40} color="var(--temperance)" className="mx-auto animate-glow-pulse" />
        <div className="mt-2 text-[13px] text-[var(--purple-glow)]">조하리의 창은 아직 잠겨 있어요</div>
        <p className="mt-2 text-[11px] leading-relaxed text-[var(--fg)]/75">
          친구가 한 명도 답하지 않았어요.<br />
          1~2명이면 일부, 3명 이상이면 전체가 열려요.
        </p>
        <div className="mt-4">
          <PixelButton full onClick={onInvite} rightIcon={<PixelIcon name="arrow" size={14} />}>
            친구 초대하기
          </PixelButton>
        </div>
      </PixelFrame>
    );
  }

  const partial = johari.level === 1;
  return (
    <PixelFrame className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-[var(--purple-glow)]">조하리의 창</div>
        <div className="text-[10px] text-[var(--fg)]/60">친구 {johari.peerCount}명 반영</div>
      </div>

      {partial && (
        <div className="mt-2 text-[10px] leading-relaxed text-[var(--justice)]">
          부분 공개 중 — 3명이 답하면 맹점(Blind)까지 전부 열려요.
        </div>
      )}

      <div className="mt-3 space-y-3">
        <Quadrant
          title="열린 창 (Open)" desc="나도 알고 친구도 아는 강점"
          color="var(--humanity)" cards={johari.open}
        />
        <Quadrant
          title="숨겨진 창 (Hidden)" desc="나만 알고 있는 강점"
          color="var(--wisdom)" cards={johari.hidden}
        />
        <Quadrant
          title="보이지 않는 창 (Blind)" desc="친구만 보고 있는 나의 강점"
          color="var(--justice)" cards={johari.blind}
          locked={partial}
          lockedLabel={`친구 ${3 - johari.peerCount}명이 더 답하면 열려요`}
        />
      </div>
    </PixelFrame>
  );
}

function Quadrant({
  title, desc, color, cards, locked, lockedLabel,
}: { title: string; desc: string; color: string; cards: Card[]; locked?: boolean; lockedLabel?: string }) {
  return (
    <div className="p-3" style={{ background: "#0a0416", boxShadow: "inset 0 0 0 2px var(--pixel-border-dark)" }}>
      <div className="text-[11px]" style={{ color }}>{title}</div>
      <div className="text-[9px] text-[var(--fg)]/55">{desc}</div>
      {locked ? (
        <div className="mt-2 flex items-center gap-2 text-[10px] text-[var(--fg)]/60">
          <PixelIcon name="key" size={14} color="var(--justice)" />
          {lockedLabel}
        </div>
      ) : cards.length === 0 ? (
        <div className="mt-2 text-[10px] text-[var(--fg)]/45">해당하는 강점이 없어요</div>
      ) : (
        <div className="mt-2 flex flex-wrap gap-1">
          {cards.map((c) => (
            <div key={c.id} className="flex items-center gap-1 px-2 py-1 text-[10px]"
              style={{ background: "#180c33", boxShadow: `inset 0 0 0 2px ${color}` }}>
              <PixelIcon name={c.icon} size={12} color={STATS[c.stat].hex} />
              {c.keyword}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
