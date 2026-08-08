import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type PeerAnswerRow = { name: string; picks: string[]; created_at: string };
type SessionRow = {
  id: string;
  nickname: string;
  self_picks: string[];
  character_id: string;
  created_at: string;
  peers: PeerAnswerRow[];
};
type GlobalStatsRow = {
  total_sessions: number;
  characters: { character_id: string; count: number }[];
  keywords: { card_id: string; count: number }[];
};

const picksSchema = z.array(z.string().min(1).max(64)).min(5).max(15);
const nameSchema = z.string().max(20);

const createInput = z.object({
  nickname: nameSchema,
  picks: picksSchema,
  characterId: z.string().max(20),
});

const peerInput = z.object({
  sessionId: z.string().uuid(),
  name: nameSchema,
  picks: picksSchema,
});

const sessionInput = z.object({ sessionId: z.string().uuid() });

export const createSessionFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: id, error } = await (
      supabaseAdmin as unknown as {
        rpc: (
          fn: string,
          args?: Record<string, unknown>,
        ) => Promise<{ data: unknown; error: { message: string } | null }>;
      }
    ).rpc("create_session", {
      p_nickname: data.nickname,
      p_picks: data.picks,
      p_character_id: data.characterId,
    });
    if (error) throw new Error("세션을 생성하지 못했어요.");
    return id as string;
  });

export const addPeerAnswerFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => peerInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (
      supabaseAdmin as unknown as {
        rpc: (
          fn: string,
          args?: Record<string, unknown>,
        ) => Promise<{ data: unknown; error: { message: string } | null }>;
      }
    ).rpc("add_peer_answer", {
      p_session_id: data.sessionId,
      p_name: data.name,
      p_picks: data.picks,
    });
    if (error) throw new Error("응답을 저장하지 못했어요.");
    return { ok: true };
  });

export const getSessionFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: session, error } = await (
      supabaseAdmin as unknown as {
        rpc: (
          fn: string,
          args?: Record<string, unknown>,
        ) => Promise<{ data: unknown; error: { message: string } | null }>;
      }
    ).rpc("get_session", { p_session_id: data.sessionId });
    if (error) throw new Error("결과를 불러오지 못했어요.");
    return (session ?? null) as SessionRow | null;
  });

export const getGlobalStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await (
    supabaseAdmin as unknown as {
      rpc: (
        fn: string,
        args?: Record<string, unknown>,
      ) => Promise<{ data: unknown; error: { message: string } | null }>;
    }
  ).rpc("get_global_stats");
  if (error) throw new Error("통계를 불러오지 못했어요.");
  return data as GlobalStatsRow;
});
