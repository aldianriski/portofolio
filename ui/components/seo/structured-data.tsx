import { siteConfig } from '@/config/seo';

interface StructuredDataProps {
  locale: string;
}

export function StructuredData({ locale }: StructuredDataProps) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'M. Aldian Rizki Lamani',
    jobTitle: 'Fullstack Developer & Tech Lead',
    description:
      locale === 'id'
        ? 'Fullstack developer berpengalaman yang berspesialisasi dalam membangun aplikasi web scalable'
        : 'Experienced fullstack developer specializing in building scalable web applications',
    url: siteConfig.url,
    sameAs: [
      'https://github.com/aldianriski',
      'https://linkedin.com/in/aldianriski',
      'https://twitter.com/aldianriski',
    ],
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'Next.js',
      'React',
      'Vue.js',
      'Nuxt.js',
      'Node.js',
      'Golang',
      'Web Development',
      'Software Engineering',
      'Tech Leadership',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: [locale === 'id' ? 'id-ID' : 'en-US'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
