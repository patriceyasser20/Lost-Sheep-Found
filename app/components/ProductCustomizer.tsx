'use client';

import { useEffect, useState } from 'react';
import { getCustomizationOptionsClient, type CustomizationOption, type OptionChoice } from '../../lib/customization';

export type Selections = Record<string, { optionName: string; value: string; swatch?: string; image?: string }>;

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
    getCustomizationOptionsClient(productId).then((opts) => {
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

  function choose(opt: CustomizationOption, choice: OptionChoice) {
    commit({
      ...selections,
      [opt.id]: { optionName: opt.name, value: choice.label, swatch: choice.swatch, image: choice.image },
    });
  }

  function setText(opt: CustomizationOption, value: string) {
    commit({ ...selections, [opt.id]: { optionName: opt.name, value } });
  }

  if (loading || options.length === 0) return null;

  const coverSwatch = Object.values(selections).find((s) => s.optionName === 'Cover Style')?.swatch;
  const colorSwatch = Object.values(selections).find((s) => s.optionName === 'Color')?.swatch;
  const templateLabel = Object.values(selections).find((s) => s.optionName === 'Interior Template')?.value;
  const promptLabel = Object.values(selections).find((s) => s.optionName === 'Prompt Style')?.value;
  const freeText = Object.values(selections).find((s) => s.optionName === 'Personalize with Initials')?.value;

  return (
    <div className="my-8 border-t border-line pt-8">
      <h3 className="mb-5 font-display text-xl">Make It Yours</h3>

      <div className="flex flex-col gap-3">
        {options.map((opt) => (    
            <div key={opt.id}>
            <label className="mb-2 block text-[11px] uppercase tracking-[.1em] text-brown-soft">
              {opt.name}
              {opt.required && <span className="ml-1 text-gold">*</span>}
            </label>

            {opt.type === 'select' ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {opt.options.map((choice) => {
                    const active = selections[opt.id]?.value === choice.label;
                    return (
                        <button
                            type="button"
                            key={choice.id}
                            onClick={() => choose(opt, choice)}
                            aria-pressed={active}
                            title={choice.label}
                            className={`flex items-center gap-3 border py-2.5 pl-2.5 pr-5 text-sm transition duration-200 ${
                                active
                                ? 'border-gold bg-paper-light ring-1 ring-inset ring-gold'
                                : 'border-line bg-cream hover:border-gold'
                            }`}
                        >
                        {choice.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={choice.image}
                                alt=""
                                className="h-14 w-14 flex-shrink-0 rounded-sm border border-brown/15 object-cover"
                                />
                        ) : choice.swatch ? (
                            <span
                                className="inline-block h-14 w-14 flex-shrink-0 rounded-sm border border-brown/15"
                                style={{ background: choice.swatch }}
                            />
                        ) : null}
                        {choice.label}
                        </button>
                    );
                    })}
                </div>
                ) : opt.type === 'textarea' ? (
              <textarea
                className="w-full border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-gold"
                placeholder={`Add your ${opt.name.toLowerCase()}...`}
                value={selections[opt.id]?.value || ''}
                onChange={(e) => setText(opt, e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="w-full border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-gold"
                placeholder={`Add your ${opt.name.toLowerCase()}...`}
                value={selections[opt.id]?.value || ''}
                onChange={(e) => setText(opt, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 border border-line bg-paper-light p-6">
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
          {templateLabel && (
            <p className="my-1 text-[11px] uppercase tracking-[.06em] text-brown-soft">{templateLabel}</p>
          )}
          {promptLabel && (
            <p className="my-1 text-[11px] uppercase tracking-[.06em] text-brown-soft">{promptLabel}</p>
          )}
          {freeText && <p className="mt-2 text-[13px] italic text-brown">"{freeText}"</p>}
        </div>

        <p className="mt-3 text-center text-[11px] text-brown-soft">
          A rough sense of it — the finished piece is made by hand.
        </p>
      </div>
    </div>
  );
}