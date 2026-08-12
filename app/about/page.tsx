import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About — Lost Sheep Found',
};

export default function AboutPage() {
  return (
    <main className="content-page" style={{ textAlign: 'center' }}>
      <p className="content-meta">Who we are</p>
      <h2 style={{ marginTop: 10 }}>A small studio making faith-filled pieces.</h2>
      <p>
        Lost Sheep Found is a Cairo-based studio making Bible journals,
        wooden verse pieces, and everyday keepsakes — each one made to be
        used, not just kept on a shelf.
      </p>
      <p>
        We're a small team: a handful of makers, one studio, and a long
        list of verses we keep coming back to.
      </p>
      <Link href="/our-story" className="text-link">Read our full story <span>→</span></Link>
    </main>
  );
}
