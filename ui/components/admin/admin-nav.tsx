'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/ui/components/ui/button';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Settings,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  Mail,
  LogOut,
  Code2,
  Users2,
  FileText,
} from 'lucide-react';

interface AdminNavProps {
  locale: string;
}

export function AdminNav({ locale }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        router.push(`/${locale}/admin/login`);
        router.refresh();
      }
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navItems = [
    { href: `/${locale}/admin`, icon: LayoutDashboard, label: 'Dashboard' },
    { href: `/${locale}/admin/settings`, icon: Settings, label: 'Settings' },
    { href: `/${locale}/admin/projects`, icon: Code2, label: 'Projects' },
    { href: `/${locale}/admin/experience`, icon: Briefcase, label: 'Experience' },
    { href: `/${locale}/admin/skills`, icon: Award, label: 'Skills' },
    { href: `/${locale}/admin/education`, icon: GraduationCap, label: 'Education' },
    { href: `/${locale}/admin/organizations`, icon: Users2, label: 'Organizations' },
    { href: `/${locale}/admin/testimonials`, icon: MessageSquare, label: 'Testimonials' },
    { href: `/${locale}/admin/certifications`, icon: FileText, label: 'Certifications' },
    { href: `/${locale}/admin/messages`, icon: Mail, label: 'Messages' },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href={`/${locale}/admin`} className="font-bold text-xl">
              Admin Panel
            </Link>
            <div className="hidden md:flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}`}>
              <Button variant="outline" size="sm">
                View Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
