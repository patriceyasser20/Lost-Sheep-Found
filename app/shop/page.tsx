import Link from "next/link";
import { ArrowRight } from "lucide-react";

const items = [
  ["Bible Journals", "bible-journals", "Write, pray, reflect."],
  ["Bookmarks", "bookmarks", "Small reminders, close at hand."],
  ["Wood Blocks", "wood-blocks", "Scripture for your space."],
  ["Tote Bags", "tote-bags", "Carry faith with you."],
  ["Key Chains", "key-chains", "A little keepsake for every day."]
];

export default function Shop() {
  return (
    <main className="section" style={{ minHeight: "80vh" }}>
      <div className="section-heading">
        <div><p className="eyebrow">The collection</p><h1 style={{fontSize:"clamp(55px,7vw,90px)"}}>Shop with purpose.</h1></div>
      </div>
      <div className="collection-grid">
        {items.map(([name, slug, description]) => (
          <Link key={slug} href={`/shop?category=${slug}`} className="collection-card">
            <div><p className="eyebrow">Collection</p><h3>{name}</h3><p>{description}</p></div>
            <span className="card-arrow"><ArrowRight size={18}/></span>
          </Link>
        ))}
      </div>
    </main>
  );
}