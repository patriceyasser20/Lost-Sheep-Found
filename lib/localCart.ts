// lib/localCart.ts

export type CartLine = {
  lineId: string;      // unique per product+selections combo
  id: string;           // product id
  qty: number;
  selections?: Record<string, any>;
};

const CART_KEY = 'lsf_cart';
const WISHLIST_KEY = 'lsf_wishlist';

// Stable stringify so key order doesn't create false-different keys.
function selectionsKey(selections?: Record<string, any>): string {
  if (!selections || Object.keys(selections).length === 0) return '';
  const sorted = Object.keys(selections)
    .sort()
    .reduce((acc, k) => {
      acc[k] = selections[k];
      return acc;
    }, {} as Record<string, any>);
  return JSON.stringify(sorted);
}

function makeLineId(id: string, selections?: Record<string, any>): string {
  const key = selectionsKey(selections);
  return key ? `${id}::${key}` : id;
}

export function getCart(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

export function setCart(cart: CartLine[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(id: string, qty: number = 1, selections?: Record<string, any>) {
  const cart = getCart();
  const lineId = makeLineId(id, selections);
  const existing = cart.find((l) => l.lineId === lineId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ lineId, id, qty, selections });
  }
  setCart(cart);
}

export function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  } catch {
    return [];
  }
}

export function setWishlist(list: string[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

export function addToWishlist(id: string) {
  const list = getWishlist();
  if (!list.includes(id)) {
    setWishlist([...list, id]);
  }
}