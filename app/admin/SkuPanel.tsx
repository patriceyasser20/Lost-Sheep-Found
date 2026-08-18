'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { getProductsClient, type Product } from '../../lib/products';
import { supabaseClient } from '../../lib/supabaseClient';
import { adminApi } from '../../lib/adminApi';
import { mergeChildSkus } from '../../lib/sku';

const inputBase =
  'w-full border border-line bg-cream px-4 py-3 text-sm text-brown outline-none transition placeholder:text-brown-soft/60 focus:border-gold';
const labelBase = 'mb-2 block text-[10px] uppercase tracking-[.12em] text-brown-soft';

type Choice = { id: string; label: string; sku?: string };
type OptionRow = { id: string; product_id: string; name: string; type: string; options: Choice[] };

type ComposedSku = { fullSku: string | null; comboLabel: string };
type ProductWithSkus = Product & { composedSkus: ComposedSku[] };

// Bounded cartesian product across a product's customization option groups —
// caps out so a product with many options/choices can't explode into
// thousands of combinations.
function cartesianCombos(
  groups: { optionId: string; choices: Choice[] }[],
  cap = 60
): Record<string, Choice>[] {
  let combos: Record<string, Choice>[] = [{}];
  for (const group of groups) {
    const next: Record<string, Choice>[] = [];
    outer: for (const combo of combos) {
      for (const choice of group.choices) {
        next.push({ ...combo, [group.optionId]: choice });
        if (next.length >= cap) break outer;
      }
    }
    combos = next;
    if (combos.length >= cap) break;
  }
  return combos;
}

function buildComposedSkus(product: Product, optionRows: OptionRow[]): ComposedSku[] {
  const selectGroups = optionRows
    .filter((o) => o.type === 'select' && o.options.length > 0)
    .map((o) => ({ optionId: o.id, optionName: o.name, choices: o.options }));

  if (selectGroups.length === 0) {
    return [{ fullSku: product.sku || null, comboLabel: '' }];
  }

  const combos = cartesianCombos(selectGroups);
  const seen = new Set<string>();
  const results: ComposedSku[] = [];

  for (const combo of combos) {
    const selections: Record<string, { sku?: string }> = {};
    const labelParts: string[] = [];

    selectGroups.forEach((g) => {
      const picked = combo[g.optionId];
      if (picked) {
        selections[g.optionId] = { sku: picked.sku };
        labelParts.push(`${g.optionName}: ${picked.label}`);
      }
    });

    const fullSku = mergeChildSkus(product.sku, selections);
    const key = fullSku || labelParts.join('|');
    if (seen.has(key)) continue;
    seen.add(key);

    results.push({ fullSku, comboLabel: labelParts.join(' · ') });
  }

  return results;
}

export default function SkuPanel() {
  const [products, setProducts] = useState<ProductWithSkus[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const productList = await getProductsClient();

      const { data: optionRows, error } = await supabaseClient
        .from('customization_options')
        .select('id, product_id, name, type, options');

      if (error) console.error('Failed to load customization options:', error.message);

      const optionsByProduct = new Map<string, OptionRow[]>();
      (optionRows || []).forEach((row: any) => {
        const list = optionsByProduct.get(row.product_id) || [];
        list.push({
          id: row.id,
          product_id: row.product_id,
          name: row.name,
          type: row.type,
          options: row.options || [],
        });
        optionsByProduct.set(row.product_id, list);
      });

      const withSkus: ProductWithSkus[] = productList.map((p) => ({
        ...p,
        composedSkus: buildComposedSkus(p, optionsByProduct.get(p.id) || []),
      }));

      setProducts(withSkus);
      setStockEdits(Object.fromEntries(withSkus.map((p) => [p.id, p.stock])));
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => !productFilter || p.id === productFilter)
      .map((p) => {
        if (!q) return { product: p, matches: p.composedSkus };
        const nameMatches = p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q);
        const matches = p.composedSkus.filter(
          (c) => nameMatches || (c.fullSku || '').toLowerCase().includes(q)
        );
        return { product: p, matches: nameMatches ? p.composedSkus : matches };
      })
      .filter((r) => r.matches.length > 0);
  }, [products, query, productFilter]);

  async function saveStock(productId: string) {
    const stock = stockEdits[productId];
    setSaving(productId);
    try {
      await adminApi.updateProduct(productId, { stock: Number(stock) });
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: Number(stock) } : p)));
    } catch (err: any) {
      alert('Failed to update stock: ' + err.message);
    }
    setSaving(null);
  }

  if (loading) return <p className="text-sm text-brown-soft">Loading SKUs…</p>;

  return (
    <div>
      <h2 className="mb-1 font-display text-2xl font-medium tracking-[-.02em] text-brown">SKU Search</h2>
      <p className="mb-6 text-[12.5px] text-brown-soft">
        Search by parent SKU, a full composed SKU (e.g. LSF-JRN-001-LINEN), or product name. To add or edit SKUs,
        use Full Edit on a product in the Products tab.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-4 border border-line bg-paper-light p-5 md:grid-cols-3">
        <div>
          <label className={labelBase}>Search</label>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brown-soft" />
            <input
              type="text"
              placeholder="SKU or product name"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
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
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} matched
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-brown-soft">
          {products.length === 0 ? 'No products yet.' : 'No SKUs match that search.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ product: p, matches }) => (
            <div key={p.id} className="border border-line bg-cream">
              <div className="relative aspect-square border-b border-line bg-paper-light">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gold">
                    <span className="text-2xl">✦</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-3 inline-flex items-center gap-2 border border-line bg-paper-light px-2.5 py-1">
                  <span className="text-[9px] uppercase tracking-[.12em] text-brown-soft">Parent SKU</span>
                  <span className="font-mono text-[12px] tracking-wider text-brown">{p.sku || '—'}</span>
                </div>

                <h3 className="font-display text-lg font-medium tracking-[-.01em] text-brown">{p.name}</h3>
                <p className="mt-0.5 text-[13px] text-brown-soft">EGP {p.price}</p>

                <div className="mt-3 space-y-1.5">
                  {matches.map((c, i) => (
                    <div key={i} className="border border-line/60 bg-paper-light/50 px-2.5 py-1.5">
                      <p className="font-mono text-[11.5px] tracking-wide text-brown">{c.fullSku || '—'}</p>
                      {c.comboLabel && (
                        <p className="mt-0.5 text-[10.5px] text-brown-soft">{c.comboLabel}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 border border-line bg-paper-light p-3">
                  <p className="mb-2 text-[9px] uppercase tracking-[.12em] text-brown-soft">Stock</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-20 border border-line bg-cream px-2 py-1 text-center text-sm text-brown outline-none focus:border-gold"
                      value={stockEdits[p.id] ?? p.stock}
                      onChange={(e) => setStockEdits((prev) => ({ ...prev, [p.id]: Number(e.target.value) }))}
                    />
                    <button
                      onClick={() => saveStock(p.id)}
                      disabled={saving === p.id}
                      className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[.06em] text-brown-soft transition hover:border-brown hover:text-brown disabled:opacity-50"
                    >
                      {saving === p.id ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}