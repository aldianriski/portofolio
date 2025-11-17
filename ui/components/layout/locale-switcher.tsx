'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/ui/components/ui/button';
import { Globe } from 'lucide-react';
import { locales, localeNames } from '@/config/i18n';

interface LocaleSwitcherProps {
  currentLocale: string;
}

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    // Replace the locale in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={currentLocale === locale ? 'default' : 'ghost'}
          size="sm"
          onClick={() => switchLocale(locale)}
          className="gap-2"
        >
          <Globe className="w-4 h-4" />
          {localeNames[locale]}
        </Button>
      ))}
    </div>
  );
}
