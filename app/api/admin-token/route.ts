import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (!body.token) {
    return NextResponse.json({ error: 'No credentials provided.' }, { status: 400 });
  }

  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(body.token);
  if (userError || !user) {
    console.log('USER LOOKUP FAILED:', userError);
    return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  console.log('ADMIN CHECK:', { userId: user.id, profile, profileError });

  if (profileError || !profile?.is_admin) {
    return NextResponse.json({ error: 'Not an admin.' }, { status: 403 });
  }

  return NextResponse.json({ token: process.env.ADMIN_SECRET });
}
