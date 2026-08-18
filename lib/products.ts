import { supabaseClient } from './supabaseClient';

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  tag: string;
  imageUrl: string | null;
  images: string[];
  categorySlug: string;
  categoryName: string;
  customizable: boolean;
  featured: boolean;
  stock: number;
  sku?: string;
};

export const PRODUCT_SELECT = `
  id, slug, name, description, price, image_url, is_customizable, is_featured, stock, sku,
  categories ( name, slug ),
  product_images ( image_url, sort_order )
`;

export function mapProduct(row: any): Product {
  const price = Number(row.price);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    price,
    priceLabel: row.is_customizable ? `From EGP ${price}` : `EGP ${price}`,
    tag: row.is_customizable ? 'Personalizable' : row.is_featured ? 'Featured' : 'New',
    imageUrl: row.image_url,
    images: (row.product_images || [])
      .slice()
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((img: any) => img.image_url),
    categorySlug: row.categories?.slug || '',
    categoryName: row.categories?.name || 'Uncategorized',
    customizable: row.is_customizable,
    featured: row.is_featured,
    stock: row.stock,
    sku: row.sku || undefined,
  };
}

// ---------- Client Components ----------
export async function getProductsClient(): Promise<Product[]> {
  const { data, error } = await supabaseClient.from('products').select(PRODUCT_SELECT);
  if (error) { console.error('getProductsClient:', error.message); return []; }
  return (data || []).map(mapProduct);
}

export async function getProductClient(slug: string): Promise<Product | null> {
  const { data, error } = await supabaseClient
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) return null;
  return mapProduct(data);
}