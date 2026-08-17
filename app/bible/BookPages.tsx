'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import PageTurn from './PageTurn';

type Verse = { verse: number; text: string };
type ChapterLink = { testament: string; book: string; chapter: number } | null;

// Honest caveat: there's no DOM measurement here, so this is a heuristic,
// not a pixel-exact typesetter — a few verses right at a page boundary may
// end up on one side or the other slightly earlier/later than an ideal
// layout engine would place them. But it guarantees every spread fits the
// fixed height below, which is what actually prevents scrolling.
const LINE_HEIGHT_PX = 33; // ~17px font * 1.95 line-height
const CHARS_PER_LINE = 44; // approx chars per line at this column width
const PAGE_HEIGHT_PX = 480; // per-column reading height budget

function estimateLines(text: string) {
  return Math.max(1, Math.ceil((text.length + 4) / CHARS_PER_LINE)) + 0.3; // +0.3 for paragraph gap
}

function paginate(verses: Verse[]) {
  const linesPerColumn = Math.floor(PAGE_HEIGHT_PX / LINE_HEIGHT_PX);
  const linesPerSpread = linesPerColumn * 2;

  const spreads: Verse[][] = [];
  let current: Verse[] = [];
  let currentLines = 0;

  for (const v of verses) {
    const lines = estimateLines(v.text);
    if (currentLines + lines > linesPerSpread && current.length > 0) {
      spreads.push(current);
      current = [];
      currentLines = 0;
    }
    current.push(v);
    currentLines += lines;
  }
  if (current.length > 0) spreads.push(current);
  return { spreads, linesPerColumn };
}

function splitColumns(spread: Verse[], linesPerColumn: number) {
  const left: Verse[] = [];
  const right: Verse[] = [];
  let lines = 0;
  let filled = false;

  for (const v of spread) {
    const l = estimateLines(v.text);
    if (!filled && lines + l > linesPerColumn && left.length > 0) filled = true;
    if (!filled) {
      left.push(v);
      lines += l;
    } else {
      right.push(v);
    }
  }
  return { left, right };
}

function VerseList({ verses }: { verses: Verse[] }) {
  return (
    <>
      {verses.map((v) => (
        <p key={v.verse} className="mb-[3px] text-[17px] leading-[1.95] text-brown">
          <sup className="mr-1.5 text-[10px] font-semibold text-gold">{v.verse}</sup>
          {v.text}
        </p>
      ))}
    </>
  );
}

export default function BookPages({
  verses,
  bookName,
  bookHref,
  chapterNum,
  totalChapters,
  prevChapter,
  nextChapter,
}: {
  verses: Verse[];
  bookName: string;
  bookHref: string;
  chapterNum: number;
  totalChapters: number;
  prevChapter: ChapterLink;
  nextChapter: ChapterLink;
}) {
  const { spreads, linesPerColumn } = useMemo(() => paginate(verses), [verses]);
  const [spreadIndex, setSpreadIndex] = useState(0);

  const spread = spreads[spreadIndex] ?? [];
  const { left, right } = splitColumns(spread, linesPerColumn);

  const atFirstSpread = spreadIndex === 0;
  const atLastSpread = spreadIndex === spreads.length - 1;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between text-[11px] uppercase tracking-[.08em] text-brown-soft">
        <Link href={bookHref} className="flex items-center gap-2 transition hover:text-brown">
          <ArrowLeft size={13} /> {bookName}
        </Link>
        <Link href="/bible" className="transition hover:text-brown">
          Cover
        </Link>
      </div>

      <div className="mb-6 text-center">
        <p className="mb-2 text-[10px] uppercase tracking-[.2em] text-gold">
          Chapter {chapterNum} of {totalChapters}
          {spreads.length > 1 ? ` · Page ${spreadIndex + 1} of ${spreads.length}` : ''}
        </p>
        <h1 className="font-display text-[clamp(28px,4vw,42px)] font-medium tracking-[-.03em]">
          {bookName} {chapterNum}
        </h1>
      </div>

      <PageTurn key={spreadIndex}>
        <div className="grid grid-cols-1 gap-x-16 md:h-[480px] md:grid-cols-2 md:overflow-hidden">
          <div className="md:overflow-hidden md:border-r md:border-line md:pr-8">
            <VerseList verses={left} />
          </div>
          <div className="md:overflow-hidden md:pl-8">
            <VerseList verses={right} />
          </div>
        </div>
      </PageTurn>

      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        {!atFirstSpread ? (
          <button
            onClick={() => setSpreadIndex((i) => i - 1)}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[.08em] text-brown-soft transition hover:text-brown"
          >
            <ChevronLeft size={15} /> Previous page
          </button>
        ) : prevChapter ? (
          <Link
            href={`/bible/${prevChapter.testament}/${prevChapter.book}/${prevChapter.chapter}`}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[.08em] text-brown-soft transition hover:text-brown"
          >
            <ChevronLeft size={15} /> Previous chapter
          </Link>
        ) : (
          <span />
        )}

        {!atLastSpread ? (
          <button
            onClick={() => setSpreadIndex((i) => i + 1)}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[.08em] text-brown-soft transition hover:text-brown"
          >
            Next page <ChevronRight size={15} />
          </button>
        ) : nextChapter ? (
          <Link
            href={`/bible/${nextChapter.testament}/${nextChapter.book}/${nextChapter.chapter}`}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[.08em] text-brown-soft transition hover:text-brown"
          >
            Next chapter <ChevronRight size={15} />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}