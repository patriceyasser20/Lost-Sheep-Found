'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { mockSkus, type Sku } from '../../lib/adminTypes';
import { products } from '../../lib/products';
import { adminApi } from '../../lib/adminApi';

export default function SkuPanel() {
  const [skus, setSkus] = useState<Sku[]>(mockSkus);
  const [form, setForm] = useState<Omit<Sku, 'id'>>({ productId: products[0]?.id ?? '', sku: '', variantLabel: 'Default', stock: 0 });

  async function add() {
    const id = `${form.productId}-${form.sku || Date.now()}`;
    const sku = { ...form, id };
    await adminApi.insertSku(sku);
    setSkus((prev) => [...prev, sku]);
    setForm({ productId: products[0]?.id ?? '', sku: '', variantLabel: 'Default', stock: 0 });
  }

  async function updateStock(id: string, stock: number) {
    const sku = skus.find((s) => s.id === id);
    if (!sku) return;
    setSkus((prev) => prev.map((s) => (s.id === id ? { ...s, stock } : s)));
    await adminApi.updateSku({ ...sku, stock });
  }

  async function remove(id: string) {
    await adminApi.deleteSku(id);
    setSkus((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <h3 className="mb-5 text-lg font-medium">SKU & stock</h3>

      <div className="mb-8 grid grid-cols-2 gap-4 border border-line bg-paper-light p-5 md:grid-cols-5">
        <select className="border border-line bg-cream px-3 py-2 text-sm" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input className="border border-line bg-cream px-3 py-2 text-sm" placeholder="SKU code" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        <input className="border border-line bg-cream px-3 py-2 text-sm" placeholder="Variant (e.g. Color)" value={form.variantLabel} onChange={(e) => setForm({ ...form, variantLabel: e.target.value })} />
        <input type="number" className="border border-line bg-cream px-3 py-2 text-sm" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
        <button onClick={add} className="flex items-center justify-center gap-2 bg-brown px-4 py-2 text-[11px] uppercase tracking-[.08em] text-cream">
          <Plus size={14} /> Add SKU
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[11px] uppercase tracking-[.08em] text-brown-soft">
            <th className="py-3">SKU</th>
            <th className="py-3">Product</th>
            <th className="py-3">Variant</th>
            <th className="py-3">Stock</th>
            <th className="py-3 text-right">Delete</th>
          </tr>
        </thead>
        <tbody>
          {skus.map((s) => (
            <tr key={s.id} className="border-b border-line">
              <td className="py-3 font-medium">{s.sku}</td>
              <td className="py-3 text-brown-soft">{products.find((p) => p.id === s.productId)?.name ?? s.productId}</td>
              <td className="py-3 text-brown-soft">{s.variantLabel}</td>
              <td className="py-3"><input type="number" className="w-20 border border-line bg-cream px-2 py-1 text-sm" value={s.stock} onChange={(e) => updateStock(s.id, Number(e.target.value))} /></td>
              <td className="py-3 text-right"><button onClick={() => remove(s.id)} className="text-brown-soft hover:text-[#a14b3c]"><Trash2 size={15} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}