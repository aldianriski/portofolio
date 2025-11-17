import { supabase } from '../client';
import type { Certification } from '@/domain/certifications/types';

export class CertificationsRepository {
  async getCertifications(locale: string): Promise<Certification[]> {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('locale', locale)
      .order('order_index', { ascending: true});

    if (error) {
      console.error('Error fetching certifications:', error);
      return [];
    }

    return data || [];
  }
}

export const certificationsRepository = new CertificationsRepository();
