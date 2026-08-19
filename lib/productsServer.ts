import { createClient } from './supabaseServer';
import { PRODUCT_SELECT, mapProduct, type Product } from './products';
import { createPublicClient } from './supabaseServer';

export async function getProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('created_at', { ascending: false });
  if (error) { console.error('getProducts:', error.message); return []; }
  return (data || []).map(mapProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) return null;
  return mapProduct(data);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.categorySlug === categorySlug);
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.featured).slice(0, limit);
}