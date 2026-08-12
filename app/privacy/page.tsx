export const metadata = {
  title: "Privacy Policy — Lost Sheep Found",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">How we handle your data</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">Privacy Policy</h1>
        <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">What we collect, why we collect it, and how it's kept safe.</p>
      </section>

      <div className="mx-auto max-w-[780px] px-[30px] pb-[120px] pt-[70px]">
        <p className="mb-[6px] text-[10px] uppercase tracking-[.16em] text-gold">Updated August 2026</p>

        <h2 className="mb-4 mt-[30px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Information we collect</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          When you place an order, create an account, or contact us, we
          collect information like your name, email, phone number, shipping
          address, and payment details. We also collect basic browsing data
          to help us improve the site.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">How we use it</h2>
        <ul className="mb-[18px] list-disc pl-5 text-[14.5px] leading-[1.85] text-brown-soft">
          <li className="mb-1.5">To process and deliver your orders</li>
          <li className="mb-1.5">To respond to questions and customer support requests</li>
          <li className="mb-1.5">To send order updates and, if you've opted in, occasional newsletters</li>
          <li className="mb-1.5">To improve our products, site, and shopping experience</li>
        </ul>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">How we protect it</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Payment information is processed through encrypted, PCI-compliant
          payment providers — we never store your full card details on our
          servers. Access to customer information is limited to team
          members who need it to do their jobs.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Sharing your information</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          We share information only with the services that help us run our
          business — payment processors, shipping couriers, and email
          providers — and never sell your data to third parties.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Cookies</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          We use cookies to keep your cart saved, remember your
          preferences, and understand how visitors use our site. You can
          disable cookies in your browser settings, though some features
          may not work as smoothly.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Your choices</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          You can ask to see, update, or delete the personal information we
          hold about you at any time by emailing
          hello@lostsheepfound.com. You can also unsubscribe from marketing
          emails using the link at the bottom of any newsletter.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Changes to this policy</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          We'll update this page if our practices change, and note the date
          at the top so you can see when it was last revised.
        </p>
      </div>
    </main>
  );
}