'use client';

import { useEffect, useState } from 'react';
import { getCustomizationOptions, type CustomizationOption } from '../../lib/customization';

export type Selections = Record<string, { optionName: string; value: string; label: string; swatch?: string }>;

export default function ProductCustomizer({
  productId,
  productName,
  onChange,
}: {
  productId: string;
  productName: string;
  onChange?: (selections: Selections, complete: boolean) => void;
}) {
  const [options, setOptions] = useState<CustomizationOption[]>([]);
  const [selections, setSelections] = useState<Selections>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCustomizationOptions(productId).then((opts) => {
      if (!active) return;
      setOptions(opts);
      setLoading(false);
    });
    return () => { active = false; };
  }, [productId]);

  function commit(next: Selections) {
    setSelections(next);
    const complete = options.filter((o) => o.required).every((o) => next[o.id]?.value?.trim());
    onChange?.(next, complete);
  }

  function choose(opt: CustomizationOption, value: string, label: string, swatch?: string) {
    commit({ ...selections, [opt.id]: { optionName: opt.name, value, label, swatch } });
  }

  function setText(opt: CustomizationOption, value: string) {
    commit({ ...selections, [opt.id]: { optionName: opt.name, value, label: value } });
  }

  if (loading || options.length === 0) return null;

  const coverSwatch = Object.values(selections).find((s) => s.optionName === 'Cover')?.swatch;
  const colorSwatch = Object.values(selections).find((s) => s.optionName === 'Colors')?.swatch;
  const designLabel = Object.values(selections).find((s) => s.optionName === 'Designs')?.label;
  const templateLabel = Object.values(selections).find((s) => s.optionName === 'Template')?.label;
  const promptText = Object.values(selections).find(
    (s) => !['Cover', 'Colors', 'Designs', 'Template'].includes(s.optionName)
  )?.value;

  return (
    <div className="my-8 border-t border-line pt-8">
      <h3 className="mb-5 font-display text-xl">Make It Yours</h3>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          {options.map((opt) => (
            <div className="mb-6" key={opt.id}>
              <label className="mb-2 block text-[11px] uppercase tracking-[.1em] text-brown-soft">
                {opt.name}
                {opt.required && <span className="ml-1 text-gold">*</span>}
              </label>

              {opt.type === 'select' ? (
                <div className="flex flex-wrap gap-2">
                  {opt.options.map((c) => {
                    const active = selections[opt.id]?.value === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => choose(opt, c.id, c.label, c.swatch)}
                        aria-pressed={active}
                        className={`flex items-center gap-2 border px-4 py-2 text-[12.5px] transition duration-200 ${
                          active
                            ? 'border-gold bg-paper-light ring-1 ring-inset ring-gold'
                            : 'border-line bg-cream hover:border-gold'
                        }`}
                      >
                        {c.swatch && (
                          <span
                            className="inline-block h-3.5 w-3.5 rounded-full border border-brown/25"
                            style={{ background: c.swatch }}
                          />
                        )}
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              ) : opt.type === 'textarea' ? (
                <textarea
                  className="w-full border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-gold"
                  placeholder={opt.placeholder}
                  value={selections[opt.id]?.value || ''}
                  onChange={(e) => setText(opt, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  className="w-full border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-gold"
                  placeholder={opt.placeholder}
                  value={selections[opt.id]?.value || ''}
                  onChange={(e) => setText(opt, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="h-fit border border-line bg-paper-light p-6 md:sticky md:top-[110px]">
          <span className="mb-3 block text-[10px] uppercase tracking-[.16em] text-gold">Preview</span>

          <div
            className="border px-5 py-6 text-center transition-colors duration-300"
            style={{
              background: coverSwatch || 'var(--paper-light)',
              borderColor: colorSwatch || 'var(--line)',
            }}
          >
            <div className="mb-2 text-2xl" style={{ color: colorSwatch || 'var(--gold)' }}>✦</div>
            <p className="mb-1 font-display text-lg">{productName}</p>
            {designLabel && designLabel !== 'No Design' && (
              <p className="my-1 text-[11px] uppercase tracking-[.06em] text-brown-soft">{designLabel}</p>
            )}
            {templateLabel && (
              <p className="my-1 text-[11px] uppercase tracking-[.06em] text-brown-soft">{templateLabel}</p>
            )}
            {promptText && <p className="mt-2 text-[13px] italic text-brown">"{promptText}"</p>}
          </div>

          <p className="mt-3 text-center text-[11px] text-brown-soft">
            A rough sense of it — the finished piece is made by hand.
          </p>
        </div>
      </div>
    </div>
  );
}