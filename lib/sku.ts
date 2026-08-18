// Combines a product's parent SKU with the child SKU of each selected
// customization choice into one fulfillment-ready string, e.g.
// "LSF-JRN-001" + "LINEN" + "IVORY" -> "LSF-JRN-001-LINEN-IVORY".
//
// Tolerant by design: if a selection doesn't carry a `sku` (e.g. an older
// order placed before child SKUs existed, or an option whose choice was
// never given one), it's just skipped rather than breaking the merge.
export function mergeChildSkus(
  parentSku: string | null | undefined,
  selections: Record<string, { sku?: string | null }> | null | undefined
): string | null {
  const parts: string[] = [];

  if (parentSku && parentSku.trim()) {
    parts.push(parentSku.trim());
  }

  if (selections) {
    for (const sel of Object.values(selections)) {
      if (sel && typeof sel === 'object' && sel.sku && String(sel.sku).trim()) {
        parts.push(String(sel.sku).trim());
      }
    }
  }

  return parts.length > 0 ? parts.join('-') : null;
}