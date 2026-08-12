import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/api/', '/account', '/checkout', '/login', '/signup'],
    },
    sitemap: 'https://lostsheepfound.com/sitemap.xml',
  };
}
