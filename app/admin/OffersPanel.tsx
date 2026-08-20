'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { adminApi } from '../../lib/adminApi';
import { getProductsClient, type Product } from '../../lib/products';
import { supabaseClient } from '../../lib/supabaseClient';
import type { Offer, OfferType, OfferAppliesTo } from '../../lib/adminTypes';

// ---------- Offer shape ----------
// NOTE: this extends the previous `Offer` type from lib/adminTypes.ts.
// If that file still exports the old shape (title/discountPct/scope/startsAt/endsAt/active),
// swap its `Offer` export for this one — the fields below are a superset.

const EMPTY_FORM: Omit<Offer, 'id'> = {
  title: '',
  offerType: 'buy_x_get_y_free',
  buyQty: 2,
  getQty: 1,
  discountPct: 20,
  appliesTo: 'all',
  targetId: '',
  targetLabel: '',
  requireSameVariant: false,
  bannerText: '',
  endsAt: '',
  active: true,
};

// ---------- Shared style tokens (match ProductsPanel) ----------
const btnPrimary =
  'inline-flex items-center gap-2 bg-brown px-6 py-3 text-[11px] uppercase tracking-[.08em] text-cream transition hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(76,60,46,.16)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none';
const btnLine =
  'inline-flex items-center gap-2 border border-brown px-6 py-3 text-[11px] uppercase tracking-[.08em] text-brown transition hover:bg-brown hover:text-cream';
const inputBase =
  'w-full border border-line bg-cream px-4 py-3 text-sm text-brown outline-none transition placeholder:text-brown-soft/60 focus:border-gold';
