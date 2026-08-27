import { supabase } from "../lib/supabase";

export interface HeroQuote {
  id: string;
  quote: string;
  author: string;
  display_order: number;
  published: boolean;
}

/* ================= GET QUOTES ================= */

export async function getHeroQuotes(): Promise<HeroQuote[]> {
  const { data, error } = await supabase
    .from("hero_quotes")
    .select("*")
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error fetching hero quotes:",
      error
    );

    throw error;
  }

  return data ?? [];
}

/* ================= CREATE QUOTE ================= */

export async function createHeroQuote(
  quote: Omit<HeroQuote, "id">
): Promise<HeroQuote> {
  const { data, error } = await supabase
    .from("hero_quotes")
    .insert(quote)
    .select()
    .single();

  if (error) {
    console.error(
      "Error creating hero quote:",
      error
    );

    throw error;
  }

  return data;
}

/* ================= UPDATE QUOTE ================= */

export async function updateHeroQuote(
  id: string,
  updates: Partial<
    Omit<HeroQuote, "id">
  >
): Promise<HeroQuote> {
  const { data, error } = await supabase
    .from("hero_quotes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      "Error updating hero quote:",
      error
    );

    throw error;
  }

  return data;
}

/* ================= DELETE QUOTE ================= */

export async function deleteHeroQuote(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("hero_quotes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Error deleting hero quote:",
      error
    );

    throw error;
  }
}