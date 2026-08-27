export interface SkillCategory {
  id: string;

  title: string;

  description: string;

  display_order: number;

  published: boolean;

  created_at: string;

  updated_at: string;
}

export interface Skill {
  id: string;

  category_id: string;

  title: string;

  description: string;

  icon: string;

  display_order: number;

  published: boolean;

  created_at: string;

  updated_at: string;
}

export interface SkillCategoryInput {
  title: string;

  description: string;

  display_order: number;

  published: boolean;
}

export interface SkillInput {
  category_id: string;

  title: string;

  description: string;

  icon: string;

  display_order: number;

  published: boolean;
}

export interface SkillWithCategory extends Skill {
  category?: SkillCategory | null;
}