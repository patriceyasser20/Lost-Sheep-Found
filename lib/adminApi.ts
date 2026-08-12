const ADMIN_ENDPOINT = '/api/admin-ops';

function getToken() {
  return typeof window === 'undefined' ? null : localStorage.getItem('adminToken');
}

async function call(action: string, payload: any) {
  const res = await fetch(ADMIN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': getToken() || '' },
    body: JSON.stringify({ action, payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${action}`);
  return data.data ?? data;
}

export const adminApi = {
  insertProduct: (payload: any) => call('insert-product', payload),
  updateProduct: (id: string, payload: any) => call('update-product', { id, ...payload }),
  deleteProduct: (id: string) => call('delete-product', { id }),

  insertPromo: (payload: unknown) => call('insert-promo', payload),
  updatePromo: (payload: unknown) => call('update-promo', payload),
  deletePromo: (id: string) => call('delete-promo', { id }),

  upsertShippingCity: (payload: unknown) => call('upsert-shipping-city', payload),

  insertOffer: (payload: unknown) => call('insert-offer', payload),
  updateOffer: (payload: unknown) => call('update-offer', payload),
  deleteOffer: (id: string) => call('delete-offer', { id }),

  insertSku: (payload: unknown) => call('insert-sku', payload),
  updateSku: (payload: unknown) => call('update-sku', payload),
  deleteSku: (id: string) => call('delete-sku', { id }),

  updateOrderStatus: (payload: unknown) => call('update-order-status', payload),
  saveCustomizationOptions: (productId: string, options: any[]) =>
  call('insert-customization-options', { productId, options }),
  deleteCustomizationOptionsForProduct: (productId: string) =>
  call('delete-customization-options-for-product', { productId }),
};