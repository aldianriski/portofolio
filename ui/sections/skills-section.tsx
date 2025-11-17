'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { SkillsByCategory } from '@/domain/skills/types';

interface SkillsSectionProps {
  locale: string;
}

export function SkillsSection({ locale }: SkillsSectionProps) {
  const t = useTranslations('skills');
  const [skills, setSkills] = useState<SkillsByCategory | null>(null);

  useEffect(() => {
    fetch(`/api/skills?locale=${locale}`)
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.error('Error fetching skills:', err));
  }, [locale]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  // Prepare data for radar chart (soft skills)
  const softSkillsData = skills?.soft.map(skill => ({
    skill: skill.name,
    proficiency: skill.proficiency,
  })) || [];

  // Group hard skills by subcategory
  const hardSkillsBySubcategory = skills?.hard.reduce((acc, skill) => {
    const subcategory = skill.subcategory || 'other';
    if (!acc[subcategory]) {
      acc[subcategory] = [];
    }
    acc[subcategory].push(skill);
    return acc;
  }, {} as Record<string, typeof skills.hard>) || {};

  return (
    <section id="skills" className="py-16 md:py-24 bg-background">
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

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Hard Skills */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <span className="text-primary">💻</span>
                    {t('hardSkills')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {Object.entries(hardSkillsBySubcategory).map(([subcategory, categorySkills]) => (
                      <motion.div key={subcategory} variants={itemVariants}>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3 capitalize">
                          {subcategory}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {categorySkills.map((skill) => (
                            <motion.div
                              key={skill.id}
                              className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                              whileHover={{ scale: 1.05, y: -2 }}
                              transition={{ duration: 0.2 }}
                            >
                              {skill.name}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Soft Skills with Radar Chart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <span className="text-primary">🎯</span>
                    {t('softSkills')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[400px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={softSkillsData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis
                          dataKey="skill"
                          tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Radar
                          name="Proficiency"
                          dataKey="proficiency"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.6}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))',
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
