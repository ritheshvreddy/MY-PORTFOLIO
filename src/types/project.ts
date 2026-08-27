/* =========================================================
   PROJECT TECHNOLOGY
========================================================= */

export interface ProjectTechnology {
  id: string;
  technology: string;
}


/* =========================================================
   PROJECT HIGHLIGHT
========================================================= */

export interface ProjectHighlight {
  id: string;
  highlight: string;
}


/* =========================================================
   PROJECT GALLERY
========================================================= */

export interface ProjectGallery {
  id: string;

  project_id?: string;

  /*
    Supabase column:
    image_path

    Frontend property:
    image_url
  */
  image_url: string;

  caption: string | null;

  display_order: number;
}


/* =========================================================
   PROJECT CASE STUDY
========================================================= */

export interface ProjectCaseStudy {
  id: string;

  project_id: string;

  title: string | null;

  introduction: string | null;

  overview: string | null;

  problem: string | null;

  goals: string | null;

  solution: string | null;

  role: string | null;

  created_at?: string;

  updated_at?: string;
}


/* =========================================================
   BASIC PROJECT
========================================================= */

export interface Project {
  id: string;

  title: string;

  slug: string;

  tagline: string;

  description: string;

  category: string;

  cover_image: string | null;

  github_url: string | null;

  live_url: string | null;

  case_study_url?: string | null;

  ppt_url?: string | null;

  video_url?: string | null;

  date: string | null;

  role?: string | null;

  featured: boolean;

  published: boolean;


  /* =======================================================
     FRONTEND / CMS CONTROLS
  ======================================================= */

  show_case_study: boolean;

  show_github_button: boolean;

  show_live_demo_button: boolean;


  created_at?: string;

  updated_at?: string;
}


/* =========================================================
   FULL PROJECT
========================================================= */

export interface FullProject
  extends Project {

  technologies:
    ProjectTechnology[];

  highlights:
    ProjectHighlight[];

  gallery:
    ProjectGallery[];

  case_study:
    ProjectCaseStudy | null;
}