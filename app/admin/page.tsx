'use client';

import { useState } from 'react';
import { Package, ShoppingCart, Truck, Tag, Grid3x3, Percent } from 'lucide-react';
import ProductsPanel from './ProductsPanel';
import OrdersPanel from './OrdersPanel';
import ShippingPanel from './ShippingPanel';
import OffersPanel from './OffersPanel';
import SkuPanel from './SkuPanel';
import PromoCodesPanel from './PromoCodesPanel';
// import OrdersPanel from './OrdersPanel';
// import ShippingPanel from './ShippingPanel';
// import SkuPanel from './SkuPanel';
// import PromoCodesPanel from './PromoCodesPanel';
// import OffersPanel from './OffersPanel';

const TABS = [
  { key: 'products', label: 'Products', icon: Package },
  { key: 'orders', label: 'Orders', icon: ShoppingCart },
  { key: 'shipping', label: 'Shipping', icon: Truck },
  { key: 'offers', label: 'Offers', icon: Percent },
  { key: 'sku', label: 'SKU / Stock', icon: Grid3x3 },
  { key: 'promo', label: 'Promo Codes', icon: Tag },
] as const;

export default function AdminPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('products');

  return (
    <div className="min-h-screen bg-paper py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="mb-[6px] text-[10px] uppercase tracking-[.16em] text-gold">Admin</p>
        <h1 className="mb-8 font-display text-3xl font-medium tracking-[-.03em] md:text-4xl">Dashboard</h1>

        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <nav className="flex flex-shrink-0 flex-col gap-1.5 border-b border-line pb-6 md:w-[220px] md:border-b-0 md:border-r md:pb-0 md:pr-6" aria-label="Admin sections">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-left text-[11px] uppercase tracking-[.08em] transition duration-200 ${
                    active
                      ? 'bg-brown text-cream'
                      : 'border border-transparent text-brown-soft hover:border-line hover:bg-cream hover:text-brown'
                  }`}
                >
                  <Icon size={15} /> {t.label}
                </button>
              );
            })}
          </nav>

          <div className="min-w-0 flex-1">
            {tab === 'products' && <ProductsPanel />}
            {tab === 'orders' && <OrdersPanel/>}
            {tab === 'shipping' && <ShippingPanel/>}
            {tab === 'offers' && <OffersPanel/>}
            {tab === 'sku' && <SkuPanel/>}
            {tab === 'promo' && <PromoCodesPanel/>}
          </div>
        </div>
      </div>
    </div>
  );
}