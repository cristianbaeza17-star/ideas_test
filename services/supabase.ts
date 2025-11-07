// Fix: Added a triple-slash directive to include Vite's client types. This is necessary for TypeScript to recognize `import.meta.env` and prevent type errors.
/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

// IMPORTANTE: Variables de Entorno para Vite
// 1. Crea un archivo llamado .env en la raíz de tu proyecto.
// 2. Añade tus credenciales de Supabase al archivo .env de esta forma:
//    VITE_SUPABASE_URL=TU_URL_DE_SUPABASE
//    VITE_SUPABASE_ANON_KEY=TU_LLAVE_ANON_DE_SUPABASE
// 3. Vercel: Configura estas variables de entorno en los ajustes de tu proyecto en el panel de Vercel.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; 
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file or deployment environment.");
}


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