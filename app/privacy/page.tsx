
export const metadata = {
  title: "Privacy Policy — Lost Sheep Found",
};

export default function PrivacyPage() {
  return (
    <main>

      <section className="page-hero">
        <p className="eyebrow">How we handle your data</p>
        <h1>Privacy Policy</h1>
        <p>What we collect, why we collect it, and how it's kept safe.</p>
      </section>

      <div className="content-page">
        <p className="content-meta">Updated August 2026</p>

        <h2>Information we collect</h2>
        <p>
          When you place an order, create an account, or contact us, we
          collect information like your name, email, phone number, shipping
          address, and payment details. We also collect basic browsing data
          to help us improve the site.
        </p>

        <h2>How we use it</h2>
        <ul>
          <li>To process and deliver your orders</li>
          <li>To respond to questions and customer support requests</li>
          <li>To send order updates and, if you've opted in, occasional newsletters</li>
          <li>To improve our products, site, and shopping experience</li>
        </ul>

        <h2>How we protect it</h2>
        <p>
          Payment information is processed through encrypted, PCI-compliant
          payment providers — we never store your full card details on our
          servers. Access to customer information is limited to team
          members who need it to do their jobs.
        </p>

        <h2>Sharing your information</h2>
        <p>
          We share information only with the services that help us run our
          business — payment processors, shipping couriers, and email
          providers — and never sell your data to third parties.
        </p>

        <h2>Cookies</h2>
        <p>
          We use cookies to keep your cart saved, remember your
          preferences, and understand how visitors use our site. You can
          disable cookies in your browser settings, though some features
          may not work as smoothly.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask to see, update, or delete the personal information we
          hold about you at any time by emailing
          hello@lostsheepfound.com. You can also unsubscribe from marketing
          emails using the link at the bottom of any newsletter.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We'll update this page if our practices change, and note the date
          at the top so you can see when it was last revised.
        </p>
      </div>

    </main>
  );
}
