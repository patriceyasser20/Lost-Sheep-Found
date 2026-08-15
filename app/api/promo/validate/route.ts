// app/api/promo/validate/route.ts
//
// POST /api/promo/validate
// Body: { code: string }
// Returns: { valid: boolean, discount: number, freeDelivery: boolean, message: string }

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const code: string = (body.code ?? '').trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ valid: false, discount: 0, freeDelivery: false, message: 'Enter a promo code.' });
  }

  const db = supabaseAdmin();
  const { data: promo, error } = await db
    .from('promo_codes')
    .select('code, discount_pct, usage_limit, used_count, expires_at, active, free_delivery')
    .ilike('code', code)
    .maybeSingle();

  if (error || !promo) {
    return NextResponse.json({ valid: false, discount: 0, freeDelivery: false, message: 'Invalid promo code.' });
  }

  if (!promo.active) {
    return NextResponse.json({ valid: false, discount: 0, freeDelivery: false, message: 'This promo code is no longer active.' });
  }

  if (promo.expires_at) {
    const today = new Date().toISOString().slice(0, 10);
    if (promo.expires_at < today) {
      return NextResponse.json({ valid: false, discount: 0, freeDelivery: false, message: 'This promo code has expired.' });
    }
  }

  // usage_limit of 0 (or unset) is treated as unlimited.
  if (promo.usage_limit > 0 && promo.used_count >= promo.usage_limit) {
    return NextResponse.json({ valid: false, discount: 0, freeDelivery: false, message: 'This promo code has reached its usage limit.' });
  }

  return NextResponse.json({
    valid: true,
    discount: promo.discount_pct,
    freeDelivery: !!promo.free_delivery,
    message: promo.free_delivery
      ? `${promo.discount_pct}% off + free delivery applied!`
      : `${promo.discount_pct}% off applied!`,
  });
}