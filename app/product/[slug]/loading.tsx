import { ProductDetailSkeleton } from '../../components/Skeleton';

export default function ProductLoading() {
  return (
    <main>
      <div className="mx-auto max-w-[1240px] px-[30px] pt-7 text-[11px] uppercase tracking-[.06em] text-brown-soft opacity-40">
        Home / Shop / …
      </div>
      <ProductDetailSkeleton />
    </main>
  );
}