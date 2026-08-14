import { createClient } from './supabaseServer';
import type { CustomizationOption } from './customization';

// Server Component read (product detail page)
export async function getCustomizationOptions(productId: string): Promise<CustomizationOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('customization_options')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });
  if (error) { console.error('getCustomizationOptions:', error.message); return []; }
  return data || [];
}