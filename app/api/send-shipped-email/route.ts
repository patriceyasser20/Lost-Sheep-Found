import { NextRequest, NextResponse } from 'next/server';
import { resend, FROM_ADDRESS } from '../../../lib/resend';

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-admin-token');
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }

  const { order } = await req.json().catch(() => ({}));
  if (!order?.contact_email && !order?.user_email) {
    return NextResponse.json({ error: 'No recipient email on this order.' }, { status: 400 });
  }

  const to = order.contact_email || order.user_email;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Your order is on its way — Lost Sheep Found`,
    html: `
      <div style="font-family: Georgia, serif; color:#4c3c2e; max-width:480px; margin:auto;">
        <p style="color:#a18a69; letter-spacing:.2em; font-size:11px; text-transform:uppercase;">Order shipped</p>
        <h2>Your order is on its way</h2>
        <p>Order #${order.id?.slice(0, 8)} has shipped and should arrive soon.</p>
      </div>
    `,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sent: true });
}