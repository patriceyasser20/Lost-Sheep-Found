import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="grid grid-cols-1 gap-[50px] bg-[#e8dfd1] px-[25px] pb-[22px] pt-[55px] md:grid-cols-[1.2fr_1fr] md:px-[50px] md:pt-[70px] md:pb-[25px]">
      <div>
        <div className="font-display text-[34px]">lost sheep found</div>
        <p className="text-xs text-brown-soft">Faith-filled pieces for your everyday walk.</p>
      </div>
      <div className="grid grid-cols-3 gap-[25px]">
        <div className="flex flex-col gap-[10px]">
          <strong className="mb-[5px] text-[9px] tracking-[.18em] uppercase text-gold">Shop</strong>
          <Link href="/shop" className="text-xs text-brown-soft hover:text-brown">All pieces</Link>
          <Link href="/collection/bible-journals" className="text-xs text-brown-soft hover:text-brown">Journals</Link>
          <Link href="/collection/wood-blocks" className="text-xs text-brown-soft hover:text-brown">Wood verses</Link>
          <Link href="/sale" className="text-xs text-brown-soft hover:text-brown">Sale</Link>
        </div>
        <div className="flex flex-col gap-[10px]">
          <strong className="mb-[5px] text-[9px] tracking-[.18em] uppercase text-gold">About</strong>
          <Link href="/about" className="text-xs text-brown-soft hover:text-brown">About</Link>
          <Link href="/our-story" className="text-xs text-brown-soft hover:text-brown">Our story</Link>
          <Link href="/press" className="text-xs text-brown-soft hover:text-brown">Press</Link>
          <Link href="/sustainability" className="text-xs text-brown-soft hover:text-brown">Sustainability</Link>
        </div>
        <div className="flex flex-col gap-[10px]">
          <strong className="mb-[5px] text-[9px] tracking-[.18em] uppercase text-gold">Help</strong>
          <Link href="/customer-service" className="text-xs text-brown-soft hover:text-brown">Customer service</Link>
          <Link href="/shipping" className="text-xs text-brown-soft hover:text-brown">Shipping</Link>
          <Link href="/return-exchange" className="text-xs text-brown-soft hover:text-brown">Returns &amp; exchange</Link>
          <Link href="/size-guide" className="text-xs text-brown-soft hover:text-brown">Size guide</Link>
          <Link href="/faq" className="text-xs text-brown-soft hover:text-brown">FAQ</Link>
          <Link href="/contact" className="text-xs text-brown-soft hover:text-brown">Contact</Link>
        </div>
      </div>
      <div className="col-span-1 border-t border-brown/[.14] pt-[25px] text-[9px] tracking-[.1em] uppercase text-[#8a7967] md:col-span-2">
        © 2026 Lost Sheep Found · Made with grace.
      </div>
    </footer>
  );
}