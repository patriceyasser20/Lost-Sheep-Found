'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getProductsClient, type Product } from '../../lib/products';
import { supabaseClient } from '../../lib/supabaseClient';
import { adminApi } from '../../lib/adminApi';
import { Plus, Trash2, Edit2, X, ImagePlus, GripVertical, Lock } from 'lucide-react';
import {
  OPTION_PRESETS,
  type CustomizationOption,
  type OptionChoice,
} from '../../lib/customization';

// ---------- Shared style tokens ----------
const btnPrimary =
  'inline-flex items-center gap-2 bg-brown px-6 py-3 text-[11px] uppercase tracking-[.08em] text-cream transition hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(76,60,46,.16)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none';
const btnLine =
  'inline-flex items-center gap-2 border border-brown px-6 py-3 text-[11px] uppercase tracking-[.08em] text-brown transition hover:bg-brown hover:text-cream';
const btnSmallPrimary =
  'bg-brown px-3.5 py-2 text-[10px] uppercase tracking-[.08em] text-cream transition hover:opacity-90';
const btnSmallLine =
  'border border-line px-3.5 py-2 text-[10px] uppercase tracking-[.08em] text-brown-soft transition hover:border-brown hover:text-brown';
const inputBase =
  'w-full border border-line bg-cream px-4 py-3 text-sm text-brown outline-none transition placeholder:text-brown-soft/60 focus:border-gold';
const labelBase = 'mb-2 block text-[10px] uppercase tracking-[.12em] text-brown-soft';

