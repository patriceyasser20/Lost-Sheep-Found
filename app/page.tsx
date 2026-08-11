import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Heart,
  Menu,
  ShoppingBag,
  Sparkles
} from "lucide-react";

const collections = [
  {
    title: "Bible Journals",
    description: "Beautiful places to slow down, reflect, and write.",
    href: "/shop?category=bible-journals",
    icon: BookOpen
  },
  {
    title: "Wooden Verses",
    description: "Scripture made tangible for your home and heart.",
    href: "/shop?category=wood-blocks",
    icon: Sparkles
  },
  {
    title: "Little Keepsakes",
    description: "Bookmarks, totes and key chains made to carry faith.",
    href: "/shop?category=keepsakes",
    icon: Heart
  }
];

const featured = [
  { name: "The Shepherd Journal", price: "From EGP 420", tag: "Personalizable" },
  { name: "Psalm 23 Wood Block", price: "EGP 350", tag: "Hand-finished" },
  { name: "Grace & Truth Bookmark", price: "EGP 120", tag: "New" }
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <button className="mobile-menu" aria-label="Open menu"><Menu size={21} /></button>

          <Link href="/" className="wordmark">
            <span className="wordmark-small">✦</span>
            <span>lost sheep found</span>
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="/shop">Shop</Link>
            <Link href="/shop?category=bible-journals">Journals</Link>
            <Link href="/shop?category=wood-blocks">Wood Verses</Link>
            <Link href="/our-story">Our Story</Link>
          </nav>

          <div className="header-actions">
            <Link href="/shop" className="shop-link">Explore</Link>
            <Link href="/cart" aria-label="Shopping bag"><ShoppingBag size={20} strokeWidth={1.7} /></Link>
          </div>
        </div>
      </header>

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
          <div className="hero-note">“The Lord is my shepherd.”<br /><span>Psalm 23:1</span></div>
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
          {featured.map((product, index) => (
            <Link href={`/products/${index + 1}`} className="product-card" key={product.name}>
              <div className="product-placeholder">
                <span className="product-mark">✦</span>
                <span>{product.tag}</span>
              </div>
              <div className="product-meta">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
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
          “Be still, and know that I am God.”
        </blockquote>
        <p>Psalm 46:10</p>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <div className="footer-logo">lost sheep found</div>
          <p>Faith-filled pieces for your everyday walk.</p>
        </div>
        <div className="footer-links">
          <div><strong>Shop</strong><Link href="/shop">All pieces</Link><Link href="/shop?category=bible-journals">Journals</Link><Link href="/shop?category=wood-blocks">Wood verses</Link></div>
          <div><strong>About</strong><Link href="/our-story">Our story</Link><Link href="/contact">Contact</Link></div>
          <div><strong>Help</strong><Link href="/shipping">Shipping</Link><Link href="/returns">Returns</Link></div>
        </div>
        <div className="footer-bottom">© 2026 Lost Sheep Found · Made with grace.</div>
      </footer>
    </main>
  );
}