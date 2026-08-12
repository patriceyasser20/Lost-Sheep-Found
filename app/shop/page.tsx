import type { Metadata } from 'next';
import { products } from '../../lib/products';
import ShopPageClient from './ShopPageClient';

// TODO once Supabase is wired: replace the local `products` import with
//   const { data } = await supabaseClient.from('products').select('*')
// ShopPageClient's props shape won't need to change.

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Browse the full Lost Sheep Found collection — journals, wooden verses, and keepsakes.',
  alternates: { canonical: 'https://lostsheepfound.com/shop' },
};

export default async function Shop() {
  return <ShopPageClient initialProducts={products} />;
}
