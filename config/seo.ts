import type { Metadata } from 'next';

export const siteConfig = {
  name: 'M. Aldian Rizki Lamani',
  title: 'M. Aldian Rizki Lamani - Fullstack Developer & Tech Lead',
  description: 'Leading teams to ship scalable systems in the AI era. Experienced fullstack developer specializing in Next.js, React, Vue, Node.js, and Golang.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://aldianriski.com',
  ogImage: '/og-image.png',
  keywords: [
    'Fullstack Developer',
    'Tech Lead',
    'Next.js Developer',
    'React Developer',
    'Vue.js Developer',
    'Nuxt.js Developer',
    'Node.js Developer',
    'Golang Developer',
    'Indonesia',
    'Jakarta',
    'Software Engineer',
    'Web Developer',
    'AI Development',
    'ChatGPT',
    'Claude AI',
  ],
  authors: [
    {
      name: 'M. Aldian Rizki Lamani',
      url: 'https://aldianriski.com',
    },
  ],
  creator: 'M. Aldian Rizki Lamani',
};

export function getBaseMetadata(locale: string = 'en'): Metadata {
  const title = locale === 'id'
    ? 'M. Aldian Rizki Lamani - Fullstack Developer & Tech Lead'
    : 'M. Aldian Rizki Lamani - Fullstack Developer & Tech Lead';

  const description = locale === 'id'
    ? 'Memimpin tim untuk menghadirkan sistem yang scalable di era AI. Fullstack developer berpengalaman yang berspesialisasi dalam Next.js, React, Vue, Node.js, dan Golang.'
    : 'Leading teams to ship scalable systems in the AI era. Experienced fullstack developer specializing in Next.js, React, Vue, Node.js, and Golang.';

  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: siteConfig.keywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: 'website',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      url: siteConfig.url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteConfig.ogImage],
      creator: '@aldianriski',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
  };
}
