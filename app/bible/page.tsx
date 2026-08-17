'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BiblePage() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="min-h-[70vh]">
      <section className="mx-auto max-w-[640px] px-[30px] pb-[35px] pt-[80px] text-center">
        <p className="mb-[18px] text-[10px] uppercase tracking-[.22em] text-gold">The Word</p>
        <h1 className="font-display text-[clamp(40px,5.6vw,64px)] font-medium leading-[.95] tracking-[-.045em]">
          Read Scripture
        </h1>
      </section>

      {!opened ? (
        <div className="mx-auto flex max-w-[420px] flex-col items-center px-[30px] pb-[100px] pt-[10px]">
          <button
            onClick={() => setOpened(true)}
            aria-label="Open the Bible"
            className="group relative flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 border border-gold/40 bg-brown px-8 text-cream shadow-[0_30px_60px_-20px_rgba(76,60,46,.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_40px_70px_-20px_rgba(76,60,46,.5)]"
          >
            <div className="absolute inset-3 border border-gold/30" />
            <span className="relative text-3xl text-gold">✦</span>
            <span className="relative font-display text-[26px] leading-tight tracking-[-.02em]">
              Holy Bible
            </span>
            <span className="relative text-[10px] uppercase tracking-[.2em] text-cream/60">
              King James Version
            </span>
            <span className="relative mt-6 text-[10px] uppercase tracking-[.15em] text-gold transition group-hover:tracking-[.22em]">
              Tap to open →
            </span>
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-[900px] px-[20px] pb-[100px]">
          <div className="relative grid grid-cols-1 border border-line bg-cream shadow-[0_30px_60px_-20px_rgba(76,60,46,.25)] md:grid-cols-2">
            <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[2px] -translate-x-1/2 bg-gradient-to-r from-transparent via-brown/15 to-transparent md:block" />

            <Link
              href="/bible/old"
              className="group flex flex-col items-center justify-center gap-4 border-b border-line px-8 py-[90px] text-center transition hover:bg-paper-light md:border-b-0 md:border-r"
            >
              <span className="text-2xl text-gold">✦</span>
              <h2 className="font-display text-3xl font-medium tracking-[-.02em]">Old Testament</h2>
              <p className="text-[13px] text-brown-soft">Genesis through Malachi</p>
              <span className="mt-2 text-[10px] uppercase tracking-[.15em] text-gold transition group-hover:tracking-[.22em]">
                Open →
              </span>
            </Link>

            <Link
              href="/bible/new"
              className="group flex flex-col items-center justify-center gap-4 px-8 py-[90px] text-center transition hover:bg-paper-light"
            >
              <span className="text-2xl text-gold">✦</span>
              <h2 className="font-display text-3xl font-medium tracking-[-.02em]">New Testament</h2>
              <p className="text-[13px] text-brown-soft">Matthew through Revelation</p>
              <span className="mt-2 text-[10px] uppercase tracking-[.15em] text-gold transition group-hover:tracking-[.22em]">
                Open →
              </span>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}