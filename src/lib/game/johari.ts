import { CARD_BY_ID, STAT_KEYS, countByStat, type Card, type StatKey } from "./data";

export type JohariBucket = {
  /** Chosen by me AND by at least one friend. */
  open: Card[];
  /** Chosen by me only — nobody else sees it. */
  hidden: Card[];
  /** Chosen by friends only — my blind spot. */
  blind: Card[];
};

export type PeerLike = { name: string; picks: string[] };

export type JohariResult = JohariBucket & {
  peerCount: number;
  /** 0 = locked (waiting), 1 = partial (1-2 peers), 2 = full (3+ peers). */
  level: 0 | 1 | 2;
  /** How many friends picked each card. */
  peerCountByCard: Record<string, number>;
};

export function computeJohari(selfPicks: string[], peers: PeerLike[]): JohariResult {
  const self = new Set(selfPicks);
  const peerCountByCard: Record<string, number> = {};
  for (const p of peers) {
    for (const id of new Set(p.picks)) {
      peerCountByCard[id] = (peerCountByCard[id] ?? 0) + 1;
    }
  }

  const open: Card[] = [];
  const hidden: Card[] = [];
  const blind: Card[] = [];

  for (const id of selfPicks) {
    const card = CARD_BY_ID[id];
    if (!card) continue;
    if ((peerCountByCard[id] ?? 0) > 0) open.push(card);
    else hidden.push(card);
  }
  for (const id of Object.keys(peerCountByCard)) {
    if (self.has(id)) continue;
    const card = CARD_BY_ID[id];
    if (card) blind.push(card);
  }
  blind.sort((a, b) => (peerCountByCard[b.id]! - peerCountByCard[a.id]!));

  const peerCount = peers.length;
  const level: 0 | 1 | 2 = peerCount === 0 ? 0 : peerCount < 3 ? 1 : 2;

  return { open, hidden, blind, peerCount, level, peerCountByCard };
}

/** Virtue distribution as friends see me. */
export function peerStatCounts(peers: PeerLike[]): Record<StatKey, number> {
  const all = peers.flatMap((p) => p.picks);
  return countByStat(all);
}

export function toPercent(counts: Record<StatKey, number>): Record<StatKey, number> {
  const total = STAT_KEYS.reduce((a, k) => a + counts[k], 0) || 1;
  const out = {} as Record<StatKey, number>;
  for (const k of STAT_KEYS) out[k] = Math.round((counts[k] / total) * 100);
  return out;
}

/* ── Weighted Johari scoring ─────────────────────────────────────────────
 * Open   = self ∩ peers  → weight 3
 * Hidden = self - peers  → weight 2
 * Blind  = peers - self  → weight 1
 * Only the first three peer answers count, so the result is fixed once
 * three friends have replied (revisiting never changes it).
 */
export const WEIGHTS = { open: 3, hidden: 2, blind: 1 } as const;

export type Quadrant = "open" | "hidden" | "blind";

export type WeightedResult = {
  scores: Record<StatKey, number>;
  contributions: Record<StatKey, Record<Quadrant, number>>;
  stat: StatKey;
  dominant: Quadrant;
  message: string;
  peerCount: number;
  usedPeerCount: number;
};

const MESSAGES: Record<Quadrant, string> = {
  open: "나도, 내 곁의 사람들도 인정한 당신의 진짜 모습이에요",
  hidden: "아직 다 드러나지 않았지만, 당신 안에 분명히 있는 모습이에요",
  blind: "당신은 몰랐지만, 곁의 사람들은 이미 알고 있던 모습이에요",
};

function emptyByStat(): Record<StatKey, number> {
  return { wisdom: 0, courage: 0, humanity: 0, justice: 0, temperance: 0, transcendence: 0 };
}

export function weightedResult(selfPicks: string[], peers: PeerLike[]): WeightedResult {
  const used = peers.slice(0, 3);
  const johari = computeJohari(selfPicks, used);

  const contributions = {} as Record<StatKey, Record<Quadrant, number>>;
  for (const k of STAT_KEYS) contributions[k] = { open: 0, hidden: 0, blind: 0 };
  for (const c of johari.open) contributions[c.stat].open++;
  for (const c of johari.hidden) contributions[c.stat].hidden++;
  for (const c of johari.blind) contributions[c.stat].blind++;

  const scores = emptyByStat();
  const openScores = emptyByStat();
  for (const k of STAT_KEYS) {
    const q = contributions[k];
    scores[k] = q.open * WEIGHTS.open + q.hidden * WEIGHTS.hidden + q.blind * WEIGHTS.blind;
    openScores[k] = q.open;
  }

  // Tie-break: higher Open contribution, then the virtue the user picked first.
  const firstPickOrder = emptyByStat();
  for (const k of STAT_KEYS) firstPickOrder[k] = Number.POSITIVE_INFINITY;
  selfPicks.forEach((id, i) => {
    const card = CARD_BY_ID[id];
    if (card && firstPickOrder[card.stat] === Number.POSITIVE_INFINITY) firstPickOrder[card.stat] = i;
  });

  let stat: StatKey = STAT_KEYS[0]!;
  for (const k of STAT_KEYS) {
    if (k === stat) continue;
    const better =
      scores[k] > scores[stat] ||
      (scores[k] === scores[stat] && openScores[k] > openScores[stat]) ||
      (scores[k] === scores[stat] && openScores[k] === openScores[stat] &&
        firstPickOrder[k] < firstPickOrder[stat]);
    if (better) stat = k;
  }

  const q = contributions[stat];
  const weighted: [Quadrant, number][] = [
    ["open", q.open * WEIGHTS.open],
    ["hidden", q.hidden * WEIGHTS.hidden],
    ["blind", q.blind * WEIGHTS.blind],
  ];
  const dominant = weighted.reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  return {
    scores,
    contributions,
    stat,
    dominant,
    message: MESSAGES[dominant],
    peerCount: peers.length,
    usedPeerCount: used.length,
  };
}
