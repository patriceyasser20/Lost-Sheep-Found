import { ProductDetailSkeleton } from '../../components/Skeleton';

export default function ProductLoading() {
  return (
    <main>
      <div className="breadcrumb" style={{ opacity: 0.4 }}>Home / Shop / …</div>
      <ProductDetailSkeleton />
    </main>
  );
}
