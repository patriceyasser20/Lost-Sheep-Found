'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type WishlistContextType = {
  ids: string[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const STORAGE_KEY = 'lsf_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      try {
        setIds(JSON.parse(stored));
      } catch {
        // ignore malformed storage
      }
    }
  }, []);

  function persist(next: string[]) {
    setIds(next);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function toggleWishlist(id: string) {
    persist(ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]);
  }

  function isWishlisted(id: string) {
    return ids.includes(id);
  }

  return (
    <WishlistContext.Provider value={{ ids, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};