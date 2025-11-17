import { supabase } from '../client';
import type { Project } from '@/domain/projects/types';

export class ProjectsRepository {
  async getProjects(locale: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('locale', locale)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  }

  async getFeaturedProjects(locale: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('locale', locale)
      .eq('featured', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching featured projects:', error);
      return [];
    }

    return data || [];
  }

  async getProjectBySlug(slug: string, locale: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('locale', locale)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }

    return data;
  }
}

export const projectsRepository = new ProjectsRepository();
