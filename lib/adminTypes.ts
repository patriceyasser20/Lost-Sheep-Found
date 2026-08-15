// lib/adminTypes.ts
//
// Shared types + placeholder data for the admin panels that don't have a
// live Supabase-backed loader yet. Swap `mock*` arrays for real fetches
// (via adminApi or a dedicated getX() in lib/) as each panel gets wired up.
export type OfferType = 'buy_x_get_y_free' | 'percent_off';
export type OfferAppliesTo = 'product' | 'category' | 'collection' | 'all';


export type Offer = {
  id: string;
  title: string;
  offerType: OfferType;
  buyQty: number;
  getQty: number;
  discountPct: number; // used when offerType === 'percent_off'
  appliesTo: OfferAppliesTo;
  targetId: string; // product/category/collection id — '' when appliesTo === 'all'
  targetLabel?: string; // display label for the table, resolved at save time
  requireSameVariant: boolean;
  endsAt: string; // '' when no end date
  active: boolean;
};
export const mockOffers: Offer[] = [];

export type PromoCode = {
  id: string;
  code: string;
  discountPct: number;
  usageLimit: number; // 0 = unlimited
  usedCount: number;
  expiresAt: string; // '' when no expiry
  active: boolean;
  freeDelivery: boolean;
};
export const mockPromoCodes: PromoCode[] = [
  { id: 'first10', code: 'FIRST10', discountPct: 10, usageLimit: 0, usedCount: 0, active: true, expiresAt: '', freeDelivery: false },
];

export type Sku = {
  id: string;
  productId: string;
  sku: string;
  variantLabel: string;
  stock: number;
};
export const mockSkus: Sku[] = [];

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type AdminOrderItem = {
  productName: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  customization: Record<string, any> | null;
};

export type AdminOrder = {
  id: string;
  customerName: string;
  email: string;
  city: string;
  isRegistered: boolean; 
  items: AdminOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  createdAt: string;
  status: OrderStatus;
};

export const mockOrders: AdminOrder[] = [];
export type ShippingRate = {
  id: string;
  city: string;
  fee: number;
  freeShipping: boolean;
  active: boolean;
};

export const mockShippingRates: ShippingRate[] = [
  { id: 'cairo', city: 'Cairo', fee: 90, freeShipping: false, active: true },
  { id: 'alexandria', city: 'Alexandria', fee: 110, freeShipping: false, active: true },
  { id: 'aswan', city: 'Aswan', fee: 150, freeShipping: false, active: true },
];