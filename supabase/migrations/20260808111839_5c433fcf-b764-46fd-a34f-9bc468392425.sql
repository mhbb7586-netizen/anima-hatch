REVOKE ALL ON FUNCTION public.create_session(text, text[], text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.add_peer_answer(uuid, text, text[]) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_session(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_global_stats() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_session(text, text[], text) TO service_role;
GRANT EXECUTE ON FUNCTION public.add_peer_answer(uuid, text, text[]) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_session(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_global_stats() TO service_role;