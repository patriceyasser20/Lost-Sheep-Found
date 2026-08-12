'use client';

import { useState } from 'react';
import { Package, ShoppingCart, Truck, Tag, Grid3x3, Percent } from 'lucide-react';
import ProductsPanel from './ProductsPanel';
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
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-sm text-gray-400 mb-1">Admin</p>
        <h1 className="text-3xl font-light mb-8">Dashboard</h1>

        <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 rounded-full text-sm flex items-center gap-2 ${
                  tab === t.key ? 'bg-black text-white' : 'bg-white border'
                }`}
              >
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'products' && <ProductsPanel />}
        {tab === 'orders' && <p className="text-gray-400">Orders panel — same pattern as ProductsPanel, reading from `orders`.</p>}
        {tab === 'shipping' && <p className="text-gray-400">Shipping panel — ports directly from your uploaded logic.</p>}
        {tab === 'offers' && <p className="text-gray-400">Offers panel — ports directly from your uploaded logic.</p>}
        {tab === 'sku' && <p className="text-gray-400">SKU search panel — ports directly from your uploaded logic.</p>}
        {tab === 'promo' && <p className="text-gray-400">Promo codes panel — ports directly from your uploaded logic.</p>}
      </div>
    </div>
  );
}