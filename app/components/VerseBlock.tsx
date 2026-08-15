export default function VerseBlock({ verse, reference }: { verse: string; reference: string }) {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-paper-light px-[30px] py-[110px] text-center">
      <div className="mb-3 text-lg text-gold">✦</div>
      <blockquote className="m-0 font-display text-[clamp(24px,3vw,32px)] italic leading-snug text-brown">
        "{verse}"
      </blockquote>
      <p className="mt-3 text-[10px] uppercase tracking-[.2em] text-gold">{reference}</p>
    </section>
  );
}