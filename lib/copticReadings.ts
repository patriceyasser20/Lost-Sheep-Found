export type ReadingReference = {
  label: string;
  ref: string;
};

export type CopticReadingsDay = {
  dateString: string; // e.g. "Mesra 14, 1742"
  day: number;
  month: number;
  monthString: string;
  year: number;
  dayOfYear: number;
  isRestPeriod: boolean; // true during Nasie, the short 13th month
  readings: ReadingReference[];
  synaxarium: { name: string; url: string }[];
  celebrations: { name: string; type: string }[];
};

const READING_LABELS: Record<string, string> = {
  VPsalm: 'Vespers Psalm',
  VGospel: 'Vespers Gospel',
  MPsalm: 'Matins Psalm',
  MGospel: 'Matins Gospel',
  Pauline: 'Pauline Epistle',
  Catholic: 'Catholic Epistle',
  Acts: 'Acts',
  LPsalm: 'Liturgy Psalm',
  LGospel: 'Liturgy Gospel',
};

// coptic.io's Katameros endpoint returns *references* (which passages to
// read), not full scripture text — matched here rather than reproduced,
// since bulk-hosting daily Bible text ourselves would raise real copyright
// concerns. Each reference links out to Bible Gateway to actually read it.
export async function getTodaysCopticReadings(): Promise<CopticReadingsDay | null> {
  try {
    const res = await fetch('https://api.coptic.io/api/readings', {
      next: { revalidate: 3600 }, // refresh hourly — this only changes once a day anyway
    });
    if (!res.ok) return null;
    const data = await res.json();

    const { fullDate, reference, Synaxarium, celebrations } = data;
    if (!fullDate || !reference) return null;

    // The Coptic year: 12 months of 30 days (360), then Nasie — a short
    // 13th month of 5 (6 in leap years) transitional days before the new
    // year. That's where the "365 days, then it rests" behavior comes from
    // naturally, rather than something bolted on separately.
    const dayOfYear = fullDate.month <= 12 ? (fullDate.month - 1) * 30 + fullDate.day : 360 + fullDate.day;

    const readings: ReadingReference[] = Object.entries(READING_LABELS)
      .filter(([key]) => reference[key])
      .map(([key, label]) => ({ label, ref: reference[key] }));

    return {
      dateString: fullDate.dateString,
      day: fullDate.day,
      month: fullDate.month,
      monthString: fullDate.monthString,
      year: fullDate.year,
      dayOfYear,
      isRestPeriod: fullDate.month === 13,
      readings,
      synaxarium: (Synaxarium || []).map((s: any) => ({ name: s.name, url: s.url })),
      celebrations: (celebrations || []).map((c: any) => ({ name: c.name, type: c.type })),
    };
  } catch (err) {
    console.error('getTodaysCopticReadings:', err);
    return null;
  }
}
