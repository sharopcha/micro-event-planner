-- Migration: Add 'venue' to addon_category enum
-- Created at: 2025-12-18 01:25:22

-- We use ALTER TYPE to add the value. 
-- Note: This command cannot be run inside a transaction block in some Postgres versions, 
-- but Supabase migrations usually handle this. If it fails, it might need to be run manually or separated.

DO $$
BEGIN
    ALTER TYPE addon_category ADD VALUE IF NOT EXISTS 'venue';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
