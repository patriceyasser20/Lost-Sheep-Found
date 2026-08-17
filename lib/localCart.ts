// lib/localCart.ts

export type CartLine = {
  lineId: string;      // now just equals the product id — one line per product
  id: string;           // product id
  qty: number;
  selections?: Record<string, any>;
};

const CART_KEY = 'lsf_cart';
const WISHLIST_KEY = 'lsf_wishlist';

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
  window.dispatchEvent(new Event('cart-updated'));
}

export function addToCart(id: string, qty: number = 1, selections?: Record<string, any>) {
  const cart = getCart();
  const existing = cart.find((l) => l.id === id);
  if (existing) {
    existing.qty += qty;
    // Most recent customization choice wins for the merged line.
    existing.selections = selections;
  } else {
    cart.push({ lineId: id, id, qty, selections });
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
  window.dispatchEvent(new Event('wishlist-updated'));
}

export function addToWishlist(id: string) {
  const list = getWishlist();
  if (!list.includes(id)) {
    setWishlist([...list, id]);
  }
}

export function removeFromWishlist(id: string) {
  setWishlist(getWishlist().filter((existingId) => existingId !== id));
}