'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Currency = 'EGP' | 'USD' | 'EUR' | 'GBP';

// Static fallback rates. Swap for a live rates API once one is chosen —
// nothing else in the app needs to change, callers only use format()/convert().
const RATES: Record<Currency, number> = { EGP: 1, USD: 0.021, EUR: 0.019, GBP: 0.016 };

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (egpAmount: number) => number;
  format: (egpAmount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('EGP');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('currency') : null;
    if (stored && stored in RATES) setCurrencyState(stored as Currency);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    if (typeof window !== 'undefined') localStorage.setItem('currency', c);
  };

  const convert = (egpAmount: number) => Math.round(egpAmount * RATES[currency] * 100) / 100;
  const format = (egpAmount: number) => `${currency} ${convert(egpAmount)}`;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
