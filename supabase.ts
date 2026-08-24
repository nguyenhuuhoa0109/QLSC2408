import { createClient, SupabaseClient } from '@supabase/supabase-js';

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('CUSTOM_SUPABASE_URL') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('CUSTOM_SUPABASE_ANON_KEY') : null;

const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export let SUPABASE_URL = storedUrl || envUrl || 'https://pmesvcogcutfgvrjaaxj.supabase.co';
export let SUPABASE_ANON_KEY = storedKey || envKey || 'sb_publishable_qvqOXWQY6ojjXT4oDzSx-A_8_kJXn5o';

export function createSupabaseInstance(url: string, key: string): SupabaseClient {
  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

// Initialize Supabase Client
export let supabase = createSupabaseInstance(SUPABASE_URL, SUPABASE_ANON_KEY);

export function updateSupabaseCredentials(url: string, key: string) {
  SUPABASE_URL = url.trim();
  SUPABASE_ANON_KEY = key.trim();
  if (typeof window !== 'undefined') {
    localStorage.setItem('CUSTOM_SUPABASE_URL', SUPABASE_URL);
    localStorage.setItem('CUSTOM_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY);
  }
  supabase = createSupabaseInstance(SUPABASE_URL, SUPABASE_ANON_KEY);
}
