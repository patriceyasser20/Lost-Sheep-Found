'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { type PromoCode } from '../../lib/adminTypes';
import { adminApi } from '../../lib/adminApi';

const EMPTY_FORM: Omit<PromoCode, 'id' | 'usedCount'> = {
  code: '',
  discountPct: 10,
  usageLimit: 0,
  active: true,
  expiresAt: '',
  freeDelivery: false,
};

export default function PromoCodesPanel() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<PromoCode, 'id' | 'usedCount'>>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .getPromoCodes()
      .then((data: PromoCode[]) => setCodes(data || []))
      .catch((err) => console.error('Failed to load promo codes:', err.message))
      .finally(() => setLoading(false));
  }, []);

  async function add() {
    const code = form.code.toUpperCase().trim();
    if (!code) return;
    if (form.discountPct <= 0 && !form.freeDelivery) {
      alert('Set a discount % and/or turn on Free delivery — a promo needs to do at least one of these.');
      return;
    }
    setSaving(true);
    try {
      const inserted = await adminApi.insertPromo({ ...form, code });
      setCodes((prev) => [...prev, inserted]);
      setForm(EMPTY_FORM);
    } catch (err: any) {
      alert('Failed to save promo code: ' + err.message);
    }
    setSaving(false);
  }

  async function toggle(id: string) {
    const promo = codes.find((c) => c.id === id);
    if (!promo) return;
    setCodes((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    await adminApi.updatePromo({ ...promo, active: !promo.active });
  }

  async function toggleFreeDelivery(id: string) {
    const promo = codes.find((c) => c.id === id);
    if (!promo) return;
    setCodes((prev) => prev.map((c) => (c.id === id ? { ...c, freeDelivery: !c.freeDelivery } : c)));
    try {
      await adminApi.updatePromo({ ...promo, freeDelivery: !promo.freeDelivery });
    } catch (err: any) {
      // revert on failure
      setCodes((prev) => prev.map((c) => (c.id === id ? { ...c, freeDelivery: promo.freeDelivery } : c)));
      alert('Failed to update: ' + err.message);
    }
  }

  async function remove(id: string) {
    await adminApi.deletePromo(id);
    setCodes((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) return <p className="text-sm text-brown-soft">Loading promo codes…</p>;

  return (
    <div>
      <h3 className="mb-5 text-lg font-medium">Promo codes</h3>

      <div className="mb-8 grid grid-cols-2 gap-4 border border-line bg-paper-light p-5 md:grid-cols-6">
        <div>
          <label htmlFor="promo-code" className="mb-2 block text-[10px] uppercase tracking-[.12em] text-brown-soft">
            Code
          </label>
          <input
            id="promo-code"
            className="w-full border border-line bg-cream px-3 py-2 text-sm uppercase"
            placeholder="e.g. FIRST10"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="promo-discount" className="mb-2 block text-[10px] uppercase tracking-[.12em] text-brown-soft">
            Discount %
          </label>
          <input
            id="promo-discount"
            type="number"
            className="w-full border border-line bg-cream px-3 py-2 text-sm"
            placeholder="10"
            value={form.discountPct}
            onChange={(e) => setForm({ ...form, discountPct: Number(e.target.value) })}
          />
        </div>

        <div>
          <label htmlFor="promo-limit" className="mb-2 block text-[10px] uppercase tracking-[.12em] text-brown-soft">
            Usage Limit
          </label>
          <input
            id="promo-limit"
            type="number"
            className="w-full border border-line bg-cream px-3 py-2 text-sm"
            placeholder="0 = unlimited"
            value={form.usageLimit}
            onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
          />
        </div>

        <div>
          <label htmlFor="promo-expires" className="mb-2 block text-[10px] uppercase tracking-[.12em] text-brown-soft">
            Expires (optional)
          </label>
          <input
            id="promo-expires"
            type="date"
            className="w-full border border-line bg-cream px-3 py-2 text-sm"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
          />
        </div>


        <div className="flex items-end">
          <button
            onClick={add}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 bg-brown px-4 py-2 text-[11px] uppercase tracking-[.08em] text-cream disabled:opacity-50"
          >
            <Plus size={14} /> {saving ? 'Adding…' : 'Add code'}
          </button>
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[11px] uppercase tracking-[.08em] text-brown-soft">
            <th className="py-3">Code</th>
            <th className="py-3">Discount</th>
            <th className="py-3">Free Delivery</th>
            <th className="py-3">Used / Limit</th>
            <th className="py-3">Expires</th>
            <th className="py-3">Active</th>
            <th className="py-3 text-right">Delete</th>
          </tr>
        </thead>
        <tbody>
          {codes.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-brown-soft">
                No promo codes yet.
              </td>
            </tr>
          )}
          {codes.map((c) => (
            <tr key={c.id} className="border-b border-line">
              <td className="py-3 font-medium">{c.code}</td>
              <td className="py-3">{c.discountPct > 0 ? `${c.discountPct}%` : '—'}</td>
              <td className="py-3">
                <button
                  onClick={() => toggleFreeDelivery(c.id)}
                  className={`px-2 py-1 text-[10px] uppercase tracking-[.06em] ${
                    c.freeDelivery ? 'bg-brown text-cream' : 'border border-line text-brown-soft'
                  }`}
                >
                  {c.freeDelivery ? 'Free' : 'Off'}
                </button>
              </td>
              <td className="py-3 text-brown-soft">{c.usedCount} / {c.usageLimit || '∞'}</td>
              <td className="py-3 text-brown-soft">{c.expiresAt || '—'}</td>
              <td className="py-3">
                <button
                  onClick={() => toggle(c.id)}
                  className={`px-2 py-1 text-[10px] uppercase tracking-[.06em] ${
                    c.active ? 'bg-brown text-cream' : 'border border-line text-brown-soft'
                  }`}
                >
                  {c.active ? 'Active' : 'Off'}
                </button>
              </td>
              <td className="py-3 text-right">
                <button onClick={() => remove(c.id)} aria-label="Delete promo code" className="text-brown-soft hover:text-[#a14b3c]">
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