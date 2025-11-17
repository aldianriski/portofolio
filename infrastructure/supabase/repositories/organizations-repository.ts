import { supabase } from '../client';
import type { Organization } from '@/domain/organizations/types';

export class OrganizationsRepository {
  async getOrganizations(locale: string): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('locale', locale)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching organizations:', error);
      return [];
    }

    return data || [];
  }
}

export const organizationsRepository = new OrganizationsRepository();
