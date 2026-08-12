// lib/products.ts
export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  priceLabel: string;
  tag: string;
  category: "bible-journals" | "wood-blocks" | "keepsakes";
  collection: string;
  customizable: boolean;
  stock: number;
  description: string;
  details: string[];
  verse: string;
  verseRef: string;
};

export const products: Product[] = [
  {
    id: "the-shepherd-journal",
    slug: "the-shepherd-journal",
    name: "The Shepherd Journal",
    sku: "LSF-SJ-001",
    price: 420,
    priceLabel: "From EGP 420",
    tag: "Personalizable",
    category: "bible-journals",
    collection: "bible-journals",
    customizable: true,
    stock: 20,
    description:
      "A wide-margin journaling Bible companion with soft linen covers, ribbon markers, and pages made for notes, prayers, and pressed moments.",
    details: [
      "192 pages, 120gsm cream paper",
      "Linen cover in five colors",
      "Ribbon marker + elastic closure",
      "Optional name or verse foil stamp",
    ],
    verse: "The Lord is my shepherd; I shall not want.",
    verseRef: "Psalm 23:1",
  },
  {
    id: "psalm-23-wood-block",
    slug: "psalm-23-wood-block",
    name: "Psalm 23 Wood Block",
    sku: "LSF-SJ-001",
    price: 350,
    priceLabel: "EGP 350",
    tag: "Hand-finished",
    category: "wood-blocks",
    collection: "wood-blocks",
    customizable: false,
    stock: 15,
    description:
      "Solid acacia wood, hand-sanded and engraved with Psalm 23 in a quiet serif hand. A small, steady thing for a shelf or a desk.",
    details: [
      "Solid acacia wood, oiled finish",
      "14cm x 19cm x 2cm",
      "Laser engraved, hand-sanded edges",
      "Felt backing to protect surfaces",
    ],
    verse: "He restoreth my soul.",
    verseRef: "Psalm 23:3",
  },
  {
    id: "grace-and-truth-bookmark",
    slug: "grace-and-truth-bookmark",
    name: "Grace & Truth Bookmark",
    sku: "LSF-SJ-001",
    price: 120,
    priceLabel: "EGP 120",
    tag: "New",
    category: "keepsakes",
    collection: "keepsakes",
    customizable: true,
    stock: 30,
    description:
      "A slim brass-edged bookmark with a tassel, made to sit inside your Bible or journal between visits.",
    details: [
      "Kraft card + brass corner",
      "Cotton tassel, three colorways",
      "Optional initial embossing",
      "Ships in a kraft sleeve",
    ],
    verse: "Grace and truth came through Jesus Christ.",
    verseRef: "John 1:17",
  },
  {
    id: "still-waters-journal",
    slug: "still-waters-journal",
    name: "Still Waters Journal",
    sku: "LSF-SJ-001",
    price: 460,
    priceLabel: "EGP 460",
    tag: "Personalizable",
    category: "bible-journals",
    collection: "bible-journals",
    customizable: true,
    stock: 18,
    description:
      "Our fullest journal, with guided prayer prompts, a reading plan, and generous room in the margins for your own words.",
    details: [
      "224 pages, dot-grid + lined mix",
      "Cloth-bound hardcover",
      "Included 6-month reading plan",
      "Optional name or verse foil stamp",
    ],
    verse: "He leadeth me beside the still waters.",
    verseRef: "Psalm 23:2",
  },
  {
    id: "be-still-wood-block",
    slug: "be-still-wood-block",
    name: "Be Still Wood Block",
    sku: "LSF-SJ-001",
    price: 340,
    priceLabel: "EGP 340",
    tag: "Hand-finished",
    category: "wood-blocks",
    collection: "wood-blocks",
    customizable: false,
    stock: 12,
    description:
      "A small standing block carved with 'Be still, and know that I am God' — a quiet reminder for a nightstand or entryway.",
    details: [
      "Solid pine, matte white wash",
      "10cm x 15cm x 2cm",
      "Hand-sanded, easel back",
      "Felt backing to protect surfaces",
    ],
    verse: "Be still, and know that I am God.",
    verseRef: "Psalm 46:10",
  },
  {
    id: "faithful-tote",
    slug: "faithful-tote",
    name: "Faithful Tote",
    sku: "LSF-SJ-001",
    price: 280,
    priceLabel: "EGP 280",
    tag: "New",
    category: "keepsakes",
    collection: "keepsakes",
    customizable: false,
    stock: 25,
    description:
      "Heavyweight canvas, sized to carry a Bible, a journal, and whatever else the day asks for.",
    details: [
      "12oz natural canvas",
      "38cm x 40cm, 10cm gusset",
      "Reinforced stitched handles",
      "Screen-printed wordmark",
    ],
    verse: "Great is thy faithfulness.",
    verseRef: "Lamentations 3:23",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}