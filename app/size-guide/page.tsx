export const metadata = {
  title: 'Size Guide — Lost Sheep Found',
};

export default function SizeGuidePage() {
  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">Know before you order</p>
        <h1>Size Guide</h1>
        <p>Dimensions for our journals, wood pieces, and keepsakes.</p>
      </section>

      <div className="content-page">
        <h2>Journals</h2>
        <p>All journals are portrait-oriented and sit comfortably in a bag or on a nightstand.</p>
        <ul>
          <li>The Shepherd Journal — 14.8cm × 21cm (A5), 192 pages</li>
          <li>Still Waters Journal — 16cm × 23cm, 224 pages</li>
        </ul>

        <h2>Wood pieces</h2>
        <ul>
          <li>Psalm 23 Wood Block — 14cm × 19cm × 2cm</li>
          <li>Be Still Wood Block — 10cm × 15cm × 2cm</li>
        </ul>

        <h2>Keepsakes</h2>
        <ul>
          <li>Grace &amp; Truth Bookmark — 5cm × 18cm</li>
          <li>Faithful Tote — 38cm × 40cm, 10cm gusset</li>
        </ul>

        <h2>Still not sure?</h2>
        <p>
          Message us on the chat widget or email hello@lostsheepfound.com
          with the piece you're considering — we're happy to help you pick.
        </p>
      </div>
    </main>
  );
}
