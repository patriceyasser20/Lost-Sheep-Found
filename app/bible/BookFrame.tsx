export default function BookFrame({
  children,
  narrow = false,
}: {
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className={`mx-auto ${narrow ? 'max-w-[820px]' : 'max-w-[1400px]'} px-[16px] py-[36px] md:px-[28px]`}>
      <div className="relative">
        {/* faux stacked pages peeking out behind the book, for a "book resting
            on a desk" read rather than a flat card */}
        <div className="absolute inset-x-3 -bottom-2 top-3 -z-10 border border-line/70 bg-paper-light" />
        <div className="absolute inset-x-1.5 -bottom-1 top-1.5 -z-10 border border-line/80 bg-cream/80" />
        <div className="relative border border-line bg-cream shadow-[0_40px_80px_-30px_rgba(76,60,46,.35)]">
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(76,60,46,.06)]" />
          <div className="relative px-6 py-8 md:px-[60px] md:py-[50px]">{children}</div>
        </div>
      </div>
    </div>
  );
}