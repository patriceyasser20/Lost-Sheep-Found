'use client';

export type HighlightColor = 'gold' | 'sage' | 'rose' | 'sky' | 'lavender';

export const HIGHLIGHT_COLORS: { key: HighlightColor; label: string; swatch: string; bg: string }[] = [
  { key: 'gold', label: 'Gold', swatch: '#C9A227', bg: '#F3E8C9' },
  { key: 'sage', label: 'Sage', swatch: '#8A9B6E', bg: '#E3E8D8' },
  { key: 'rose', label: 'Rose', swatch: '#C97B84', bg: '#F3DEE0' },
  { key: 'sky', label: 'Sky', swatch: '#7F97AC', bg: '#DFE6EC' },
  { key: 'lavender', label: 'Lavender', swatch: '#9C89B8', bg: '#E9E1F0' },
];

export function colorBg(color: HighlightColor) {
  return HIGHLIGHT_COLORS.find((c) => c.key === color)?.bg ?? '#F3E8C9';
}

export type HighlightRange = {
  id: string;
  verse: number;
  start: number; // character offset into that verse's plain text
  end: number; // exclusive
  color: HighlightColor;
};

const STORAGE_KEY = 'lsf_bible_highlights';

type AllHighlights = Record<string, HighlightRange[]>; // chapterKey -> ranges

function readAll(): AllHighlights {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(all: AllHighlights) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Highlighting is a nice-to-have, not critical — fail silently
    // (e.g. storage quota exceeded or private-browsing restrictions).
  }
}

export function getChapterHighlights(chapterKey: string): HighlightRange[] {
  const val = readAll()[chapterKey];
  return Array.isArray(val) ? val : [];
}

function overlaps(a: { verse: number; start: number; end: number }, b: HighlightRange) {
  return a.verse === b.verse && a.start < b.end && a.end > b.start;
}

// A new selection replaces any highlight(s) it overlaps, rather than stacking —
// overlapping ranges would make splitting the verse text for rendering ambiguous.
export function addHighlight(
  chapterKey: string,
  range: { verse: number; start: number; end: number; color: HighlightColor }
): HighlightRange[] {
  const all = readAll();
  const existing = Array.isArray(all[chapterKey]) ? all[chapterKey] : [];
  const kept = existing.filter((h) => !overlaps(range, h));
  const next: HighlightRange = {
    ...range,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  const updated = [...kept, next];
  all[chapterKey] = updated;
  writeAll(all);
  return updated;
}

export function updateHighlightColor(chapterKey: string, id: string, color: HighlightColor): HighlightRange[] {
  const all = readAll();
  const existing = Array.isArray(all[chapterKey]) ? all[chapterKey] : [];
  const updated = existing.map((h) => (h.id === id ? { ...h, color } : h));
  all[chapterKey] = updated;
  writeAll(all);
  return updated;
}

export function removeHighlight(chapterKey: string, id: string): HighlightRange[] {
  const all = readAll();
  const existing = Array.isArray(all[chapterKey]) ? all[chapterKey] : [];
  const updated = existing.filter((h) => h.id !== id);
  all[chapterKey] = updated;
  writeAll(all);
  return updated;
}