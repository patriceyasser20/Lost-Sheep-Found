export const metadata = {
  title: 'Sustainability — Lost Sheep Found',
};

export default function SustainabilityPage() {
  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">Made with care</p>
        <h1>Sustainability</h1>
        <p>How we source materials and make decisions we can stand behind.</p>
      </section>

      <div className="content-page">
        <h2>Paper &amp; wood</h2>
        <p>
          Our journal paper is sourced from FSC-certified mills, and our
          wood pieces use offcuts and sustainably harvested acacia and pine
          from local suppliers — nothing rare or endangered.
        </p>

        <h2>Packaging</h2>
        <p>
          Orders ship in recyclable kraft boxes with paper tape, no plastic
          air pillows. Bookmarks and small keepsakes ship in kraft sleeves
          rather than boxes where possible.
        </p>

        <h2>Small batches</h2>
        <p>
          We produce in small runs rather than mass quantities, which means
          less unsold inventory and less waste — even if it occasionally
          means a piece is briefly out of stock.
        </p>

        <h2>Still learning</h2>
        <p>
          We're a small studio and don't have every answer yet. If
          sustainability matters to you and you have a question about a
          specific piece, ask — we'll tell you honestly what we know.
        </p>
      </div>
    </main>
  );
}
