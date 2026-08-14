import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductsByCategory } from '../../../lib/productsServer';
import CollectionPageClient from './CollectionPageClient';

const COLLECTION_NAMES: Record<string, string> = {
  'bible-journals': 'Bible Journals',
  'wood-blocks': 'Wooden Verses',
  keepsakes: 'Little Keepsakes',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = COLLECTION_NAMES[slug];
  return { title: name ? `${name} — Lost Sheep Found` : 'Collection — Lost Sheep Found' };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = COLLECTION_NAMES[slug];
  if (!name) notFound();

  // const items = getByCollection(slug);

  // return <CollectionPageClient name={name} products={items} />;
}
