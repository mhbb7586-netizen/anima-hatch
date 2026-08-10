import { useNavigate } from "@tanstack/react-router";
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
  CHAR_BY_STAT, STATS, STAT_KEYS, computeStats, type Card,
} from "@/lib/game/data";
import { computeJohari, peerStatCounts, toPercent, weightedResult } from "@/lib/game/johari";
import { fetchSession } from "@/lib/game/api";
import { useGame } from "@/lib/game/store";

type Props = {
  /** Session to display. When null the viewer's own local session is used. */
  sessionId: string | null;
  /** True when the viewer is looking at their own result. */
  own: boolean;
};

export function ResultView({ sessionId, own }: Props) {
  const game = useGame();
  const navigate = useNavigate();
  const [showDebug, setShowDebug] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: session } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSession(sessionId!),
    enabled: !!sessionId,
    refetchInterval: own ? 8000 : false,
  });

  const selfPicks = session?.self_picks?.length ? session.self_picks : own ? game.myPicks : [];
  const peers = useMemo(() => session?.peers ?? [], [session]);
  const johari = useMemo(() => computeJohari(selfPicks, peers.slice(0, 3)), [selfPicks, peers]);
  const weighted = useMemo(() => weightedResult(selfPicks, peers), [selfPicks, peers]);

  const character = CHAR_BY_STAT[weighted.stat];
  const selfPct = computeStats(selfPicks);
  const peerPct = toPercent(peerStatCounts(peers.slice(0, 3)));
  const nickname = session?.nickname || (own ? game.nickname : "") || "모험가";

  if (selfPicks.length === 0) {
    return (
      <AppShell title="결과" back="/">
        <div className="pt-10 max-w-[340px] mx-auto">
          <PixelFrame className="p-6 text-center">
            <PixelIcon name="egg" size={60} className="mx-auto" />
            <div className="mt-3 text-[13px] text-[var(--purple-glow)]">
              {sessionId && !session ? "결과를 불러오는 중..." : "아직 여정을 시작하지 않았어요"}
            </div>
            <div className="mt-4">
              <PixelButton full onClick={() => navigate({ to: "/profile" })}>시작하기</PixelButton>
            </div>
          </PixelFrame>
        </div>
      </AppShell>
    );
  }

  const shareUrl =
    typeof window === "undefined"
      ? ""
      : sessionId
        ? `${window.location.origin}/result/${sessionId}`
        : window.location.origin;

  function share() {
    const text = `${nickname}님은 ${character.name}! ANIMA HATCH에서 내 강점을 확인해보세요.`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "ANIMA HATCH", text, url: shareUrl }).catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(`${text} ${shareUrl}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }).catch(() => {});
    }
  }

  return (
    <AppShell title={own ? "나의 결과" : `${nickname}님의 결과`} back="/" action={
      <button onClick={share} aria-label="결과 공유하기" className="flex h-10 w-10 items-center justify-center">
        <PixelIcon name="share" size={20} color="var(--purple-glow)" />
      </button>
    }>
      <div className="pt-2 pb-8 space-y-4 max-w-[380px] mx-auto">
        {/* Character */}
        <PixelFrame className="p-5 text-center">
          <PixelTag tone="purple">{STATS[weighted.stat].label}의 결</PixelTag>
          <div className="mt-3 flex justify-center">
            <img src={character.image} alt={character.name} className="animate-float-slow"
              style={{ height: 170, imageRendering: "pixelated", filter: "drop-shadow(0 0 18px var(--purple-glow))" }} />
          </div>
          <div className="mt-2 text-[22px] text-[var(--purple-glow)]">{character.name}</div>
          <div className="text-[11px] text-[var(--fg)]/70">{character.subtitle} · {character.tags}</div>
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--fg)]/85">{character.description}</p>
          <div className="mt-3 p-2 text-[11px] leading-relaxed"
            style={{ background: "#0a0416", boxShadow: "inset 0 0 0 2px var(--pixel-border-dark)", color: STATS[weighted.stat].hex }}>
            {weighted.message}
          </div>
          <div className="mt-2 text-[10px] text-[var(--fg)]/55">
            {nickname}님이 고른 {selfPicks.length}개의 강점과 친구 {weighted.usedPeerCount}명의 시선에서 태어났어요
          </div>
        </PixelFrame>

        {/* Weighted virtue scores */}
        <PixelFrame className="p-4">
          <div className="text-[12px] text-[var(--purple-glow)] mb-1">덕목 점수</div>
          <div className="text-[9px] text-[var(--fg)]/55 mb-3">열린 창 ×3 · 숨겨진 창 ×2 · 보이지 않는 창 ×1</div>
          <div className="space-y-2">
            {STAT_KEYS.map((k) => {
              const maxScore = Math.max(...STAT_KEYS.map((s) => weighted.scores[s]), 1);
              return (
                <div key={k} className="flex items-center gap-2">
                  <div className="w-[46px] text-[10px] shrink-0">{STATS[k].label}</div>
                  <PixelStatBar value={Math.round((weighted.scores[k] / maxScore) * 100)} color={STATS[k].hex} />
                  <div className="text-[10px] text-[var(--fg)]/60 w-[34px] text-right">{weighted.scores[k]}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-[12px] text-[var(--purple-glow)] mb-2">내가 고른 나</div>
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
        <JohariSection johari={johari} own={own} onInvite={() => navigate({ to: "/invite" })} />

        {/* Wallet */}
        <StrengthWallet picks={selfPicks} scoreByStat={weighted.scores} />

        <div className="space-y-2">
          <PixelButton full size="lg" onClick={share} leftIcon={<PixelIcon name="share" size={14} />}>
            {copied ? "링크 복사됨!" : "결과 공유하기"}
          </PixelButton>
          {own ? (
            <PixelButton full size="md" variant="ghost" onClick={() => navigate({ to: "/stats" })}
              rightIcon={<PixelIcon name="arrow" size={14} />}>
              통계 보러가기
            </PixelButton>
          ) : (
            <PixelButton full size="md" onClick={() => navigate({ to: "/" })}
              rightIcon={<PixelIcon name="arrow" size={14} />}>
              나도 해볼래!
            </PixelButton>
          )}
        </div>

        {own && (
          <PixelFrame className="p-3" tone="mid">
            <button className="text-[10px] text-[var(--fg)]/60" onClick={() => setShowDebug((v) => !v)}>
              [디버그 정보 {showDebug ? "숨기기" : "보기"}]
            </button>
            {showDebug && (
              <pre className="mt-2 text-[9px] leading-relaxed whitespace-pre-wrap break-all text-[var(--fg)]/70">
{JSON.stringify({
  sessionId,
  nickname,
  selfPickCount: selfPicks.length,
  selfPicks,
  scores: weighted.scores,
  contributions: weighted.contributions,
  stat: weighted.stat,
  dominant: weighted.dominant,
  characterId: character.id,
  peerCount: weighted.peerCount,
  usedPeerCount: weighted.usedPeerCount,
  peers: peers.map((p) => ({ name: p.name, picks: p.picks.length })),
  johari: { open: johari.open.length, hidden: johari.hidden.length, blind: johari.blind.length, level: johari.level },
}, null, 1)}
              </pre>
            )}
          </PixelFrame>
        )}
      </div>
    </AppShell>
  );
}

function JohariSection({
  johari, own, onInvite,
}: { johari: ReturnType<typeof computeJohari>; own: boolean; onInvite: () => void }) {
  if (johari.level === 0) {
    return (
      <PixelFrame className="p-5 text-center">
        <PixelIcon name="hourglass" size={40} color="var(--temperance)" className="mx-auto animate-glow-pulse" />
        <div className="mt-2 text-[13px] text-[var(--purple-glow)]">조하리의 창은 아직 잠겨 있어요</div>
        <p className="mt-2 text-[11px] leading-relaxed text-[var(--fg)]/75">
          친구가 한 명도 답하지 않았어요.<br />
          1~2명이면 일부, 3명 이상이면 전체가 열려요.
        </p>
        {own && (
          <div className="mt-4">
            <PixelButton full onClick={onInvite} rightIcon={<PixelIcon name="arrow" size={14} />}>
              친구 초대하기
            </PixelButton>
          </div>
        )}
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
        <Quadrant title="열린 창 (Open)" desc="나도 알고 친구도 아는 강점"
          color="var(--humanity)" cards={johari.open} />
        <Quadrant title="숨겨진 창 (Hidden)" desc="나만 알고 있는 강점"
          color="var(--wisdom)" cards={johari.hidden} />
        <Quadrant title="보이지 않는 창 (Blind)" desc="친구만 보고 있는 나의 강점"
          color="var(--justice)" cards={johari.blind}
          locked={partial}
          lockedLabel={`친구 ${3 - johari.peerCount}명이 더 답하면 열려요`} />
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
