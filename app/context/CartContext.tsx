'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  getCart,
  setCart as persistCart,
  addToCart as addToCartStorage,
  type CartLine,
} from '../../lib/localCart';

type CartContextType = {
  lines: CartLine[];
  itemCount: number;
  addToCart: (id: string, qty?: number, selections?: Record<string, any>) => void;
  updateQty: (lineId: string, delta: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    setLines(getCart());

    // Keep the badge in sync if the cart changes in another tab.
    function handleStorage(e: StorageEvent) {
      if (e.key === 'lsf_cart') setLines(getCart());
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  function addToCart(id: string, qty = 1, selections?: Record<string, any>) {
    addToCartStorage(id, qty, selections);
    setLines(getCart());
  }

  function updateQty(lineId: string, delta: number) {
    const next = getCart()
      .map((l) => (l.lineId === lineId ? { ...l, qty: Math.max(1, l.qty + delta) } : l))
      .filter((l) => l.qty > 0);
    persistCart(next);
    setLines(next);
  }

  function removeLine(lineId: string) {
    const next = getCart().filter((l) => l.lineId !== lineId);
    persistCart(next);
    setLines(next);
  }

  function clearCart() {
    persistCart([]);
    setLines([]);
  }

  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <CartContext.Provider value={{ lines, itemCount, addToCart, updateQty, removeLine, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};