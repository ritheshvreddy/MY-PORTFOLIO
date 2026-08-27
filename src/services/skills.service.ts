import { supabase } from "../lib/supabase";

import type {
  Skill,
  SkillCategory,
  SkillInput,
  SkillCategoryInput,
} from "../types/skill";

/* =========================================================
   SKILL CATEGORIES
========================================================= */

export async function getSkillCategories(): Promise<
  SkillCategory[]
> {
  const { data, error } = await supabase
    .from("skill_categories")
    .select("*")
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error fetching skill categories:",
      error
    );
    return [];
  }

  return data ?? [];
}

export async function getPublishedSkillCategories(): Promise<
  SkillCategory[]
> {
  const { data, error } = await supabase
    .from("skill_categories")
    .select("*")
    .eq("published", true)
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error fetching published skill categories:",
      error
    );
    return [];
  }

  return data ?? [];
}

export async function createSkillCategory(
  input: SkillCategoryInput
): Promise<SkillCategory> {
  const { data, error } = await supabase
    .from("skill_categories")
    .insert(input)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateSkillCategory(
  id: string,
  input: Partial<SkillCategoryInput>
): Promise<SkillCategory> {
  const { data, error } = await supabase
    .from("skill_categories")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteSkillCategory(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("skill_categories")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/* =========================================================
   SKILLS
========================================================= */

function getSkillIconUrl(
  iconPath: string
): string {
  if (!iconPath) {
    return "";
  }

  if (
    iconPath.startsWith("http://") ||
    iconPath.startsWith("https://")
  ) {
    return iconPath;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("portfolio")
    .getPublicUrl(iconPath);

  return publicUrl;
}

export async function getSkills(): Promise<
  Skill[]
> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error fetching skills:",
      error
    );
    return [];
  }

  return (data ?? []).map((skill) => ({
    ...skill,
    icon: getSkillIconUrl(skill.icon),
  }));
}

export async function getPublishedSkills(): Promise<
  Skill[]
> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("published", true)
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error fetching published skills:",
      error
    );
    return [];
  }

  return (data ?? []).map((skill) => ({
    ...skill,
    icon: getSkillIconUrl(skill.icon),
  }));
}

export async function createSkill(
  input: SkillInput
): Promise<Skill> {
  const { data, error } = await supabase
    .from("skills")
    .insert(input)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    icon: getSkillIconUrl(data.icon),
  };
}

export async function updateSkill(
  id: string,
  input: Partial<SkillInput>
): Promise<Skill> {
  const { data, error } = await supabase
    .from("skills")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    icon: getSkillIconUrl(data.icon),
  };
}

export async function deleteSkill(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function updateSkillPublished(
  id: string,
  published: boolean
): Promise<Skill> {
  const { data, error } = await supabase
    .from("skills")
    .update({
      published,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    icon: getSkillIconUrl(data.icon),
  };
}

/* =========================================================
   COUNTS
========================================================= */

export async function getSkillCount(): Promise<
  number
> {
  const { count, error } = await supabase
    .from("skills")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) {
    console.error(
      "Error fetching skill count:",
      error
    );
    return 0;
  }

  return count ?? 0;
}

export async function getPublishedSkillCount(): Promise<
  number
> {
  const { count, error } = await supabase
    .from("skills")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("published", true);

  if (error) {
    console.error(
      "Error fetching published skill count:",
      error
    );
    return 0;
  }

  return count ?? 0;
}

export async function getSkillCategoryCount(): Promise<
  number
> {
  const { count, error } = await supabase
    .from("skill_categories")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) {
    console.error(
      "Error fetching skill category count:",
      error
    );
    return 0;
  }

  return count ?? 0;
}