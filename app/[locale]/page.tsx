import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/ui/sections/hero-section';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen">
      <HeroSection locale={locale} />

      {/* More sections will be added here */}
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-muted-foreground">
          More sections coming soon...
        </p>
      </div>
    </main>
  );
}
