import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, products } from '../../../lib/products';
import ProductDetailClient from './ProductDetailClient';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product ? product.name : 'Product — Lost Sheep Found' };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return <ProductDetailClient product={product} related={related} />;
}