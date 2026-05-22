-- Run in Supabase Dashboard → SQL Editor
-- Fixes: permission denied for table kb_* (missing GRANTs on service_role / anon)

GRANT SELECT, INSERT, UPDATE, DELETE ON public.kb_services TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kb_courses TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kb_events TO service_role;

GRANT SELECT ON public.kb_services TO anon;
GRANT SELECT ON public.kb_courses TO anon;
GRANT SELECT ON public.kb_events TO anon;

-- If tables use serial/identity columns, also run:
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
