import type { Metadata } from "next";
import "@/styles/globals.css";
import { GoogleAnalytics } from '@/lib/analytics';
import { AnalyticsProvider } from '@/ui/components/analytics/analytics-provider';

export const metadata: Metadata = {
  title: "M. Aldian Rizki Lamani - Fullstack Developer & Tech Lead",
  description: "Leading teams to ship scalable systems in the AI era.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
