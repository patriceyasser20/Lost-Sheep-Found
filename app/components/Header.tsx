'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, Menu, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from '../context/LanguageContext';

const currencies = ['EGP', 'USD', 'EUR', 'GBP'] as const;

export default function Header() {
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { t, language, changeLanguage } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-[68px] md:h-[78px] border-b border-brown/[.12] bg-paper/[.88] backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between gap-[30px] px-[18px] md:px-[34px]">
        <button
          className="border-0 bg-transparent text-brown md:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu size={21} />
        </button>

        <Link href="/" className="mx-auto flex items-center gap-[7px] whitespace-nowrap font-display text-[22px] tracking-[-.04em] md:mx-0 md:text-[25px]">
          <span className="font-serif text-xs text-gold">✦</span>
          <span>lost sheep found</span>
        </Link>

        <nav className="mx-auto hidden gap-[34px] md:flex" aria-label="Main navigation">
          <Link href="/shop" className="text-xs tracking-[.1em] uppercase text-brown-soft hover:text-brown">{t('nav.shop')}</Link>
          <Link href="/collection/bible-journals" className="text-xs tracking-[.1em] uppercase text-brown-soft hover:text-brown">{t('nav.journals')}</Link>
          <Link href="/collection/wood-blocks" className="text-xs tracking-[.1em] uppercase text-brown-soft hover:text-brown">{t('nav.woodVerses')}</Link>
          <Link href="/our-story" className="text-xs tracking-[.1em] uppercase text-brown-soft hover:text-brown">{t('nav.ourStory')}</Link>
        </nav>

        <div className="flex items-center gap-[22px]">
          <select
            aria-label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as typeof currencies[number])}
            className="border-0 bg-transparent text-[11px] tracking-[.08em]"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            aria-label="Language"
            onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
            className="cursor-pointer border-0 bg-transparent text-[11px] tracking-[.08em]"
          >
            {language === 'en' ? 'AR' : 'EN'}
          </button>
          <Link href={user ? '/account' : '/login'} aria-label="Account"><User size={19} strokeWidth={1.7} /></Link>
          <Link href="/wishlist" aria-label="Wishlist"><Heart size={19} strokeWidth={1.7} /></Link>
          <Link href="/cart" aria-label="Shopping bag"><ShoppingBag size={20} strokeWidth={1.7} /></Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-[18px] px-[34px] py-[18px]">
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="text-xs tracking-[.1em] uppercase text-brown-soft hover:text-brown">{t('nav.shop')}</Link>
          <Link href="/collection/bible-journals" onClick={() => setMenuOpen(false)} className="text-xs tracking-[.1em] uppercase text-brown-soft hover:text-brown">{t('nav.journals')}</Link>
          <Link href="/collection/wood-blocks" onClick={() => setMenuOpen(false)} className="text-xs tracking-[.1em] uppercase text-brown-soft hover:text-brown">{t('nav.woodVerses')}</Link>
          <Link href="/our-story" onClick={() => setMenuOpen(false)} className="text-xs tracking-[.1em] uppercase text-brown-soft hover:text-brown">{t('nav.ourStory')}</Link>
        </nav>
      )}
    </header>
  );
}