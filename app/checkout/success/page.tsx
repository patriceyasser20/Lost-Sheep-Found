'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <main className="content-page" style={{ maxWidth: 480, paddingTop: 100, textAlign: 'center' }}>
      <div className="custom-symbol">✦</div>
      <h2>Payment received</h2>
      <p>
        {orderId ? `Order ${orderId} is confirmed. ` : ''}
        A receipt is on its way to your inbox, and we'll email you again once it ships.
      </p>
      <Link href="/account" className="button button-dark" style={{ marginTop: 10 }}>
        View your orders <ArrowRight size={16} />
      </Link>
    </main>
  );
}
