import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/game/', '/lobby/', '/results/'],
      },
    ],
    sitemap: 'https://devception.com/sitemap.xml',
  };
}
