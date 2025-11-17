'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Briefcase, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import type { Experience } from '@/domain/experience/types';

interface ExperienceSectionProps {
  locale: string;
}

export function ExperienceSection({ locale }: ExperienceSectionProps) {
  const t = useTranslations('experience');
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    fetch(`/api/experience?locale=${locale}`)
      .then(res => res.json())
      .then(data => setExperiences(data))
      .catch(err => console.error('Error fetching experience:', err));
  }, [locale]);

  const formatDate = (dateString: string | null, isCurrent: boolean) => {
    if (isCurrent) return t('present');
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="experience" className="py-16 md:py-24 bg-background">
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

        {/* Timeline */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2" />

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                className={`relative mb-8 md:mb-12 ${
                  index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
                }`}
              >
                {/* Timeline dot */}
                <motion.div
                  className={`absolute left-8 md:left-1/2 top-8 w-4 h-4 bg-primary rounded-full border-4 border-background z-10 -translate-x-1/2 ${
                    exp.is_current ? 'ring-4 ring-primary/20' : ''
                  }`}
                  whileHover={{ scale: 1.5 }}
                  transition={{ duration: 0.2 }}
                />

                <Card className={`ml-16 md:ml-0 ${
                  index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                } hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {exp.position}
                        </CardTitle>
                        <CardDescription className="text-base font-semibold text-foreground/80">
                          {exp.company}
                        </CardDescription>
                      </div>
                      {exp.is_current && (
                        <span className="px-3 py-1 bg-brand-blue/20 text-brand-blue text-xs font-semibold rounded-full">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(exp.start_date, false)} - {formatDate(exp.end_date, exp.is_current)}
                        </span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    {exp.description && (
                      <p className="text-muted-foreground mb-4">
                        {exp.description}
                      </p>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-foreground/80">
                          Key Achievements:
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <motion.li
                              key={i}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{achievement}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
