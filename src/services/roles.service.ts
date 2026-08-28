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


/* ======================================================
   GET ALL ROLES
====================================================== */

export async function getRoles(): Promise<Role[]> {
  const {
    data,
    error,
  } = await supabase
    .from("roles")
    .select("*")
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Role[];
}


/* ======================================================
   GET PUBLISHED ROLES - PUBLIC WEBSITE
====================================================== */

export async function getPublishedRoles(): Promise<Role[]> {
  const {
    data,
    error,
  } = await supabase
    .from("roles")
    .select("*")
    .eq("published", true)
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Role[];
}


/* ======================================================
   GET FEATURED ROLES - HOME PAGE
====================================================== */

export async function getFeaturedRoles(): Promise<Role[]> {
  const {
    data,
    error,
  } = await supabase
    .from("roles")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("display_order", {
      ascending: true,
    })
    .limit(2);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Role[];
}


/* ======================================================
   GET ROLE BY ID
====================================================== */

export async function getRoleById(
  id: string
): Promise<Role | null> {
  const {
    data,
    error,
  } = await supabase
    .from("roles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Role | null;
}


/* ======================================================
   CREATE ROLE
====================================================== */

export async function createRole(
  input: RoleInput
): Promise<Role> {
  const {
    data,
    error,
  } = await supabase
    .from("roles")
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Role;
}


/* ======================================================
   UPDATE ROLE
====================================================== */

export async function updateRole(
  id: string,
  input: Partial<RoleInput>
): Promise<Role> {
  const {
    data,
    error,
  } = await supabase
    .from("roles")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Role;
}


/* ======================================================
   DELETE ROLE
====================================================== */

export async function deleteRole(
  id: string
): Promise<void> {
  const {
    error,
  } = await supabase
    .from("roles")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}


/* ======================================================
   UPDATE PUBLISH STATUS
====================================================== */

export async function updateRolePublished(
  id: string,
  published: boolean
): Promise<Role> {
  const {
    data,
    error,
  } = await supabase
    .from("roles")
    .update({
      published,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Role;
}


/* ======================================================
   RESPONSIBILITIES
====================================================== */


/* ======================================================
   GET RESPONSIBILITIES FOR ONE ROLE
====================================================== */

export async function getResponsibilities(
  roleId: string
): Promise<RoleResponsibility[]> {
  const {
    data,
    error,
  } = await supabase
    .from("role_responsibilities")
    .select("*")
    .eq("role_id", roleId)
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as RoleResponsibility[];
}


/* ======================================================
   CREATE RESPONSIBILITY
====================================================== */

export async function createResponsibility(
  roleId: string,
  responsibility: string,
  displayOrder: number
): Promise<RoleResponsibility> {
  const {
    data,
    error,
  } = await supabase
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

  return data as RoleResponsibility;
}


/* ======================================================
   UPDATE RESPONSIBILITY
====================================================== */

export async function updateResponsibility(
  id: string,
  responsibility: string,
  displayOrder: number
): Promise<RoleResponsibility> {
  const {
    data,
    error,
  } = await supabase
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

  return data as RoleResponsibility;
}


/* ======================================================
   DELETE RESPONSIBILITY
====================================================== */

export async function deleteResponsibility(
  id: string
): Promise<void> {
  const {
    error,
  } = await supabase
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


/* ======================================================
   GET ROLE SKILLS FOR ONE ROLE
====================================================== */

export async function getRoleSkills(
  roleId: string
): Promise<RoleSkill[]> {
  const {
    data,
    error,
  } = await supabase
    .from("role_skills")
    .select("*")
    .eq("role_id", roleId)
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as RoleSkill[];
}


/* ======================================================
   CREATE ROLE SKILL
====================================================== */

export async function createRoleSkill(
  roleId: string,
  skill: string,
  displayOrder: number
): Promise<RoleSkill> {
  const {
    data,
    error,
  } = await supabase
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

  return data as RoleSkill;
}


/* ======================================================
   UPDATE ROLE SKILL
====================================================== */

export async function updateRoleSkill(
  id: string,
  skill: string,
  displayOrder: number
): Promise<RoleSkill> {
  const {
    data,
    error,
  } = await supabase
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

  return data as RoleSkill;
}


/* ======================================================
   DELETE ROLE SKILL
====================================================== */

export async function deleteRoleSkill(
  id: string
): Promise<void> {
  const {
    error,
  } = await supabase
    .from("role_skills")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}


/* ======================================================
   BUILD FULL ROLES - BATCHED
====================================================== */

async function buildFullRoles(
  roles: Role[]
): Promise<FullRole[]> {

  if (!roles.length) {
    return [];
  }


  const roleIds =
    roles.map(
      (role) => role.id
    );


  /*
    Fetch ALL responsibilities and skills
    in two queries instead of two queries
    for every role.
  */

  const [
    responsibilitiesResult,
    skillsResult,
  ] = await Promise.all([

    supabase
      .from("role_responsibilities")
      .select("*")
      .in(
        "role_id",
        roleIds
      )
      .order(
        "display_order",
        {
          ascending: true,
        }
      ),

    supabase
      .from("role_skills")
      .select("*")
      .in(
        "role_id",
        roleIds
      )
      .order(
        "display_order",
        {
          ascending: true,
        }
      ),

  ]);


  if (responsibilitiesResult.error) {
    throw new Error(
      responsibilitiesResult.error.message
    );
  }


  if (skillsResult.error) {
    throw new Error(
      skillsResult.error.message
    );
  }


  const responsibilities =
    (responsibilitiesResult.data ??
      []) as RoleResponsibility[];


  const skills =
    (skillsResult.data ??
      []) as RoleSkill[];


  /*
    Group related records by role_id.
  */

  const responsibilitiesByRole =
    new Map<string, RoleResponsibility[]>();


  for (
    const responsibility
    of responsibilities
  ) {

    const existing =
      responsibilitiesByRole.get(
        responsibility.role_id
      ) ?? [];


    existing.push(
      responsibility
    );


    responsibilitiesByRole.set(
      responsibility.role_id,
      existing
    );
  }


  const skillsByRole =
    new Map<string, RoleSkill[]>();


  for (
    const skill
    of skills
  ) {

    const existing =
      skillsByRole.get(
        skill.role_id
      ) ?? [];


    existing.push(
      skill
    );


    skillsByRole.set(
      skill.role_id,
      existing
    );
  }


  /*
    Rebuild the exact FullRole structure
    expected by your existing UI.
  */

  return roles.map(
    (role) => ({

      ...role,

      responsibilities:
        responsibilitiesByRole.get(
          role.id
        ) ?? [],

      skills:
        skillsByRole.get(
          role.id
        ) ?? [],

    }) as FullRole
  );
}


/* ======================================================
   FULL ROLES - PUBLIC WEBSITE
====================================================== */

export async function getFullRoles():
  Promise<FullRole[]> {

  const roles =
    await getPublishedRoles();


  return buildFullRoles(
    roles
  );
}


/* ======================================================
   FEATURED FULL ROLES - HOME PAGE
====================================================== */

export async function getFeaturedFullRoles():
  Promise<FullRole[]> {

  const roles =
    await getFeaturedRoles();


  return buildFullRoles(
    roles
  );
}