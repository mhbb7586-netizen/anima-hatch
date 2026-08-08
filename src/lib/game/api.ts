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
): Promise<string> {
  return await createSessionFn({ data: { nickname, picks, characterId } });
}

export async function addPeerAnswer(sessionId: string, name: string, picks: string[]) {
  await addPeerAnswerFn({ data: { sessionId, name, picks } });
}

export async function fetchSession(sessionId: string): Promise<SessionData | null> {
  return (await getSessionFn({ data: { sessionId } })) as SessionData | null;
}

export async function fetchGlobalStats(): Promise<GlobalStats> {
  return (await getGlobalStatsFn()) as GlobalStats;
}

