'use client';

import { useEffect, useState } from 'react';

// Fixed, deterministic values (not Math.random) so server and client render
// identical markup on first paint — avoids hydration mismatches.
const BLOBS = [
  { top: '-8%', left: '-6%', size: 620, color: 'rgba(201,169,126,.30)', duration: 26, delay: 0 },
  { top: '52%', left: '80%', size: 520, color: 'rgba(161,121,47,.22)', duration: 32, delay: -6 },
  { top: '82%', left: '10%', size: 460, color: 'rgba(201,169,126,.24)', duration: 22, delay: -12 },
  { top: '18%', left: '46%', size: 380, color: 'rgba(201,169,126,.16)', duration: 28, delay: -9 },
];

const MOTES = [
  { left: '6%', size: 4, duration: 16, delay: 0 },
  { left: '16%', size: 3, duration: 19, delay: -3 },
  { left: '26%', size: 5, duration: 14, delay: -7 },
  { left: '35%', size: 3, duration: 21, delay: -2 },
  { left: '45%', size: 4, duration: 17, delay: -9 },
  { left: '55%', size: 3, duration: 15, delay: -4 },
  { left: '64%', size: 5, duration: 20, delay: -11 },
  { left: '73%', size: 3, duration: 18, delay: -1 },
  { left: '83%', size: 4, duration: 16, delay: -8 },
  { left: '91%', size: 3, duration: 22, delay: -5 },
  { left: '50%', size: 3, duration: 24, delay: -13 },
  { left: '96%', size: 4, duration: 18, delay: -6 },
];

export default function AmbientBackground() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEnabled(false);
    }
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <style>{`
        @keyframes lsfBlobDrift {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(4%, 6%) scale(1.08); }
          66%  { transform: translate(-3%, 3%) scale(.96); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes lsfMoteRise {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: .55; }
          50%  { transform: translateY(-46vh) translateX(12px); opacity: .85; }
          90%  { opacity: 0; }
          100% { transform: translateY(-92vh) translateX(-6px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lsf-blob, .lsf-mote { animation: none !important; }
        }
      `}</style>

      {BLOBS.map((b, i) => (
        <div
          key={`blob-${i}`}
          className="lsf-blob absolute rounded-full blur-[80px]"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            animation: enabled ? `lsfBlobDrift ${b.duration}s ease-in-out infinite` : 'none',
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      {enabled &&
        MOTES.map((m, i) => (
          <div
            key={`mote-${i}`}
            className="lsf-mote absolute bottom-0 rounded-full bg-gold"
            style={{
              left: m.left,
              width: m.size,
              height: m.size,
              boxShadow: '0 0 6px 1px rgba(201,169,126,.65)',
              animation: `lsfMoteRise ${m.duration}s ease-in-out infinite`,
              animationDelay: `${m.delay}s`,
            }}
          />
        ))}
    </div>
  );
}