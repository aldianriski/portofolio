'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { Textarea } from '@/ui/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '@/infrastructure/supabase/client';

const settingsSchema = z.object({
  hero_name: z.string().min(1, 'Name is required'),
  hero_title: z.string().min(1, 'Title is required'),
  hero_tagline: z.string().min(1, 'Tagline is required'),
  hero_description: z.string().min(1, 'Description is required'),
  contact_email: z.string().email('Valid email required'),
  contact_phone: z.string().min(1, 'Phone is required'),
  contact_whatsapp: z.string().min(1, 'WhatsApp is required'),
  working_status: z.enum(['available', 'busy', 'unavailable']),
  github_url: z.string().url('Valid URL required').optional().or(z.literal('')),
  linkedin_url: z.string().url('Valid URL required').optional().or(z.literal('')),
  twitter_url: z.string().url('Valid URL required').optional().or(z.literal('')),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [locale] = useState('en'); // You can make this dynamic later

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('locale', locale);

      if (error) throw error;

      const settingsMap = new Map(data?.map(s => [s.key, s.value || '']) || []);

      reset({
        hero_name: settingsMap.get('hero_name') || '',
        hero_title: settingsMap.get('hero_title') || '',
        hero_tagline: settingsMap.get('hero_tagline') || '',
        hero_description: settingsMap.get('hero_description') || '',
        contact_email: settingsMap.get('contact_email') || '',
        contact_phone: settingsMap.get('contact_phone') || '',
        contact_whatsapp: settingsMap.get('contact_whatsapp') || '',
        working_status: (settingsMap.get('working_status') || 'available') as any,
        github_url: settingsMap.get('github_url') || '',
        linkedin_url: settingsMap.get('linkedin_url') || '',
        twitter_url: settingsMap.get('twitter_url') || '',
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    try {
      // Update or insert each setting
      const updates = Object.entries(data).map(([key, value]) => ({
        key,
        value: value?.toString() || '',
        locale,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('settings')
          .upsert(
            { ...update },
            { onConflict: 'key,locale' }
          );

        if (error) throw error;
      }

      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your portfolio settings and information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hero Section Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>
              Configure the main introduction section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero_name">Name</Label>
              <Input
                id="hero_name"
                {...register('hero_name')}
                placeholder="M. ALDIAN RIZKI LAMANI"
              />
              {errors.hero_name && (
                <p className="text-sm text-destructive mt-1">{errors.hero_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hero_title">Title</Label>
              <Input
                id="hero_title"
                {...register('hero_title')}
                placeholder="Fullstack Developer & Tech Lead"
              />
              {errors.hero_title && (
                <p className="text-sm text-destructive mt-1">{errors.hero_title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hero_tagline">Tagline</Label>
              <Input
                id="hero_tagline"
                {...register('hero_tagline')}
                placeholder="Leading teams to ship scalable systems in the AI era."
              />
              {errors.hero_tagline && (
                <p className="text-sm text-destructive mt-1">{errors.hero_tagline.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hero_description">Description</Label>
              <Textarea
                id="hero_description"
                {...register('hero_description')}
                rows={4}
                placeholder="A brief introduction about yourself..."
              />
              {errors.hero_description && (
                <p className="text-sm text-destructive mt-1">{errors.hero_description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Update your contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                {...register('contact_email')}
                placeholder="your@email.com"
              />
              {errors.contact_email && (
                <p className="text-sm text-destructive mt-1">{errors.contact_email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                {...register('contact_phone')}
                placeholder="+62 812-3456-7890"
              />
              {errors.contact_phone && (
                <p className="text-sm text-destructive mt-1">{errors.contact_phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contact_whatsapp">WhatsApp Number</Label>
              <Input
                id="contact_whatsapp"
                {...register('contact_whatsapp')}
                placeholder="+6281234567890"
              />
              {errors.contact_whatsapp && (
                <p className="text-sm text-destructive mt-1">{errors.contact_whatsapp.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="working_status">Working Status</Label>
              <select
                id="working_status"
                {...register('working_status')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="available">Available for work</option>
                <option value="busy">Currently busy</option>
                <option value="unavailable">Not available</option>
              </select>
              {errors.working_status && (
                <p className="text-sm text-destructive mt-1">{errors.working_status.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>
              Configure your social media links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                {...register('github_url')}
                placeholder="https://github.com/aldianriski"
              />
              {errors.github_url && (
                <p className="text-sm text-destructive mt-1">{errors.github_url.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                {...register('linkedin_url')}
                placeholder="https://linkedin.com/in/aldianriski"
              />
              {errors.linkedin_url && (
                <p className="text-sm text-destructive mt-1">{errors.linkedin_url.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="twitter_url">Twitter URL</Label>
              <Input
                id="twitter_url"
                {...register('twitter_url')}
                placeholder="https://twitter.com/aldianriski"
              />
              {errors.twitter_url && (
                <p className="text-sm text-destructive mt-1">{errors.twitter_url.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
