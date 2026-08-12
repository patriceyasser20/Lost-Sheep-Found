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

      <section className="page-hero">
        <p className="eyebrow">Questions & answers</p>
        <h1>Frequently Asked</h1>
        <p>Everything you might wonder before your order arrives.</p>
      </section>

      <div className="faq-list">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div className={`faq-item${isOpen ? " open" : ""}`} key={faq.question}>
              <button
                className="faq-question"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <h3>{faq.question}</h3>
                <Plus size={18} />
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>

    </main>
  );
}
