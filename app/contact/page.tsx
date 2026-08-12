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

      <div className="contact-layout">
        <div className="contact-info">
          <p className="eyebrow">Get in touch</p>
          <h2>We'd love to hear from you.</h2>
          <p>
            Questions about an order, a personalization request, or just
            want to say hello — reach out and we'll get back to you within
            a day or two.
          </p>

          <div className="contact-detail">
            <Mail size={18} />
            <div>
              <strong>Email</strong>
              <span>hello@lostsheepfound.com</span>
            </div>
          </div>
          <div className="contact-detail">
            <Phone size={18} />
            <div>
              <strong>Phone</strong>
              <span>+20 10 000 0000</span>
            </div>
          </div>
          <div className="contact-detail">
            <MapPin size={18} />
            <div>
              <strong>Studio</strong>
              <span>Maadi, Cairo, Egypt</span>
            </div>
          </div>
          <div className="contact-detail">
            <Clock size={18} />
            <div>
              <strong>Hours</strong>
              <span>Sunday – Thursday, 10am – 6pm</span>
            </div>
          </div>
        </div>

        <div>
          {sent ? (
            <div className="form-success">
              <h3>Message sent</h3>
              <p>Thank you for writing in — we'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="name">Name</label>
                  <input id="name" type="text" required />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" required />
                </div>
                <div className="form-field full">
                  <label htmlFor="subject">Subject</label>
                  <input id="subject" type="text" required />
                </div>
                <div className="form-field full">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" required />
                </div>
              </div>
              <button type="submit" className="button button-dark">
                Send message
              </button>
            </form>
          )}
        </div>
      </div>

    </main>
  );
}
