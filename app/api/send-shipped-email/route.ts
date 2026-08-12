import { NextRequest, NextResponse } from 'next/server';

// TODO: wire up an email provider + Supabase order lookup.
// Called from the admin panel when an order's status flips to "shipped".

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-admin-token');
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }

  const { orderId } = await req.json().catch(() => ({}));
  if (!orderId) {
    return NextResponse.json({ error: 'orderId is required.' }, { status: 400 });
  }

  return NextResponse.json({ sent: false, message: 'Shipping emails are not configured yet.' });
}
