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