// ---------- Shared: upload a file through the server-side admin route ----------
// Uploads must go through /api/admin-upload (service-role, x-admin-token
// gated) rather than supabaseClient.storage directly — the anon client has
// no real Supabase Auth session behind it in this app (admin access is a
// custom localStorage token, not Supabase Auth), so Storage RLS correctly
// rejects direct anon uploads.
async function uploadViaAdminRoute(file: File, path: string, bucket = 'product-images'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path);
  formData.append('bucket', bucket);

  const res = await fetch('/api/admin-upload', {
    method: 'POST',
    headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
    body: formData,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Image upload failed.');
  return json.data.publicUrl;
}

// ---------- Customization builder ----------
function CustomizationEditor({
  options,
  onChange,
}: {
  options: CustomizationOption[];
  onChange: (next: CustomizationOption[]) => void;
}) {
  const [uploadingChoiceId, setUploadingChoiceId] = useState<string | null>(null);
  const [draggedOptIndex, setDraggedOptIndex] = useState<number | null>(null);
  const [draggedChoice, setDraggedChoice] = useState<{ optId: string; index: number } | null>(null);

  function addPreset(key: string) {
    const preset = OPTION_PRESETS[key];
    const id = `opt-${key.toLowerCase()}-${Date.now()}`;
    onChange([...options, { id, product_id: '', sort_order: options.length, ...preset }]);
  }

  function addCustom() {
    const id = `opt-custom-${Date.now()}`;
    onChange([
      ...options,
      { id, product_id: '', name: '', type: 'text', required: false, options: [], sort_order: options.length },
    ]);
  }

  function update(id: string, patch: Partial<CustomizationOption>) {
    onChange(options.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  function remove(id: string) {
    onChange(options.filter((o) => o.id !== id));
  }

  // Reordering an option group. Language can't be dragged (no drag handlers
  // are ever attached to it), and re-running withLanguageEnforced after
  // every reorder guarantees it snaps back to the top even if a drop
  // target briefly put something else first mid-gesture.
  function reorderOptions(from: number, to: number) {
    const updated = [...options];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(withLanguageEnforced(updated));
  }

  function addChoice(optId: string) {
    const opt = options.find((o) => o.id === optId)!;
    const choice: OptionChoice = { id: `choice-${Date.now()}`, label: '', swatch: '#a1792f', sku: '' };
    update(optId, { options: [...opt.options, choice] });
  }

  function updateChoice(optId: string, choiceId: string, patch: Partial<OptionChoice>) {
    const opt = options.find((o) => o.id === optId)!;
    update(optId, {
      options: opt.options.map((c) => (c.id === choiceId ? { ...c, ...patch } : c)),
    });
  }

  function removeChoice(optId: string, choiceId: string) {
    const opt = options.find((o) => o.id === optId)!;
    update(optId, { options: opt.options.filter((c) => c.id !== choiceId) });
  }

  function reorderChoices(optId: string, from: number, to: number) {
    const opt = options.find((o) => o.id === optId)!;
    const updated = [...opt.options];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    update(optId, { options: updated });
  }

  async function uploadChoiceImage(optId: string, choiceId: string, file: File) {
    setUploadingChoiceId(choiceId);
    try {
      const ext = file.name.split('.').pop();
      const path = `choices/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const publicUrl = await uploadViaAdminRoute(file, path);
      updateChoice(optId, choiceId, { image: publicUrl });
    } catch (err: any) {
      alert('Failed to upload image: ' + err.message);
    }
    setUploadingChoiceId(null);
  }

  return (
    <div className="border border-line bg-paper-light p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[.12em] text-brown-soft">Customization Options</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(OPTION_PRESETS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => addPreset(key)}
              className="border border-line bg-cream px-3 py-1.5 text-[10px] uppercase tracking-[.06em] text-brown-soft transition hover:border-brown hover:text-brown"
            >
              + {key}
            </button>
          ))}
          <button type="button" onClick={addCustom} className={btnSmallLine}>
            <Plus size={12} className="inline -mt-0.5" /> Custom
          </button>
        </div>
      </div>

      {options.length === 0 && (
        <p className="text-sm text-brown-soft/70">
          No customization options yet — add Language, Cover, Colors, Designs, Template, or a Prompt field above.
        </p>
      )}

      <div className="space-y-4">
        {options.map((opt, optIndex) => {
          const isLanguage = opt.name === 'Language';
          return (
            <div
              key={opt.id}
              draggable={!isLanguage}
              onDragStart={() => !isLanguage && setDraggedOptIndex(optIndex)}
              onDragOver={(e) => {
                if (isLanguage || draggedOptIndex === null || draggedOptIndex === optIndex) return;
                e.preventDefault();
                reorderOptions(draggedOptIndex, optIndex);
                setDraggedOptIndex(optIndex);
              }}
              onDrop={(e) => e.preventDefault()}
              onDragEnd={() => setDraggedOptIndex(null)}
              className={`border border-line bg-cream p-4 transition ${
                draggedOptIndex === optIndex ? 'scale-[.99] opacity-50' : ''
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center gap-3">
                {isLanguage ? (
                  <span
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-brown-soft"
                    title="Always first, can't be reordered"
                  >
                    <Lock size={14} />
                  </span>
                ) : (
                  <span
                    className="flex h-8 w-8 flex-shrink-0 cursor-move items-center justify-center text-brown-soft"
                    title="Drag to reorder"
                  >
                    <GripVertical size={16} />
                  </span>
                )}

                <input
                  type="text"
                  placeholder="Option name (e.g. Cover)"
                  value={opt.name}
                  onChange={(e) => update(opt.id, { name: e.target.value })}
                  disabled={isLanguage}
                  className="min-w-[160px] flex-1 border border-line bg-cream px-3 py-2 text-sm text-brown outline-none focus:border-gold disabled:bg-paper-light disabled:text-brown-soft"
                />
                <select
                  value={opt.type}
                  onChange={(e) => update(opt.id, { type: e.target.value as CustomizationOption['type'] })}
                  disabled={isLanguage}
                  className="border border-line bg-cream px-3 py-2 text-sm text-brown outline-none focus:border-gold disabled:bg-paper-light disabled:text-brown-soft"
                >
                  <option value="select">Select (choices)</option>
                  <option value="text">Short text</option>
                  <option value="textarea">Long text / prompt</option>
                </select>
                <label className="flex items-center gap-2 text-xs text-brown-soft">
                  <input
                    type="checkbox"
                    checked={opt.required}
                    disabled={isLanguage}
                    onChange={(e) => update(opt.id, { required: e.target.checked })}
                    className="accent-brown"
                  />
                  Required{isLanguage ? ' (always)' : ''}
                </label>
                {!isLanguage && (
                  <button
                    onClick={() => remove(opt.id)}
                    className="ml-auto text-brown-soft transition hover:text-[#a14b3c]"
                    aria-label="Remove option"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {opt.type === 'select' ? (
                <div className="space-y-2 pl-[44px]">
                  {opt.options.map((c, i) => {
                    const choiceKey = c.id || `choice-${i}`;
                    const isUploading = uploadingChoiceId === choiceKey;
                    const isDraggingThis = draggedChoice?.optId === opt.id && draggedChoice.index === i;
                    return (
                      <div
                        key={choiceKey}
                        draggable
                        onDragStart={() => setDraggedChoice({ optId: opt.id, index: i })}
                        onDragOver={(e) => {
                          if (!draggedChoice || draggedChoice.optId !== opt.id || draggedChoice.index === i) return;
                          e.preventDefault();
                          reorderChoices(opt.id, draggedChoice.index, i);
                          setDraggedChoice({ optId: opt.id, index: i });
                        }}
                        onDrop={(e) => e.preventDefault()}
                        onDragEnd={() => setDraggedChoice(null)}
                        className={`border border-line/60 bg-paper-light/40 p-2.5 transition ${
                          isDraggingThis ? 'scale-[.99] opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-6 w-4 flex-shrink-0 cursor-move items-center justify-center text-brown-soft/70"
                            title="Drag to reorder"
                          >
                            <GripVertical size={14} />
                          </span>

                          <label
                            className="relative flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden border border-line bg-paper-light"
                            title={c.image ? 'Change picture' : 'Add picture'}
                          >
                            {c.image ? (
                              <Image src={c.image} alt={c.label || 'choice'} fill className="object-cover" />
                            ) : isUploading ? (
                              <span className="text-[10px] text-brown-soft">…</span>
                            ) : (
                              <ImagePlus size={20} className="text-brown-soft" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) uploadChoiceImage(opt.id, c.id, file);
                              }}
                            />
                          </label>

                          <input
                            type="color"
                            value={c.swatch || '#a1792f'}
                            onChange={(e) => updateChoice(opt.id, c.id, { swatch: e.target.value })}
                            className="h-6 w-6 flex-shrink-0 border border-line p-0"
                            title="Fallback color (used if no picture is set)"
                          />

                          <input
                            type="text"
                            placeholder="Choice label (e.g. Gold Foil)"
                            value={c.label}
                            onChange={(e) => updateChoice(opt.id, c.id, { label: e.target.value })}
                            className="flex-1 border border-line bg-cream px-3 py-1.5 text-sm text-brown outline-none focus:border-gold"
                          />

                          {c.image && (
                            <button
                              onClick={() => updateChoice(opt.id, c.id, { image: undefined })}
                              className="text-[10px] uppercase tracking-[.06em] text-brown-soft transition hover:text-brown"
                              title="Remove picture, keep color"
                            >
                              Clear pic
                            </button>
                          )}

                          <button
                            onClick={() => removeChoice(opt.id, c.id)}
                            className="text-brown-soft transition hover:text-[#a14b3c]"
                            aria-label="Remove choice"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        {/* Child SKU — one per choice (e.g. LSF-JRN-001-LINEN), sits under the parent product SKU */}
                        <div className="mt-2 pl-[92px]">
                          <input
                            type="text"
                            placeholder="Child SKU (e.g. LSF-JRN-001-LINEN)"
                            value={c.sku || ''}
                            onChange={(e) => updateChoice(opt.id, c.id, { sku: e.target.value.toUpperCase() })}
                            className="w-full max-w-xs border border-line bg-cream px-2.5 py-1.5 text-[12px] text-brown outline-none focus:border-gold"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => addChoice(opt.id)}
                    className="flex items-center gap-1 text-[11px] uppercase tracking-[.06em] text-brown-soft transition hover:text-brown"
                  >
                    <Plus size={12} /> Add choice
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Placeholder text shown to the customer"
                  value={opt.placeholder || ''}
                  onChange={(e) => update(opt.id, { placeholder: e.target.value })}
                  className="w-full border border-line bg-cream px-3 py-2 text-sm text-brown outline-none focus:border-gold"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Multi-image type ----------
type ImageItem = {
  key: string;
  type: 'existing' | 'new';
  url: string;
  file?: File;
};

// ---------- Multi-image picker (with drag reorder) ----------
function ImageManager({
  items,
  onAdd,
  onRemove,
  onReorder,
}: {
  items: ImageItem[];
  onAdd: (files: File[]) => void;
  onRemove: (key: string) => void;
  onReorder: (from: number, to: number) => void;
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          onAdd(Array.from(e.target.files || []));
          e.target.value = '';
        }}
        className="w-full border border-line bg-cream px-4 py-2.5 text-sm text-brown-soft file:mr-4 file:border-0 file:bg-brown file:px-4 file:py-2 file:text-[10px] file:uppercase file:tracking-[.08em] file:text-cream"
      />

      {items.length > 0 && (
        <>
          <p className="mb-2 mt-3 text-xs text-brown-soft/70">
            Drag to reorder — the <span className="font-medium text-brown">first image</span> is the thumbnail shown in the shop grid.
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {items.map((item, i) => (
              <div
                key={item.key}
                draggable
                onDragStart={() => setDraggedIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggedIndex === null || draggedIndex === i) return;
                  onReorder(draggedIndex, i);
                  setDraggedIndex(i);
                }}
                onDrop={(e) => e.preventDefault()}
                onDragEnd={() => setDraggedIndex(null)}
                className={`relative aspect-square cursor-move select-none border border-line transition ${
                  draggedIndex === i ? 'scale-95 opacity-40' : ''
                }`}
              >
                <Image
                  src={item.url}
                  alt=""
                  fill
                  unoptimized={item.type === 'new'}
                  sizes="140px"
                  className={`pointer-events-none object-cover ${i === 0 ? 'border-2 border-brown' : ''}`}
                />
                {i === 0 && (
                  <span className="absolute left-1 top-1 bg-brown px-1.5 py-0.5 text-[9px] uppercase tracking-[.06em] text-cream">
                    Thumbnail
                  </span>
                )}
                {item.type === 'new' && (
                  <span className="absolute bottom-1 left-1 bg-gold px-1.5 py-0.5 text-[9px] uppercase tracking-[.06em] text-cream">
                    New
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(item.key)}
                  className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#a14b3c] text-cream shadow"
                  title="Remove image"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// The Language option must always exist, be first, and be required —
// across every product, whether brand new or already saved before this
// feature existed. This is the single place that guarantee lives, so
// both "add" and "edit" paths (and the save-time safety net) stay in sync.
function withLanguageEnforced(options: CustomizationOption[]): CustomizationOption[] {
  const languagePreset = OPTION_PRESETS['Language'];
  const existingIndex = options.findIndex((o) => o.name === 'Language');

  if (existingIndex === -1) {
    const seeded: CustomizationOption = {
      id: `opt-language-${Date.now()}`,
      product_id: '',
      sort_order: 0,
      ...languagePreset,
    };
    return [seeded, ...options];
  }

  const existing = { ...options[existingIndex], required: true };
  const rest = options.filter((_, i) => i !== existingIndex);
  return [existing, ...rest];
}

// ---------- Main panel ----------
export default function ProductsPanel() {
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quickForm, setQuickForm] = useState({ name: '', price: '', category: '', stock: '' });

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [form, setForm] = useState({ name: '', sku: '', price: '', description: '', categoryId: '', isCustomizable: false });
  const [customOptions, setCustomOptions] = useState<CustomizationOption[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProductsClient().then((data) => {
      setList(data);
      setLoading(false);
    });
    supabaseClient
      .from('categories')
      .select('id, name, slug')
      .order('name')
      .then(({ data, error }) => {
        if (error) console.error('categories fetch:', error.message);
        setCategories(data || []);
      });
  }, []);

  function startQuickEdit(p: Product) {
    setEditingId(p.id);
    setQuickForm({ name: p.name, price: String(p.price), category: p.categorySlug, stock: String(p.stock) });
  }

  function saveQuickEdit(id: string) {
    setList((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, name: quickForm.name, price: Number(quickForm.price), stock: Number(quickForm.stock) }
          : p
      )
    );
    adminApi
      .updateProduct(id, {
        name: quickForm.name,
        price: Number(quickForm.price),
        stock: Number(quickForm.stock),
      })
      .catch((err) => alert('Failed to save: ' + err.message));
    setEditingId(null);
  }

  function openAddForm() {
    setEditingProduct(null);
    setForm({ name: '', sku: '', price: '', description: '', categoryId: '', isCustomizable: false });
    setCustomOptions([]);
    setImageItems([]);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
  }

  async function openEditForm(p: Product) {
    const matchedCategory = categories.find((c) => c.slug === p.categorySlug);
    setEditingProduct(p);
    setForm({
      name: p.name,
      // `sku` is an assumed new field on Product — falls back to an empty
      // string for existing products that don't have one set yet.
      sku: (p as any).sku || '',
      price: String(p.price),
      description: p.description,
      categoryId: matchedCategory?.id || '',
      isCustomizable: p.customizable,
    });

    // `images` is the assumed new gallery field on Product — falls back to
    // the single imageUrl if the type hasn't been extended yet, so existing
    // products with only one photo still show correctly.
    const existingUrls = p.images.length ? p.images : p.imageUrl ? [p.imageUrl] : [];
    setImageItems(
      existingUrls.map((url: string, i: number) => ({
        key: `existing-${i}-${url}`,
        type: 'existing' as const,
        url,
      }))
    );

    setCustomOptions([]);
    setShowForm(true);

    if (!p.customizable) return;

    const { data, error } = await supabaseClient
      .from('customization_options')
      .select('*')
      .eq('product_id', p.id)
      .order('sort_order');

    if (error) {
      console.error('load customization options:', error.message);
      return;
    }

    setCustomOptions(
      withLanguageEnforced(
        (data || []).map((row: any) => ({
          id: row.id,
          product_id: row.product_id,
          name: row.name,
          type: row.type,
          required: row.required,
          options: (row.options || []).map((c: any, i: number) => ({
            ...c,
            id: c.id || `choice-${row.id}-${i}`,
            sku: c.sku || '',
          })),
          sort_order: row.sort_order,
        }))
      )
    );
  }

  function addNewImages(files: File[]) {
    const newItems: ImageItem[] = files.map((file) => ({
      key: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: 'new',
      url: URL.createObjectURL(file),
      file,
    }));
    setImageItems((prev) => [...prev, ...newItems]);
  }

  function removeImageItem(key: string) {
    setImageItems((prev) => {
      const target = prev.find((i) => i.key === key);
      if (target?.type === 'new') URL.revokeObjectURL(target.url);
      return prev.filter((i) => i.key !== key);
    });
  }

  function reorderImages(from: number, to: number) {
    setImageItems((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }

  async function uploadProductImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    return uploadViaAdminRoute(file, path);
  }

  async function deleteProduct(p: Product) {
    if (!confirm(`Delete "${p.name}" permanently? This cannot be undone.`)) return;
    try {
      await adminApi.deleteProduct(p.id);
      setList((prev) => prev.filter((item) => item.id !== p.id));
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  }

  async function saveProduct() {
    if (!form.name.trim() || !form.price) {
        alert('Name and price are required');
        return;
    }
    if (!form.categoryId) {
        alert('Please choose a category');
        return;
    }
    if (imageItems.length === 0) {
        alert('Add at least one picture');
        return;
    }
    setSaving(true);
    try {
        const images: string[] = [];
        for (const item of imageItems) {
        if (item.type === 'existing') {
            images.push(item.url);
        } else if (item.file) {
            images.push(await uploadProductImage(item.file));
        }
        }

        const slug = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const payload = {
          name: form.name,
          slug,
          sku: form.sku.trim().toUpperCase() || null,
          price: Number(form.price),
          description: form.description,
          category_id: form.categoryId,
          is_customizable: form.isCustomizable,
          image_url: images[0],
        };

        let productId = editingProduct?.id;
        if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload);
        } else {
        const inserted = await adminApi.insertProduct(payload);
        productId = inserted.id;
        }

        // Gallery lives in product_images, not on the products row itself
        await adminApi.saveProductImages(productId!, images);

        if (form.isCustomizable && customOptions.length > 0) {
          const enforced = withLanguageEnforced(customOptions);
          const normalizedOptions = enforced.map((opt) => ({
            ...opt,
            options: opt.options.map((c) => ({ ...c, sku: (c.sku || '').toUpperCase() })),
          }));
          await adminApi.saveCustomizationOptions(productId!, normalizedOptions);
        } else {
          await adminApi.deleteCustomizationOptionsForProduct(productId!);
        }

        setShowForm(false);
        setEditingProduct(null);
        getProductsClient().then(setList);
    } catch (err: any) {
        alert('Failed to save: ' + err.message);
    }
    setSaving(false);
    }

  if (loading) return <p className="text-sm text-brown-soft">Loading products…</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-medium tracking-[-.02em] text-brown">
          Products ({list.length})
        </h2>
        {!showForm && (
          <button onClick={openAddForm} className={btnPrimary}>
            <Plus size={15} /> Add Product
          </button>
        )}
      </div>

      {/* Inline add/edit panel */}
      {showForm && (
        <div className="mb-10 border border-line bg-paper-light p-6 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h3 className="font-display text-xl font-medium tracking-[-.02em] text-brown">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h3>
            <button onClick={closeForm} aria-label="Close" className="text-brown-soft transition hover:text-brown">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className={labelBase}>Pictures</label>
              <ImageManager
                items={imageItems}
                onAdd={addNewImages}
                onRemove={removeImageItem}
                onReorder={reorderImages}
              />
            </div>

            <div>
              <label className={labelBase}>Product name</label>
              <input
                type="text"
                placeholder="Product name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputBase}
              />
            </div>

            <div>
              <label className={labelBase}>Parent SKU</label>
              <input
                type="text"
                placeholder="e.g. LSF-JRN-001"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })}
                className={inputBase}
              />
              <p className="mt-1.5 text-[11px] text-brown-soft/70">
                Identifies this product overall. Each customization choice below can carry its own child SKU under this one.
              </p>
            </div>

            <div>
              <label className={labelBase}>Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className={`${inputBase} appearance-none`}
              >
                <option value="">Choose a category *</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelBase}>Price</label>
              <input
                type="number"
                placeholder="Price *"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputBase}
              />
            </div>

            <div>
              <label className={labelBase}>Description</label>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputBase} h-24 resize-y`}
              />
            </div>

            <label className="flex items-center gap-3 border border-line bg-cream p-4">
              <input
                type="checkbox"
                checked={form.isCustomizable}
                onChange={(e) => {
                  const nowCustomizable = e.target.checked;
                  setForm({ ...form, isCustomizable: nowCustomizable });
                  // Arabic/English is the mandatory default option for every
                  // customizable product, across every category — enforced
                  // here rather than relying on the admin to add it.
                  if (nowCustomizable) {
                    setCustomOptions((prev) => withLanguageEnforced(prev));
                  }
                }}
                className="h-4 w-4 accent-brown"
              />
              <span className="text-sm text-brown">This product is customizable</span>
            </label>

            {form.isCustomizable && (
              <CustomizationEditor options={customOptions} onChange={setCustomOptions} />
            )}

            <div className="flex items-center gap-3 pt-2">
              <button onClick={saveProduct} disabled={saving} className={btnPrimary}>
                {saving ? 'Saving…' : editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button onClick={closeForm} className={btnLine}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => {
          const isEditing = editingId === p.id;
          const galleryCount = p.images.length || (p.imageUrl ? 1 : 0);
          return (
            <div key={p.id} className="border border-line bg-cream">
              <div className="relative aspect-[4/3] border-b border-line bg-paper-light">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gold">
                    <span className="text-2xl">✦</span>
                    <span className="text-[9px] uppercase tracking-[.15em] text-brown-soft">No image</span>
                  </div>
                )}
                {galleryCount > 1 && (
                  <span className="absolute left-2 top-2 bg-brown/85 px-2 py-1 text-[9px] uppercase tracking-[.1em] text-cream">
                    {galleryCount} photos
                  </span>
                )}
                {p.stock === 0 && (
                  <span className="absolute right-2 top-2 bg-brown px-2 py-1 text-[9px] uppercase tracking-[.1em] text-cream">
                    Out of stock
                  </span>
                )}
              </div>

              <div className="p-4">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      value={quickForm.name}
                      onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                      className="w-full border border-line bg-cream px-2 py-1.5 text-sm text-brown outline-none focus:border-gold"
                      placeholder="Name"
                    />
                    <div className="flex gap-2">
                      <input
                        value={quickForm.price}
                        onChange={(e) => setQuickForm({ ...quickForm, price: e.target.value })}
                        className="w-1/2 border border-line bg-cream px-2 py-1.5 text-sm text-brown outline-none focus:border-gold"
                        placeholder="Price"
                      />
                      <input
                        value={quickForm.stock}
                        onChange={(e) => setQuickForm({ ...quickForm, stock: e.target.value })}
                        className="w-1/2 border border-line bg-cream px-2 py-1.5 text-sm text-brown outline-none focus:border-gold"
                        placeholder="Stock"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => saveQuickEdit(p.id)} className={`${btnSmallPrimary} flex-1`}>Save</button>
                      <button onClick={() => setEditingId(null)} className={`${btnSmallLine} flex-1`}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] uppercase tracking-[.1em] text-gold">{p.categorySlug}</p>
                    <h3 className="mt-1 font-display text-lg font-medium tracking-[-.01em] text-brown">
                      {p.name}
                    </h3>

                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-brown">EGP {p.price}</span>
                      <span className={p.stock === 0 ? 'text-[#a14b3c]' : 'text-brown-soft'}>
                        {p.stock} in stock
                      </span>
                    </div>

                    {p.customizable && (
                      <span className="mt-2 inline-block border border-gold px-2 py-0.5 text-[9px] uppercase tracking-[.08em] text-gold">
                        Customizable
                      </span>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                      <button
                        onClick={() => startQuickEdit(p)}
                        className="flex items-center gap-1.5 text-[11px] uppercase tracking-[.06em] text-brown-soft transition hover:text-brown"
                      >
                        <Edit2 size={12} /> Quick edit
                      </button>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => openEditForm(p)}
                          className="text-[11px] uppercase tracking-[.06em] text-gold transition hover:text-brown"
                        >
                          Full Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p)}
                          aria-label={`Delete ${p.name}`}
                          className="text-brown-soft transition hover:text-[#a14b3c]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {list.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-brown-soft">No products yet.</p>
        )}
      </div>
    </div>
  );
}