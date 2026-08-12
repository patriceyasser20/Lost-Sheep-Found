import ProductCard from '../components/ProductCard';
import { products } from '../../lib/products';

export const metadata = {
  title: 'Sale — Lost Sheep Found',
};

export default function SalePage() {
  // TODO: filter on a real `is_on_sale` / `discount_percentage` field once
  // products come from Supabase. Showing the full catalog for now.
  const saleItems = products;

  return (
    <main className="shop-page">
      <section className="page-hero">
        <p className="eyebrow">Advent sale</p>
        <h1>15% off, this week only</h1>
        <p>Use code <strong>ADVENT15</strong> at checkout on any journal or wood verse piece.</p>
      </section>

      <div className="page-container">
        <div className="product-grid">
          {saleItems.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </main>
  );
}
