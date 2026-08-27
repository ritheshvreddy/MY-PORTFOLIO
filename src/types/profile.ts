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

  /*
    Database:
    project_gallery.project_id
  */
  project_id?: string;

  /*
    Frontend property.

    Database stores this as:
    project_gallery.image_path
  */
  image_url: string;

  caption: string | null;

  display_order: number;

  created_at?: string;
}


/* =========================================================
   PROJECT RESPONSIBILITY
========================================================= */

export interface ProjectResponsibility {
  id: string;

  responsibility: string;

  display_order: number;
}


/* =========================================================
   PROJECT FEATURE
========================================================= */

export interface ProjectFeature {
  id: string;

  feature: string;

  display_order: number;
}


/* =========================================================
   PROJECT CHALLENGE
========================================================= */

export interface ProjectChallenge {
  id: string;

  challenge: string;

  solution: string | null;

  display_order: number;
}


/* =========================================================
   PROJECT LEARNING
========================================================= */

export interface ProjectLearning {
  id: string;

  learning: string;

  display_order: number;
}


/* =========================================================
   PROJECT FUTURE IMPROVEMENT
========================================================= */

export interface ProjectFutureImprovement {
  id: string;

  improvement: string;

  display_order: number;
}


/* =========================================================
   PROJECT CASE STUDY
========================================================= */

export interface ProjectCaseStudy {
  id: string;

  project_id?: string;

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

  /*
    Kept for compatibility with any existing
    project data/code.
  */
  case_study_url?: string | null;

  ppt_url?: string | null;

  video_url?: string | null;

  date: string | null;

  role?: string | null;

  featured: boolean;

  published: boolean;


  /* =======================================================
     CASE STUDY / BUTTON CONTROLS
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


  /* =======================================================
     CASE STUDY REPEATABLE SECTIONS
  ======================================================= */

  responsibilities:
    ProjectResponsibility[];

  features:
    ProjectFeature[];

  challenges:
    ProjectChallenge[];

  learnings:
    ProjectLearning[];

  future_improvements:
    ProjectFutureImprovement[];
}