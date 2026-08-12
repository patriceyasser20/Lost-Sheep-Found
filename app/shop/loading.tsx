import { ProductGridSkeleton } from '../components/Skeleton';

export default function ShopLoading() {
  return (
    <main className="shop-page">
      <section className="page-hero">
        <div style={{ height: 10, width: 140, background: 'var(--line)', margin: '0 auto 18px' }} />
        <div style={{ height: 40, width: 260, background: 'var(--line)', margin: '0 auto' }} />
      </section>
      <div className="page-container">
        <ProductGridSkeleton count={6} />
      </div>
    </main>
  );
}
