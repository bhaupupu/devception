import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Block app/auth surfaces and the placeholder shop so crawlers only
        // assess real, content-bearing pages (keeps thin pages out of review).
        disallow: ['/api/', '/game/', '/lobby/', '/results/', '/play', '/profile', '/login', '/shop'],
      },
    ],
    sitemap: 'https://devception.xyz/sitemap.xml',
  };
}
