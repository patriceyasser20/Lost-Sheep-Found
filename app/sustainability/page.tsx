export const metadata = {
  title: 'Sustainability — Lost Sheep Found',
};

export default function SustainabilityPage() {
  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Made with care</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">Sustainability</h1>
        <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">How we source materials and make decisions we can stand behind.</p>
      </section>

      <div className="mx-auto max-w-[780px] px-[30px] pb-[120px] pt-[70px]">
        <h2 className="mb-4 mt-[30px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Paper &amp; wood</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Our journal paper is sourced from FSC-certified mills, and our
          wood pieces use offcuts and sustainably harvested acacia and pine
          from local suppliers — nothing rare or endangered.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Packaging</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Orders ship in recyclable kraft boxes with paper tape, no plastic
          air pillows. Bookmarks and small keepsakes ship in kraft sleeves
          rather than boxes where possible.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Small batches</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          We produce in small runs rather than mass quantities, which means
          less unsold inventory and less waste — even if it occasionally
          means a piece is briefly out of stock.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Still learning</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          We're a small studio and don't have every answer yet. If
          sustainability matters to you and you have a question about a
          specific piece, ask — we'll tell you honestly what we know.
        </p>
      </div>
    </main>
  );
}