// app/shop/page.tsx
import type { Metadata } from 'next';
import { getProducts } from '../../lib/productsServer';
import ShopPageClient from './ShopPageClient';


export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Browse the full Lost Sheep Found collection — journals, wooden verses, and keepsakes.',
  alternates: { canonical: 'https://lostsheepfound.com/shop' },
};

export default async function Shop() {
  const products = await getProducts();
  return <ShopPageClient initialProducts={products} />;
}