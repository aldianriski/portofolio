'use client';

import { usePageViews } from '@/lib/analytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  usePageViews();
  return <>{children}</>;
}
