export interface Setting {
  id: string;
  key: string;
  value: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface HeroSettings {
  name: string;
  title: string;
  tagline: string;
  description: string;
}

export interface ContactSettings {
  email: string;
  phone: string;
  whatsapp: string;
  working_status: 'available' | 'busy' | 'unavailable';
}

export interface SocialSettings {
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
}
