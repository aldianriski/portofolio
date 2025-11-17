'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { GraduationCap, Users2, Calendar } from 'lucide-react';
import type { Education } from '@/domain/education/types';
import type { Organization } from '@/domain/organizations/types';
import { EducationSectionSkeleton } from '@/ui/components/sections/skeletons';

interface EducationSectionProps {
  locale: string;
}

export function EducationSection({ locale }: EducationSectionProps) {
  const t = useTranslations('education');
  const [education, setEducation] = useState<Education[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/education?locale=${locale}`)
      .then(res => res.json())
      .then(data => {
        setEducation(data.education || []);
        setOrganizations(data.organizations || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching education/organizations:', err);
        setIsLoading(false);
      });
  }, [locale]);

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate && !endDate) return '';

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    };

    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    if (startDate) {
      return formatDate(startDate);
    }
    return '';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="education" className="py-16 md:py-24 bg-muted/30">
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

        {isLoading ? (
          <div className="max-w-5xl mx-auto">
            <EducationSectionSkeleton />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="grid gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {/* Education */}
              <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                Education
              </h3>
              <div className="grid gap-4">
                {education.map((edu) => (
                  <motion.div key={edu.id} variants={itemVariants}>
                    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">
                              {edu.institution}
                            </CardTitle>
                            <CardDescription className="text-base font-medium text-foreground/80">
                              {edu.degree}
                              {edu.field_of_study && ` - ${edu.field_of_study}`}
                            </CardDescription>
                          </div>
                          {edu.gpa && (
                            <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold text-sm whitespace-nowrap">
                              GPA: {edu.gpa}
                            </div>
                          )}
                        </div>
                        {(edu.start_date || edu.end_date) && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateRange(edu.start_date, edu.end_date)}</span>
                          </div>
                        )}
                      </CardHeader>
                      {edu.description && (
                        <CardContent>
                          <p className="text-muted-foreground">{edu.description}</p>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Organizations */}
            {organizations.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Users2 className="w-6 h-6 text-primary" />
                  Organizations
                </h3>
                <div className="grid gap-4">
                  {organizations.map((org) => (
                    <motion.div key={org.id} variants={itemVariants}>
                      <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2">
                                {org.name}
                              </CardTitle>
                              <CardDescription className="text-base font-medium text-foreground/80">
                                {org.position}
                              </CardDescription>
                            </div>
                            {(org.start_date || org.end_date) && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDateRange(org.start_date, org.end_date)}</span>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        {org.description && (
                          <CardContent>
                            <p className="text-muted-foreground">{org.description}</p>
                          </CardContent>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
