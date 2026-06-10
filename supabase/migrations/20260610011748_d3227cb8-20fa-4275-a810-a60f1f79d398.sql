
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- ad_sessions is service-role only; add explicit deny policy to satisfy linter
CREATE POLICY "No client access to ad_sessions" ON public.ad_sessions FOR SELECT TO authenticated USING (false);
