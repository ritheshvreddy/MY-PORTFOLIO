import { supabase } from "../lib/supabase";
import type { FullRole } from "../types/roles";

export async function getPreviewRoles(): Promise<FullRole[]> {
  const { data, error } = await supabase
    .from("roles")
    .select(`
      *,
      responsibilities:role_responsibilities(*),
      skills:role_skills(*)
    `)
    .eq("published", true)
    .eq("featured", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  console.log("Featured Roles:", data);

  return (data ?? []) as FullRole[];
}