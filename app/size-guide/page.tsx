export const metadata = {
  title: 'Size Guide — Lost Sheep Found',
};

export default function SizeGuidePage() {
  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Know before you order</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">Size Guide</h1>
        <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">Dimensions for our journals, wood pieces, and keepsakes.</p>
      </section>

      <div className="mx-auto max-w-[780px] px-[30px] pb-[120px] pt-[70px]">
        <h2 className="mb-4 mt-[30px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Journals</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">All journals are portrait-oriented and sit comfortably in a bag or on a nightstand.</p>
        <ul className="mb-[18px] list-disc pl-5 text-[14.5px] leading-[1.85] text-brown-soft">
          <li className="mb-1.5">The Shepherd Journal — 14.8cm × 21cm (A5), 192 pages</li>
          <li className="mb-1.5">Still Waters Journal — 16cm × 23cm, 224 pages</li>
        </ul>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Wood pieces</h2>
        <ul className="mb-[18px] list-disc pl-5 text-[14.5px] leading-[1.85] text-brown-soft">
          <li className="mb-1.5">Psalm 23 Wood Block — 14cm × 19cm × 2cm</li>
          <li className="mb-1.5">Be Still Wood Block — 10cm × 15cm × 2cm</li>
        </ul>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Keepsakes</h2>
        <ul className="mb-[18px] list-disc pl-5 text-[14.5px] leading-[1.85] text-brown-soft">
          <li className="mb-1.5">Grace &amp; Truth Bookmark — 5cm × 18cm</li>
          <li className="mb-1.5">Faithful Tote — 38cm × 40cm, 10cm gusset</li>
        </ul>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Still not sure?</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Message us on the chat widget or email hello@lostsheepfound.com
          with the piece you're considering — we're happy to help you pick.
        </p>
      </div>
    </main>
  );
}