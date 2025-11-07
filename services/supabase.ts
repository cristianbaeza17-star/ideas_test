
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

// IMPORTANT: 
// 1. Create a new project at https://supabase.com/
// 2. Go to your project's "Project Settings" > "API"
// 3. Find your "Project URL" and "Project API Keys" (use the anon, public one)
// 4. Paste them here.
const supabaseUrl = process.env.SUPABASE_URL || 'https://fjddlslynjxoesahiiux.supabase.co'; 
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZGRsc2x5bmp4b2VzYWhpaXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTY1MzksImV4cCI6MjA3ODA3MjUzOX0.4QPdcHByRjXmgjqRNqqu0VHPHMDvJQ0HNTbyxYKzdhY';

// In your Supabase project, run this SQL to create the 'ideas' table:
/*
  CREATE TABLE public.ideas (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    content text NULL,
    user_id uuid NULL DEFAULT auth.uid(),
    CONSTRAINT ideas_pkey PRIMARY KEY (id),
    CONSTRAINT ideas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
  );

  -- Enable Row Level Security (RLS)
  ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

  -- Policy: Users can only see their own ideas
  CREATE POLICY "Enable read access for own ideas" ON public.ideas
  AS PERMISSIVE FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

  -- Policy: Users can insert ideas for themselves
  CREATE POLICY "Enable insert for own ideas" ON public.ideas
  AS PERMISSIVE FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
*/


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
