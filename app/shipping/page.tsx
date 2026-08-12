export const metadata = {
  title: "Shipping — Lost Sheep Found",
};

export default function ShippingPage() {
  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Getting to you</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">Shipping</h1>
        <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">How and when your order makes its way home.</p>
      </section>

      <div className="mx-auto max-w-[780px] px-[30px] pb-[120px] pt-[70px]">
        <p className="mb-[6px] text-[10px] uppercase tracking-[.16em] text-gold">Updated August 2026</p>

        <h2 className="mb-4 mt-[30px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Delivery areas</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          We currently ship to all governorates within Egypt. International
          shipping is in the works and will be announced through our
          newsletter once it launches.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Delivery times</h2>
        <ul className="mb-[18px] list-disc pl-5 text-[14.5px] leading-[1.85] text-brown-soft">
          <li className="mb-1.5">Cairo & Giza — 2 to 3 business days (standard), next day (express)</li>
          <li className="mb-1.5">Alexandria & the Delta — 3 to 4 business days (standard)</li>
          <li className="mb-1.5">Upper Egypt & Red Sea governorates — 4 to 6 business days (standard)</li>
        </ul>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Personalized pieces add 1 to 2 extra days to allow time for
          engraving or embroidery before your order ships.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Shipping costs</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Standard delivery is EGP 90 nationwide. Express delivery is EGP
          150 and available in Cairo, Giza, and Alexandria. Orders over
          EGP 1,500 ship free with standard delivery.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Tracking your order</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Once your order leaves our studio, you'll receive an email with a
          tracking link. You can also check on an order any time through
          the confirmation email you received at checkout.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Delays</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Public holidays and unusually high order volume around gifting
          seasons can add a day or two to the times above. If your order is
          running late, reach out through our contact page and we'll look
          into it right away.
        </p>
      </div>
    </main>
  );
}