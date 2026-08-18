import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/pixel/AppShell";
import { PixelFrame } from "@/components/pixel/PixelFrame";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelInput } from "@/components/pixel/PixelInput";
import { CARD_BY_ID, CHAR_BY_STAT, STATS, STAT_KEYS, type StatKey } from "@/lib/game/data";
import { WEIGHTS, computeJohari, weightedResult, type Quadrant } from "@/lib/game/johari";
import { fetchSession } from "@/lib/game/api";
import { useGame } from "@/lib/game/store";

/** Not linked anywhere — the calculation inspector is reachable by key only. */
const ADMIN_KEY = "anima-admin";

type Search = { key?: string; s?: string };

export const Route = createFileRoute("/admin")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    key: typeof s.key === "string" ? s.key : undefined,
    s: typeof s.s === "string" ? s.s : undefined,
  }),
  head: () => ({
    meta: [
      { title: "계산 검증 콘솔 · ANIMA HATCH" },
      { name: "description", content: "결과 점수 계산 과정을 단계별로 확인하는 내부 화면입니다." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "계산 검증 콘솔 · ANIMA HATCH" },
      { property: "og:description", content: "결과 점수 계산 과정을 단계별로 확인하는 내부 화면입니다." },
    ],
  }),
  component: AdminPage,
});

const QUAD_LABEL: Record<Quadrant, string> = {
  open: "열린 창 (나+친구)",
  hidden: "숨겨진 창 (나만)",
  blind: "보이지 않는 창 (친구만)",
};

function AdminPage() {
  const search = useSearch({ from: "/admin" });
  const navigate = useNavigate();
  const game = useGame();
  const [input, setInput] = useState(search.s ?? game.sessionId ?? "");

  if (search.key !== ADMIN_KEY) {
    return (
      <AppShell hideHeader>
        <div className="pt-16 text-center text-[12px] text-[var(--fg)]/60">페이지를 찾을 수 없어요.</div>
      </AppShell>
    );
  }

  return (
    <AppShell scroll title="계산 검증 콘솔" back="/">
      <div className="pb-8 space-y-3 max-w-[400px] mx-auto">
        <PixelFrame className="p-3" tone="mid">
          <div className="text-[10px] text-[var(--fg)]/70 mb-2">세션 ID</div>
          <PixelInput value={input} onChange={(e) => setInput(e.target.value.trim())} placeholder="uuid" />
          <div className="mt-2">
            <PixelButton full size="sm"
              onClick={() => navigate({ to: "/admin", search: { key: ADMIN_KEY, s: input } })}>
              계산 과정 보기
            </PixelButton>
          </div>
        </PixelFrame>

        {search.s ? <Breakdown sessionId={search.s} /> : (
          <div className="text-center text-[10px] text-[var(--fg)]/60">세션 ID를 입력하면 단계별 계산이 보여요.</div>
        )}
      </div>
    </AppShell>
  );
}

