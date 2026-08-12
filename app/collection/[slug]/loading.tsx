import { ProductGridSkeleton } from '../../components/Skeleton';

export default function CollectionLoading() {
  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <div className="mx-auto h-10 w-[220px] bg-line" />
      </section>
      <div className="mx-auto max-w-[1240px] px-[30px]">
        <ProductGridSkeleton count={6} />
      </div>
    </main>
  );
}