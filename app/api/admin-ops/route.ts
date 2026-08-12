import { NextRequest, NextResponse } from 'next/server';

// TODO: replace with a real Supabase service-role client once credentials
// are available, and validate req headers['x-admin-token'] against it.
//
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );



const handlers: Record<string, (payload: any) => Promise<any>> = {
  'insert-product': async (payload) => ({ inserted: payload }),
  'update-product': async (payload) => ({ updated: payload }),
  'delete-product': async (payload) => ({ deleted: payload.id }),
  restock: async (payload) => ({ restocked: payload }),
  'insert-promo': async (payload) => ({ inserted: payload }),
  'update-promo': async (payload) => ({ updated: payload }),
  'delete-promo': async (payload) => ({ deleted: payload.id }),
  'toggle-country': async (payload) => ({ toggled: payload }),
  'upsert-shipping-city': async (payload) => ({ upserted: payload }),
  'set-featured': async (payload) => ({ featured: payload }),
  'get-shipping-cities': async (payload) => ({ data: [] }),
  'insert-offer': async (payload) => ({ inserted: payload }),
  'update-offer': async (payload) => ({ updated: payload }),
  'delete-offer': async (payload) => ({ deleted: payload.id }),
  'insert-sku': async (payload) => ({ inserted: payload }),
  'update-sku': async (payload) => ({ updated: payload }),
  'delete-sku': async (payload) => ({ deleted: payload.id }),
  'update-order-status': async (payload) => ({ updated: payload }),
  'insert-customization-options': async (payload) => ({ saved: payload }),
  'delete-customization-options-for-product': async (payload) => ({ deleted: payload.productId }),
};

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-admin-token');
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }

  const { action, payload } = await req.json();
  const handler = handlers[action];
  if (!handler) {
    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }

  try {
    const data = await handler(payload);
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Admin operation failed.' }, { status: 500 });
  }
}
