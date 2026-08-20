import Link from 'next/link';
import { getTodaysCopticReadings } from '../../lib/copticReadings';
import ReadingRow from '../components/ReadingRow';
import VerseBlock from '../components/VerseBlock';

export const metadata = {
  title: 'Daily Reading — Lost Sheep Found',
};

export default async function DailyReadingPage() {
  const today = await getTodaysCopticReadings();

  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">The Katameros</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">
          Today's Reading
        </h1>
        {today && (
          <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">
            {today.dateString} — the Coptic Orthodox lectionary for today.
          </p>
        )}
      </section>

      {!today ? (
        <div className="px-[30px] py-[100px] text-center">
          <h2 className="font-display text-2xl font-medium">Couldn't load today's reading</h2>
          <p className="my-[14px] text-brown-soft">Please check back shortly.</p>
        </div>
      ) : (
        <div className="mx-auto max-w-[780px] px-[30px] pb-[70px]">
          {/* Day counter / rest period */}
          <div className="mb-10 border border-line bg-paper-light p-6 text-center">
            {today.isRestPeriod ? (
              <>
                <p className="mb-1 text-[11px] uppercase tracking-[.1em] text-gold">Nasie</p>
                <p className="font-display text-xl text-brown">
                  The reading cycle rests these final days before the new Coptic year begins.
                </p>
              </>
            ) : (
              <>
                <p className="mb-1 text-[11px] uppercase tracking-[.1em] text-gold">
                  Day {today.dayOfYear} of 365
                </p>
                <p className="font-display text-xl text-brown">{today.monthString} {today.day}, {today.year}</p>
              </>
            )}
          </div>

          {/* Readings list */}
          {today.readings.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-5 text-[11px] uppercase tracking-[.12em] text-brown-soft">Scripture readings</h2>
              <div className="divide-y divide-line border-y border-line">
                {today.readings.map((r) => (
                    <ReadingRow key={r.label} label={r.label} refString={r.ref} />
                ))}
              </div>
            </div>
          )}

          {/* Synaxarium */}
          {today.synaxarium.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-5 text-[11px] uppercase tracking-[.12em] text-brown-soft">Commemorations</h2>
              {today.synaxarium.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-line bg-cream p-5 text-[14px] leading-[1.7] text-brown transition hover:border-gold"
                >
                  {s.name}
                </a>
              ))}
            </div>
          )}

          {today.celebrations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {today.celebrations.map((c) => (
                <span key={c.name} className="border border-gold px-3 py-1.5 text-[11px] uppercase tracking-[.06em] text-gold">
                  {c.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <VerseBlock verse="Your word is a lamp for my feet, a light on my path." reference="Psalm 119:105" />
    </main>
  );
}