// lib/localCart.ts

export type CartLine = { id: string; qty: number; selections?: Record<string, any> };

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
}

export function addToCart(id: string, qty: number = 1, selections?: Record<string, any>) {
  const cart = getCart();
  const existing = cart.find((l) => l.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty, selections });
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