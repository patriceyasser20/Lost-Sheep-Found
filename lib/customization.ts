import { supabaseClient } from './supabaseClient';

export type OptionType = 'select' | 'text' | 'textarea';

export type OptionChoice = {
  id: string;
  label: string;
  swatch?: string;   // hex color, for Cover/Colors
  image?: string;     // small preview image, for Designs/Template
};

export type CustomizationOption = {
  id: string;
  product_id: string;
  name: string;
  type: OptionType;
  required: boolean;
  options: OptionChoice[];
  placeholder?: string;
};

// Presets the admin can drop in with one click.
export const OPTION_PRESETS: Record<string, Omit<CustomizationOption, 'id' | 'product_id'>> = {
  Cover: {
    name: 'Cover', type: 'select', required: true,
    options: [
      { id: 'cover-linen-ivory', label: 'Linen — Ivory', swatch: '#ede1c6' },
      { id: 'cover-linen-navy', label: 'Linen — Navy', swatch: '#1c2a4a' },
      { id: 'cover-leather-cognac', label: 'Leather — Cognac', swatch: '#8a5a34' },
    ],
  },
  Colors: {
    name: 'Colors', type: 'select', required: true,
    options: [
      { id: 'color-gold', label: 'Gold Foil', swatch: '#a1792f' },
      { id: 'color-silver', label: 'Silver Foil', swatch: '#b7bcc4' },
      { id: 'color-rubric', label: 'Rubric Red', swatch: '#7b2c2c' },
    ],
  },
  Designs: {
    name: 'Designs', type: 'select', required: false,
    options: [
      { id: 'design-ivy', label: 'Ivy Border' },
      { id: 'design-cross', label: 'Cross Emblem' },
      { id: 'design-vine', label: 'Floral Vine' },
      { id: 'design-none', label: 'No Design' },
    ],
  },
  Template: {
    name: 'Template', type: 'select', required: true,
    options: [
      { id: 'tpl-classic', label: 'Classic Verse Layout' },
      { id: 'tpl-minimal', label: 'Modern Minimal' },
      { id: 'tpl-illuminated', label: 'Illuminated Initial' },
    ],
  },
  Prompt: {
    name: 'Personal Verse or Prompt', type: 'textarea', required: false, options: [],
    placeholder: 'e.g. "Psalm 46:10", a name to stamp inside the cover, or a note for the scribe...',
  },
};

// Local fallback so the storefront renders before Supabase is connected.
const DEMO_CUSTOMIZATION: Record<string, Omit<CustomizationOption, 'product_id'>[]> = {
  'the-shepherd-journal': [
    { id: 'opt-cover', ...OPTION_PRESETS.Cover },
    { id: 'opt-colors', ...OPTION_PRESETS.Colors },
    { id: 'opt-designs', ...OPTION_PRESETS.Designs },
    { id: 'opt-template', ...OPTION_PRESETS.Template },
    { id: 'opt-prompt', ...OPTION_PRESETS.Prompt },
  ],
};

export async function getCustomizationOptions(productId: string): Promise<CustomizationOption[]> {
  // TODO: once Supabase is connected —
  //   const { data } = await supabaseClient.from('customization_options').select('*').eq('product_id', productId);
  //   return data || [];
  const demo = DEMO_CUSTOMIZATION[productId];
  return demo ? demo.map((o) => ({ ...o, product_id: productId })) : [];
}