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

      <section className="story-hero">
        <p className="eyebrow"><span>✦</span> Our story <span>✦</span></p>
        <h1>A lamp for a lamb<br /><em>that wandered</em>.</h1>
        <p>
          Lost Sheep Found started with a journal, a hard season, and a
          verse underlined so many times it wore through the page.
        </p>
      </section>

      <section className="story-block">
        <div className="story-visual">
          <span className="product-mark" style={{ fontSize: 30, zIndex: 1 }}>✦</span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">How it began</p>
          <h2>A journal that held more than notes.</h2>
          <p>
            In 2022, our founder started filling the margins of an ordinary
            notebook with prayers, verses, and the small, unremarkable
            moments of a hard year. That notebook became the first Shepherd
            Journal, made for anyone who needed somewhere to put their
            thoughts down honestly.
          </p>
          <p>
            What began as one journal, sewn and bound at a kitchen table,
            slowly grew into a small studio of makers who care as much
            about the verse on the page as the hands that made it.
          </p>
        </div>
      </section>

      <section className="story-block reverse">
        <div className="story-visual">
          <span className="product-mark" style={{ fontSize: 30, zIndex: 1 }}>✦</span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">Why "Lost Sheep Found"</p>
          <h2>For the wandering and the returning.</h2>
          <p>
            The name comes from a parable about being sought after — not
            because you have it all figured out, but simply because you're
            worth finding. That's the feeling we want every piece to carry:
            not judgment, just a quiet welcome back.
          </p>
          <p>
            Today, our journals and wooden verses travel to homes across
            Egypt, each one made to be a small, steady companion for
            whatever season you're in.
          </p>
        </div>
      </section>

      <section className="story-values">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <div className="story-value" key={value.title}>
              <div className="collection-icon"><Icon size={24} strokeWidth={1.2} /></div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          );
        })}
      </section>

      <section className="verse-section">
        <div className="verse-ornament">✦</div>
        <blockquote>
          "I have found my sheep which was lost."
        </blockquote>
        <p>Luke 15:6</p>
      </section>

    </main>
  );
}
