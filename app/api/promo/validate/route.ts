// app/api/promo/validate/route.ts
//
// POST /api/promo/validate
// Body: { code: string }
// Returns: { valid: boolean, discount: number, message: string }

import { NextRequest, NextResponse } from 'next/server';

const FIRST_ORDER_CODE = 'FIRST10';
const FIRST_ORDER_PCT = 10;

export async function POST(req: NextRequest) {
  // TODO: wire up once Supabase is available —
  //   read the session via createSupabaseServerClient(), require login,
  //   then check the promo_usage table so each user can only use FIRST10 once.

  const body = await req.json().catch(() => ({}));
  const code: string = (body.code ?? '').trim().toUpperCase();

  if (code !== FIRST_ORDER_CODE) {
    return NextResponse.json({ valid: false, discount: 0, message: 'Invalid promo code.' });
  }

  return NextResponse.json({
    valid: true,
    discount: FIRST_ORDER_PCT,
    message: `${FIRST_ORDER_PCT}% off applied to your first order!`,
  });
}
