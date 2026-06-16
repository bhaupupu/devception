import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPost, blogPosts } from '@/lib/blog-data';
import BlogPostClient from '@/components/landing/BlogPostClient';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return { title: 'Not Found' };

  return {
    title: `${post.title} | Devception Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        author: {
          '@type': 'Person',
          name: post.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Devception Team',
          logo: {
            '@type': 'ImageObject',
            url: 'https://devception.xyz/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://devception.xyz/blog/${post.slug}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://devception.xyz/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://devception.xyz/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: `https://devception.xyz/blog/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}
