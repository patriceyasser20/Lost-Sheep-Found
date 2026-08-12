"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { products } from "../../lib/products";

const initialSaved = ["still-waters-journal", "be-still-wood-block", "faithful-tote"];

export default function WishlistPage() {
  const [saved, setSaved] = useState<string[]>(initialSaved);

  const items = products.filter((p) => saved.includes(p.id));

  function remove(id: string) {
    setSaved((prev) => prev.filter((s) => s !== id));
  }

  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">Kept for later</p>
        <h1>Your Wishlist</h1>
        <p>Pieces you've set aside — ready whenever you are.</p>
      </section>

      {items.length === 0 ? (
        <div className="cart-empty">
          <Heart size={30} color="var(--gold)" strokeWidth={1.3} />
          <h2 style={{ marginTop: 18 }}>Nothing saved yet</h2>
          <p>Tap the heart on any piece to keep it here.</p>
          <Link href="/shop" className="button button-dark">
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="page-container shop-page">
          <div className="product-grid">
            {items.map((product) => (
              <div className="product-card" key={product.id}>
                <Link href={`/product/${product.id}`}>
                  <div className="product-placeholder">
                    <span className="product-mark">✦</span>
                    <span>{product.tag}</span>
                  </div>
                </Link>
                <div className="product-meta">
                  <Link href={`/product/${product.id}`}>
                    <h3>{product.name}</h3>
                    <p>{product.priceLabel}</p>
                  </Link>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button className="button button-dark" style={{ flex: 1 }}>
                    Add to cart <ShoppingBag size={14} />
                  </button>
                  <button
                    className="button button-line"
                    aria-label="Remove from wishlist"
                    onClick={() => remove(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
