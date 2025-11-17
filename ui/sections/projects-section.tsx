'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import type { Project } from '@/domain/projects/types';
import { ProjectSectionSkeleton } from '@/ui/components/sections/skeletons';

interface ProjectsSectionProps {
  locale: string;
}

export function ProjectsSection({ locale }: ProjectsSectionProps) {
  const t = useTranslations('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState<string>('all');

  useEffect(() => {
    fetch(`/api/projects?locale=${locale}&featured=true`)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setIsLoading(false);
      });
  }, [locale]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  // Extract all unique tech stacks from projects
  const allTechStacks = Array.from(
    new Set(projects.flatMap(p => p.tech_stack || []))
  ).sort();

  // Filter projects based on selected tech
  const filteredProjects = projects.filter(project => {
    if (selectedTech === 'all') return true;
    return project.tech_stack?.includes(selectedTech);
  });

  return (
    <section id="projects" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        {/* Tech Stack Filter */}
        {allTechStacks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={selectedTech === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTech('all')}
            >
              All Projects
            </Button>
            {allTechStacks.map((tech) => (
              <Button
                key={tech}
                variant={selectedTech === tech ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTech(tech)}
              >
                {tech}
              </Button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {isLoading ? (
          <div className="max-w-7xl mx-auto">
            <ProjectSectionSkeleton />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="h-full flex flex-col border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                {/* Project image placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 via-brand-yellow/20 to-brand-red/20"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-bold text-primary/20">
                      {index + 1}
                    </div>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  {project.role && (
                    <CardDescription className="font-medium">
                      {project.role}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <span className="px-2 py-1 text-muted-foreground text-xs">
                          +{project.tech_stack.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Impact */}
                  {project.impact && (
                    <div className="border-l-2 border-primary/30 pl-3 mt-4">
                      <p className="text-sm text-muted-foreground italic line-clamp-2">
                        {project.impact}
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Link href={`/${locale}/projects/${project.slug}`} className="flex-1">
                    <Button variant="default" className="w-full group/btn">
                      {t('viewDetail')}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>

                  {project.github_url && (
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                    >
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View on GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    </Button>
                  )}

                  {project.project_url && (
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                    >
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View live project"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
