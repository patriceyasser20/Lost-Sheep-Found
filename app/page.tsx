import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Heart, Sparkles } from "lucide-react";
import Reveal from "./components/Reveal";
import AmbientBackground from "./components/AmbientBackground";

const collections = [
  {
    title: "Bible Journals",
    description: "Beautiful places to slow down, reflect, and write.",
    href: "/collection/bible-journals",
    icon: BookOpen,
  },
  {
    title: "Wooden Verses",
    description: "Scripture made tangible for your home and heart.",
    href: "/collection/wood-blocks",
    icon: Sparkles,
  },
  {
    title: "Little Keepsakes",
    description: "Bookmarks, totes and key chains made to carry faith.",
    href: "/collection/keepsakes",
    icon: Heart,
  },
];

export default function Home() {
  return (
    <main className="relative">
      <AmbientBackground />

      {/* keyframes for the "Make it yours" band — twinkling mark + drifting ambient glow */}
      <style>{`
        @keyframes lsfTwinkle {
          0%, 100% { opacity: .55; transform: scale(.85) rotate(0deg); }
          50%      { opacity: 1;   transform: scale(1.15) rotate(12deg); }
        }
        @keyframes lsfDrift {
          0%   { transform: translate(-8%, -6%) scale(1); }
          50%  { transform: translate(8%, 6%) scale(1.18); }
          100% { transform: translate(-8%, -6%) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lsf-twinkle, .lsf-drift { animation: none !important; }
        }
      `}</style>

      <section className="mx-auto grid min-h-[690px] max-w-[1320px] grid-cols-1 items-center gap-[30px] px-[25px] py-[60px] text-center md:grid-cols-[1.02fr_.98fr] md:gap-[60px] md:px-[50px] md:py-[85px] md:text-left">
        <Reveal className="md:pl-[30px]" direction="up" distance={22}>
          <p className="mb-[17px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">
            <span className="px-2">✦</span> Made with faith & intention <span className="px-2">✦</span>
          </p>
          <h1 className="m-0 font-display text-[clamp(58px,6.3vw,94px)] font-medium leading-[.88] tracking-[-.055em]">
            Carry a little<br /><em className="font-normal italic">Scripture</em> with you.
          </h1>
          <p className="mx-auto my-7 max-w-[470px] text-[15px] leading-[1.8] text-brown-soft md:mx-0">
            Thoughtfully made journals, keepsakes, and everyday pieces
            inspired by the Word — created to remind you of what matters.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-7 md:justify-start">
            <Link href="/shop" className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
              Explore the collection <ArrowRight size={16} />
            </Link>
            <Link href="/our-story" className="text-xs uppercase tracking-[.08em] border-b border-gold pb-[5px]">Our story <span className="ml-[7px]">→</span></Link>
          </div>
        </Reveal>

        <Reveal direction="up" distance={22} delay={150}>
          <div className="relative flex flex-col items-center">
            <div className="relative flex aspect-square w-full max-w-[430px] items-center justify-center md:max-w-[550px]">

              {/* White background behind the entire logo */}
              <div className="absolute h-[92%] w-[88%] bg-[#fffdf8]" />

              {/* Decorative arch border */}
              <div className="absolute h-[86%] w-[76%] rounded-[48%_48%_3%_3%] border border-gold opacity-70" />

              <Image
                src="/logo.png"
                alt="Lost Sheep Found logo with a resting lamb"
                fill
                priority
                className="relative z-10 object-contain p-[15px] mix-blend-multiply md:p-[25px]"
              />

            </div>
            <div className="-mt-4 text-center font-display text-[17px] italic leading-[1.35]">
              "The Lord is my shepherd."<br />
              <span className="font-sans text-[9px] not-italic uppercase tracking-[.16em] text-gold">Psalm 23:1</span>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className="mx-auto flex max-w-[1150px] items-center gap-[22px] px-[30px] pb-[45px] text-brown-soft md:pb-[72px]">
          <span className="hidden h-px flex-1 bg-line md:block" />
          <p className="m-auto text-center font-display text-[17px] italic md:flex-none">For the quiet moments. The answered prayers. The everyday walk.</p>
          <span className="hidden h-px flex-1 bg-line md:block" />
        </section>
      </Reveal>

      <section className="mx-auto max-w-[1240px] border-t border-line px-5 py-[65px] md:px-[30px] md:py-[90px]">
        <Reveal>
          <div className="mb-[38px] flex items-end justify-between">
            <div>
              <p className="mb-[10px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Find something meaningful</p>
              <h2 className="m-0 font-display text-[clamp(43px,5vw,62px)] font-medium leading-[.95] tracking-[-.045em]">Shop by collection</h2>
            </div>
            <Link href="/shop" className="hidden text-xs uppercase tracking-[.08em] border-b border-gold pb-[5px] md:inline">View everything <span className="ml-[7px]">→</span></Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-3">
          {collections.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 110} distance={20}>
                <Link
                  href={item.href}
                  className="relative flex min-h-[210px] flex-col justify-between border border-line bg-cream/[.52] p-[30px] transition duration-300 hover:-translate-y-1 hover:bg-cream md:min-h-[245px]"
                >
                  <div className="text-gold"><Icon size={25} strokeWidth={1.2} /></div>
                  <div>
                    <h3 className="m-0 mb-2 font-display text-[29px] font-medium tracking-[-.03em]">{item.title}</h3>
                    <p className="m-0 max-w-[260px] text-[13px] leading-[1.6] text-brown-soft">{item.description}</p>
                  </div>
                  <span className="absolute bottom-[30px] right-[28px]"><ArrowRight size={18} /></span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------- Bible feature promo — replaces the old featured-products section ---------- */}
      <section className="mx-auto max-w-[1240px] px-5 pb-[65px] pt-[105px] md:px-[30px] md:pb-[90px]">
        <Reveal>
          <div className="mb-[38px] text-center">
            <p className="mb-[10px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Sit with the Word</p>
            <h2 className="m-0 font-display text-[clamp(43px,5vw,62px)] font-medium leading-[.95] tracking-[-.045em]">Read Scripture, page by page</h2>
            <p className="mx-auto mt-[17px] max-w-[450px] text-sm leading-[1.7] text-brown-soft">
              Every book, every chapter, laid out like an actual Bible you can open and turn through.
            </p>
          </div>
        </Reveal>

        <Reveal delay={110} distance={20}>
          <Link
            href="/bible"
            className="group relative mx-auto flex max-w-[720px] flex-col items-center gap-4 border border-line bg-cream/[.52] px-8 py-[70px] text-center transition duration-300 hover:-translate-y-1 hover:bg-cream"
          >
            <div className="text-gold"><BookOpen size={28} strokeWidth={1.2} /></div>
            <h3 className="m-0 font-display text-[29px] font-medium tracking-[-.03em]">Open the Bible</h3>
            <p className="m-0 max-w-[420px] text-[13px] leading-[1.6] text-brown-soft">
              Genesis to Revelation, King James Version — tap the cover, flip to a book, and read a chapter at a time.
            </p>
            <span className="mt-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[.15em] text-gold transition group-hover:tracking-[.22em]">
              Start reading <ArrowRight size={16} />
            </span>
          </Link>
        </Reveal>
      </section>

      {/* ---------- Daily Katameros reading — 365-day lectionary cycle ---------- */}
      <section className="mx-auto max-w-[1240px] px-5 pb-[65px] md:px-[30px] md:pb-[90px]">
        <Reveal delay={110} distance={20}>
          <Link
            href="/daily-reading"
            className="group relative mx-auto flex max-w-[720px] flex-col items-center gap-4 border border-line bg-cream/[.52] px-8 py-[70px] text-center transition duration-300 hover:-translate-y-1 hover:bg-cream"
          >
            <div className="text-gold"><BookOpen size={28} strokeWidth={1.2} /></div>
            <p className="m-0 text-[10px] font-semibold uppercase tracking-[.22em] text-gold">The Katameros</p>
            <h3 className="m-0 font-display text-[29px] font-medium tracking-[-.03em]">Today's daily reading</h3>
            <p className="m-0 max-w-[420px] text-[13px] leading-[1.6] text-brown-soft">
              A year-long journey through Scripture, following the Coptic Orthodox Church's calendar —
              one reading a day.
            </p>
            <span className="mt-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[.15em] text-gold transition group-hover:tracking-[.22em]">
              Read today's passage <ArrowRight size={16} />
            </span>
          </Link>
        </Reveal>
      </section>

      {/* ---------- "Make it yours" — richer treatment on top of the ambient layer ---------- */}
      <section className="relative mt-[50px] overflow-hidden bg-brown text-center text-cream">
        {/* extra, section-local glow layered above the site-wide ambient background */}
        <div
          className="lsf-drift pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(201,169,126,.35) 0%, rgba(201,169,126,0) 68%)',
            animation: 'lsfDrift 14s ease-in-out infinite',
          }}
        />

        <div className="relative mx-auto max-w-[720px] px-[30px] py-[110px]">
          <Reveal distance={16}>
            <div
              className="lsf-twinkle mb-[18px] text-[22px] text-[#c2a97e]"
              style={{ animation: 'lsfTwinkle 3.4s ease-in-out infinite' }}
            >
              ✦
            </div>
          </Reveal>

          <Reveal delay={80} distance={16}>
            <p className="mb-[17px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Make it yours</p>
          </Reveal>

          <Reveal delay={160} distance={20}>
            <h2 className="m-0 font-display text-[clamp(48px,6vw,72px)] font-medium leading-[.94] tracking-[-.05em]">
              A gift with <em className="font-normal italic">your story</em> in it.
            </h2>
          </Reveal>

          <Reveal delay={260} distance={18}>
            <p className="mx-auto my-[25px] mb-[35px] max-w-[540px] text-sm leading-[1.8] text-cream/[.72]">
              Add a name, a verse, a prayer, or a few words that mean everything.
              Our journals and wooden scripture pieces can be personalized just for you.
            </p>
          </Reveal>

          <Reveal delay={340} distance={14}>
            <Link href="/shop?customizable=true" className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-cream/[.65] px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:bg-cream hover:text-brown">
              Discover personalized pieces <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <section className="bg-paper-light px-[30px] py-[110px] text-center">
          <div className="text-xl text-gold">✦</div>
          <blockquote className="mx-auto mb-2 mt-[18px] max-w-[850px] font-display text-[clamp(34px,5vw,58px)] italic tracking-[-.04em]">
            "I have found my sheep which was lost."
          </blockquote>
          <p className="m-0 text-[9px] uppercase tracking-[.2em] text-gold">Luke 15:6</p>
        </section>
      </Reveal>
    </main>
  );
}