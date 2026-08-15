import ProductCard from '../components/ProductCard';
import { getProducts } from '../../lib/productsServer';
import VerseBlock from '../components/VerseBlock';

export const metadata = {
  title: 'Sale — Lost Sheep Found',
};

export default async function SalePage() {
  const products = await getProducts();
  const saleItems = products; // TODO: filter on a real is_on_sale field once it exists

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

        <VerseBlock
          verse="Freely you have received; freely give."
          reference="Matthew 10:8"
        />
      </div>
    </main>
  );
}