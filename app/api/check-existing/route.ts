import { NextRequest, NextResponse } from 'next/server';

// TODO: wire up once Supabase is available —
//   const { data } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
// Returning `false` always for now so the signup form isn't blocked in dev.

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({ email: '' }));
  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  return NextResponse.json({ exists: false });
}
