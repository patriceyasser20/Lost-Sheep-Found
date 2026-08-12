"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Standard delivery within Egypt takes 3 to 5 business days. Express delivery arrives in 1 to 2 business days. You'll get a tracking link by email once your order ships.",
  },
  {
    question: "Can I personalize a journal or wood block?",
    answer:
      "Yes — most of our journals and keepsakes can be personalized with a name, initials, or a short verse. Look for the 'Personalizable' tag on a product page and fill in the field before adding it to your cart.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Unused, unpersonalized items can be returned within 14 days of delivery for a full refund. Personalized pieces are made just for you and can't be returned unless there's a fault. See our Returns page for the full details.",
  },
  {
    question: "Do you ship outside Egypt?",
    answer:
      "At the moment we ship within Egypt only, with international shipping planned for later this year. Sign up to our newsletter to hear when it launches.",
  },
  {
    question: "How do I care for the wooden pieces?",
    answer:
      "Wipe gently with a dry or slightly damp cloth. Avoid soaking or direct sunlight for long periods, and an occasional dab of furniture oil will keep the wood looking its best.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards, as well as cash on delivery within Cairo and Giza.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Questions & answers</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">Frequently Asked</h1>
        <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">Everything you might wonder before your order arrives.</p>
      </section>

      <div className="mx-auto max-w-[780px] px-[30px] pb-[130px]">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div className="border-b border-line" key={faq.question}>
              <button
                className="flex w-full cursor-pointer items-center justify-between gap-5 border-0 bg-transparent px-1 py-[26px] text-left text-brown"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <h3 className="m-0 text-lg font-medium tracking-[-.015em]">{faq.question}</h3>
                <Plus size={18} className={`flex-shrink-0 text-gold transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-[400px]' : 'max-h-0'}`}>
                <p className="m-0 mx-1 mb-6 max-w-[620px] text-sm leading-[1.8] text-brown-soft">{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}