'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <main className="mx-auto max-w-[480px] px-[30px] pb-[120px] pt-[100px] text-center">
      <div className="mb-[18px] text-[22px] text-[#c2a97e]">✦</div>
      <h2 className="mt-[30px] mb-4 font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Payment received</h2>
      <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
        {orderId ? `Order ${orderId} is confirmed. ` : ''}
        A receipt is on its way to your inbox, and we'll email you again once it ships.
      </p>
      <Link href="/account" className="mt-[10px] inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
        View your orders <ArrowRight size={16} />
      </Link>
    </main>
  );
}