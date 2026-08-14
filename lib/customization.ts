import { supabaseClient } from './supabaseClient';

export type OptionType = 'select' | 'text' | 'textarea';

export type OptionChoice = {
  id: string;
  label: string;
  swatch?: string;
  image?: string; 
};

export type CustomizationOption = {
  id: string;
  product_id: string;
  name: string;
  type: OptionType;
  required: boolean;
  options: OptionChoice[];
  sort_order: number;
  placeholder?: string;
};

const COLOR_SWATCHES: Record<string, string> = {
  ivory: '#f3ede0',
  'sage green': '#9caf88',
  'dusty rose': '#c98f8f',
  cream: '#fffdf8',
  navy: '#1c2a4a',
  gold: '#a1792f',
  'kraft cover': '#b08d57',
  'linen cover': '#e7dcc4',
  'leather cover': '#5c3a21',
};

export function swatchFor(label: string): string | undefined {
  return COLOR_SWATCHES[label.trim().toLowerCase()];
}

export const OPTION_PRESETS: Record<string, Omit<CustomizationOption, 'id' | 'product_id' | 'sort_order'>> = {
  Cover: {
    name: 'Cover',
    type: 'select',
    required: true,
    options: [
      { id: 'cover-linen', label: 'Linen Cover', swatch: swatchFor('linen cover') },
      { id: 'cover-kraft', label: 'Kraft Cover', swatch: swatchFor('kraft cover') },
      { id: 'cover-leather', label: 'Leather Cover', swatch: swatchFor('leather cover') },
    ],
  },
  Colors: {
    name: 'Color',
    type: 'select',
    required: true,
    options: [
      { id: 'color-ivory', label: 'Ivory', swatch: swatchFor('ivory') },
      { id: 'color-sage', label: 'Sage Green', swatch: swatchFor('sage green') },
      { id: 'color-rose', label: 'Dusty Rose', swatch: swatchFor('dusty rose') },
      { id: 'color-navy', label: 'Navy', swatch: swatchFor('navy') },
    ],
  },
  Designs: {
    name: 'Design',
    type: 'select',
    required: false,
    options: [
      { id: 'design-plain', label: 'Plain' },
      { id: 'design-floral', label: 'Floral Border' },
      { id: 'design-verse', label: 'Verse Overlay' },
    ],
  },
  Template: {
    name: 'Template',
    type: 'select',
    required: false,
    options: [
      { id: 'template-classic', label: 'Classic' },
      { id: 'template-modern', label: 'Modern' },
    ],
  },
  Prompt: {
    name: 'Personalization',
    type: 'textarea',
    required: false,
    options: [],
  },
};

// Client Component read (product customizer widget, admin edit modal)
export async function getCustomizationOptionsClient(productId: string): Promise<CustomizationOption[]> {
  const { data, error } = await supabaseClient
    .from('customization_options')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });
  if (error) { console.error('getCustomizationOptionsClient:', error.message); return []; }
  return data || [];
}