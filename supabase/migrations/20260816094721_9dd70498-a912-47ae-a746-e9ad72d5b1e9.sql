-- 1) Reset all recorded data (fresh statistics start)
DELETE FROM public.peer_answers;
DELETE FROM public.self_answers;
DELETE FROM public.sessions;

-- 2) Remove email storage
DROP FUNCTION IF EXISTS public.create_session(text, text, integer[], text);
ALTER TABLE public.sessions DROP COLUMN IF EXISTS email;

CREATE FUNCTION public.create_session(p_nickname text, p_keyword_ids integer[], p_character_id text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE new_id uuid;
BEGIN
  IF array_length(p_keyword_ids, 1) IS NULL OR array_length(p_keyword_ids, 1) < 5 OR array_length(p_keyword_ids, 1) > 15 THEN
    RAISE EXCEPTION 'keyword_ids must contain between 5 and 15 items';
  END IF;
  INSERT INTO public.sessions (nickname, character_id)
  VALUES (left(coalesce(p_nickname, ''), 20), left(coalesce(p_character_id, ''), 20))
  RETURNING id INTO new_id;
  INSERT INTO public.self_answers (session_id, keyword_ids) VALUES (new_id, p_keyword_ids);
  RETURN new_id;
END;
$$;

-- 3) Hard cap of 3 peer answers per session, enforced server-side
CREATE OR REPLACE FUNCTION public.add_peer_answer(p_session_id uuid, p_peer_nickname text, p_keyword_ids integer[])
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE cnt int;
BEGIN
  IF array_length(p_keyword_ids, 1) IS NULL OR array_length(p_keyword_ids, 1) < 5 OR array_length(p_keyword_ids, 1) > 15 THEN
    RAISE EXCEPTION 'keyword_ids must contain between 5 and 15 items';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.sessions WHERE id = p_session_id) THEN
    RAISE EXCEPTION 'session not found';
  END IF;
  -- lock the session row so concurrent submissions cannot exceed the cap
  PERFORM 1 FROM public.sessions WHERE id = p_session_id FOR UPDATE;
  SELECT count(*) INTO cnt FROM public.peer_answers WHERE session_id = p_session_id;
  IF cnt >= 3 THEN
    RAISE EXCEPTION 'session full';
  END IF;
  INSERT INTO public.peer_answers (session_id, peer_nickname, keyword_ids)
  VALUES (p_session_id, left(coalesce(p_peer_nickname, ''), 20), p_keyword_ids);
  RETURN true;
END;
$$;

-- 4) get_session without email, with peer_count / closed flag
CREATE OR REPLACE FUNCTION public.get_session(p_session_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT jsonb_build_object(
    'id', s.id,
    'nickname', s.nickname,
    'self_keyword_ids', coalesce((SELECT to_jsonb(a.keyword_ids) FROM public.self_answers a WHERE a.session_id = s.id), '[]'::jsonb),
    'character_id', s.character_id,
    'created_at', s.created_at,
    'peer_count', (SELECT count(*) FROM public.peer_answers p WHERE p.session_id = s.id),
    'closed', ((SELECT count(*) FROM public.peer_answers p WHERE p.session_id = s.id) >= 3),
    'peers', coalesce((
      SELECT jsonb_agg(jsonb_build_object('peer_nickname', p.peer_nickname, 'keyword_ids', to_jsonb(p.keyword_ids), 'created_at', p.created_at) ORDER BY p.created_at)
      FROM public.peer_answers p WHERE p.session_id = s.id
    ), '[]'::jsonb)
  )
  FROM public.sessions s WHERE s.id = p_session_id;
$$;

REVOKE ALL ON FUNCTION public.create_session(text, integer[], text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.add_peer_answer(uuid, text, integer[]) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_session(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_session(text, integer[], text) TO service_role;
GRANT EXECUTE ON FUNCTION public.add_peer_answer(uuid, text, integer[]) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_session(uuid) TO service_role;