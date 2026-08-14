import { MetadataRoute } from 'next';
import { getProducts } from '../lib/productsServer';

export const revalidate = 3600;
const SITE = 'https://lostsheepfound.com';

function withLocales(path: string, lastModified: string | Date) {
  const enUrl = path === '/' ? SITE : `${SITE}${path}`;
  const arUrl = path === '/' ? `${SITE}/ar` : `${SITE}/ar${path}`;
  const alternates = { languages: { en: enUrl, ar: arUrl } };
  return [
    { url: enUrl, lastModified, alternates },
    { url: arUrl, lastModified, alternates },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const productUrls = products.flatMap((p) => withLocales(`/product/${p.slug}`, new Date()));
  const collectionSlugs = [...new Set(products.map((p) => p.categorySlug))];
  const collectionUrls = collectionSlugs.flatMap((slug) => withLocales(`/collection/${slug}`, new Date()));

  const staticPaths = [
    '/', '/shop', '/sale', '/about', '/contact', '/size-guide',
    '/return-exchange', '/customer-service', '/our-story', '/press', '/sustainability', '/faq',
  ];
  const staticUrls = staticPaths.flatMap((p) => withLocales(p, new Date()));

  return [...staticUrls, ...collectionUrls, ...productUrls];
}