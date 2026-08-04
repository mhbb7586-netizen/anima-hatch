CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL DEFAULT '',
  self_picks text[] NOT NULL DEFAULT '{}',
  character_id text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.peer_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  picks text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX peer_answers_session_id_idx ON public.peer_answers(session_id);

GRANT ALL ON public.sessions TO service_role;
GRANT ALL ON public.peer_answers TO service_role;

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_answers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.create_session(p_nickname text, p_picks text[], p_character_id text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE new_id uuid;
BEGIN
  IF array_length(p_picks, 1) IS NULL OR array_length(p_picks, 1) < 5 OR array_length(p_picks, 1) > 15 THEN
    RAISE EXCEPTION 'picks must contain between 5 and 15 items';
  END IF;
  INSERT INTO public.sessions (nickname, self_picks, character_id)
  VALUES (left(coalesce(p_nickname, ''), 20), p_picks, left(coalesce(p_character_id, ''), 20))
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_peer_answer(p_session_id uuid, p_name text, p_picks text[])
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE cnt int;
BEGIN
  IF array_length(p_picks, 1) IS NULL OR array_length(p_picks, 1) < 5 OR array_length(p_picks, 1) > 15 THEN
    RAISE EXCEPTION 'picks must contain between 5 and 15 items';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.sessions WHERE id = p_session_id) THEN
    RAISE EXCEPTION 'session not found';
  END IF;
  SELECT count(*) INTO cnt FROM public.peer_answers WHERE session_id = p_session_id;
  IF cnt >= 20 THEN
    RAISE EXCEPTION 'too many answers';
  END IF;
  INSERT INTO public.peer_answers (session_id, name, picks)
  VALUES (p_session_id, left(coalesce(p_name, ''), 20), p_picks);
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_session(p_session_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'id', s.id,
    'nickname', s.nickname,
    'self_picks', to_jsonb(s.self_picks),
    'character_id', s.character_id,
    'created_at', s.created_at,
    'peers', coalesce((
      SELECT jsonb_agg(jsonb_build_object('name', p.name, 'picks', to_jsonb(p.picks), 'created_at', p.created_at) ORDER BY p.created_at)
      FROM public.peer_answers p WHERE p.session_id = s.id
    ), '[]'::jsonb)
  )
  FROM public.sessions s WHERE s.id = p_session_id;
$$;

CREATE OR REPLACE FUNCTION public.get_global_stats()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'total_sessions', (SELECT count(*) FROM public.sessions WHERE character_id <> ''),
    'characters', coalesce((
      SELECT jsonb_agg(jsonb_build_object('character_id', c.character_id, 'count', c.n) ORDER BY c.n DESC)
      FROM (
        SELECT character_id, count(*) AS n FROM public.sessions WHERE character_id <> '' GROUP BY character_id
      ) c
    ), '[]'::jsonb),
    'keywords', coalesce((
      SELECT jsonb_agg(jsonb_build_object('card_id', k.card_id, 'count', k.n) ORDER BY k.n DESC)
      FROM (
        SELECT unnest(self_picks) AS card_id, count(*) AS n FROM public.sessions GROUP BY 1
      ) k
    ), '[]'::jsonb)
  );
$$;

GRANT EXECUTE ON FUNCTION public.create_session(text, text[], text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_peer_answer(uuid, text, text[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_session(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_global_stats() TO anon, authenticated;