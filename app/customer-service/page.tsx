import Link from 'next/link';
import { HelpCircle, Mail, Ruler, RotateCcw, Truck } from 'lucide-react';
import VerseBlock from '../components/VerseBlock';

export const metadata = {
  title: 'Customer Service — Lost Sheep Found',
};

const links = [
  { href: '/shipping', title: 'Shipping', description: 'Delivery areas, times, and costs.', icon: Truck },
  { href: '/return-exchange', title: 'Returns & Exchange', description: 'How to send something back.', icon: RotateCcw },
  { href: '/size-guide', title: 'Size Guide', description: 'Journal and wood-block dimensions.', icon: Ruler },
  { href: '/faq', title: 'FAQ', description: 'Quick answers to common questions.', icon: HelpCircle },
  { href: '/contact', title: 'Contact us', description: 'Reach our team directly.', icon: Mail },
];

export default function CustomerServicePage() {
  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">We're here to help</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">Customer Service</h1>
        <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">Everything you need to shop, track, and return with confidence.</p>
      </section>

      <div className="mx-auto max-w-[1240px] px-[30px] pb-[110px]">
        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                href={link.href}
                className="relative flex min-h-[210px] flex-col justify-between border border-line bg-cream/[.52] p-[30px] transition duration-300 hover:-translate-y-1 hover:bg-cream md:min-h-[245px]"
                key={link.href}
              >
                <div className="text-gold"><Icon size={24} strokeWidth={1.2} /></div>
                <div>
                  <h3 className="m-0 mb-2 font-display text-[29px] font-medium tracking-[-.03em]">{link.title}</h3>
                  <p className="m-0 max-w-[260px] text-[13px] leading-[1.6] text-brown-soft">{link.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <VerseBlock
          verse="Carry each other's burdens, and in this way you will fulfill the law of Christ."
          reference="Galatians 6:2"
        />
      </div>
    </main>
  );
}