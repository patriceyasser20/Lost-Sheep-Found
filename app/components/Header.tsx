'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, LogOut, Menu, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Header() {
  const { user, signOut } = useAuth();
  const { t, language, changeLanguage } = useTranslation();
  const { itemCount } = useCart();
  const { ids: wishlistIds } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const hasWishlistItems = wishlistIds.length > 0;

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
          <button
            aria-label="Language"
            onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
            className="cursor-pointer border-0 bg-transparent text-[11px] tracking-[.08em]"
          >
            {language === 'en' ? 'AR' : 'EN'}
          </button>

          {/* Account */}
          {user ? (
            <div className="relative">
              <button
                aria-label="Account menu"
                onClick={() => setAccountOpen((open) => !open)}
                className="border-0 bg-transparent text-brown"
              >
                <User size={19} strokeWidth={1.7} />
              </button>
              {accountOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+14px)] w-[170px] border border-line bg-cream py-2 shadow-[0_8px_24px_rgba(76,60,46,.12)]"
                  onMouseLeave={() => setAccountOpen(false)}
                >
                  <Link
                    href="/account"
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-2.5 text-xs uppercase tracking-[.08em] text-brown-soft hover:bg-paper-light hover:text-brown"
                  >
                    My account
                  </Link>
                  <button
                    onClick={() => {
                      setAccountOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-[.08em] text-brown-soft hover:bg-paper-light hover:text-brown"
                  >
                    <LogOut size={13} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" aria-label="Login"><User size={19} strokeWidth={1.7} /></Link>
          )}

          {/* Wishlist — filled + gold when non-empty */}
          <Link href="/wishlist" aria-label="Wishlist">
            <Heart
              size={19}
              strokeWidth={1.7}
              className={hasWishlistItems ? 'fill-gold text-gold' : 'text-brown'}
            />
          </Link>

          {/* Cart with count badge */}
          <Link href="/cart" aria-label="Shopping bag" className="relative">
            <ShoppingBag size={20} strokeWidth={1.7} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brown px-1 text-[9px] font-medium leading-none text-cream">
                {itemCount}
              </span>
            )}
          </Link>
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