/* =========================================================
   ABOUT PROFILE
========================================================= */

export interface AboutProfile {
  id: string;

  title: string;

  subtitle: string | null;

  /*
    Existing database columns.

    IMPORTANT:
    background_1 = About paragraph 1
    background_2 = About paragraph 2
  */
  background_1: string;

  background_2: string | null;

  resume_url: string | null;

  created_at: string;

  updated_at: string;
}


/* =========================================================
   HOBBY
========================================================= */

export interface Hobby {
  id: string;

  name: string;

  icon_url: string;

  display_order: number;

  published: boolean;

  created_at: string;
}