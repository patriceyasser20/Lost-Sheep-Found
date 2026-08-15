import { supabaseClient } from './supabaseClient';

export type ShippingCity = {
  id: string;
  countryCode: string;
  city: string;
  fee: number;
  freeShipping: boolean;
  active: boolean;
};

export async function getShippingCitiesClient(countryCode: string = 'EG'): Promise<ShippingCity[]> {
  const { data, error } = await supabaseClient
    .from('shipping_cities')
    .select('id, country_code, city, fee, "freeShipping", active')
    .eq('country_code', countryCode)
    .eq('active', true)
    .order('city');

  if (error) {
    console.error('getShippingCitiesClient:', error.message);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    countryCode: row.country_code,
    city: row.city,
    fee: row.freeShipping ? 0 : Number(row.fee),
    freeShipping: row.freeShipping,
    active: row.active,
  }));
}