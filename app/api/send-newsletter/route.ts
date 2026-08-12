import { NextRequest, NextResponse } from 'next/server';

// TODO: wire up an email provider (Resend, Postmark, SES, ...) and pull
// subscriber addresses from Supabase. Gated the same way as admin-ops.

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-admin-token');
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }

  const { subject, body } = await req.json().catch(() => ({}));
  if (!subject || !body) {
    return NextResponse.json({ error: 'subject and body are required.' }, { status: 400 });
  }

  return NextResponse.json({ sent: 0, message: 'Newsletter sending is not configured yet.' });
}
