import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// TODO: wire up Supabase once available —
//   const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
//   then mark the matching order as paid/failed based on obj.success.

// Paymob's HMAC covers these exact fields, in this exact order — fixed by
// Paymob's spec, not something to reorder.
const HMAC_FIELDS = [
  'amount_cents', 'created_at', 'currency', 'error_occured',
  'has_parent_transaction', 'id', 'integration_id', 'is_3d_secure',
  'is_auth', 'is_capture', 'is_refunded', 'is_standalone_payment',
  'is_voided', 'order.id', 'owner', 'pending', 'source_data.pan',
  'source_data.sub_type', 'source_data.type', 'success',
];

function getNested(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function verifyHmac(obj: any, receivedHmac: string): boolean {
  if (!process.env.PAYMOB_HMAC_SECRET) return false;
  const concatenated = HMAC_FIELDS.map((field) => String(getNested(obj, field))).join('');
  const computed = crypto
    .createHmac('sha512', process.env.PAYMOB_HMAC_SECRET)
    .update(concatenated)
    .digest('hex');
  return computed === receivedHmac;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const receivedHmac = req.nextUrl.searchParams.get('hmac');
  const obj = body?.obj;

  if (!obj || !receivedHmac || !verifyHmac(obj, receivedHmac)) {
    console.error('Paymob webhook: HMAC verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // TODO: look up the order by obj.order.id and update its status.
  console.log('Paymob webhook verified for order', obj.order?.id, 'success:', obj.success);

  return NextResponse.json({ received: true });
}
