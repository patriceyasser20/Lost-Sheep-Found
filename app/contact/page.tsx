"use client";

import { useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main>
      <div className="mx-auto grid max-w-[1150px] grid-cols-1 gap-11 px-5 py-[60px] md:grid-cols-[.8fr_1.2fr] md:gap-[60px] md:px-[30px] md:py-[90px]">
        <div>
          <p className="mb-[17px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Get in touch</p>
          <h2 className="mb-4 font-display text-[clamp(30px,3.6vw,40px)] font-medium tracking-[-.03em]">We'd love to hear from you.</h2>
          <p className="mb-[34px] text-[14.5px] leading-[1.85] text-brown-soft">
            Questions about an order, a personalization request, or just
            want to say hello — reach out and we'll get back to you within
            a day or two.
          </p>

          <div className="flex gap-[14px] border-t border-line py-[18px]">
            <Mail size={18} className="mt-0.5 flex-shrink-0 text-gold" />
            <div>
              <strong className="mb-[3px] block text-[13px]">Email</strong>
              <span className="text-[13px] text-brown-soft">hello@lostsheepfound.com</span>
            </div>
          </div>
          <div className="flex gap-[14px] border-t border-line py-[18px]">
            <Phone size={18} className="mt-0.5 flex-shrink-0 text-gold" />
            <div>
              <strong className="mb-[3px] block text-[13px]">Phone</strong>
              <span className="text-[13px] text-brown-soft">+20 10 000 0000</span>
            </div>
          </div>
          <div className="flex gap-[14px] border-t border-line py-[18px]">
            <MapPin size={18} className="mt-0.5 flex-shrink-0 text-gold" />
            <div>
              <strong className="mb-[3px] block text-[13px]">Studio</strong>
              <span className="text-[13px] text-brown-soft">Maadi, Cairo, Egypt</span>
            </div>
          </div>
          <div className="flex gap-[14px] border-y border-line py-[18px]">
            <Clock size={18} className="mt-0.5 flex-shrink-0 text-gold" />
            <div>
              <strong className="mb-[3px] block text-[13px]">Hours</strong>
              <span className="text-[13px] text-brown-soft">Sunday – Thursday, 10am – 6pm</span>
            </div>
          </div>
        </div>

        <div>
          {sent ? (
            <div className="border border-line bg-paper-light px-[30px] py-10 text-center">
              <h3 className="mb-[10px] text-2xl">Message sent</h3>
              <p className="m-0 text-sm text-brown-soft">Thank you for writing in — we'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
                <div className="mb-[18px] flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Name</label>
                  <input id="name" type="text" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
                </div>
                <div className="mb-[18px] flex flex-col gap-2">
                  <label htmlFor="email" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Email</label>
                  <input id="email" type="email" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
                </div>
                <div className="col-span-1 mb-[18px] flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="subject" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Subject</label>
                  <input id="subject" type="text" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
                </div>
                <div className="col-span-1 mb-[18px] flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="message" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Message</label>
                  <textarea id="message" required className="min-h-[120px] resize-y border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
                </div>
              </div>
              <button type="submit" className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}