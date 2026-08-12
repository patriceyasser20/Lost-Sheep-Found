'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { mockPromoCodes, type PromoCode } from '../../lib/adminTypes';
import { adminApi } from '../../lib/adminApi';

export default function PromoCodesPanel() {
  const [codes, setCodes] = useState<PromoCode[]>(mockPromoCodes);
  const [form, setForm] = useState<Omit<PromoCode, 'id' | 'usedCount'>>({ code: '', discountPct: 10, usageLimit: 0, active: true, expiresAt: '' });

  async function add() {
    const code = form.code.toUpperCase().trim();
    if (!code) return;
    const id = code.toLowerCase();
    const promo = { ...form, code, id, usedCount: 0 };
    await adminApi.insertPromo(promo);
    setCodes((prev) => [...prev, promo]);
    setForm({ code: '', discountPct: 10, usageLimit: 0, active: true, expiresAt: '' });
  }

  async function toggle(id: string) {
    const promo = codes.find((c) => c.id === id);
    if (!promo) return;
    setCodes((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    await adminApi.updatePromo({ ...promo, active: !promo.active });
  }

  async function remove(id: string) {
    await adminApi.deletePromo(id);
    setCodes((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <h3 className="mb-5 text-lg font-medium">Promo codes</h3>

      <div className="mb-8 grid grid-cols-2 gap-4 border border-line bg-paper-light p-5 md:grid-cols-5">
        <input className="border border-line bg-cream px-3 py-2 text-sm uppercase" placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <input type="number" className="border border-line bg-cream px-3 py-2 text-sm" placeholder="Discount %" value={form.discountPct} onChange={(e) => setForm({ ...form, discountPct: Number(e.target.value) })} />
        <input type="number" className="border border-line bg-cream px-3 py-2 text-sm" placeholder="Usage limit (0 = unlimited)" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} />
        <input type="date" className="border border-line bg-cream px-3 py-2 text-sm" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
        <button onClick={add} className="flex items-center justify-center gap-2 bg-brown px-4 py-2 text-[11px] uppercase tracking-[.08em] text-cream">
          <Plus size={14} /> Add code
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[11px] uppercase tracking-[.08em] text-brown-soft">
            <th className="py-3">Code</th>
            <th className="py-3">Discount</th>
            <th className="py-3">Used / Limit</th>
            <th className="py-3">Expires</th>
            <th className="py-3">Active</th>
            <th className="py-3 text-right">Delete</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((c) => (
            <tr key={c.id} className="border-b border-line">
              <td className="py-3 font-medium">{c.code}</td>
              <td className="py-3">{c.discountPct}%</td>
              <td className="py-3 text-brown-soft">{c.usedCount} / {c.usageLimit || '∞'}</td>
              <td className="py-3 text-brown-soft">{c.expiresAt || '—'}</td>
              <td className="py-3">
                <button onClick={() => toggle(c.id)} className={`px-2 py-1 text-[10px] uppercase tracking-[.06em] ${c.active ? 'bg-brown text-cream' : 'border border-line text-brown-soft'}`}>
                  {c.active ? 'Active' : 'Off'}
                </button>
              </td>
              <td className="py-3 text-right"><button onClick={() => remove(c.id)} className="text-brown-soft hover:text-[#a14b3c]"><Trash2 size={15} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}