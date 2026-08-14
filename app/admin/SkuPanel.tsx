'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { adminApi } from '../../lib/adminApi';

type SkuRow = {
  id: string;
  productId: string;
  productName: string;
  sku: string; // variant name/label — doubles as SKU display until/unless a real sku column exists
  stock: number;
};

const inputBase =
  'w-full border border-line bg-cream px-4 py-3 text-sm text-brown outline-none transition placeholder:text-brown-soft/60 focus:border-gold';
const labelBase = 'mb-2 block text-[10px] uppercase tracking-[.12em] text-brown-soft';

function mapRow(row: any): SkuRow {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.products?.name ?? row.product_id,
    sku: row.name ?? '',
    stock: row.stock ?? 0,
  };
}

export default function SkuPanel() {
  const [rows, setRows] = useState<SkuRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [productFilter, setProductFilter] = useState('');

  useEffect(() => {
    adminApi
      .getSkus()
      .then((data: any[]) => setRows((data || []).map(mapRow)))
      .catch((err) => console.error('Failed to load SKUs:', err.message))
      .finally(() => setLoading(false));
  }, []);

  const products = useMemo(() => {
    const seen = new Map<string, string>();
    rows.forEach((r) => seen.set(r.productId, r.productName));
    return Array.from(seen, ([id, name]) => ({ id, name }));
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (productFilter && r.productId !== productFilter) return false;
      if (!q) return true;
      return r.sku.toLowerCase().includes(q) || r.productName.toLowerCase().includes(q);
    });
  }, [rows, query, productFilter]);

  async function updateStock(id: string, stock: number) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, stock } : r)));
    try {
      await adminApi.updateSku({ id, stock });
    } catch (err: any) {
      alert('Failed to update stock: ' + err.message);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this SKU? This cannot be undone.')) return;
    try {
      await adminApi.deleteSku(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  }

  if (loading) return <p className="text-sm text-brown-soft">Loading SKUs…</p>;

  return (
    <div>
      <h2 className="mb-1 font-display text-2xl font-medium tracking-[-.02em] text-brown">SKU Search</h2>
      <p className="mb-6 text-[12.5px] text-brown-soft">
        Look up a variant by SKU code or product name to check or adjust stock. To add new variants, use Full Edit
        on a product in the Products tab.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-4 border border-line bg-paper-light p-5 md:grid-cols-3">
        <div>
          <label className={labelBase}>Search</label>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brown-soft" />
            <input
              type="text"
              placeholder="SKU code or product name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${inputBase} pl-9`}
            />
          </div>
        </div>

        <div>
          <label className={labelBase}>Filter by product</label>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className={`${inputBase} appearance-none`}
          >
            <option value="">All products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <p className="text-[12px] text-brown-soft">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </p>
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[11px] uppercase tracking-[.08em] text-brown-soft">
            <th className="py-3">SKU</th>
            <th className="py-3">Product</th>
            <th className="py-3">Stock</th>
            <th className="py-3 text-right">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-brown-soft">
                {rows.length === 0 ? 'No SKUs yet.' : 'No SKUs match that search.'}
              </td>
            </tr>
          )}
          {filtered.map((r) => (
            <tr key={r.id} className="border-b border-line">
              <td className="py-3 font-medium text-brown">{r.sku || '—'}</td>
              <td className="py-3 text-brown-soft">{r.productName}</td>
              <td className="py-3">
                <input
                  type="number"
                  className="w-20 border border-line bg-cream px-2 py-1 text-sm text-brown outline-none focus:border-gold"
                  value={r.stock}
                  onChange={(e) => updateStock(r.id, Number(e.target.value))}
                />
              </td>
              <td className="py-3 text-right">
                <button onClick={() => remove(r.id)} aria-label="Delete SKU" className="text-brown-soft transition hover:text-[#a14b3c]">
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}