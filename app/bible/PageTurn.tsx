'use client';

// Forces a remount (and therefore replays the CSS animation below) whenever
// the parent passes a new `key` — see usage in the chapter page, where
// key={`${testament}-${book}-${chapter}`} changes on every navigation.
export default function PageTurn({ children }: { children: React.ReactNode }) {
  return (
    <div className="lsf-page-turn">
      <style>{`
        .lsf-page-turn {
          transform-origin: left center;
          animation: lsfPageTurn .55s cubic-bezier(.2,.7,.3,1) both;
        }
        @keyframes lsfPageTurn {
          from {
            opacity: 0;
            transform: perspective(1400px) rotateY(-6deg) scale(.985);
          }
          to {
            opacity: 1;
            transform: perspective(1400px) rotateY(0deg) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .lsf-page-turn { animation: none; }
        }
      `}</style>
      {children}
    </div>
  );
}