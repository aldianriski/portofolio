import { MetadataRoute } from 'next';
import { locales } from '@/config/i18n';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aldianriski.com';

  // Generate URLs for each locale
  const homePages = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1,
  }));

  // You can add more dynamic routes here when you have project data
  // For now, we'll just include the home pages

  return [...homePages];
}