const labelBase = 'mb-2 block text-[10px] uppercase tracking-[.12em] text-brown-soft';

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-4 py-2.5 text-sm transition ${
        active
          ? 'border-brown bg-brown text-cream'
          : 'border-line bg-cream text-brown-soft hover:border-brown hover:text-brown'
      }`}
    >
      {children}
    </button>
  );
}

// A few real starting points from the catalog, shown as a rotating placeholder
// hint rather than hard-coded options — the actual name field stays free text.
const TITLE_EXAMPLES = [
  'Advent Journal Bundle',
  'Psalm 23 Gift Set',
  'Buy a Journal, Gift a Bookmark',
  'Wooden Verse Pair Deal',
];

export default function OffersPanel() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Offer, 'id'>>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  const titlePlaceholder = `Offer name (e.g. ${TITLE_EXAMPLES[Math.floor(Math.random() * TITLE_EXAMPLES.length)]})`;

  useEffect(() => {
    Promise.all([
        getProductsClient(),
        supabaseClient.from('categories').select('id, name, slug').order('name'),
        adminApi.getOffers(),
    ]).then(([productData, { data: catData, error }, offerData]) => {
        setProducts(productData);
        if (error) console.error('categories fetch:', error.message);
        setCategories(catData || []);
        setOffers(offerData || []);
        setLoading(false);
    });
    }, []);

  function openAddForm() {
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setForm(EMPTY_FORM);
  }

  function targetOptions() {
    if (form.appliesTo === 'product') return products.map((p) => ({ id: p.id, label: p.name }));
    if (form.appliesTo === 'category') {
      return categories.map((c) => ({ id: c.id, label: c.name }));
    }
    return [];
  }

  // Only journals and keepsakes (bookmarks/totes/key chains) are customizable
  // per the product schema (`is_customizable`), so the variant note only
  // makes sense to show when the selected scope could include them.
  const targetIsCustomizable =
    form.appliesTo === 'product'
      ? !!products.find((p) => p.id === form.targetId)?.customizable
      : form.appliesTo === 'category' || form.appliesTo === 'all';

  async function saveOffer() {
  if (!form.title.trim()) {
    alert('Please name the offer.');
    return;
  }
  if (form.appliesTo !== 'all' && !form.targetId) {
    alert(`Please select a ${form.appliesTo}.`);
    return;
  }
  setSaving(true);
  try {
    const options = targetOptions();
    const targetLabel = form.appliesTo === 'all' ? 'All products' : options.find((o) => o.id === form.targetId)?.label;

    const inserted = await adminApi.insertOffer({ ...form, targetLabel });
    setOffers((prev) => [...prev, inserted]);
    closeForm();
  } catch (err: any) {
    alert('Failed to save offer: ' + err.message);
  }
  setSaving(false);
}

  async function toggleActive(id: string) {
    const offer = offers.find((o) => o.id === id);
    if (!offer) return;
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o)));
    await adminApi.updateOffer({ ...offer, active: !offer.active });
  }

  async function remove(id: string) {
    await adminApi.deleteOffer(id);
    setOffers((prev) => prev.filter((o) => o.id !== id));
  }

  if (loading) return <p className="text-sm text-brown-soft">Loading offers…</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-medium tracking-[-.02em] text-brown">
            Offers ({offers.length})
          </h2>
          <p className="mt-1 text-[12.5px] text-brown-soft">
            Bundle deals across journals, wooden verses, and keepsakes — like a free bookmark with a journal, or a
            discount on a pair of wood blocks.
          </p>
        </div>
        {!showForm && (
          <button onClick={openAddForm} className={btnPrimary}>
            <Plus size={15} /> New Offer
          </button>
        )}
      </div>

      {/* Inline offer builder */}
      {showForm && (
        <div className="mb-10 border border-line bg-paper-light p-6 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h3 className="font-display text-xl font-medium tracking-[-.02em] text-brown">New Offer</h3>
            <button onClick={closeForm} aria-label="Close" className="text-brown-soft transition hover:text-brown">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className={labelBase}>Offer name</label>
              <input
                type="text"
                placeholder={titlePlaceholder}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelBase}>Banner text</label>
              <input
                type="text"
                placeholder="Buy 2, get 1 free — this week only"
                value={form.bannerText}
                onChange={(e) => setForm({ ...form, bannerText: e.target.value })}
                className={inputBase}
              />
              <p className="mt-1.5 text-[11.5px] text-brown-soft">
                Shown in the site-wide banner at the top of every page while this offer is active. Leave blank to use the offer name instead.
              </p>
            </div>

            <div>
              <label className={labelBase}>Offer Type</label>
              <div className="grid grid-cols-2 gap-3">
                <ToggleButton active={form.offerType === 'buy_x_get_y_free'} onClick={() => setForm({ ...form, offerType: 'buy_x_get_y_free' })}>
                  Buy X Get Y Free
                </ToggleButton>
                <ToggleButton active={form.offerType === 'percent_off'} onClick={() => setForm({ ...form, offerType: 'percent_off' })}>
                  Buy X Get Y % Off
                </ToggleButton>
              </div>
            </div>

            <div className={`grid gap-4 ${form.offerType === 'percent_off' ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <div>
                <label className={labelBase}>Buy Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={form.buyQty}
                  onChange={(e) => setForm({ ...form, buyQty: Number(e.target.value) })}
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>Get Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={form.getQty}
                  onChange={(e) => setForm({ ...form, getQty: Number(e.target.value) })}
                  className={inputBase}
                />
              </div>
              {form.offerType === 'percent_off' && (
                <div>
                  <label className={labelBase}>Discount %</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={form.discountPct}
                    onChange={(e) => setForm({ ...form, discountPct: Number(e.target.value) })}
                    className={inputBase}
                  />
                </div>
              )}
            </div>

            <p className="border border-line bg-cream px-4 py-3 text-[13px] leading-relaxed text-brown-soft">
              <span className="text-brown-soft">Preview: </span>
              <span className="font-medium text-brown">
                {form.offerType === 'buy_x_get_y_free'
                  ? `Buy ${form.buyQty || 0} Get ${form.getQty || 0} Free`
                  : `Buy ${form.buyQty || 0} Get ${form.getQty || 0} at ${form.discountPct || 0}% off`}
              </span>{' '}
              — e.g. a customer adding {form.buyQty || 0} journals or wood-verse pieces to their cart gets the
              cheapest {form.getQty || 0} of them {form.offerType === 'buy_x_get_y_free' ? 'for free' : `at ${form.discountPct || 0}% off`}.
            </p>

            <div>
              <label className={labelBase}>Applies To</label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <ToggleButton active={form.appliesTo === 'product'} onClick={() => setForm({ ...form, appliesTo: 'product', targetId: '' })}>
                  Product
                </ToggleButton>
                <ToggleButton active={form.appliesTo === 'category'} onClick={() => setForm({ ...form, appliesTo: 'category', targetId: '' })}>
                  Category
                </ToggleButton>
                <ToggleButton active={form.appliesTo === 'all'} onClick={() => setForm({ ...form, appliesTo: 'all', targetId: '' })}>
                  All Products
                </ToggleButton>
              </div>
              <p className="mt-2 text-[12px] text-brown-soft">
                {form.appliesTo === 'product' && 'A single item — e.g. just the Shepherd Journal.'}
                {form.appliesTo === 'category' && 'A whole category — e.g. all Bible Journals, or all Wood Blocks.'}
                {form.appliesTo === 'all' && 'Every product in the store, customizable or not.'}
              </p>
            </div>

            {form.appliesTo !== 'all' && (
              <div>
                <label className={labelBase}>
                  Select {form.appliesTo === 'product' ? 'product' : form.appliesTo === 'category' ? 'category' : 'collection'}
                </label>
                <select
                  value={form.targetId}
                  onChange={(e) => setForm({ ...form, targetId: e.target.value })}
                  className={`${inputBase} appearance-none`}
                >
                  <option value="">
                    Select {form.appliesTo === 'product' ? 'product' : form.appliesTo === 'category' ? 'category' : 'collection'}
                  </option>
                  {targetOptions().map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>
            )}

            {targetIsCustomizable && (
              <label className="flex items-start gap-3 border border-line bg-cream p-4">
                <input
                  type="checkbox"
                  checked={form.requireSameVariant}
                  onChange={(e) => setForm({ ...form, requireSameVariant: e.target.checked })}
                  className="mt-0.5 h-4 w-4 accent-brown"
                />
                <span>
                  <span className="block text-sm font-medium text-brown">Require same cover, color & template</span>
                  <span className="mt-1 block text-[12.5px] leading-relaxed text-brown-soft">
                    Leave unchecked (recommended) so the customer can mix Cover Style, Color, and Interior Template
                    freely across qualifying pieces — e.g. pick a linen cover in blush and a cloth-bound cover in
                    sand, and the cheaper of the two still qualifies. Personalization text (name, verse, or prompt
                    style) never affects eligibility either way.
                  </span>
                </span>
              </label>
            )}

            <div>
              <label className={labelBase}>End Date (optional)</label>
              <input
                type="date"
                value={form.endsAt}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                className={inputBase}
              />
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="h-4 w-4 accent-brown"
              />
              <span className="text-sm text-brown">Active immediately</span>
            </label>

            <div className="flex items-center gap-3 pt-2">
              <button onClick={saveOffer} disabled={saving} className={btnPrimary}>
                {saving ? 'Saving…' : 'Save Offer'}
              </button>
              <button onClick={closeForm} className={btnLine}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[10px] uppercase tracking-[.1em] text-brown-soft">
            <th className="py-2.5 font-normal">Title</th>
            <th className="py-2.5 font-normal">Offer</th>
            <th className="py-2.5 font-normal">Applies To</th>
            <th className="py-2.5 font-normal">Ends</th>
            <th className="py-2.5 font-normal">Active</th>
            <th className="py-2.5 text-right font-normal">Delete</th>
          </tr>
        </thead>
        <tbody>
          {offers.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-brown-soft">
                No offers yet — click "New Offer" to bundle journals, wood verses, or keepsakes together.
              </td>
            </tr>
          )}
          {offers.map((o) => (
            <tr key={o.id} className="border-b border-line">
              <td className="py-3 text-brown">{o.title}</td>
              <td className="py-3 text-brown-soft">
                {o.offerType === 'buy_x_get_y_free'
                  ? `Buy ${o.buyQty} Get ${o.getQty} Free`
                  : `Buy ${o.buyQty} Get ${o.getQty} at ${o.discountPct}% off`}
              </td>
              <td className="py-3 text-brown-soft">
                {o.appliesTo === 'all' ? 'All products' : `${o.appliesTo}: ${o.targetLabel || o.targetId}`}
              </td>
              <td className="py-3 text-brown-soft">{o.endsAt || '—'}</td>
              <td className="py-3">
                <button
                  onClick={() => toggleActive(o.id)}
                  className={`px-2 py-1 text-[10px] uppercase tracking-[.06em] ${
                    o.active ? 'bg-brown text-cream' : 'border border-line text-brown-soft'
                  }`}
                >
                  {o.active ? 'Active' : 'Off'}
                </button>
              </td>
              <td className="py-3 text-right">
                <button onClick={() => remove(o.id)} aria-label="Delete offer" className="text-brown-soft transition hover:text-[#a14b3c]">
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