import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase URL and Anon Key from environment variables
// Supports both standard SUPABASE_URL and VITE_SUPABASE_URL out of the box
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl !== 'https://your-supabase-project-id.supabase.co' &&
  supabaseAnonKey && 
  supabaseAnonKey !== 'your-supabase-anon-key-here'
);

// Create a singleton Supabase client instance
// If credentials are not set, create with fallback strings to prevent immediate fatal crashes, allowing clean UI warnings
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
