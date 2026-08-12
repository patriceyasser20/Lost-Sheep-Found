import { MetadataRoute } from 'next';
import { products } from '../lib/products';

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
  // TODO: once Supabase is wired up, replace `products` with a live query —
  //   const { data: products } = await supabaseClient.from('products').select('id, category, collection, updated_at');

  const productUrls = products.flatMap((p) => withLocales(`/product/${p.id}`, new Date()));

  const collectionSlugs = [...new Set(products.map((p) => p.collection))];
  const collectionUrls = collectionSlugs.flatMap((slug) => withLocales(`/collection/${slug}`, new Date()));

  const staticPaths = [
    '/', '/shop', '/sale', '/about', '/contact', '/size-guide',
    '/return-exchange', '/customer-service', '/our-story', '/press', '/sustainability', '/faq',
  ];
  const staticUrls = staticPaths.flatMap((p) => withLocales(p, new Date()));

  return [...staticUrls, ...collectionUrls, ...productUrls];
}
