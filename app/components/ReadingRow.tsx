'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Passage = { reference: string; text: string };

export default function ReadingRow({ label, refString }: { label: string; refString: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [passages, setPassages] = useState<Passage[] | null>(null);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !passages && !loading) {
      setLoading(true);
      setError(false);
      try {
        // Each reading can bundle multiple refs, semicolon-separated
        // (e.g. "Psalms 132:9-10;Psalms 132:17-18") — fetch each
        // separately since bible-api.com expects one passage per call.
        const parts = refString.split(';').map((r) => r.trim());
        const results = await Promise.all(
          parts.map(async (part) => {
            const res = await fetch(`https://bible-api.com/${encodeURIComponent(part)}?translation=web`);
            if (!res.ok) throw new Error('fetch failed');
            const data = await res.json();
            return { reference: data.reference as string, text: (data.text as string).trim() };
          })
        );
        setPassages(results);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div>
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left transition hover:bg-paper-light"
      >
        <div>
          <p className="text-[11px] uppercase tracking-[.08em] text-gold">{label}</p>
          <p className="mt-0.5 text-[15px] text-brown">{refString.split(';').join(' · ')}</p>
        </div>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-brown-soft transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mb-4 space-y-4 border border-line bg-paper-light p-5 text-[14px] leading-[1.8] text-brown">
          {loading && <p className="text-brown-soft">Loading…</p>}
          {error && <p className="text-brown-soft">Couldn't load this passage — please try again.</p>}
          {passages?.map((p) => (
            <div key={p.reference}>
              <p className="mb-1 text-[11px] uppercase tracking-[.08em] text-gold">{p.reference}</p>
              <p className="whitespace-pre-line">{p.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}