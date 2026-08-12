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
    <header className="site-header">
      <div className="header-inner">
        <button
          className="mobile-menu"
          aria-label="Open menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu size={21} />
        </button>

        <Link href="/" className="wordmark">
          <span className="wordmark-small">✦</span>
          <span>lost sheep found</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/shop">{t('nav.shop')}</Link>
          <Link href="/collection/bible-journals">{t('nav.journals')}</Link>
          <Link href="/collection/wood-blocks">{t('nav.woodVerses')}</Link>
          <Link href="/our-story">{t('nav.ourStory')}</Link>
        </nav>

        <div className="header-actions">
          <select
            aria-label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as typeof currencies[number])}
            style={{ border: 0, background: 'transparent', fontSize: 11, letterSpacing: '.08em' }}
          >
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            aria-label="Language"
            onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
            style={{ border: 0, background: 'transparent', fontSize: 11, letterSpacing: '.08em', cursor: 'pointer' }}
          >
            {language === 'en' ? 'AR' : 'EN'}
          </button>
          <Link href={user ? '/account' : '/login'} aria-label="Account"><User size={19} strokeWidth={1.7} /></Link>
          <Link href="/wishlist" aria-label="Wishlist"><Heart size={19} strokeWidth={1.7} /></Link>
          <Link href="/cart" aria-label="Shopping bag"><ShoppingBag size={20} strokeWidth={1.7} /></Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="desktop-nav" style={{ flexDirection: 'column', padding: '18px 34px' }}>
          <Link href="/shop" onClick={() => setMenuOpen(false)}>{t('nav.shop')}</Link>
          <Link href="/collection/bible-journals" onClick={() => setMenuOpen(false)}>{t('nav.journals')}</Link>
          <Link href="/collection/wood-blocks" onClick={() => setMenuOpen(false)}>{t('nav.woodVerses')}</Link>
          <Link href="/our-story" onClick={() => setMenuOpen(false)}>{t('nav.ourStory')}</Link>
        </nav>
      )}
    </header>
  );
}
