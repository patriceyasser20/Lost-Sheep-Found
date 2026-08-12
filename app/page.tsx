import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Heart, Sparkles } from "lucide-react";
import { products } from "../lib/products";

const collections = [
  {
    title: "Bible Journals",
    description: "Beautiful places to slow down, reflect, and write.",
    href: "/collection/bible-journals",
    icon: BookOpen,
  },
  {
    title: "Wooden Verses",
    description: "Scripture made tangible for your home and heart.",
    href: "/collection/wood-blocks",
    icon: Sparkles,
  },
  {
    title: "Little Keepsakes",
    description: "Bookmarks, totes and key chains made to carry faith.",
    href: "/collection/keepsakes",
    icon: Heart,
  },
];

const featured = products.slice(0, 3);

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span>✦</span> Made with faith & intention <span>✦</span></p>
          <h1>Carry a little<br /><em>Scripture</em> with you.</h1>
          <p className="hero-text">
            Thoughtfully made journals, keepsakes, and everyday pieces
            inspired by the Word — created to remind you of what matters.
          </p>
          <div className="hero-buttons">
            <Link href="/shop" className="button button-dark">
              Explore the collection <ArrowRight size={16} />
            </Link>
            <Link href="/our-story" className="text-link">Our story <span>→</span></Link>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-frame">
            <Image
              src="/logo.png"
              alt="Lost Sheep Found logo with a resting lamb"
              fill
              priority
              className="hero-logo"
            />
          </div>
          <div className="hero-note">"The Lord is my shepherd."<br /><span>Psalm 23:1</span></div>
        </div>
      </section>

      <section className="intro-strip">
        <span className="rule" />
        <p>For the quiet moments. The answered prayers. The everyday walk.</p>
        <span className="rule" />
      </section>

      <section className="section collections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Find something meaningful</p>
            <h2>Shop by collection</h2>
          </div>
          <Link href="/shop" className="text-link desktop-only">View everything <span>→</span></Link>
        </div>

        <div className="collection-grid">
          {collections.map((item) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} className="collection-card" key={item.title}>
                <div className="collection-icon"><Icon size={25} strokeWidth={1.2} /></div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="card-arrow"><ArrowRight size={18} /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section featured">
        <div className="section-heading centered">
          <p className="eyebrow">A few favorites</p>
          <h2>Made to be kept</h2>
          <p className="section-subtitle">
            Personal pieces for your Bible, your home, and the people you love.
          </p>
        </div>

        <div className="product-grid">
          {featured.map((product) => (
            <Link href={`/product/${product.slug}`} className="product-card" key={product.slug}>
              <div className="product-placeholder">
                <span className="product-mark">✦</span>
                <span>{product.tag}</span>
              </div>
              <div className="product-meta">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.priceLabel}</p>
                </div>
                <ArrowRight size={17} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="custom-section">
        <div className="custom-inner">
          <div className="custom-symbol">✦</div>
          <p className="eyebrow">Make it yours</p>
          <h2>A gift with <em>your story</em> in it.</h2>
          <p>
            Add a name, a verse, a prayer, or a few words that mean everything.
            Our journals and wooden scripture pieces can be personalized just for you.
          </p>
          <Link href="/shop?customizable=true" className="button button-outline">
            Discover personalized pieces <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="verse-section">
        <div className="verse-ornament">✦</div>
        <blockquote>
          "Be still, and know that I am God."
        </blockquote>
        <p>Psalm 46:10</p>
      </section>
    </main>
  );
}
