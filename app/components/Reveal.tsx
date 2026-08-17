'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** delay in ms before the reveal starts, once in view — use to stagger siblings */
  delay?: number;
  /** how far (px) the content travels as it fades in */
  distance?: number;
  /** 'up' | 'down' | 'none' — direction content travels from */
  direction?: 'up' | 'down' | 'none';
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  distance = 26,
  direction = 'up',
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion preference — show content immediately, no animation.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const offset = direction === 'none' ? 0 : distance;
  const translateFrom = direction === 'down' ? -offset : offset;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${translateFrom}px)`,
        transition: `opacity 0.85s cubic-bezier(.16,.84,.44,1) ${delay}ms, transform 0.85s cubic-bezier(.16,.84,.44,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}