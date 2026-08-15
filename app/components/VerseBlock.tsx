export default function VerseBlock({ verse, reference }: { verse: string; reference: string }) {
  return (
    <section className="bg-paper-light px-[30px] py-[110px] text-center">
      <div className="text-xl text-gold">✦</div>
      <blockquote className="mx-auto mb-2 mt-[18px] max-w-[850px] font-display text-[clamp(34px,5vw,58px)] italic tracking-[-.04em]">
        "{verse}"
      </blockquote>
      <p className="m-0 text-[9px] uppercase tracking-[.2em] text-gold">{reference}</p>
    </section>
  );
}