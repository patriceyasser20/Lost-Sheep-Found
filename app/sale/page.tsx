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
    <main>
      <section className="mx-auto max-w-[640px] px-[30px] pt-[95px] pb-[55px] text-center">
        <p className="mb-[17px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">
          Advent sale
        </p>
        <h1 className="mt-[18px] mb-[22px] text-[clamp(46px,5.6vw,76px)] capitalize leading-[.92] tracking-[-.045em]">
          15% off, this week only
        </h1>
        <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">
          Use code <strong>ADVENT15</strong> at checkout on any journal or wood verse piece.
        </p>
      </section>

      <div className="mx-auto max-w-[1240px] px-5 pb-[110px] md:px-[30px]">
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
          {saleItems.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
      <section className="flex min-h-[520px] flex-col items-center justify-center bg-paper-light px-[30px] py-[110px] text-center">
        <div className="text-[20px] text-gold">✦</div>
        <blockquote className="mx-auto mt-[18px] mb-2 max-w-[850px] text-[clamp(34px,5vw,58px)] italic tracking-[-.04em]">
          "Every good gift and every perfect gift is from above."
        </blockquote>
        <p className="m-0 text-[9px] uppercase tracking-[.2em] text-gold">James 1:17</p>
      </section>
    </main>
  );
}
