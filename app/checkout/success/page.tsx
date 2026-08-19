'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import VerseBlock from '../../components/VerseBlock';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <>
      <div className="mb-[18px] text-[22px] text-[#c2a97e]">✦</div>
      <h2 className="mt-[30px] mb-4 font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Payment received</h2>
      <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
        {orderId ? `Order ${orderId} is confirmed. ` : ''}
        A receipt is on its way to your inbox, and we'll email you again once it ships.
      </p>
      <Link
        href={orderId ? `/account?order_id=${orderId}` : '/account'}
        className="mt-[10px] inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
        View your order <ArrowRight size={16} />
      </Link>
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="pb-[120px] pt-[100px] text-center">
      <div className="mx-auto max-w-[480px] px-[30px]">
        <Suspense fallback={null}>
          <SuccessContent />
        </Suspense>
      </div>

      <div className="relative left-1/2 right-1/2 mt-16 -ml-[50vw] -mr-[50vw] w-screen">
        <VerseBlock
          verse="Every good and perfect gift is from above, coming down from the Father of lights."
          reference="James 1:17"
        />
      </div>
    </main>
  );
}