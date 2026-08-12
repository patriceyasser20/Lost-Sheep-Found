import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <div className="footer-logo">lost sheep found</div>
        <p>Faith-filled pieces for your everyday walk.</p>
      </div>
      <div className="footer-links">
        <div>
          <strong>Shop</strong>
          <Link href="/shop">All pieces</Link>
          <Link href="/collection/bible-journals">Journals</Link>
          <Link href="/collection/wood-blocks">Wood verses</Link>
          <Link href="/sale">Sale</Link>
        </div>
        <div>
          <strong>About</strong>
          <Link href="/about">About</Link>
          <Link href="/our-story">Our story</Link>
          <Link href="/press">Press</Link>
          <Link href="/sustainability">Sustainability</Link>
        </div>
        <div>
          <strong>Help</strong>
          <Link href="/customer-service">Customer service</Link>
          <Link href="/shipping">Shipping</Link>
          <Link href="/return-exchange">Returns &amp; exchange</Link>
          <Link href="/size-guide">Size guide</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Lost Sheep Found · Made with grace.</div>
    </footer>
  );
}
