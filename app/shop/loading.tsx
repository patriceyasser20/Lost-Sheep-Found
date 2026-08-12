import { ProductGridSkeleton } from '../components/Skeleton';

export default function ShopLoading() {
  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <div className="mx-auto mb-[18px] h-2.5 w-[140px] bg-line" />
        <div className="mx-auto h-10 w-[260px] bg-line" />
      </section>
      <div className="mx-auto max-w-[1240px] px-[30px]">
        <ProductGridSkeleton count={6} />
      </div>
    </main>
  );
}