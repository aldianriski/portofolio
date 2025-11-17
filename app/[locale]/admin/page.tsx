import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import {
  Code2,
  Briefcase,
  Award,
  MessageSquare,
  Mail,
  GraduationCap,
  Users2,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { supabaseAdmin } from '@/infrastructure/supabase/server';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Fetch counts for dashboard stats
  const [
    projectsCount,
    experienceCount,
    skillsCount,
    testimonialsCount,
    messagesCount,
    educationCount,
    organizationsCount,
    certificationsCount,
  ] = await Promise.all([
    supabaseAdmin.from('projects').select('id', { count: 'exact', head: true }).eq('locale', locale),
    supabaseAdmin.from('experience').select('id', { count: 'exact', head: true }).eq('locale', locale),
    supabaseAdmin.from('skills').select('id', { count: 'exact', head: true }).eq('locale', locale),
    supabaseAdmin.from('testimonials').select('id', { count: 'exact', head: true }).eq('locale', locale),
    supabaseAdmin.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
    supabaseAdmin.from('education').select('id', { count: 'exact', head: true }).eq('locale', locale),
    supabaseAdmin.from('organizations').select('id', { count: 'exact', head: true }).eq('locale', locale),
    supabaseAdmin.from('certifications').select('id', { count: 'exact', head: true }).eq('locale', locale),
  ]);

  const stats = [
    {
      title: 'Projects',
      count: projectsCount.count || 0,
      icon: Code2,
      href: `/${locale}/admin/projects`,
      color: 'text-blue-500',
    },
    {
      title: 'Experience',
      count: experienceCount.count || 0,
      icon: Briefcase,
      href: `/${locale}/admin/experience`,
      color: 'text-green-500',
    },
    {
      title: 'Skills',
      count: skillsCount.count || 0,
      icon: Award,
      href: `/${locale}/admin/skills`,
      color: 'text-yellow-500',
    },
    {
      title: 'Testimonials',
      count: testimonialsCount.count || 0,
      icon: MessageSquare,
      href: `/${locale}/admin/testimonials`,
      color: 'text-purple-500',
    },
    {
      title: 'Education',
      count: educationCount.count || 0,
      icon: GraduationCap,
      href: `/${locale}/admin/education`,
      color: 'text-indigo-500',
    },
    {
      title: 'Organizations',
      count: organizationsCount.count || 0,
      icon: Users2,
      href: `/${locale}/admin/organizations`,
      color: 'text-pink-500',
    },
    {
      title: 'Certifications',
      count: certificationsCount.count || 0,
      icon: FileText,
      href: `/${locale}/admin/certifications`,
      color: 'text-orange-500',
    },
    {
      title: 'Unread Messages',
      count: messagesCount.count || 0,
      icon: Mail,
      href: `/${locale}/admin/messages`,
      color: 'text-red-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your portfolio content - Locale: <span className="font-semibold uppercase">{locale}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.count}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click to manage
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href={`/${locale}/admin/projects`}>
              <Button variant="outline" className="w-full justify-between">
                Add New Project
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href={`/${locale}/admin/experience`}>
              <Button variant="outline" className="w-full justify-between">
                Add Experience
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href={`/${locale}/admin/settings`}>
              <Button variant="outline" className="w-full justify-between">
                Update Settings
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates to your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity tracking coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
