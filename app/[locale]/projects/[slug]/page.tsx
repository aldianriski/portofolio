import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { projectsRepository } from '@/infrastructure/supabase/repositories/projects-repository';
import { siteConfig } from '@/config/seo';

interface ProjectPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await projectsRepository.getProjectBySlug(slug, locale);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: project.title,
    description: project.description || `${project.title} - A project by ${siteConfig.name}`,
    openGraph: {
      title: project.title,
      description: project.description || `${project.title} - A project by ${siteConfig.name}`,
      type: 'article',
      url: `${siteConfig.url}/${locale}/projects/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description || `${project.title} - A project by ${siteConfig.name}`,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await projectsRepository.getProjectBySlug(slug, locale);
  const t = await getTranslations('projects');

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <Link href={`/${locale}`} className="inline-block mb-8">
          <Button variant="ghost" className="group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Project header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {project.title}
            </h1>
            {project.role && (
              <p className="text-xl text-muted-foreground mb-6">
                {project.role}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {project.project_url && (
                <Button asChild>
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Project
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button variant="outline" asChild>
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View on GitHub
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Project image placeholder */}
          <div className="h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-8 flex items-center justify-center">
            <div className="text-9xl font-bold text-primary/20">
              {project.title.charAt(0)}
            </div>
          </div>

          {/* Project details */}
          <div className="grid gap-6">
            {/* Description */}
            {project.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tech Stack */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Technologies Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {project.tech_stack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contributions */}
            {project.contributions && (
              <Card>
                <CardHeader>
                  <CardTitle>My Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                    {project.contributions}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Impact */}
            {project.impact && (
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>🎯</span>
                    Impact & Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                    {project.impact}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Back button at bottom */}
          <div className="mt-12 text-center">
            <Link href={`/${locale}`}>
              <Button variant="outline" size="lg" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
