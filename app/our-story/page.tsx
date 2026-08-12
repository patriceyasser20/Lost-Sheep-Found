import { Feather, Hand, Home as HomeIcon } from "lucide-react";

export const metadata = {
  title: "Our Story — Lost Sheep Found",
};

const values = [
  {
    icon: Feather,
    title: "Made slowly",
    description: "Every piece is finished by hand, in small batches, so nothing feels mass-produced.",
  },
  {
    icon: HomeIcon,
    title: "Made for the everyday",
    description: "Not for a shelf you forget about — for the bag, the desk, the nightstand you actually use.",
  },
  {
    icon: Hand,
    title: "Made with you in mind",
    description: "A name, a verse, a color — we build in room to make each piece feel like yours.",
  },
];

export default function OurStoryPage() {
  return (
    <main>
      <section className="mx-auto max-w-[900px] px-[30px] pb-[60px] pt-[95px] text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-gold"><span className="px-2">✦</span> Our story <span className="px-2">✦</span></p>
        <h1 className="my-[18px] mb-[26px] font-display text-[clamp(48px,6vw,80px)] font-medium leading-[.92] tracking-[-.045em]">A lamp for a lamb<br /><em className="font-normal italic">that wandered</em>.</h1>
        <p className="mx-auto max-w-[540px] text-[15px] leading-[1.85] text-brown-soft">
          Lost Sheep Found started with a journal, a hard season, and a
          verse underlined so many times it wore through the page.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1150px] grid-cols-1 items-center gap-6 px-[30px] py-[60px] md:grid-cols-[.85fr_1.15fr] md:gap-[60px]">
        <div className="relative flex aspect-[4/5] items-center justify-center border border-line bg-paper-light text-gold before:absolute before:h-[78%] before:w-[70%] before:rounded-[48%_48%_4%_4%] before:border before:border-gold/[.5] before:content-['']">
          <span className="relative z-10 text-[30px]">✦</span>
        </div>
        <div>
          <p className="mb-[14px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">How it began</p>
          <h2 className="mb-[18px] font-display text-[clamp(30px,3.6vw,42px)] font-medium tracking-[-.035em]">A journal that held more than notes.</h2>
          <p className="mb-[14px] text-[14.5px] leading-[1.85] text-brown-soft">
            In 2022, our founder started filling the margins of an ordinary
            notebook with prayers, verses, and the small, unremarkable
            moments of a hard year. That notebook became the first Shepherd
            Journal, made for anyone who needed somewhere to put their
            thoughts down honestly.
          </p>
          <p className="mb-[14px] text-[14.5px] leading-[1.85] text-brown-soft">
            What began as one journal, sewn and bound at a kitchen table,
            slowly grew into a small studio of makers who care as much
            about the verse on the page as the hands that made it.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1150px] grid-cols-1 items-center gap-6 px-[30px] py-[60px] md:grid-cols-[1.15fr_.85fr] md:gap-[60px]">
        <div className="order-none md:order-2">
          <p className="mb-[14px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Why "Lost Sheep Found"</p>
          <h2 className="mb-[18px] font-display text-[clamp(30px,3.6vw,42px)] font-medium tracking-[-.035em]">For the wandering and the returning.</h2>
          <p className="mb-[14px] text-[14.5px] leading-[1.85] text-brown-soft">
            The name comes from a parable about being sought after — not
            because you have it all figured out, but simply because you're
            worth finding. That's the feeling we want every piece to carry:
            not judgment, just a quiet welcome back.
          </p>
          <p className="mb-[14px] text-[14.5px] leading-[1.85] text-brown-soft">
            Today, our journals and wooden verses travel to homes across
            Egypt, each one made to be a small, steady companion for
            whatever season you're in.
          </p>
        </div>
        <div className="relative flex aspect-[4/5] items-center justify-center border border-line bg-paper-light text-gold before:absolute before:h-[78%] before:w-[70%] before:rounded-[48%_48%_4%_4%] before:border before:border-gold/[.5] before:content-['']">
          <span className="relative z-10 text-[30px]">✦</span>
        </div>
      </section>

      <section className="mx-auto mt-[50px] grid max-w-[1150px] grid-cols-1 gap-[34px] border-t border-line px-[30px] py-[70px] md:grid-cols-3 md:gap-[30px]">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <div key={value.title}>
              <div className="text-gold"><Icon size={24} strokeWidth={1.2} /></div>
              <h3 className="my-[14px] mb-2 text-[22px] tracking-[-.02em]">{value.title}</h3>
              <p className="m-0 text-[13.5px] leading-[1.7] text-brown-soft">{value.description}</p>
            </div>
          );
        })}
      </section>

      <section className="bg-paper-light px-[30px] py-[110px] text-center">
        <div className="text-xl text-gold">✦</div>
        <blockquote className="mx-auto mb-2 mt-[18px] max-w-[850px] font-display text-[clamp(34px,5vw,58px)] italic tracking-[-.04em]">
          "I have found my sheep which was lost."
        </blockquote>
        <p className="m-0 text-[9px] uppercase tracking-[.2em] text-gold">Luke 15:6</p>
      </section>
    </main>
  );
}