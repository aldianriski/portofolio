'use client';

import { Suspense } from 'react';
import { usePageViews } from '@/lib/analytics';

function PageViewsTracker() {
  usePageViews();
  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <PageViewsTracker />
      </Suspense>
      {children}
    </>
  );
}
