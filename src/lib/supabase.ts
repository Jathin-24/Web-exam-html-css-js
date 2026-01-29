import { createClient } from '@supabase/supabase-js';

// Using custom Supabase credentials provided via environment variables
const SUPABASE_URL = import.meta.env.VITE_CUSTOM_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_CUSTOM_SUPABASE_ANON_KEY || '';

// Check if we have valid Supabase credentials
const hasValidCredentials = SUPABASE_URL && SUPABASE_ANON_KEY;

// Log configuration status
if (hasValidCredentials) {
  console.log('✓ Supabase configured');
  console.log('  URL:', SUPABASE_URL.substring(0, 30) + '...');
  console.log('  Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...');
} else {
  console.warn('⚠ Supabase NOT configured');
  console.warn('  Missing:', [
    !SUPABASE_URL ? 'VITE_CUSTOM_SUPABASE_URL' : '',
    !SUPABASE_ANON_KEY ? 'VITE_CUSTOM_SUPABASE_ANON_KEY' : ''
  ].filter(Boolean).join(', '));
}

export const supabase = hasValidCredentials 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const isSupabaseConfigured = hasValidCredentials;

