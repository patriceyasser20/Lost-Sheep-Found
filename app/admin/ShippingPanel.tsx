'use client';

import { useEffect, useState } from 'react';
import type { ShippingRate } from '../../lib/adminTypes';
import { adminApi } from '../../lib/adminApi';

const COUNTRY_CODE = 'EG';

export default function ShippingPanel() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await adminApi.getShippingCities(COUNTRY_CODE);
        if (!cancelled) setRates(data);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load shipping rates');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function update(id: string, field: keyof ShippingRate, value: number | boolean) {
    setRates((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function toggleFreeShipping(id: string) {
    setRates((prev) => prev.map((r) => (r.id === id ? { ...r, freeShipping: !r.freeShipping } : r)));
  }

  async function save(rate: ShippingRate) {
    setSavingId(rate.id);
    try {
      const saved = await adminApi.upsertShippingCity({ ...rate, country_code: COUNTRY_CODE });
      // reconcile with what the DB actually returned (real id, etc.)
      setRates((prev) => prev.map((r) => (r.id === rate.id ? saved : r)));
    } catch (e: any) {
      alert(`Couldn't save ${rate.city}: ${e.message || 'unknown error'}`);
    } finally {
      setSavingId(null);
    }
  }

  async function addCity() {
    const city = prompt('City name?');
    if (!city) return;
    const draft = { city, country_code: COUNTRY_CODE, fee: 90, freeShipping: false, active: true };
    try {
      const saved = await adminApi.upsertShippingCity(draft);
      setRates((prev) => [...prev, saved]);
    } catch (e: any) {
      alert(`Couldn't add ${city}: ${e.message || 'unknown error'}`);
    }
  }

  async function markAllFree() {
    const updated = rates.map((r) => ({ ...r, freeShipping: true }));
    setRates(updated);
    try {
      await Promise.all(updated.map((r) => adminApi.upsertShippingCity({ ...r, country_code: COUNTRY_CODE })));
    } catch (e: any) {
      alert(`Some cities failed to save: ${e.message || 'unknown error'}`);
    }
  }

  if (loading) return <p className="text-sm text-brown-soft">Loading shipping rates…</p>;
  if (error) return <p className="text-sm text-red-700">Couldn't load shipping rates: {error}</p>;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-medium">Shipping rates — Egypt</h3>
        <div className="flex gap-2">
          <button onClick={markAllFree} className="border border-gold px-4 py-2 text-[11px] uppercase tracking-[.08em] text-gold hover:bg-gold hover:text-cream">
            Make all free shipping
          </button>
          <button onClick={addCity} className="border border-brown px-4 py-2 text-[11px] uppercase tracking-[.08em] text-brown hover:bg-brown hover:text-cream">
            Add city
          </button>
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[11px] uppercase tracking-[.08em] text-brown-soft">
            <th className="py-3">City</th>
            <th className="py-3">Delivery fee (EGP)</th>
            <th className="py-3">Free shipping</th>
            <th className="py-3">Active</th>
            <th className="py-3 text-right">Save</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((r) => (
            <tr key={r.id} className="border-b border-line">
              <td className="py-3">{r.city}</td>
              <td className="py-3">
                {r.freeShipping ? (
                  <span className="text-[13px] uppercase tracking-[.06em] text-gold">Free</span>
                ) : (
                  <input type="number" className="w-20 border border-line bg-cream px-2 py-1 text-sm"
                    value={r.fee} onChange={(e) => update(r.id, 'fee', Number(e.target.value))} />
                )}
              </td>
              <td className="py-3">
                <button onClick={() => toggleFreeShipping(r.id)}
                  className={`px-3 py-1 text-[10px] uppercase tracking-[.06em] ${r.freeShipping ? 'bg-gold text-cream' : 'border border-line text-brown-soft'}`}>
                  {r.freeShipping ? 'Free' : 'Paid'}
                </button>
              </td>
              <td className="py-3">
                <input type="checkbox" checked={r.active} onChange={(e) => update(r.id, 'active', e.target.checked)} />
              </td>
              <td className="py-3 text-right">
                <button onClick={() => save(r)} disabled={savingId === r.id}
                  className="text-[11px] uppercase tracking-[.06em] text-brown underline underline-offset-2 disabled:opacity-50">
                  {savingId === r.id ? 'Saving…' : 'Save'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}