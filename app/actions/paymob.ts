'use server';

// TODO: wire up once Supabase + Paymob credentials are available.
// Mirrors the reference repo's app/actions/paymob.ts shape so the checkout
// page can call this directly without changing its call site later.

const PAYMOB_BASE = 'https://accept.paymob.com/api';
const FIRST_ORDER_CODE = 'FIRST10';

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
}

interface CartLineInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Step 1: auth → Step 2: register order → Step 3: request a payment key →
// return the iframe URL the client redirects to. Left unimplemented here —
// throwing is intentional so a misconfigured env fails loudly in dev
// rather than silently no-opping at checkout.
export async function createPaymobPayment(
  total: number,
  items: CartLineInput[],
  orderId: string,
  billing: BillingInfo,
  promoCode?: string,
  discountPct?: number
): Promise<{ iframeUrl: string }> {
  if (!process.env.PAYMOB_API_KEY) {
    throw new Error(
      'Paymob is not configured yet. Set PAYMOB_API_KEY, PAYMOB_INTEGRATION_ID, ' +
        'and PAYMOB_IFRAME_ID in your environment to enable checkout.'
    );
  }

  // const authRes = await fetch(`${PAYMOB_BASE}/auth/tokens`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
  // });
  // ...register order, request payment key, build iframe URL...

  throw new Error('createPaymobPayment: not yet implemented.');
}
