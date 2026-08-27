export interface Role {
  id: string;
  position: string;
  company: string;
  company_logo: string | null;
  location: string | null;
  duration: string | null;
  employment_type: string | null;
  short_description: string | null;
  featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface RoleResponsibility {
  id: string;
  role_id: string;
  responsibility: string;
  display_order: number;
  created_at: string;
}

export interface RoleSkill {
  id: string;
  role_id: string;
  skill: string;
  display_order: number;
  created_at: string;
}

export interface FullRole extends Role {
  responsibilities: RoleResponsibility[];
  skills: RoleSkill[];
}

export interface RoleInput {
  position: string;
  company: string;
  company_logo: string | null;
  location: string | null;
  duration: string | null;
  employment_type: string | null;
  short_description: string | null;
  featured: boolean;
  is_published: boolean;
  display_order: number;
}