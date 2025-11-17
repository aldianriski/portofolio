import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/ui/sections/hero-section';
import { ExpertiseSection } from '@/ui/sections/expertise-section';
import { SkillsSection } from '@/ui/sections/skills-section';
import { ProjectsSection } from '@/ui/sections/projects-section';
import { ExperienceSection } from '@/ui/sections/experience-section';
import { EducationSection } from '@/ui/sections/education-section';
import { TestimonialsSection } from '@/ui/sections/testimonials-section';
import { CertificationsSection } from '@/ui/sections/certifications-section';
import { ContactSection } from '@/ui/sections/contact-section';
import { FloatingThemeToggle } from '@/ui/components/layout/floating-theme-toggle';

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
      <ExpertiseSection locale={locale} />
      <SkillsSection locale={locale} />
      <ProjectsSection locale={locale} />
      <ExperienceSection locale={locale} />
      <EducationSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <CertificationsSection locale={locale} />
      <ContactSection locale={locale} />
      <FloatingThemeToggle />
    </main>
  );
}
