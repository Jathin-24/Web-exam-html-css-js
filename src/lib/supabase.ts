import { createClient } from '@supabase/supabase-js';

// Using custom Supabase credentials provided via secrets
// These will be available at runtime through edge functions
// For now, we'll use localStorage as a fallback for development

const SUPABASE_URL = import.meta.env.VITE_CUSTOM_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_CUSTOM_SUPABASE_ANON_KEY || '';

// Check if we have valid Supabase credentials
const hasValidCredentials = SUPABASE_URL && SUPABASE_ANON_KEY;

export const supabase = hasValidCredentials 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const isSupabaseConfigured = hasValidCredentials;
