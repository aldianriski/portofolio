'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Award, Calendar, ExternalLink, BadgeCheck } from 'lucide-react';
import type { Certification } from '@/domain/certifications/types';

interface CertificationsSectionProps {
  locale: string;
}

export function CertificationsSection({ locale }: CertificationsSectionProps) {
  const t = useTranslations('certifications');
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    fetch(`/api/certifications?locale=${locale}`)
      .then(res => res.json())
      .then(data => setCertifications(data))
      .catch(err => console.error('Error fetching certifications:', err));
  }, [locale]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="certifications" className="py-16 md:py-24 bg-muted/30">
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

        {/* Certifications List */}
        <motion.div
          className="max-w-4xl mx-auto space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {certifications.map((cert) => (
            <motion.div key={cert.id} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <CardTitle className="text-xl mb-2 flex items-center gap-2">
                            {cert.name}
                            {!isExpired(cert.expiry_date) && cert.expiry_date && (
                              <BadgeCheck className="w-5 h-5 text-brand-blue" />
                            )}
                          </CardTitle>
                          <CardDescription className="text-base font-medium">
                            {cert.issuer}
                          </CardDescription>
                        </div>
                        {cert.credential_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={cert.credential_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Credential
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {cert.issue_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Issued: {formatDate(cert.issue_date)}
                        </span>
                      </div>
                    )}
                    {cert.expiry_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className={isExpired(cert.expiry_date) ? 'text-destructive' : ''}>
                          {isExpired(cert.expiry_date) ? 'Expired' : 'Expires'}: {formatDate(cert.expiry_date)}
                        </span>
                      </div>
                    )}
                    {cert.credential_id && (
                      <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        ID: {cert.credential_id}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
