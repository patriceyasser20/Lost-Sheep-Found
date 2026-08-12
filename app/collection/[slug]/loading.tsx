import { ProductGridSkeleton } from '../../components/Skeleton';

export default function CollectionLoading() {
  return (
    <main className="shop-page">
      <section className="page-hero">
        <div style={{ height: 40, width: 220, background: 'var(--line)', margin: '0 auto' }} />
      </section>
      <div className="page-container">
        <ProductGridSkeleton count={6} />
      </div>
    </main>
  );
}
