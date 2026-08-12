import { NextRequest, NextResponse } from 'next/server';

// TODO: wire up once Supabase is available.
//
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );
//
// Path A: body.token is a Supabase session access token (OAuth/email login)
// Path B: body.email + body.password (fallback)
// Either way, resolve a user id, check profiles.is_admin, and return
// process.env.ADMIN_SECRET if they qualify.

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (!body.token && !(body.email && body.password)) {
    return NextResponse.json({ error: 'No credentials provided.' }, { status: 400 });
  }

  return NextResponse.json(
    { error: 'Admin auth is not configured yet. Connect Supabase to enable the admin panel.' },
    { status: 501 }
  );
}
