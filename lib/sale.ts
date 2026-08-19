import { supabaseClient } from './supabaseClient';

export type SaleSettings = {
  title: string;
  subtitle: string;
  categorySlugs: string[];
  discountPct: number;
  active: boolean;
};

export async function getActiveSaleClient(): Promise<SaleSettings | null> {
  const { data, error } = await supabaseClient
    .from('sale_settings')
    .select('title, subtitle, category_slugs, discount_pct, active')
    .eq('active', true)
    .maybeSingle();

  if (error || !data) return null;
  return {
    title: data.title,
    subtitle: data.subtitle,
    categorySlugs: data.category_slugs || [],
    discountPct: Number(data.discount_pct) || 0,
    active: data.active,
  };
}