-- Migration: align kb_faqs table with current FAQ JSON schema and seeder
-- Run in Supabase Dashboard → SQL Editor
-- Safe: uses ADD COLUMN IF NOT EXISTS, preserves all existing data

ALTER TABLE public.kb_faqs
  ADD COLUMN IF NOT EXISTS section text,
  ADD COLUMN IF NOT EXISTS area    text;

-- Verify final column set matches seeder payload:
-- id, question, answer, category, section, area, tags, searchable_content, metadata, source, created_at
