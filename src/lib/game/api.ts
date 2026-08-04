import { supabase } from "@/integrations/supabase/client";

/** The generated types file has no RPC signatures, so call through a narrow shim. */
const db = supabase as unknown as {
  rpc: (
    fn: string,
    args?: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

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
  const { data, error } = await db.rpc("create_session", {
    p_nickname: nickname,
    p_picks: picks,
    p_character_id: characterId,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

export async function addPeerAnswer(sessionId: string, name: string, picks: string[]) {
  const { error } = await db.rpc("add_peer_answer", {
    p_session_id: sessionId,
    p_name: name,
    p_picks: picks,
  });
  if (error) throw new Error(error.message);
}

export async function fetchSession(sessionId: string): Promise<SessionData | null> {
  const { data, error } = await db.rpc("get_session", { p_session_id: sessionId });
  if (error) throw new Error(error.message);
  return (data as SessionData | null) ?? null;
}

export async function fetchGlobalStats(): Promise<GlobalStats> {
  const { data, error } = await db.rpc("get_global_stats");
  if (error) throw new Error(error.message);
  return data as GlobalStats;
}
