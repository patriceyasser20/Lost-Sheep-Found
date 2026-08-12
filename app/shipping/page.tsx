
export const metadata = {
  title: "Shipping — Lost Sheep Found",
};

export default function ShippingPage() {
  return (
    <main>

      <section className="page-hero">
        <p className="eyebrow">Getting to you</p>
        <h1>Shipping</h1>
        <p>How and when your order makes its way home.</p>
      </section>

      <div className="content-page">
        <p className="content-meta">Updated August 2026</p>

        <h2>Delivery areas</h2>
        <p>
          We currently ship to all governorates within Egypt. International
          shipping is in the works and will be announced through our
          newsletter once it launches.
        </p>

        <h2>Delivery times</h2>
        <ul>
          <li>Cairo & Giza — 2 to 3 business days (standard), next day (express)</li>
          <li>Alexandria & the Delta — 3 to 4 business days (standard)</li>
          <li>Upper Egypt & Red Sea governorates — 4 to 6 business days (standard)</li>
        </ul>
        <p>
          Personalized pieces add 1 to 2 extra days to allow time for
          engraving or embroidery before your order ships.
        </p>

        <h2>Shipping costs</h2>
        <p>
          Standard delivery is EGP 90 nationwide. Express delivery is EGP
          150 and available in Cairo, Giza, and Alexandria. Orders over
          EGP 1,500 ship free with standard delivery.
        </p>

        <h2>Tracking your order</h2>
        <p>
          Once your order leaves our studio, you'll receive an email with a
          tracking link. You can also check on an order any time through
          the confirmation email you received at checkout.
        </p>

        <h2>Delays</h2>
        <p>
          Public holidays and unusually high order volume around gifting
          seasons can add a day or two to the times above. If your order is
          running late, reach out through our contact page and we'll look
          into it right away.
        </p>
      </div>

    </main>
  );
}
