import Link from 'next/link';
import { HelpCircle, Mail, Ruler, RotateCcw, Truck } from 'lucide-react';

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
      <section className="page-hero">
        <p className="eyebrow">We're here to help</p>
        <h1>Customer Service</h1>
        <p>Everything you need to shop, track, and return with confidence.</p>
      </section>

      <div className="page-container" style={{ paddingBottom: 110 }}>
        <div className="collection-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link href={link.href} className="collection-card" key={link.href}>
                <div className="collection-icon"><Icon size={24} strokeWidth={1.2} /></div>
                <div>
                  <h3>{link.title}</h3>
                  <p>{link.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
