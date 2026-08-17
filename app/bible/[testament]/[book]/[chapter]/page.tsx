import { notFound } from 'next/navigation';
import { getBook, fetchChapter, BIBLE_BOOKS } from '../../../../../lib/bible';
import BookFrame from '../../../BookFrame';
import PageTurn from '../../../PageTurn';
import BookPages from '../../../BookPages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ testament: string; book: string; chapter: string }>;
}) {
  const { book: bookSlug, chapter } = await params;
  const book = getBook(bookSlug);
  return { title: book ? `${book.name} ${chapter} — Lost Sheep Found` : 'Read the Bible' };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ testament: string; book: string; chapter: string }>;
}) {
  const { testament, book: bookSlug, chapter: chapterParam } = await params;
  const book = getBook(bookSlug);
  const chapterNum = Number(chapterParam);

  if (
    !book ||
    book.testament !== testament ||
    !Number.isInteger(chapterNum) ||
    chapterNum < 1 ||
    chapterNum > book.chapters
  ) {
    notFound();
  }

  const data = await fetchChapter(bookSlug, chapterNum);
  if (!data) notFound();

  const bookIndex = BIBLE_BOOKS.findIndex((b) => b.slug === bookSlug);

  const prevChapter =
    chapterNum > 1
      ? { testament: book.testament, book: book.slug, chapter: chapterNum - 1 }
      : BIBLE_BOOKS[bookIndex - 1]
      ? {
          testament: BIBLE_BOOKS[bookIndex - 1].testament,
          book: BIBLE_BOOKS[bookIndex - 1].slug,
          chapter: BIBLE_BOOKS[bookIndex - 1].chapters,
        }
      : null;

  const nextChapter =
    chapterNum < book.chapters
      ? { testament: book.testament, book: book.slug, chapter: chapterNum + 1 }
      : BIBLE_BOOKS[bookIndex + 1]
      ? { testament: BIBLE_BOOKS[bookIndex + 1].testament, book: BIBLE_BOOKS[bookIndex + 1].slug, chapter: 1 }
      : null;

  return (
    <main>
      <PageTurn key={`${testament}-${bookSlug}-${chapterNum}`}>
        <BookFrame>
          <BookPages
            verses={data.verses}
            bookName={book.name}
            bookHref={`/bible/${testament}`}
            chapterNum={chapterNum}
            totalChapters={book.chapters}
            prevChapter={prevChapter}
            nextChapter={nextChapter}
          />
        </BookFrame>
      </PageTurn>
    </main>
  );
}