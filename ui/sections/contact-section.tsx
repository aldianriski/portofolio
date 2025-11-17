'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { Textarea } from '@/ui/components/ui/textarea';
import { Mail, MessageSquare, Github, Linkedin, Twitter, Loader2, CheckCircle } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/ui/components/ui/dialog';
import type { ContactSettings, SocialSettings } from '@/domain/settings/types';

interface ContactSectionProps {
  locale: string;
}

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email').max(255, 'Email is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long (max 2000 characters)'),
  website: z.string().optional(), // Honeypot field
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactSection({ locale }: ContactSectionProps) {
  const t = useTranslations('contact');
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [socialSettings, setSocialSettings] = useState<SocialSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  useEffect(() => {
    // Fetch contact and social settings
    Promise.all([
      fetch(`/api/settings/contact?locale=${locale}`).then(res => res.json()),
      fetch(`/api/settings/social?locale=${locale}`).then(res => res.json()),
    ])
      .then(([contact, social]) => {
        setContactSettings(contact);
        setSocialSettings(social);
      })
      .catch(err => console.error('Error fetching contact settings:', err));
  }, [locale]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, locale }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast.error('Too many requests. Please try again in a few minutes.');
        } else {
          toast.error(result.error || 'Failed to send message');
        }
        return;
      }

      setShowSuccessModal(true);
      toast.success(t('form.success'));
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'unavailable':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const whatsappUrl = contactSettings?.whatsapp
    ? `https://wa.me/${contactSettings.whatsapp.replace(/[^0-9]/g, '')}`
    : '#';

  return (
    <section id="contact" className="py-16 md:py-24 bg-background">
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {t('subtitle')}
          </p>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    {t('form.name')} Send a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form and I'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Honeypot field - hidden from users, visible to bots */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <Input
                        id="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        {...register('website')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="name">{t('form.name')}</Label>
                      <Input
                        id="name"
                        placeholder={t('form.name')}
                        {...register('name')}
                        disabled={isSubmitting}
                        maxLength={100}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">{t('form.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('form.email')}
                        {...register('email')}
                        disabled={isSubmitting}
                        maxLength={255}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message">{t('form.message')}</Label>
                      <Textarea
                        id="message"
                        placeholder={t('form.message')}
                        rows={5}
                        {...register('message')}
                        disabled={isSubmitting}
                        maxLength={2000}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.message && (
                          <p className="text-sm text-destructive">{errors.message.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground ml-auto">
                          Max 2000 characters
                        </p>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('form.sending')}
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          {t('form.submit')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Working Status */}
              {contactSettings?.working_status && (
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(contactSettings.working_status)} animate-pulse`} />
                      <span className="font-semibold">
                        {t(`status.${contactSettings.working_status}`)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* WhatsApp */}
              {contactSettings?.whatsapp && (
                <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="pt-6">
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      asChild
                    >
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        {t('whatsapp')}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Social Links */}
              {socialSettings && (
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Connect With Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      {socialSettings.github_url && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-primary hover:text-primary-foreground"
                          asChild
                        >
                          <a
                            href={socialSettings.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        </Button>
                      )}
                      {socialSettings.linkedin_url && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-primary hover:text-primary-foreground"
                          asChild
                        >
                          <a
                            href={socialSettings.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        </Button>
                      )}
                      {socialSettings.twitter_url && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-primary hover:text-primary-foreground"
                          asChild
                        >
                          <a
                            href={socialSettings.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Email */}
              {contactSettings?.email && (
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="w-5 h-5" />
                      <a href={`mailto:${contactSettings.email}`} className="hover:text-primary transition-colors">
                        {contactSettings.email}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogClose onClick={() => setShowSuccessModal(false)} />
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <DialogTitle className="text-center">
              {locale === 'en' ? 'Message Sent Successfully!' : 'Pesan Berhasil Dikirim!'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {locale === 'en'
                ? "Thank you for reaching out! I'll get back to you as soon as possible."
                : 'Terima kasih telah menghubungi! Saya akan segera merespons pesan Anda.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessModal(false)} className="w-full">
              {locale === 'en' ? 'Close' : 'Tutup'}
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </section>
  );
}
