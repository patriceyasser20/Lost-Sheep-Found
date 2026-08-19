'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '../../lib/supabaseClient';
import { adminApi } from '../../lib/adminApi';
import type { SaleSettings } from '../../lib/adminTypes';
import { mockSaleHistory } from '../../lib/adminTypes';

const EMPTY: SaleSettings = { title: '', subtitle: '', categorySlugs: [], discountPct: 0, active: true };

export default function SalePanel() {
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [settings, setSettings] = useState<SaleSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      supabaseClient.from('categories').select('id, name, slug').order('name'),
      adminApi.getSaleSettings(),
    ]).then(([catRes, saleSettings]) => {
      setCategories(catRes.data || []);
      setSettings({
      title: saleSettings?.title ?? EMPTY.title,
      subtitle: saleSettings?.subtitle ?? EMPTY.subtitle,
      categorySlugs: saleSettings?.categorySlugs ?? EMPTY.categorySlugs,
      discountPct: saleSettings?.discountPct ?? EMPTY.discountPct,
      active: saleSettings?.active ?? EMPTY.active,
    });
      setLoading(false);
    });
  }, []);

  function toggleCategory(slug: string) {
    setSettings((prev) => ({
      ...prev,
      categorySlugs: prev.categorySlugs.includes(slug)
        ? prev.categorySlugs.filter((s) => s !== slug)
        : [...prev.categorySlugs, slug],
    }));
  }

  async function save() {
    setSaving(true);
    const intent = settings; // what the admin actually asked to save, captured before any response can interfere
    try {
      const updated = await adminApi.updateSaleSettings(intent);

      if (updated && typeof updated.active === 'boolean' && updated.active !== intent.active) {
        // The server echoed back a different `active` than what we sent —
        // almost always a snake_case (`is_active`) vs camelCase (`active`)
        // mismatch between the client type and the DB column, or the write
        // payload silently dropping the field. Surfacing this so it's not
        // a silent, confusing bug next time.
        console.warn(
          `Sale settings: saved active=${intent.active} but server returned active=${updated.active}. ` +
          `Check adminApi.updateSaleSettings and its admin-ops handler for a field-name mismatch.`
        );
      }

      // Trust what was just saved for `active` rather than the server's
      // echo — prevents the toggle visually flipping back due to a
      // mapping bug in the response. Text fields still take the server's
      // (possibly trimmed/normalized) value when present.
      setSettings({
        title: updated?.title ?? intent.title,
        subtitle: updated?.subtitle ?? intent.subtitle,
        categorySlugs: updated?.categorySlugs ?? intent.categorySlugs,
        discountPct: updated?.discountPct ?? intent.discountPct,
        active: intent.active,
      });
      alert('Sale page updated.');
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    }
    setSaving(false);
  }

  if (loading) return <p className="text-sm text-brown-soft">Loading sale settings…</p>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium text-brown">Sale page</h3>
          <p className="mt-1 text-[13px] text-brown-soft">
            Controls the title, subtitle, and which categories appear on <span className="text-brown">Sale Page</span>.
          </p>
        </div>
        <span
          className={`px-3 py-1.5 text-[10px] uppercase tracking-[.1em] ${
            settings.active ? 'bg-gold text-cream' : 'border border-line text-brown-soft'
          }`}
        >
          {settings.active ? 'Live on site' : 'Hidden from site'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_.9fr]">
        {/* ── Left: settings form ── */}
        <div className="space-y-6 border border-line bg-paper-light p-6">
          {/* Active toggle — explicit ON/OFF segmented control */}
          <div className="flex items-center justify-between border border-line bg-cream px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-brown">Sale is active</p>
              <p className="mt-0.5 text-[11.5px] text-brown-soft">
                {settings.active ? 'Visible to customers right now.' : 'The sale page is currently hidden.'}
              </p>
            </div>
            <div className="flex flex-shrink-0 overflow-hidden border border-line" role="group" aria-label="Sale active status">
              <button
                type="button"
                aria-pressed={settings.active}
                onClick={() => setSettings({ ...settings, active: true })}
                className={`px-4 py-1.5 text-[11px] font-medium uppercase tracking-[.08em] transition ${
                  settings.active ? 'bg-brown text-cream' : 'bg-cream text-brown-soft hover:text-brown'
                }`}
              >
                On
              </button>
              <button
                type="button"
                aria-pressed={!settings.active}
                onClick={() => setSettings({ ...settings, active: false })}
                className={`border-l border-line px-4 py-1.5 text-[11px] font-medium uppercase tracking-[.08em] transition ${
                  !settings.active ? 'bg-brown text-cream' : 'bg-cream text-brown-soft hover:text-brown'
                }`}
              >
                Off
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[.12em] text-brown-soft">Title</label>
            <input
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              placeholder="15% off, this week only"
              className="w-full border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[.12em] text-brown-soft">Subtitle</label>
            <textarea
              value={settings.subtitle}
              onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
              placeholder="Use code ADVENT15 at checkout on any journal or wood verse piece."
              className="h-20 w-full resize-y border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[.12em] text-brown-soft">Categories on sale</label>
            {categories.length === 0 ? (
              <p className="text-sm text-brown-soft">No categories found.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = settings.categorySlugs.includes(c.slug);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCategory(c.slug)}
                      className={`border px-3.5 py-2 text-[12.5px] transition ${
                        active
                          ? 'border-brown bg-brown text-cream'
                          : 'border-line bg-cream text-brown-soft hover:border-brown hover:text-brown'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            )}
            {settings.categorySlugs.length === 0 && (
              <p className="mt-2 text-[12px] text-brown-soft">
                No categories selected — the sale page will show every product.
              </p>
            )}
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full bg-brown px-4 py-3 text-[11px] uppercase tracking-[.08em] text-cream transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save sale page'}
          </button>
        </div>

        {/* ── Right: sale history ── */}
        <div className="border border-line bg-paper-light p-6">
          <h4 className="mb-1 text-[10px] uppercase tracking-[.12em] text-brown-soft">Sale history</h4>
          <p className="mb-5 text-[12.5px] text-brown-soft">
            Past and current sale periods run on this page.
            {/* TODO: replace mockSaleHistory with a real Supabase query once a
                sale_history table (or similar) exists. */}
          </p>

          {mockSaleHistory.length === 0 ? (
            <p className="text-sm text-brown-soft">No sale history yet.</p>
          ) : (
            <ul className="space-y-3">
              {mockSaleHistory.map((entry) => {
                const isOngoing = !entry.endedAt;
                return (
                  <li key={entry.id} className="border border-line bg-cream p-4">
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-brown">{entry.title}</p>
                      <span
                        className={`shrink-0 px-2 py-0.5 text-[9px] uppercase tracking-[.08em] ${
                          isOngoing ? 'bg-gold text-cream' : 'border border-line text-brown-soft'
                        }`}
                      >
                        {isOngoing ? 'Ongoing' : 'Ended'}
                      </span>
                    </div>
                    <p className="mb-2 text-[12px] text-brown-soft">
                      {entry.startedAt} — {entry.endedAt || 'present'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.categorySlugs.map((slug) => (
                        <span key={slug} className="border border-line bg-paper-light px-2 py-0.5 text-[10px] text-brown-soft">
                          {slug}
                        </span>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}