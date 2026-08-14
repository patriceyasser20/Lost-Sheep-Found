import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, getProductsByCategory } from '../../../lib/productsServer';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product ? product.name : 'Product — Lost Sheep Found' };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const sameCategory = await getProductsByCategory(product.categorySlug);
  const related = sameCategory.filter((p) => p.id !== product.id).slice(0, 3);

  return <ProductDetailClient product={product} related={related} />;
}