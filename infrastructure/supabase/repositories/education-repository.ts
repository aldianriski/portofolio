import { supabase } from '../client';
import type { Education } from '@/domain/education/types';

export class EducationRepository {
  async getEducation(locale: string): Promise<Education[]> {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('locale', locale)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching education:', error);
      return [];
    }

    return data || [];
  }
}

export const educationRepository = new EducationRepository();
