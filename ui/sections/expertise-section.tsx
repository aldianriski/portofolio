'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Code2, Users, Sparkles } from 'lucide-react';

interface ExpertiseSectionProps {
  locale: string;
}

export function ExpertiseSection({ locale }: ExpertiseSectionProps) {
  const t = useTranslations('expertise');

  const expertiseItems = [
    {
      icon: Code2,
      title: t('fullstack.title'),
      description: t('fullstack.description'),
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10',
    },
    {
      icon: Users,
      title: t('techlead.title'),
      description: t('techlead.description'),
      color: 'text-brand-yellow',
      bgColor: 'bg-brand-yellow/10',
    },
    {
      icon: Sparkles,
      title: t('ai.title'),
      description: t('ai.description'),
      color: 'text-brand-red',
      bgColor: 'bg-brand-red/10',
    },
  ];

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

  return (
    <section id="expertise" className="py-16 md:py-24 bg-muted/30">
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

        {/* Expertise Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {expertiseItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className={`p-3 rounded-lg ${item.bgColor}`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className={`w-6 h-6 ${item.color}`} />
                      </motion.div>
                    </div>
                    <CardTitle className="text-xl md:text-2xl">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -right-20 top-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </section>
  );
}
