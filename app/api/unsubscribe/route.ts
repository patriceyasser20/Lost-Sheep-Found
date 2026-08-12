import { NextRequest, NextResponse } from 'next/server';

// TODO: wire up once Supabase is available —
//   supabase.from('newsletter_subscribers').delete().eq('token', token)

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Missing unsubscribe token.' }, { status: 400 });
  }

  return NextResponse.json({ unsubscribed: false, message: 'Not connected to Supabase yet.' });
}
