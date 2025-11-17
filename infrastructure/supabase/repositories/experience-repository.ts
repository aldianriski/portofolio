import { supabase } from '../client';
import type { Experience } from '@/domain/experience/types';

export class ExperienceRepository {
  async getExperience(locale: string): Promise<Experience[]> {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('locale', locale)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching experience:', error);
      return [];
    }

    return data || [];
  }
}

export const experienceRepository = new ExperienceRepository();
