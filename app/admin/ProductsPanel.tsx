'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { products as seedProducts, type Product } from '../../lib/products';
import { adminApi } from '../../lib/adminApi';
import {
  OPTION_PRESETS,
  type CustomizationOption,
  type OptionChoice,
} from '../../lib/customization';

// ---------- Customization builder ----------
function CustomizationEditor({
  options,
  onChange,
}: {
  options: CustomizationOption[];
  onChange: (next: CustomizationOption[]) => void;
}) {
  function addPreset(key: string) {
    const preset = OPTION_PRESETS[key];
    const id = `opt-${key.toLowerCase()}-${Date.now()}`;
    onChange([...options, { id, product_id: '', ...preset }]);
  }

  function addCustom() {
    const id = `opt-custom-${Date.now()}`;
    onChange([...options, { id, product_id: '', name: '', type: 'text', required: false, options: [] }]);
  }

  function update(id: string, patch: Partial<CustomizationOption>) {
    onChange(options.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  function remove(id: string) {
    onChange(options.filter((o) => o.id !== id));
  }

  function addChoice(optId: string) {
    const opt = options.find((o) => o.id === optId)!;
    const choice: OptionChoice = { id: `choice-${Date.now()}`, label: '', swatch: '#a1792f' };
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

  return (
    <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="font-medium text-sm">Customization Options</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(OPTION_PRESETS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => addPreset(key)}
              className="text-xs border rounded-full px-3 py-1.5 bg-white hover:bg-gray-100"
            >
              + {key}
            </button>
          ))}
          <button
            type="button"
            onClick={addCustom}
            className="text-xs border rounded-full px-3 py-1.5 bg-white hover:bg-gray-100"
          >
            <Plus size={12} className="inline -mt-0.5" /> Custom
          </button>
        </div>
      </div>

      {options.length === 0 && (
        <p className="text-sm text-gray-400">No customization options yet — add Cover, Colors, Designs, Template, or a Prompt field above.</p>
      )}

      <div className="space-y-4">
        {options.map((opt) => (
          <div key={opt.id} className="bg-white border rounded-xl p-4">
            <div className="flex flex-wrap gap-3 items-center mb-3">
              <input
                type="text"
                placeholder="Option name (e.g. Cover)"
                value={opt.name}
                onChange={(e) => update(opt.id, { name: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[160px]"
              />
              <select
                value={opt.type}
                onChange={(e) => update(opt.id, { type: e.target.value as CustomizationOption['type'] })}
                className="border rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="select">Select (choices)</option>
                <option value="text">Short text</option>
                <option value="textarea">Long text / prompt</option>
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={opt.required}
                  onChange={(e) => update(opt.id, { required: e.target.checked })}
                />
                Required
              </label>
              <button onClick={() => remove(opt.id)} className="text-red-600 hover:text-red-700 ml-auto">
                <Trash2 size={16} />
              </button>
            </div>

            {opt.type === 'select' ? (
              <div className="space-y-2">
                {opt.options.map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={c.swatch || '#a1792f'}
                      onChange={(e) => updateChoice(opt.id, c.id, { swatch: e.target.value })}
                      className="w-8 h-8 rounded border"
                    />
                    <input
                      type="text"
                      placeholder="Choice label (e.g. Gold Foil)"
                      value={c.label}
                      onChange={(e) => updateChoice(opt.id, c.id, { label: e.target.value })}
                      className="border rounded-lg px-3 py-1.5 text-sm flex-1"
                    />
                    <button onClick={() => removeChoice(opt.id, c.id)} className="text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addChoice(opt.id)}
                  className="text-xs text-gray-600 hover:text-black flex items-center gap-1"
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
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Main panel ----------
export default function ProductsPanel() {
  const [list, setList] = useState<Product[]>(seedProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quickForm, setQuickForm] = useState({ name: '', price: '', category: '', stock: '' });

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', isCustomizable: false });
  const [customOptions, setCustomOptions] = useState<CustomizationOption[]>([]);
  const [saving, setSaving] = useState(false);

  function startQuickEdit(p: Product) {
    setEditingId(p.id);
    setQuickForm({ name: p.name, price: String(p.price), category: p.category, stock: String(p.stock) });
  }

  function saveQuickEdit(id: string) {
    setList((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, name: quickForm.name, price: Number(quickForm.price), stock: Number(quickForm.stock) }
          : p
      )
    );
    // TODO: adminApi.updateProduct(id, { name, price, stock })
    setEditingId(null);
  }

  function openAddModal() {
    setEditingProduct(null);
    setForm({ name: '', price: '', description: '', category: '', isCustomizable: false });
    setCustomOptions([]);
    setImagePreview('');
    setShowModal(true);
  }

  function openEditModal(p: Product) {
    setEditingProduct(p);
    setForm({ name: p.name, price: String(p.price), description: p.description, category: p.category, isCustomizable: p.customizable });
    setCustomOptions([]); // TODO: load via getCustomizationOptions(p.id)
    setImagePreview('');
    setShowModal(true);
  }

  function handleImageChange(file: File | null) {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    // TODO: upload to Supabase storage once wired; for now this is preview-only.
  }

  async function saveProduct() {
    if (!form.name.trim() || !form.price) {
      alert('Name and price are required');
      return;
    }
    setSaving(true);
    try {
      const productId = editingProduct?.id || form.name.toLowerCase().replace(/\s+/g, '-');
      const payload = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        category: form.category,
        is_customizable: form.isCustomizable,
      };

      if (editingProduct) await adminApi.updateProduct(editingProduct.id, payload);
      else await adminApi.insertProduct({ id: productId, ...payload });

      if (form.isCustomizable && customOptions.length > 0) {
        await adminApi.saveCustomizationOptions(productId, customOptions);
      } else {
        await adminApi.deleteCustomizationOptionsForProduct(productId);
      }

      setShowModal(false);
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light">Products ({list.length})</h2>
        <button
          onClick={openAddModal}
          className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-gray-800 text-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Category</th>
            <th className="py-2">Price</th>
            <th className="py-2">Stock</th>
            <th className="py-2">Customizable</th>
            <th className="py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.id} className="border-b">
              {editingId === p.id ? (
                <>
                  <td className="py-2 pr-2">
                    <input value={quickForm.name} onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })} className="border rounded-lg px-2 py-1 w-full" />
                  </td>
                  <td className="py-2 pr-2 text-gray-400">{p.category}</td>
                  <td className="py-2 pr-2">
                    <input value={quickForm.price} onChange={(e) => setQuickForm({ ...quickForm, price: e.target.value })} className="border rounded-lg px-2 py-1 w-24" />
                  </td>
                  <td className="py-2 pr-2">
                    <input value={quickForm.stock} onChange={(e) => setQuickForm({ ...quickForm, stock: e.target.value })} className="border rounded-lg px-2 py-1 w-20" />
                  </td>
                  <td className="py-2 pr-2">{p.customizable ? 'Yes' : 'No'}</td>
                  <td className="py-2 text-right space-x-2">
                    <button onClick={() => saveQuickEdit(p.id)} className="bg-black text-white px-3 py-1.5 rounded-lg text-xs">Save</button>
                    <button onClick={() => setEditingId(null)} className="border px-3 py-1.5 rounded-lg text-xs">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-3">{p.name}</td>
                  <td className="py-3 text-gray-500">{p.category}</td>
                  <td className="py-3">EGP {p.price}</td>
                  <td className="py-3">{p.stock}</td>
                  <td className="py-3">{p.customizable ? 'Yes' : 'No'}</td>
                  <td className="py-3 text-right space-x-3">
                    <button onClick={() => startQuickEdit(p)} className="text-gray-500 hover:text-black"><Edit2 size={14} className="inline" /></button>
                    <button onClick={() => openEditModal(p)} className="text-blue-600 hover:text-blue-700 text-xs">Full Edit</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6"><X size={22} /></button>
            <h2 className="text-2xl font-light mb-6">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Picture</label>
                {imagePreview && (
                  <div className="relative w-32 h-32 mb-2">
                    <Image src={imagePreview} alt="" fill className="object-cover rounded-xl" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files?.[0] || null)} className="border rounded-xl px-4 py-2 w-full text-sm" />
              </div>

              <input type="text" placeholder="Product name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-xl px-4 py-3 w-full" />
              <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded-xl px-4 py-3 w-full" />
              <input type="number" placeholder="Price *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border rounded-xl px-4 py-3 w-full" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-xl px-4 py-3 w-full h-24" />

              <label className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl">
                <input type="checkbox" checked={form.isCustomizable} onChange={(e) => setForm({ ...form, isCustomizable: e.target.checked })} className="w-5 h-5" />
                <span className="font-medium text-sm">This product is customizable</span>
              </label>

              {form.isCustomizable && (
                <CustomizationEditor options={customOptions} onChange={setCustomOptions} />
              )}

              <button onClick={saveProduct} disabled={saving} className="w-full bg-black text-white py-4 rounded-2xl hover:bg-gray-800 disabled:opacity-60">
                {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}