export const metadata = {
  title: 'Returns & Exchange — Lost Sheep Found',
};

export default function ReturnExchangePage() {
  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">If it's not quite right</p>
        <h1>Returns &amp; Exchange</h1>
        <p>We want you to be glad you ordered. Here's how it works.</p>
      </section>

      <div className="content-page">
        <p className="content-meta">Updated August 2026</p>

        <h2>14-day return window</h2>
        <p>
          Unused, unpersonalized items can be returned within 14 days of
          delivery for a full refund to your original payment method. Items
          must be in their original condition and packaging.
        </p>

        <h2>Personalized pieces</h2>
        <p>
          Journals, bookmarks, and wood blocks made with a custom name or
          verse are made specifically for you and can't be returned unless
          they arrive damaged or with an error on our part.
        </p>

        <h2>How to start a return</h2>
        <ul>
          <li>Email hello@lostsheepfound.com with your order number</li>
          <li>Let us know which item you'd like to return and why</li>
          <li>We'll send a return label and instructions within one business day</li>
          <li>Refunds are processed within 5 to 7 business days of receiving your return</li>
        </ul>

        <h2>Exchanges</h2>
        <p>
          Prefer a different color? Mention it when you start your return
          and we'll ship the replacement as soon as we receive the original
          piece back.
        </p>

        <h2>Damaged or incorrect orders</h2>
        <p>
          If something arrives damaged or isn't what you ordered, contact us
          within 7 days with a photo and we'll sort out a replacement or
          refund at no cost to you.
        </p>
      </div>
    </main>
  );
}
