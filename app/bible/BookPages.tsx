'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import PageTurn from './PageTurn';
import {
  HIGHLIGHT_COLORS,
  colorBg,
  getChapterHighlights,
  addHighlight,
  updateHighlightColor,
  removeHighlight,
  type HighlightRange,
  type HighlightColor,
} from '../../lib/highlights';

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

// ---------- selection → global character offset helpers ----------

function closestVerseText(node: Node | null): HTMLElement | null {
  if (!node) return null;
  const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement);
  return el?.closest('[data-verse-text]') ?? null;
}

// Converts a (node, localOffset) pair — as given by a DOM Range — into a
// single character offset within the full plain text of `root`. Needed
// because once a verse contains saved <mark> spans, its text is split
// across several sibling text nodes, so a Range's own offset is only
// local to whichever text node the selection happened to start/end in.
function getGlobalOffset(root: HTMLElement, targetNode: Node, targetOffset: number): number {
  let offset = 0;
  let found = -1;

  function walk(node: Node) {
    if (found !== -1) return;
    if (node.nodeType === Node.TEXT_NODE) {
      if (node === targetNode) {
        found = offset + targetOffset;
        return;
      }
      offset += node.textContent?.length ?? 0;
    } else {
      node.childNodes.forEach(walk);
    }
  }
  walk(root);
  return found === -1 ? offset : found;
}

