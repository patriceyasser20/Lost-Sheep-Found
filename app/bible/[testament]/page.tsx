import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getBooksByTestament } from '../../../lib/bible';
import BookFrame from '../BookFrame';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ testament: string }>;
}) {
  const { testament } = await params;
  const label = testament === 'old' ? 'Old Testament' : testament === 'new' ? 'New Testament' : 'Bible';
  return { title: `${label} — Lost Sheep Found` };
}

export default async function TestamentPage({
  params,
}: {
  params: Promise<{ testament: string }>;
}) {
  const { testament } = await params;
  if (testament !== 'old' && testament !== 'new') notFound();

  const books = getBooksByTestament(testament);
  const label = testament === 'old' ? 'Old Testament' : 'New Testament';

  return (
    <main>
      <BookFrame>
        <Link
          href="/bible"
          className="mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[.08em] text-brown-soft transition hover:text-brown"
        >
          <ArrowLeft size={13} /> Back to the cover
        </Link>

        <p className="mb-2 text-center text-[10px] uppercase tracking-[.22em] text-gold">Table of Contents</p>
        <h1 className="mb-10 text-center font-display text-[clamp(30px,4vw,42px)] font-medium tracking-[-.03em]">
          {label}
        </h1>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
          {books.map((book) => (
            <Link
              key={book.slug}
              href={`/bible/${testament}/${book.slug}/1`}
              className="flex items-baseline justify-between gap-2 border-b border-line/70 pb-2 text-[14.5px] text-brown-soft transition hover:border-gold hover:text-brown"
            >
              <span>{book.name}</span>
              <span className="text-[10px] text-brown-soft/60">{book.chapters}</span>
            </Link>
          ))}
        </div>
      </BookFrame>
    </main>
  );
}