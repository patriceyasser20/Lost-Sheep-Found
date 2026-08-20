// app/api/admin-ops/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

const db = supabaseAdmin();


async function unwrap<T>(p: PromiseLike<{ data: T | null; error: any }>) {
  const { data, error } = await p;
  if (error) throw new Error(error.message);
  return data;
}

const handlers: Record<string, (payload: any) => Promise<any>> = {
  ping: async () => ({ ok: true }),

  // ---------- products ----------
  'insert-product': (p) => unwrap(db.from('products').insert(p).select().single()),
  'update-product': ({ id, ...rest }) =>
    unwrap(db.from('products').update(rest).eq('id', id).select().single()),
  'delete-product': async ({ id }) => {
    await db.from('product_variants').delete().eq('product_id', id);
    await db.from('customization_options').delete().eq('product_id', id);
    await unwrap(db.from('products').delete().eq('id', id));
    return { deleted: id };
    
  },

  // ---------- variants ----------
  'insert-variants': (rows) => unwrap(db.from('product_variants').insert(rows).select()),
  'update-variant-discount': ({ id, ...rest }) =>
    unwrap(db.from('product_variants').update(rest).eq('id', id).select().single()),
  restock: async ({ variantId, stock }) =>
    unwrap(db.from('product_variants').update({ stock }).eq('id', variantId).select().single()),

  // ---------- collections ----------


  // ---------- promo codes ----------
  'get-promo-codes': async () => {
    const { data, error } = await supabaseAdmin()
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  'insert-promo': async (payload) => {
    const { id, ...rest } = payload;
    const { data, error } = await supabaseAdmin()
      .from('promo_codes')
      .insert({
        code: rest.code,
        discount_pct: rest.discountPct,
        usage_limit: rest.usageLimit,
        expires_at: rest.expiresAt || null,
        active: rest.active,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  'update-promo': async (payload) => {
    const { id, ...rest } = payload;
    const { data, error } = await supabaseAdmin()
      .from('promo_codes')
      .update({
        code: rest.code,
        discount_pct: rest.discountPct,
        usage_limit: rest.usageLimit,
        expires_at: rest.expiresAt || null,
        active: rest.active,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  'delete-promo': async (payload) => {
    const { error } = await supabaseAdmin().from('promo_codes').delete().eq('id', payload.id);
    if (error) throw new Error(error.message);
    return { deleted: payload.id };
  },

  // ---------- shipping ----------
  // 'toggle-country': async ({ code, enabled }) =>
  //   unwrap(db.from('supported_countries').update({ enabled }).eq('code', code).select().single()),
  'upsert-shipping-city': (p) =>
    unwrap(db.from('shipping_cities').upsert(p, { onConflict: 'country_code,city' }).select().single()),
  'get-shipping-cities': async ({ countryCode }) =>
    unwrap(db.from('shipping_cities').select('*').eq('country_code', countryCode).order('city')),

  // ---------- featured (home page) ----------
  'set-featured': (p) =>
    unwrap(db.from('featured_products').upsert(p, { onConflict: 'product_id,section' }).select().single()),
  'unset-featured': async ({ productId, section }) => {
    await unwrap(
      db.from('featured_products').delete().eq('product_id', productId).eq('section', section)
    );
    return { removed: productId };
  },
  'clear-featured': async ({ section }) => {
    await unwrap(db.from('featured_products').delete().eq('section', section));
    return { cleared: section };
  },

  // ---------- offers ----------
  'insert-offer': async ({ id, ...rest }) =>
    unwrap(
      db.from('offers').insert({
        title: rest.title,
        offer_type: rest.offerType,
        buy_qty: rest.buyQty,
        get_qty: rest.getQty,
        discount_pct: rest.discountPct,
        applies_to: rest.appliesTo,
        target_id: rest.targetId || null,
        target_label: rest.targetLabel || null,
        require_same_variant: rest.requireSameVariant,
        banner_text: rest.bannerText || null,
        ends_at: rest.endsAt || null,
        active: rest.active,
      }).select().single()
    ),

  'update-offer': async (payload) => {
    const { id, ...rest } = payload;
    const { data, error } = await supabaseAdmin()
      .from('offers')
      .update({
        title: rest.title,
        offer_type: rest.offerType,
        buy_qty: rest.buyQty,
        get_qty: rest.getQty,
        discount_pct: rest.discountPct,
        applies_to: rest.appliesTo,
        target_id: rest.targetId || null,
        target_label: rest.targetLabel || null,
        require_same_variant: rest.requireSameVariant,
        banner_text: rest.bannerText || null,
        ends_at: rest.endsAt || null,
        active: rest.active,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  'delete-offer': async (payload) => {
    const { error } = await supabaseAdmin().from('offers').delete().eq('id', payload.id);
    if (error) throw new Error(error.message);
    return { deleted: payload.id };
  },

  // ---------- customization options ----------
  'save-customization-options': async ({ productId, options }) => {
    await db.from('customization_options').delete().eq('product_id', productId);
    if (!options.length) return { saved: [] };
    const rows = options.map((o: any, i: number) => ({
      product_id: productId,
      name: o.name,
      type: o.type,
      required: o.required,
      options: o.options,     // jsonb string[]
      sort_order: i,
    }));
    return unwrap(db.from('customization_options').insert(rows).select());
  },
  // ---------- product images ----------
  'save-product-images': async ({ productId, images }) => {
    await db.from('product_images').delete().eq('product_id', productId);
    if (!images?.length) return { saved: [] };
    const rows = images.map((image_url: string, i: number) => ({
      product_id: productId,
      image_url,
      sort_order: i,
    }));
    return unwrap(db.from('product_images').insert(rows).select());
  },
  'delete-customization-options': async ({ productId }) => {
    await unwrap(db.from('customization_options').delete().eq('product_id', productId));
    return { deleted: productId };
  },

  // ---------- newsletter ----------
  'get-subscribers': async () =>
    unwrap(db.from('newsletter_subscribers').select('email, marketing_opt_out')),


   'insert-sku': (p) => unwrap(db.from('product_variants').insert(p).select().single()),
  'update-sku': ({ id, ...rest }) =>
    unwrap(db.from('product_variants').update(rest).eq('id', id).select().single()),
  'delete-sku': async ({ id }) => {
    await unwrap(db.from('product_variants').delete().eq('id', id));
    return { deleted: id };
  },
  'get-skus': async () =>
    unwrap(
      db
        .from('product_variants')
        .select('id, product_id, name, stock, products(name)')
        .order('name')
    ),
  'update-order-status': ({ id, status }) =>
    unwrap(db.from('orders').update({ status }).eq('id', id).select().single()),

  'get-offers': async () =>
  unwrap(db.from('offers').select('*').order('created_at', { ascending: false })),

  'get-orders': async () =>
  unwrap(
    db
      .from('orders')
      .select(`
        id,
        created_at,
        status,
        subtotal,
        delivery_fee,
        discount,
        total,
        city,
        user_id,
        shipping_address,
        order_items (
          quantity,
          unit_price,
          original_price,
          discount_percentage,
          customization,
          products ( name, image_url )
        )
      `)
      .order('created_at', { ascending: false })
  ),
      'get-sale-settings': async () => {
        const { data, error } = await supabaseAdmin()
          .from('sale_settings')
          .select('*')
          .eq('id', 'default')
          .maybeSingle();
        if (error) throw new Error(error.message);
        return data;
      },

  'update-sale-settings': async (payload) => {
      const { data, error } = await supabaseAdmin()
        .from('sale_settings')
        .upsert(
          {
            id: 'default',
            title: payload.title,
            subtitle: payload.subtitle,
            banner_text: payload.banner_text,
            category_slugs: payload.category_slugs,
            discount_pct: payload.discount_pct,
            active: payload.active,
          },
          { onConflict: 'id' }
        )
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },

};

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-admin-token');
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }

  const { action, payload } = await req.json().catch(() => ({ action: null, payload: null }));

  const handler = handlers[action];
  if (!handler) {
    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }

  try {
    const data = await handler(payload);
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    console.error(`admin-ops "${action}" failed:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
