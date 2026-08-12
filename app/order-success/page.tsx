'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <main className="mx-auto max-w-[480px] px-[30px] pb-[120px] pt-[100px] text-center">
      <div className="mb-[18px] text-[22px] text-[#c2a97e]">✦</div>
      <h2 className="mt-[30px] mb-4 font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Order placed</h2>
      <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
        {orderId ? `Order ${orderId} is confirmed. ` : ''}
        Since you chose cash on delivery, you'll pay when it arrives. A
        confirmation email is on its way.
      </p>
      <Link href="/shop" className="mt-[10px] inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
        Continue shopping <ArrowRight size={16} />
      </Link>
    </main>
  );
}