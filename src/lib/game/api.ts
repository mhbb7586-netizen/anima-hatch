import { toCardIds, toKeywordIds } from "@/lib/game/data";
import {
  addPeerAnswerFn,
  createSessionFn,
  getGlobalStatsFn,
  getSessionFn,
} from "@/lib/game/session.functions";

export type PeerAnswer = { name: string; picks: string[]; created_at: string };

export type SessionData = {
  id: string;
  nickname: string;
  email: string | null;
  self_picks: string[];
  character_id: string;
  created_at: string;
  peers: PeerAnswer[];
};

export type GlobalStats = {
  total_sessions: number;
  characters: { character_id: string; count: number }[];
  keywords: { card_id: string; count: number }[];
};

export async function createSession(
  nickname: string,
  picks: string[],
  characterId: string,
  email?: string,
): Promise<string> {
  return await createSessionFn({
    data: { nickname, email: email?.trim() || undefined, keywordIds: toKeywordIds(picks), characterId },
  });
}

export async function addPeerAnswer(sessionId: string, name: string, picks: string[]) {
  await addPeerAnswerFn({
    data: { sessionId, peerNickname: name, keywordIds: toKeywordIds(picks) },
  });
}

export async function fetchSession(sessionId: string): Promise<SessionData | null> {
  const row = await getSessionFn({ data: { sessionId } });
  if (!row) return null;
  return {
    id: row.id,
    nickname: row.nickname,
    email: row.email,
    self_picks: toCardIds(row.self_keyword_ids ?? []),
    character_id: row.character_id,
    created_at: row.created_at,
    peers: (row.peers ?? []).map((p) => ({
      name: p.peer_nickname,
      picks: toCardIds(p.keyword_ids ?? []),
      created_at: p.created_at,
    })),
  };
}

export async function fetchGlobalStats(): Promise<GlobalStats> {
  const row = await getGlobalStatsFn();
  return {
    total_sessions: row.total_sessions,
    characters: row.characters ?? [],
    keywords: (row.keywords ?? [])
      .map((k) => ({ card_id: toCardIds([k.keyword_id])[0] ?? "", count: k.count }))
      .filter((k) => k.card_id),
  };
}
