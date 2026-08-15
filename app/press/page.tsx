import VerseBlock from '../components/VerseBlock';

export const metadata = {
  title: 'Press — Lost Sheep Found',
};

export default function PressPage() {
  return (
    <main>
      <div className="mx-auto max-w-[780px] px-[30px] pb-[70px] pt-[70px]">
        <p className="mb-[6px] text-[10px] uppercase tracking-[.16em] text-gold">Media</p>
        <h2 className="mt-[10px] mb-4 font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Press &amp; Media</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          Lost Sheep Found is a young studio — we don't have a long press list
          yet, but we'd love to talk to writers and outlets covering faith,
          gifting, or small-batch makers in Egypt.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Press kit</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          For high-resolution product photography, brand assets, or an
          interview with our founder, email
          press@lostsheepfound.com and we'll get back to you within two
          business days.
        </p>

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">In the news</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">No coverage to share yet — check back soon.</p>
      </div>

      <VerseBlock
        verse="Let your light shine before others, that they may see your good deeds."
        reference="Matthew 5:16"
      />
    </main>
  );
}