function Breakdown({ sessionId }: { sessionId: string }) {
  const { data: session, isLoading, error } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSession(sessionId),
  });

  const selfPicks = session?.self_picks ?? [];
  const peers = useMemo(() => session?.peers ?? [], [session]);
  const usedPeers = peers.slice(0, 3);
  const johari = useMemo(() => computeJohari(selfPicks, usedPeers), [selfPicks, usedPeers]);
  const weighted = useMemo(() => weightedResult(selfPicks, peers), [selfPicks, peers]);

  if (isLoading) return <div className="text-center text-[11px] text-[var(--fg)]/60">불러오는 중...</div>;
  if (error || !session) return <div className="text-center text-[11px] text-[var(--danger)]">세션을 찾을 수 없어요.</div>;

  const quadOf = (id: string): Quadrant =>
    johari.open.some((c) => c.id === id) ? "open"
      : johari.hidden.some((c) => c.id === id) ? "hidden" : "blind";

  // Raw (pre-weight) counts per virtue and per quadrant.
  const ranking = [...STAT_KEYS].sort((a, b) => weighted.scores[b] - weighted.scores[a]);
  const first = weighted.stat;
  const second = ranking.find((k) => k !== first) ?? ranking[1]!;
  const character = CHAR_BY_STAT[first];

  return (
    <div className="space-y-3">
      <Section title="① 세션 정보">
        <Row k="닉네임" v={session.nickname || "-"} />
        <Row k="세션 ID" v={session.id} />
        <Row k="본인 선택 수" v={`${selfPicks.length}개`} />
        <Row k="친구 응답" v={`${session.peer_count} / 3명 ${session.closed ? "(마감)" : "(진행 중)"}`} />
        <Row k="계산 반영 친구" v={`${usedPeers.length}명 (먼저 응답한 3명까지)`} />
        <div className="mt-1 text-[9px] text-[var(--fg)]/55">
          * 3명이 채워지지 않아도 현재까지의 응답으로 동일한 규칙을 그대로 계산합니다.
        </div>
      </Section>

      <Section title="② 참여자별 선택 → 덕목">
        <Participant name={`본인 (${session.nickname || "모험가"})`} picks={selfPicks} />
        {usedPeers.map((p, i) => (
          <Participant key={i} name={`친구 ${i + 1} (${p.name || "익명"})`} picks={p.picks} />
        ))}
        {usedPeers.length === 0 && (
          <div className="text-[10px] text-[var(--fg)]/55">아직 친구 응답이 없어요.</div>
        )}
      </Section>

      <Section title="③ 조하리 분면 배정 (가중치 적용 전)">
        <div className="text-[9px] text-[var(--fg)]/55 mb-2">
          열린 창 = 나+친구 · 숨겨진 창 = 나만 · 보이지 않는 창 = 친구만
        </div>
        {(["open", "hidden", "blind"] as Quadrant[]).map((q) => {
          const cards = johari[q];
          return (
            <div key={q} className="mb-2">
              <div className="text-[10px] text-[var(--purple-glow)]">
                {QUAD_LABEL[q]} · 가중치 ×{WEIGHTS[q]} · {cards.length}개
              </div>
              <div className="text-[9px] text-[var(--fg)]/70 leading-relaxed">
                {cards.length === 0 ? "없음" : cards.map((c) => `${c.keyword}(${STATS[c.stat].label} +1)`).join(", ")}
              </div>
            </div>
          );
        })}
      </Section>

      <Section title="④ 덕목별 가중치 계산">
        <div className="space-y-1">
          {STAT_KEYS.map((k) => {
            const c = weighted.contributions[k];
            const raw = c.open + c.hidden + c.blind;
            return (
              <div key={k} className="text-[9px] leading-relaxed" style={{ color: STATS[k].hex }}>
                {STATS[k].label}: 적용 전 {raw}개 (열림 {c.open} / 숨김 {c.hidden} / 안보임 {c.blind})
                {" → "}
                {c.open}×{WEIGHTS.open} + {c.hidden}×{WEIGHTS.hidden} + {c.blind}×{WEIGHTS.blind} ={" "}
                <span className="text-[var(--fg)]">{weighted.scores[k]}점</span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="⑤ 최종 순위와 캐릭터">
        {ranking.map((k, i) => (
          <Row key={k} k={`${i + 1}순위 ${STATS[k].label}`} v={`${weighted.scores[k]}점`} />
        ))}
        <div className="mt-2 text-[10px] text-[var(--purple-glow)] leading-relaxed">
          1순위 = {STATS[first].label} / 2순위 = {STATS[second].label}
          <br />→ 최종 캐릭터 = {character.name}
        </div>
        <div className="mt-1 text-[9px] text-[var(--fg)]/60">
          동점 시: 열린 창 기여도가 큰 덕목 → 본인이 먼저 고른 덕목 순으로 결정
        </div>
        <div className="mt-1 text-[9px] text-[var(--fg)]/60">
          대표 분면 = {QUAD_LABEL[weighted.dominant]} → 문구: {weighted.message}
        </div>
      </Section>

      <Section title="⑥ 원본 데이터">
        <pre className="text-[8px] leading-relaxed whitespace-pre-wrap break-all text-[var(--fg)]/70">
{JSON.stringify({ selfPicks, peers: peers.map((p) => ({ name: p.name, picks: p.picks })), scores: weighted.scores, contributions: weighted.contributions, stat: weighted.stat, quadrantOfFirstPick: selfPicks[0] ? quadOf(selfPicks[0]) : null }, null, 1)}
        </pre>
      </Section>
    </div>
  );
}

function Participant({ name, picks }: { name: string; picks: string[] }) {
  const counts = {} as Record<StatKey, number>;
  for (const k of STAT_KEYS) counts[k] = 0;
  for (const id of picks) {
    const card = CARD_BY_ID[id];
    if (card) counts[card.stat]++;
  }
  return (
    <div className="mb-2">
      <div className="text-[10px] text-[var(--purple-glow)]">{name} · {picks.length}개</div>
      <div className="text-[9px] text-[var(--fg)]/70 leading-relaxed">
        {picks.map((id) => {
          const c = CARD_BY_ID[id];
          return c ? `${c.keyword} → ${STATS[c.stat].label} +1` : null;
        }).filter(Boolean).join(" / ") || "없음"}
      </div>
      <div className="text-[9px] text-[var(--fg)]/55">
        합계: {STAT_KEYS.filter((k) => counts[k] > 0).map((k) => `${STATS[k].label} ${counts[k]}`).join(", ") || "-"}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <PixelFrame className="p-3">
      <div className="text-[11px] text-[var(--purple-glow)] mb-2">{title}</div>
      {children}
    </PixelFrame>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 text-[10px]">
      <span className="text-[var(--fg)]/60 shrink-0">{k}</span>
      <span className="text-right break-all">{v}</span>
    </div>
  );
}
