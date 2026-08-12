'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type ShippingCity = { city: string; fee: number };

export default function AdminShippingPage({
  params,
}: {
  params: Promise<{ countryCode: string }>;
}) {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState('');
  const [cities, setCities] = useState<ShippingCity[]>([]);

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      router.replace('/admin/login');
      return;
    }
    params.then((p) => setCountryCode(p.countryCode));
    // TODO: adminApi.getShippingCities(countryCode) once Supabase is wired up.
    setCities([
      { city: 'Cairo', fee: 90 },
      { city: 'Alexandria', fee: 110 },
      { city: 'Aswan', fee: 150 },
    ]);
  }, [router, params]);

  return (
    <main className="content-page" style={{ maxWidth: 700 }}>
      <p className="eyebrow">Admin · Shipping</p>
      <h2>{countryCode.toUpperCase() || '…'}</h2>

      <ul>
        {cities.map((c) => (
          <li key={c.city}>{c.city} — EGP {c.fee}</li>
        ))}
      </ul>
      <p className="form-note">
        Editing is disabled until Supabase and adminApi.upsertShipping are connected.
      </p>
    </main>
  );
}
