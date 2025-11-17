'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export function usePageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // @ts-expect-error - gtag is added by Google Analytics script
    if (typeof window.gtag !== 'undefined') {
      // @ts-expect-error - gtag is added by Google Analytics script
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);
}

// Google Analytics Scripts Component
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (!GA_MEASUREMENT_ID) return;

  // @ts-expect-error - gtag is added by Google Analytics script
  if (typeof window.gtag !== 'undefined') {
    // @ts-expect-error - gtag is added by Google Analytics script
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Predefined event trackers
export const analytics = {
  // Contact form submission
  contactFormSubmit: () => {
    trackEvent('submit', 'contact_form', 'Contact Form Submitted');
  },

  // Project view
  projectView: (projectSlug: string) => {
    trackEvent('view', 'project', projectSlug);
  },

  // Resume download
  resumeDownload: () => {
    trackEvent('download', 'resume', 'Resume PDF Downloaded');
  },

  // External link click
  externalLinkClick: (url: string) => {
    trackEvent('click', 'external_link', url);
  },

  // Social media link click
  socialMediaClick: (platform: string) => {
    trackEvent('click', 'social_media', platform);
  },

  // Section view (for scroll tracking)
  sectionView: (sectionName: string) => {
    trackEvent('view', 'section', sectionName);
  },
};
