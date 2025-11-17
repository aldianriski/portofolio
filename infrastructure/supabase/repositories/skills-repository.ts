import { supabase } from '../client';
import type { Skill, SkillsByCategory } from '@/domain/skills/types';

export class SkillsRepository {
  async getSkills(locale: string): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('locale', locale)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching skills:', error);
      return [];
    }

    return data || [];
  }

  async getSkillsByCategory(locale: string): Promise<SkillsByCategory> {
    const skills = await this.getSkills(locale);

    return {
      hard: skills.filter(s => s.category === 'hard'),
      soft: skills.filter(s => s.category === 'soft'),
    };
  }

  async getHardSkillsBySubcategory(locale: string) {
    const skills = await this.getSkills(locale);
    const hardSkills = skills.filter(s => s.category === 'hard');

    const grouped = hardSkills.reduce((acc, skill) => {
      const subcategory = skill.subcategory || 'other';
      if (!acc[subcategory]) {
        acc[subcategory] = [];
      }
      acc[subcategory].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    return grouped;
  }
}

export const skillsRepository = new SkillsRepository();
