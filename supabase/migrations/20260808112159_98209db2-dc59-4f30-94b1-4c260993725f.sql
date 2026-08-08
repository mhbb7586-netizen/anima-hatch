-- sessions: add optional email, drop legacy picks column
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.sessions DROP COLUMN IF EXISTS self_picks;

-- self_answers
CREATE TABLE IF NOT EXISTS public.self_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  keyword_ids integer[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS self_answers_session_id_key ON public.self_answers(session_id);
GRANT ALL ON public.self_answers TO service_role;
ALTER TABLE public.self_answers ENABLE ROW LEVEL SECURITY;

-- peer_answers: rename/replace columns
ALTER TABLE public.peer_answers RENAME COLUMN name TO peer_nickname;
ALTER TABLE public.peer_answers DROP COLUMN IF EXISTS picks;
ALTER TABLE public.peer_answers ADD COLUMN IF NOT EXISTS keyword_ids integer[] NOT NULL DEFAULT '{}';
CREATE INDEX IF NOT EXISTS peer_answers_session_id_idx ON public.peer_answers(session_id);

-- Rewrite the RPCs against the new shape (service_role only)
DROP FUNCTION IF EXISTS public.create_session(text, text[], text);
DROP FUNCTION IF EXISTS public.add_peer_answer(uuid, text, text[]);
DROP FUNCTION IF EXISTS public.get_session(uuid);
DROP FUNCTION IF EXISTS public.get_global_stats();

CREATE FUNCTION public.create_session(p_nickname text, p_email text, p_keyword_ids integer[], p_character_id text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE new_id uuid;
BEGIN
  IF array_length(p_keyword_ids, 1) IS NULL OR array_length(p_keyword_ids, 1) < 5 OR array_length(p_keyword_ids, 1) > 15 THEN
    RAISE EXCEPTION 'keyword_ids must contain between 5 and 15 items';
  END IF;
  INSERT INTO public.sessions (nickname, email, character_id)
  VALUES (left(coalesce(p_nickname, ''), 20), nullif(left(coalesce(p_email, ''), 254), ''), left(coalesce(p_character_id, ''), 20))
  RETURNING id INTO new_id;
  INSERT INTO public.self_answers (session_id, keyword_ids) VALUES (new_id, p_keyword_ids);
  RETURN new_id;
END;
$$;

CREATE FUNCTION public.add_peer_answer(p_session_id uuid, p_peer_nickname text, p_keyword_ids integer[])
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE cnt int;
BEGIN
  IF array_length(p_keyword_ids, 1) IS NULL OR array_length(p_keyword_ids, 1) < 5 OR array_length(p_keyword_ids, 1) > 15 THEN
    RAISE EXCEPTION 'keyword_ids must contain between 5 and 15 items';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.sessions WHERE id = p_session_id) THEN
    RAISE EXCEPTION 'session not found';
  END IF;
  SELECT count(*) INTO cnt FROM public.peer_answers WHERE session_id = p_session_id;
  IF cnt >= 20 THEN
    RAISE EXCEPTION 'too many answers';
  END IF;
  INSERT INTO public.peer_answers (session_id, peer_nickname, keyword_ids)
  VALUES (p_session_id, left(coalesce(p_peer_nickname, ''), 20), p_keyword_ids);
  RETURN true;
END;
$$;

CREATE FUNCTION public.get_session(p_session_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT jsonb_build_object(
    'id', s.id,
    'nickname', s.nickname,
    'email', s.email,
    'self_keyword_ids', coalesce((SELECT to_jsonb(a.keyword_ids) FROM public.self_answers a WHERE a.session_id = s.id), '[]'::jsonb),
    'character_id', s.character_id,
    'created_at', s.created_at,
    'peers', coalesce((
      SELECT jsonb_agg(jsonb_build_object('peer_nickname', p.peer_nickname, 'keyword_ids', to_jsonb(p.keyword_ids), 'created_at', p.created_at) ORDER BY p.created_at)
      FROM public.peer_answers p WHERE p.session_id = s.id
    ), '[]'::jsonb)
  )
  FROM public.sessions s WHERE s.id = p_session_id;
$$;

CREATE FUNCTION public.get_global_stats()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT jsonb_build_object(
    'total_sessions', (SELECT count(*) FROM public.sessions WHERE character_id <> ''),
    'characters', coalesce((
      SELECT jsonb_agg(jsonb_build_object('character_id', c.character_id, 'count', c.n) ORDER BY c.n DESC)
      FROM (SELECT character_id, count(*) AS n FROM public.sessions WHERE character_id <> '' GROUP BY character_id) c
    ), '[]'::jsonb),
    'keywords', coalesce((
      SELECT jsonb_agg(jsonb_build_object('keyword_id', k.keyword_id, 'count', k.n) ORDER BY k.n DESC)
      FROM (SELECT unnest(keyword_ids) AS keyword_id, count(*) AS n FROM public.self_answers GROUP BY 1) k
    ), '[]'::jsonb)
  );
$$;

REVOKE ALL ON FUNCTION public.create_session(text, text, integer[], text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.add_peer_answer(uuid, text, integer[]) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_session(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_global_stats() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_session(text, text, integer[], text) TO service_role;
GRANT EXECUTE ON FUNCTION public.add_peer_answer(uuid, text, integer[]) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_session(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_global_stats() TO service_role;