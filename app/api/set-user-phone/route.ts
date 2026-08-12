import { NextRequest, NextResponse } from 'next/server';

// TODO: wire up once Supabase is available —
//   read the session via createSupabaseServerClient(), then
//   supabase.from('profiles').update({ phone }).eq('id', session.user.id)

export async function POST(req: NextRequest) {
  const { phone } = await req.json().catch(() => ({}));
  if (!phone) {
    return NextResponse.json({ error: 'phone is required.' }, { status: 400 });
  }

  return NextResponse.json({ updated: false, message: 'Not connected to Supabase yet.' });
}
