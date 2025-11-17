'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';
import type { SocialSettings } from '@/domain/settings/types';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const [socialSettings, setSocialSettings] = useState<SocialSettings | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetch(`/api/settings/social?locale=${locale}`)
      .then(res => res.json())
      .then(data => setSocialSettings(data))
      .catch(err => console.error('Error fetching social settings:', err));
  }, [locale]);

  const footerSections = [
    {
      title: 'Navigation',
      links: [
        { label: 'Home', href: '#hero' },
        { label: 'Projects', href: '#projects' },
        { label: 'Experience', href: '#experience' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'About',
      links: [
        { label: 'Expertise', href: '#expertise' },
        { label: 'Skills', href: '#skills' },
        { label: 'Education', href: '#education' },
        { label: 'Testimonials', href: '#testimonials' },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      url: socialSettings?.github_url,
      label: 'GitHub',
    },
    {
      icon: Linkedin,
      url: socialSettings?.linkedin_url,
      label: 'LinkedIn',
    },
    {
      icon: Twitter,
      url: socialSettings?.twitter_url,
      label: 'Twitter',
    },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Aldian Rizki</h3>
            <p className="text-sm text-muted-foreground">
              Fullstack Developer & Tech Lead
            </p>
            <p className="text-sm text-muted-foreground">
              Leading teams to ship scalable systems in the AI era.
            </p>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                if (!social.url) return null;
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} M. Aldian Rizki Lamani. {t('rights')}.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>using Next.js & Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
