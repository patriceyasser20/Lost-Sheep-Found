'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <main className="content-page" style={{ maxWidth: 480, paddingTop: 100, textAlign: 'center' }}>
      <div className="custom-symbol">✦</div>
      <h2>Order placed</h2>
      <p>
        {orderId ? `Order ${orderId} is confirmed. ` : ''}
        Since you chose cash on delivery, you'll pay when it arrives. A
        confirmation email is on its way.
      </p>
      <Link href="/shop" className="button button-dark" style={{ marginTop: 10 }}>
        Continue shopping <ArrowRight size={16} />
      </Link>
    </main>
  );
}
