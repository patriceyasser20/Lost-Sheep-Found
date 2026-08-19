import { createPublicClient } from './supabaseServer';  
  export type SaleSettings = {
    active: boolean;
    title: string;
    subtitle: string;
    categorySlugs: string[];
    discountPct: number;
  };

  const DEFAULTS: SaleSettings = {
    active: true,
    title: '15% off, this week only',
    subtitle: '',
    categorySlugs: [],
    discountPct: 0,
  };

  export async function getSaleSettingsServer(): Promise<SaleSettings> {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('sale_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error || !data) return DEFAULTS;

    return {
      active: data.active ?? DEFAULTS.active,
      title: data.title || DEFAULTS.title,
      subtitle: data.subtitle || DEFAULTS.subtitle,
      categorySlugs: data.category_slugs || [],
      discountPct: Number(data.discount_pct) || 0,
    };
  }