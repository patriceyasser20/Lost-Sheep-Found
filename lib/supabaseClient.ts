// lib/supabaseClient.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

// Singleton browser client — this is what callback/confirm/login/signup
// are actually importing (`{ supabaseClient }`), so it needs to exist
// as a real export, not just the factory.
export const supabaseClient = createClient();