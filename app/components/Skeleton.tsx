export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mt-[50px] grid grid-cols-1 gap-[18px] md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="group" aria-hidden>
          <div className="aspect-[.88] border border-line bg-paper-light opacity-40" />
          <div className="px-1 py-[17px]">
            <div className="mb-2 h-3.5 w-[70%] bg-line" />
            <div className="h-2.5 w-[40%] bg-line" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 items-start gap-[34px] px-5 pb-20 pt-5 md:grid-cols-2 md:gap-[70px] md:px-[30px] md:pb-[110px] md:pt-[30px]" aria-hidden>
      <div className="aspect-[.9] border border-line bg-paper-light opacity-40" />
      <div>
        <div className="mb-4 h-2.5 w-[100px] bg-line" />
        <div className="mb-4 h-[34px] w-[80%] bg-line" />
        <div className="mb-[26px] h-3.5 w-[30%] bg-line" />
        <div className="h-[60px] w-full bg-line" />
      </div>
    </div>
  );
}