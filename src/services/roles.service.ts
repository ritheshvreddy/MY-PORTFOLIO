import { supabase } from "../lib/supabase";

import type {
  Role,
  RoleInput,
  RoleResponsibility,
  RoleSkill,
  FullRole,
} from "../types/roles";

/* ======================================================
   ROLES - ADMIN
====================================================== */

/* GET ALL ROLES */

export async function getRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}


/* GET PUBLISHED ROLES - PUBLIC WEBSITE */

export async function getPublishedRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("is_published", true)
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}


/* GET FEATURED ROLES - HOME PAGE */

export async function getFeaturedRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("is_published", true)
    .eq("featured", true)
    .order("display_order", {
      ascending: true,
    })
    .limit(2);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}


/* GET ROLE BY ID */

export async function getRoleById(
  id: string
): Promise<Role | null> {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


/* CREATE ROLE */

export async function createRole(
  input: RoleInput
): Promise<Role> {
  const { data, error } = await supabase
    .from("roles")
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


/* UPDATE ROLE */

export async function updateRole(
  id: string,
  input: Partial<RoleInput>
): Promise<Role> {
  const { data, error } = await supabase
    .from("roles")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


/* DELETE ROLE */

export async function deleteRole(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("roles")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}


/* UPDATE PUBLISH STATUS */

export async function updateRolePublished(
  id: string,
  is_published: boolean
): Promise<Role> {
  const { data, error } = await supabase
    .from("roles")
    .update({
      is_published,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


/* ======================================================
   RESPONSIBILITIES
====================================================== */


/* GET RESPONSIBILITIES */

export async function getResponsibilities(
  roleId: string
): Promise<RoleResponsibility[]> {
  const { data, error } = await supabase
    .from("role_responsibilities")
    .select("*")
    .eq("role_id", roleId)
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}


/* CREATE RESPONSIBILITY */

export async function createResponsibility(
  roleId: string,
  responsibility: string,
  displayOrder: number
): Promise<RoleResponsibility> {
  const { data, error } = await supabase
    .from("role_responsibilities")
    .insert({
      role_id: roleId,
      responsibility,
      display_order: displayOrder,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


/* UPDATE RESPONSIBILITY */

export async function updateResponsibility(
  id: string,
  responsibility: string,
  displayOrder: number
): Promise<RoleResponsibility> {
  const { data, error } = await supabase
    .from("role_responsibilities")
    .update({
      responsibility,
      display_order: displayOrder,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


/* DELETE RESPONSIBILITY */

export async function deleteResponsibility(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("role_responsibilities")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}


/* ======================================================
   ROLE SKILLS
====================================================== */


/* GET ROLE SKILLS */

export async function getRoleSkills(
  roleId: string
): Promise<RoleSkill[]> {
  const { data, error } = await supabase
    .from("role_skills")
    .select("*")
    .eq("role_id", roleId)
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}


/* CREATE ROLE SKILL */

export async function createRoleSkill(
  roleId: string,
  skill: string,
  displayOrder: number
): Promise<RoleSkill> {
  const { data, error } = await supabase
    .from("role_skills")
    .insert({
      role_id: roleId,
      skill,
      display_order: displayOrder,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


/* UPDATE ROLE SKILL */

export async function updateRoleSkill(
  id: string,
  skill: string,
  displayOrder: number
): Promise<RoleSkill> {
  const { data, error } = await supabase
    .from("role_skills")
    .update({
      skill,
      display_order: displayOrder,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


/* DELETE ROLE SKILL */

export async function deleteRoleSkill(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("role_skills")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}


/* ======================================================
   FULL ROLES - PUBLIC WEBSITE
====================================================== */

export async function getFullRoles(): Promise<
  FullRole[]
> {
  const roles =
    await getPublishedRoles();

  const fullRoles = await Promise.all(
    roles.map(async (role) => {
      const [
        responsibilities,
        skills,
      ] = await Promise.all([
        getResponsibilities(role.id),
        getRoleSkills(role.id),
      ]);

      return {
        ...role,
        responsibilities,
        skills,
      };
    })
  );

  return fullRoles;
}


/* ======================================================
   FEATURED FULL ROLES - HOME PAGE
====================================================== */

export async function getFeaturedFullRoles(): Promise<
  FullRole[]
> {
  const roles =
    await getFeaturedRoles();

  const fullRoles = await Promise.all(
    roles.map(async (role) => {
      const [
        responsibilities,
        skills,
      ] = await Promise.all([
        getResponsibilities(role.id),
        getRoleSkills(role.id),
      ]);

      return {
        ...role,
        responsibilities,
        skills,
      };
    })
  );

  return fullRoles;
}