import { supabase } from "../lib/supabase";

/* =========================================
   TYPES
========================================= */

export interface HeroRole {
  id: string;
  title: string;
  display_order: number;
  published: boolean;
}

/* =========================================
   GET ALL ROLES
========================================= */

export async function getHeroRoles(): Promise<
  HeroRole[]
> {
  const { data, error } = await supabase
    .from("hero_roles")
    .select("*")
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error fetching hero roles:",
      error
    );

    return [];
  }

  return data ?? [];
}

/* =========================================
   CREATE ROLE
========================================= */

export async function createHeroRole(
  role: Omit<HeroRole, "id">
): Promise<HeroRole> {
  const { data, error } = await supabase
    .from("hero_roles")
    .insert(role)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/* =========================================
   UPDATE ROLE
========================================= */

export async function updateHeroRole(
  id: string,
  updates: Partial<Omit<HeroRole, "id">>
): Promise<HeroRole> {
  const { data, error } = await supabase
    .from("hero_roles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/* =========================================
   DELETE ROLE
========================================= */

export async function deleteHeroRole(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("hero_roles")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/* =========================================
   TOGGLE PUBLISHED
========================================= */

export async function toggleHeroRolePublished(
  id: string,
  published: boolean
): Promise<HeroRole> {
  return updateHeroRole(id, {
    published,
  });
}

/* =========================================
   UPDATE DISPLAY ORDER
========================================= */

export async function updateHeroRoleOrder(
  id: string,
  display_order: number
): Promise<HeroRole> {
  return updateHeroRole(id, {
    display_order,
  });
}