import { redirect } from 'next/navigation';
import { checkAdminAuth } from '@/lib/admin-auth';
import { AdminNav } from '@/ui/components/admin/admin-nav';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAuthenticated = await checkAdminAuth();

  // Redirect to login if not authenticated (except for login page)
  if (!isAuthenticated) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNav locale={locale} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
