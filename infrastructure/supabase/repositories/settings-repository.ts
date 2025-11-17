import { supabase } from '../client';
import type { Setting, HeroSettings, ContactSettings, SocialSettings } from '@/domain/settings/types';

export class SettingsRepository {
  async getSettings(locale: string): Promise<Setting[]> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('locale', locale);

    if (error) {
      console.error('Error fetching settings:', error);
      return [];
    }

    return data || [];
  }

  async getHeroSettings(locale: string): Promise<HeroSettings | null> {
    const settings = await this.getSettings(locale);
    const settingsMap = new Map(settings.map(s => [s.key, s.value || '']));

    return {
      name: settingsMap.get('hero_name') || 'M. ALDIAN RIZKI LAMANI',
      title: settingsMap.get('hero_title') || 'Fullstack Developer & Tech Lead',
      tagline: settingsMap.get('hero_tagline') || 'Leading teams to ship scalable systems in the AI era.',
      description: settingsMap.get('hero_description') || '',
    };
  }

  async getContactSettings(locale: string): Promise<ContactSettings | null> {
    const settings = await this.getSettings(locale);
    const settingsMap = new Map(settings.map(s => [s.key, s.value || '']));

    return {
      email: settingsMap.get('contact_email') || '',
      phone: settingsMap.get('contact_phone') || '',
      whatsapp: settingsMap.get('contact_whatsapp') || '',
      working_status: (settingsMap.get('working_status') || 'available') as any,
    };
  }

  async getSocialSettings(locale: string): Promise<SocialSettings | null> {
    const settings = await this.getSettings(locale);
    const settingsMap = new Map(settings.map(s => [s.key, s.value || '']));

    return {
      github_url: settingsMap.get('github_url') || '',
      linkedin_url: settingsMap.get('linkedin_url') || '',
      twitter_url: settingsMap.get('twitter_url') || '',
    };
  }
}

export const settingsRepository = new SettingsRepository();
