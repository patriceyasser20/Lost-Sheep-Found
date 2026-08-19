import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Cookie-aware client — use for anything that needs to know who's logged in
// (account pages, orders, admin checks). Only callable inside a real
// request (Server Component render, Route Handler, Server Action) — NOT
// safe to call during `next build`'s static page-data collection, since
// cookies() requires an active request scope.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Safe when called from a Server Component.
          }
        }
      }
    }
  );
}

// Cookie-free client — use for public, unauthenticated reads (product
// listings, featured products, categories, anything anonymous visitors and
// build-time prerendering both need). Safe to call anywhere, including
// during static generation, since it never touches cookies()/headers.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}