// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

// Service-role client — bypasses RLS. Server-only, never import this
// from a 'use client' file or expose the key with NEXT_PUBLIC_.
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'supabaseAdmin: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'
    );
  }

  return createClient(url, key);
}