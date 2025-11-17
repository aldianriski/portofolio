export interface Skill {
  id: string;
  name: string;
  category: 'hard' | 'soft';
  subcategory: string | null;
  proficiency: number;
  icon: string | null;
  order_index: number;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface SkillsByCategory {
  hard: Skill[];
  soft: Skill[];
}

export interface SkillSubcategory {
  name: string;
  skills: Skill[];
}
