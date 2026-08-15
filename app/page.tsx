import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Heart, Sparkles } from "lucide-react";
import { getFeaturedProducts } from "../lib/productsServer";

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

 const featured = await getFeaturedProducts(3);

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid min-h-[690px] max-w-[1320px] grid-cols-1 items-center gap-[30px] px-[25px] py-[60px] text-center md:grid-cols-[1.02fr_.98fr] md:gap-[60px] md:px-[50px] md:py-[85px] md:text-left">
        <div className="md:pl-[30px]">
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
        </div>

        <div className="relative flex flex-col items-center">
          <div className="relative flex aspect-square w-full max-w-[430px] items-center justify-center md:max-w-[550px] before:absolute before:h-[86%] before:w-[76%] before:rounded-[48%_48%_3%_3%] before:border before:border-gold before:opacity-70 before:content-['']">
            <Image
              src="/logo.png"
              alt="Lost Sheep Found logo with a resting lamb"
              fill
              priority
              className="object-contain p-[35px] mix-blend-multiply md:p-[50px]"
            />
          </div>
          <div className="-mt-6 text-center font-display text-[17px] italic leading-[1.35]">
            "The Lord is my shepherd."<br />
            <span className="font-sans text-[9px] not-italic uppercase tracking-[.16em] text-gold">Psalm 23:1</span>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1150px] items-center gap-[22px] px-[30px] pb-[45px] text-brown-soft md:pb-[72px]">
        <span className="hidden h-px flex-1 bg-line md:block" />
        <p className="m-auto text-center font-display text-[17px] italic md:flex-none">For the quiet moments. The answered prayers. The everyday walk.</p>
        <span className="hidden h-px flex-1 bg-line md:block" />
      </section>

      <section className="mx-auto max-w-[1240px] border-t border-line px-5 py-[65px] md:px-[30px] md:py-[90px]">
        <div className="mb-[38px] flex items-end justify-between">
          <div>
            <p className="mb-[10px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Find something meaningful</p>
            <h2 className="m-0 font-display text-[clamp(43px,5vw,62px)] font-medium leading-[.95] tracking-[-.045em]">Shop by collection</h2>
          </div>
          <Link href="/shop" className="hidden text-xs uppercase tracking-[.08em] border-b border-gold pb-[5px] md:inline">View everything <span className="ml-[7px]">→</span></Link>
        </div>

        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-3">
          {collections.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                className="relative flex min-h-[210px] flex-col justify-between border border-line bg-cream/[.52] p-[30px] transition duration-300 hover:-translate-y-1 hover:bg-cream md:min-h-[245px]"
                key={item.title}
              >
                <div className="text-gold"><Icon size={25} strokeWidth={1.2} /></div>
                <div>
                  <h3 className="m-0 mb-2 font-display text-[29px] font-medium tracking-[-.03em]">{item.title}</h3>
                  <p className="m-0 max-w-[260px] text-[13px] leading-[1.6] text-brown-soft">{item.description}</p>
                </div>
                <span className="absolute bottom-[30px] right-[28px]"><ArrowRight size={18} /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-[65px] pt-[105px] md:px-[30px] md:pb-[90px]">
        <div className="mb-[38px] text-center">
          <p className="mb-[10px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">A few favorites</p>
          <h2 className="m-0 font-display text-[clamp(43px,5vw,62px)] font-medium leading-[.95] tracking-[-.045em]">Made to be kept</h2>
          <p className="mx-auto mt-[17px] max-w-[450px] text-sm leading-[1.7] text-brown-soft">
            Personal pieces for your Bible, your home, and the people you love.
          </p>
        </div>

        <div className="mt-[50px] grid grid-cols-1 gap-[18px] md:grid-cols-3">
          {featured.map((product) => (
            <Link href={`/product/${product.slug}`} className="group" key={product.slug}>
              <div className="relative flex aspect-[.88] flex-col items-center justify-center border border-line bg-paper-light text-gold before:absolute before:h-[67%] before:w-[58%] before:rounded-[48%_48%_4%_4%] before:border before:border-gold/[.55] before:content-['']">
                <span className="relative z-10 text-[27px]">✦</span>
                <span className="relative z-10 mt-[10px] text-[9px] tracking-[.15em] uppercase">{product.id}</span>
              </div>
              <div className="flex items-center justify-between px-1 py-[17px]">
                <div>
                  <h3 className="mb-1 font-display text-[22px] font-medium">{product.name}</h3>
                  <p className="text-[11px] tracking-[.05em] text-brown-soft">{product.priceLabel}</p>
                </div>
                <ArrowRight size={17} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-[50px] bg-brown text-center text-cream">
        <div className="mx-auto max-w-[720px] px-[30px] py-[110px]">
          <div className="mb-[18px] text-[22px] text-[#c2a97e]">✦</div>
          <p className="mb-[17px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Make it yours</p>
          <h2 className="m-0 font-display text-[clamp(48px,6vw,72px)] font-medium leading-[.94] tracking-[-.05em]">A gift with <em className="font-normal italic">your story</em> in it.</h2>
          <p className="mx-auto my-[25px] mb-[35px] max-w-[540px] text-sm leading-[1.8] text-cream/[.72]">
            Add a name, a verse, a prayer, or a few words that mean everything.
            Our journals and wooden scripture pieces can be personalized just for you.
          </p>
          <Link href="/shop?customizable=true" className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-cream/[.65] px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:bg-cream hover:text-brown">
            Discover personalized pieces <ArrowRight size={16} />
          </Link>
        </div>
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