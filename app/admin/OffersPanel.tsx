'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { mockOffers, type Offer } from '../../lib/adminTypes';
import { adminApi } from '../../lib/adminApi';

export default function OffersPanel() {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [form, setForm] = useState<Omit<Offer, 'id'>>({ title: '', discountPct: 10, scope: 'all', startsAt: '', endsAt: '', active: true });

  async function add() {
    const id = form.title.toLowerCase().replace(/\s+/g, '-') || `offer-${Date.now()}`;
    const offer = { ...form, id };
    await adminApi.insertOffer(offer);
    setOffers((prev) => [...prev, offer]);
    setForm({ title: '', discountPct: 10, scope: 'all', startsAt: '', endsAt: '', active: true });
  }

  async function toggle(id: string) {
    const offer = offers.find((o) => o.id === id);
    if (!offer) return;
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o)));
    await adminApi.updateOffer({ ...offer, active: !offer.active });
  }

  async function remove(id: string) {
    await adminApi.deleteOffer(id);
    setOffers((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <div>
      <h3 className="mb-5 text-lg font-medium">Site-wide offers</h3>

      <div className="mb-8 grid grid-cols-2 gap-4 border border-line bg-paper-light p-5 md:grid-cols-5">
        <input className="border border-line bg-cream px-3 py-2 text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input type="number" className="border border-line bg-cream px-3 py-2 text-sm" placeholder="Discount %" value={form.discountPct} onChange={(e) => setForm({ ...form, discountPct: Number(e.target.value) })} />
        <select className="border border-line bg-cream px-3 py-2 text-sm" value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value as Offer['scope'] })}>
          <option value="all">All products</option>
          <option value="bible-journals">Bible Journals</option>
          <option value="wood-blocks">Wood Blocks</option>
          <option value="keepsakes">Keepsakes</option>
        </select>
        <input type="date" className="border border-line bg-cream px-3 py-2 text-sm" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
        <input type="date" className="border border-line bg-cream px-3 py-2 text-sm" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
        <button onClick={add} className="col-span-2 flex items-center justify-center gap-2 bg-brown px-4 py-2 text-[11px] uppercase tracking-[.08em] text-cream md:col-span-1">
          <Plus size={14} /> Add offer
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[11px] uppercase tracking-[.08em] text-brown-soft">
            <th className="py-3">Title</th>
            <th className="py-3">Discount</th>
            <th className="py-3">Scope</th>
            <th className="py-3">Window</th>
            <th className="py-3">Active</th>
            <th className="py-3 text-right">Delete</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((o) => (
            <tr key={o.id} className="border-b border-line">
              <td className="py-3">{o.title}</td>
              <td className="py-3">{o.discountPct}%</td>
              <td className="py-3 text-brown-soft">{o.scope}</td>
              <td className="py-3 text-brown-soft">{o.startsAt} – {o.endsAt}</td>
              <td className="py-3">
                <button onClick={() => toggle(o.id)} className={`px-2 py-1 text-[10px] uppercase tracking-[.06em] ${o.active ? 'bg-brown text-cream' : 'border border-line text-brown-soft'}`}>
                  {o.active ? 'Active' : 'Off'}
                </button>
              </td>
              <td className="py-3 text-right"><button onClick={() => remove(o.id)} className="text-brown-soft hover:text-[#a14b3c]"><Trash2 size={15} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}