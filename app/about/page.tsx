import Link from 'next/link';
import VerseBlock from '../components/VerseBlock';

export const metadata = {
  title: 'About — Lost Sheep Found',
};

export default function AboutPage() {
  return (
    <main>
      <div className="mx-auto max-w-[780px] px-[30px] pb-[70px] pt-[70px] text-center">
        <p className="mb-[6px] text-[10px] uppercase tracking-[.16em] text-gold">Who we are</p>
        <h2 className="mt-[10px] mb-4 font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">A small studio making faith-filled pieces.</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Lost Sheep Found is a Cairo-based studio making Bible journals,
          wooden verse pieces, and everyday keepsakes — each one made to be
          used, not just kept on a shelf.
        </p>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          We're a small team: a handful of makers, one studio, and a long
          list of verses we keep coming back to.
        </p>
        <Link href="/our-story" className="text-xs uppercase tracking-[.08em] border-b border-gold pb-[5px]">Read our full story <span className="ml-[7px]">→</span></Link>
      </div>

      <VerseBlock
        verse="Whatever you do, work at it with all your heart, as working for the Lord."
        reference="Colossians 3:23"
      />
    </main>
  );
}