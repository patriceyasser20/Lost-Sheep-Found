export const metadata = {
  title: 'Returns & Exchange — Lost Sheep Found',
};

export default function ReturnExchangePage() {
  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">If it's not quite right</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">Returns &amp; Exchange</h1>
        <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">We want you to be glad you ordered. Here's how it works.</p>
      </section>

      <div className="mx-auto max-w-[780px] px-[30px] pb-[120px] pt-[70px]">
        <p className="mb-[6px] text-[10px] uppercase tracking-[.16em] text-gold">Updated August 2026</p>

        <h2 className="mb-4 mt-[30px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">14-day return window</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Unused, unpersonalized items can be returned within 14 days of
          delivery for a full refund to your original payment method. Items
          must be in their original condition and packaging.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Personalized pieces</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Journals, bookmarks, and wood blocks made with a custom name or
          verse are made specifically for you and can't be returned unless
          they arrive damaged or with an error on our part.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">How to start a return</h2>
        <ul className="mb-[18px] list-disc pl-5 text-[14.5px] leading-[1.85] text-brown-soft">
          <li className="mb-1.5">Email hello@lostsheepfound.com with your order number</li>
          <li className="mb-1.5">Let us know which item you'd like to return and why</li>
          <li className="mb-1.5">We'll send a return label and instructions within one business day</li>
          <li className="mb-1.5">Refunds are processed within 5 to 7 business days of receiving your return</li>
        </ul>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Exchanges</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Prefer a different color? Mention it when you start your return
          and we'll ship the replacement as soon as we receive the original
          piece back.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Damaged or incorrect orders</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          If something arrives damaged or isn't what you ordered, contact us
          within 7 days with a photo and we'll sort out a replacement or
          refund at no cost to you.
        </p>
      </div>
    </main>
  );
}