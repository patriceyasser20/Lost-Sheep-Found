'use client';

import { useState } from 'react';
import { mockShippingRates, type ShippingRate } from '../../lib/adminTypes';
import { adminApi } from '../../lib/adminApi';

export default function ShippingPanel() {
  const [rates, setRates] = useState<ShippingRate[]>(mockShippingRates);

  function update(id: string, field: keyof ShippingRate, value: number | boolean) {
    setRates((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  async function save(rate: ShippingRate) {
    await adminApi.upsertShippingCity(rate);
  }

  function addCity() {
    const city = prompt('City name?');
    if (!city) return;
    const id = city.toLowerCase().replace(/\s+/g, '-');
    setRates((prev) => [...prev, { id, city, standardFee: 90, expressFee: 0, active: true }]);
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-medium">Shipping rates — Egypt</h3>
        <button onClick={addCity} className="border border-brown px-4 py-2 text-[11px] uppercase tracking-[.08em] text-brown hover:bg-brown hover:text-cream">
          Add city
        </button>
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[11px] uppercase tracking-[.08em] text-brown-soft">
            <th className="py-3">City</th>
            <th className="py-3">Standard (EGP)</th>
            <th className="py-3">Express (EGP)</th>
            <th className="py-3">Active</th>
            <th className="py-3 text-right">Save</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((r) => (
            <tr key={r.id} className="border-b border-line">
              <td className="py-3">{r.city}</td>
              <td className="py-3"><input type="number" className="w-20 border border-line bg-cream px-2 py-1 text-sm" value={r.standardFee} onChange={(e) => update(r.id, 'standardFee', Number(e.target.value))} /></td>
              <td className="py-3"><input type="number" className="w-20 border border-line bg-cream px-2 py-1 text-sm" value={r.expressFee} onChange={(e) => update(r.id, 'expressFee', Number(e.target.value))} /></td>
              <td className="py-3"><input type="checkbox" checked={r.active} onChange={(e) => update(r.id, 'active', e.target.checked)} /></td>
              <td className="py-3 text-right"><button onClick={() => save(r)} className="text-[11px] uppercase tracking-[.06em] text-brown underline underline-offset-2">Save</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}