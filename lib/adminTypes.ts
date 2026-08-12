export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type AdminOrder = {
  id: string;
  customerName: string;
  email: string;
  itemsSummary: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type ShippingRate = {
  id: string;
  city: string;
  standardFee: number;
  expressFee: number;
  active: boolean;
};

export type Offer = {
  id: string;
  title: string;
  discountPct: number;
  scope: 'all' | 'bible-journals' | 'wood-blocks' | 'keepsakes';
  startsAt: string;
  endsAt: string;
  active: boolean;
};

export type PromoCode = {
  id: string;
  code: string;
  discountPct: number;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  expiresAt: string;
};

export type Sku = {
  id: string;
  productId: string;
  sku: string;
  variantLabel: string;
  stock: number;
};

// Seed/mock data — replace with Supabase queries once that's connected.
export const mockOrders: AdminOrder[] = [
  { id: 'ORD-1001', customerName: 'Mariam Adel', email: 'mariam@example.com', itemsSummary: 'The Shepherd Journal ×1', total: 510, status: 'processing', createdAt: '2026-08-10' },
  { id: 'ORD-1002', customerName: 'Youssef Nabil', email: 'youssef@example.com', itemsSummary: 'Grace & Truth Bookmark ×2', total: 240, status: 'pending', createdAt: '2026-08-11' },
  { id: 'ORD-1003', customerName: 'Sara Farid', email: 'sara@example.com', itemsSummary: 'Be Still Wood Block ×1', total: 340, status: 'delivered', createdAt: '2026-08-05' },
];

export const mockShippingRates: ShippingRate[] = [
  { id: 'cairo', city: 'Cairo', standardFee: 90, expressFee: 150, active: true },
  { id: 'giza', city: 'Giza', standardFee: 90, expressFee: 150, active: true },
  { id: 'alexandria', city: 'Alexandria', standardFee: 110, expressFee: 0, active: true },
  { id: 'aswan', city: 'Aswan', standardFee: 150, expressFee: 0, active: true },
];

export const mockOffers: Offer[] = [
  { id: 'advent-2026', title: 'Advent Sale', discountPct: 15, scope: 'all', startsAt: '2026-12-01', endsAt: '2026-12-25', active: true },
];

export const mockPromoCodes: PromoCode[] = [
  { id: 'first10', code: 'FIRST10', discountPct: 10, usageLimit: 1, usedCount: 0, active: true, expiresAt: '' },
  { id: 'advent15', code: 'ADVENT15', discountPct: 15, usageLimit: 0, usedCount: 128, active: true, expiresAt: '2026-12-25' },
];

export const mockSkus: Sku[] = [
  { id: 'sj-default', productId: 'the-shepherd-journal', sku: 'LSF-SJ-001', variantLabel: 'Default', stock: 20 },
  { id: 'p23-default', productId: 'psalm-23-wood-block', sku: 'LSF-P23-001', variantLabel: 'Default', stock: 15 },
  { id: 'gtb-default', productId: 'grace-and-truth-bookmark', sku: 'LSF-GTB-001', variantLabel: 'Default', stock: 30 },
];