function renderVerseSegments(text: string, ranges: HighlightRange[]) {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const segments: { text: string; highlight?: HighlightRange }[] = [];
  let cursor = 0;
  for (const r of sorted) {
    const start = Math.max(0, Math.min(text.length, r.start));
    const end = Math.max(start, Math.min(text.length, r.end));
    if (start > cursor) segments.push({ text: text.slice(cursor, start) });
    if (end > start) segments.push({ text: text.slice(start, end), highlight: r });
    cursor = Math.max(cursor, end);
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
}

// ---------- popover ----------

type PopoverState =
  | { mode: 'new'; verse: number; start: number; end: number; rect: { top: number; bottom: number; left: number } }
  | { mode: 'edit'; id: string; color: HighlightColor; rect: { top: number; bottom: number; left: number } };

function HighlightPopover({
  popover,
  onPick,
  onClear,
  onClose,
}: {
  popover: PopoverState;
  onPick: (color: HighlightColor) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const left = Math.max(8, Math.min(popover.rect.left, (typeof window !== 'undefined' ? window.innerWidth : 400) - 232));

  return (
    <div
      data-highlight-popover
      className="fixed z-30 flex items-center gap-2 border border-line bg-cream px-3 py-2 shadow-[0_10px_24px_rgba(76,60,46,.16)]"
      style={{ top: popover.rect.bottom + 8, left }}
    >
      {HIGHLIGHT_COLORS.map((c) => (
        <button
          key={c.key}
          type="button"
          aria-label={`Highlight in ${c.label}`}
          onClick={() => onPick(c.key)}
          className={`h-6 w-6 rounded-full border transition hover:scale-110 ${
            popover.mode === 'edit' && popover.color === c.key ? 'border-brown' : 'border-line'
          }`}
          style={{ backgroundColor: c.swatch }}
        />
      ))}
      {popover.mode === 'edit' && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Remove highlight"
          className="ml-1 border-l border-line pl-2 text-[10px] uppercase tracking-[.06em] text-brown-soft hover:text-brown"
        >
          Clear
        </button>
      )}
      <button type="button" onClick={onClose} aria-label="Close" className="text-brown-soft hover:text-brown">
        <X size={13} />
      </button>
    </div>
  );
}

function VerseList({ verses, rangesByVerse }: { verses: Verse[]; rangesByVerse: Map<number, HighlightRange[]> }) {
  return (
    <>
      {verses.map((v) => {
        const segments = renderVerseSegments(v.text, rangesByVerse.get(v.verse) || []);
        return (
          <p key={v.verse} className="mb-[3px] text-[17px] leading-[1.95] text-brown">
            <sup className="mr-1.5 text-[10px] font-semibold text-gold">{v.verse}</sup>
            <span data-verse-text data-verse={v.verse}>
              {segments.map((seg, i) =>
                seg.highlight ? (
                  <mark
                    key={i}
                    data-highlight-id={seg.highlight.id}
                    className="cursor-pointer rounded-[2px]"
                    style={{ backgroundColor: colorBg(seg.highlight.color) }}
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
            </span>
          </p>
        );
      })}
    </>
  );
}

export default function BookPages({
  verses,
  bookName,
  bookHref,
  chapterNum,
  totalChapters,
  chapterKey,
  prevChapter,
  nextChapter,
}: {
  verses: Verse[];
  bookName: string;
  bookHref: string;
  chapterNum: number;
  totalChapters: number;
  chapterKey: string;
  prevChapter: ChapterLink;
  nextChapter: ChapterLink;
}) {
  const { spreads, linesPerColumn } = useMemo(() => paginate(verses), [verses]);
  const [spreadIndex, setSpreadIndex] = useState(0);

  const [highlights, setHighlights] = useState<HighlightRange[]>([]);
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHighlights(getChapterHighlights(chapterKey));
    setPopover(null);
  }, [chapterKey]);

  // close the popover if the page scrolls out from under it — its position
  // is captured once, at selection time, and doesn't track scroll.
  useEffect(() => {
    if (!popover) return;
    const close = () => setPopover(null);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [popover]);

  function handleMouseUp(e: React.MouseEvent | React.TouchEvent) {
    const target = e.target as HTMLElement;
    if (target.closest('[data-highlight-popover]')) return; // let the popover's own buttons handle themselves

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const startEl = closestVerseText(range.startContainer);
      const endEl = closestVerseText(range.endContainer);

      // Only support a selection that stays within a single verse's text —
      // selections spanning multiple verses (or landing outside any verse
      // text, e.g. on the verse number) are silently ignored rather than
      // producing a broken highlight.
      if (startEl && startEl === endEl) {
        const start = getGlobalOffset(startEl, range.startContainer, range.startOffset);
        const end = getGlobalOffset(startEl, range.endContainer, range.endOffset);
        const [lo, hi] = start <= end ? [start, end] : [end, start];

        if (hi > lo) {
          const verseNum = Number(startEl.getAttribute('data-verse'));
          const rect = range.getBoundingClientRect();
          setPopover({
            mode: 'new',
            verse: verseNum,
            start: lo,
            end: hi,
            rect: { top: rect.top, bottom: rect.bottom, left: rect.left },
          });
          return;
        }
      }
    }

    // No valid new selection this time. If the click landed on an existing
    // highlighted span, its own onClick (below) opens the edit popover —
    // don't close it out from under that here.
    const onMark = target.closest('[data-highlight-id]');
    if (!onMark) setPopover(null);
  }

  function handleMarkClick(e: React.MouseEvent) {
    const mark = (e.target as HTMLElement).closest('[data-highlight-id]');
    if (!mark) return;
    const id = mark.getAttribute('data-highlight-id')!;
    const existing = highlights.find((h) => h.id === id);
    if (!existing) return;
    const rect = mark.getBoundingClientRect();
    setPopover({
      mode: 'edit',
      id,
      color: existing.color,
      rect: { top: rect.top, bottom: rect.bottom, left: rect.left },
    });
  }

  function handlePickColor(color: HighlightColor) {
    if (!popover) return;
    if (popover.mode === 'new') {
      const updated = addHighlight(chapterKey, { verse: popover.verse, start: popover.start, end: popover.end, color });
      setHighlights(updated);
      window.getSelection()?.removeAllRanges();
    } else {
      const updated = updateHighlightColor(chapterKey, popover.id, color);
      setHighlights(updated);
    }
    setPopover(null);
  }

  function handleClear() {
    if (!popover || popover.mode !== 'edit') return;
    const updated = removeHighlight(chapterKey, popover.id);
    setHighlights(updated);
    setPopover(null);
  }

  const rangesByVerse = useMemo(() => {
    const map = new Map<number, HighlightRange[]>();
    for (const h of highlights) {
      const list = map.get(h.verse) || [];
      list.push(h);
      map.set(h.verse, list);
    }
    return map;
  }, [highlights]);

  const spread = spreads[spreadIndex] ?? [];
  const { left, right } = splitColumns(spread, linesPerColumn);

  const atFirstSpread = spreadIndex === 0;
  const atLastSpread = spreadIndex === spreads.length - 1;

  return (
    <div ref={containerRef}>
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
        <div
          className="grid grid-cols-1 gap-x-16 select-text md:grid-cols-2"
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          onClick={handleMarkClick}
        >
          <div className="md:border-r md:border-line md:pr-8">
            <VerseList verses={left} rangesByVerse={rangesByVerse} />
          </div>
          <div className="md:pl-8">
            <VerseList verses={right} rangesByVerse={rangesByVerse} />
          </div>
        </div>
      </PageTurn>

      {popover && (
        <HighlightPopover
          popover={popover}
          onPick={handlePickColor}
          onClear={handleClear}
          onClose={() => setPopover(null)}
        />
      )}

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