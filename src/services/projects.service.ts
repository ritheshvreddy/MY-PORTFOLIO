import { supabase } from "../lib/supabase";

import type {
  Project,
  FullProject,
  ProjectTechnology,
  ProjectHighlight,
  ProjectGallery,
  ProjectCaseStudy,
} from "../types/project";


/* =========================================================
   CONSTANTS
========================================================= */

const PROJECT_IMAGE_BUCKET =
  "portfolio";


/* =========================================================
   PROJECT INPUT
========================================================= */

export type ProjectInput =
  Omit<
    Project,
    "id" |
    "created_at" |
    "updated_at"
  >;


/* =========================================================
   NORMALIZE PROJECT
========================================================= */

function normalizeProject(
  project: Project
): Project {

  return {

    ...project,

    cover_image:
      project.cover_image ??
      null,

    github_url:
      project.github_url ??
      null,

    live_url:
      project.live_url ??
      null,

    case_study_url:
      project.case_study_url ??
      null,

    ppt_url:
      project.ppt_url ??
      null,

    video_url:
      project.video_url ??
      null,

    date:
      project.date ??
      null,

    role:
      project.role ??
      null,

    show_case_study:
      project.show_case_study ??
      false,

    show_github_button:
      project.show_github_button ??
      true,

    show_live_demo_button:
      project.show_live_demo_button ??
      true,

  };
}


/* =========================================================
   GET ALL PROJECTS
========================================================= */

export async function getProjects():
  Promise<Project[]> {

  const {
    data,
    error,
  } =
    await supabase
      .from("projects")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      );


  if (error) {

    console.error(
      "Error fetching projects:",
      error
    );

    throw error;
  }


  return (
    (data ?? []) as Project[]
  ).map(
    normalizeProject
  );
}


/* =========================================================
   CREATE PROJECT
========================================================= */

export async function createProject(
  project: ProjectInput
): Promise<Project> {

  const {
    data,
    error,
  } =
    await supabase
      .from("projects")
      .insert(
        project
      )
      .select("*")
      .single();


  if (error) {

    console.error(
      "Error creating project:",
      error
    );

    throw error;
  }


  return data as Project;
}


/* =========================================================
   UPDATE PROJECT
========================================================= */

export async function updateProject(
  id: string,
  project: Partial<ProjectInput>
): Promise<Project> {

  const {
    data,
    error,
  } =
    await supabase
      .from("projects")
      .update(
        project
      )
      .eq(
        "id",
        id
      )
      .select("*")
      .single();


  if (error) {

    console.error(
      "Error updating project:",
      error
    );

    throw error;
  }


  return data as Project;
}


/* =========================================================
   DELETE PROJECT
========================================================= */

export async function deleteProject(
  id: string
): Promise<void> {

  const {
    error,
  } =
    await supabase
      .from("projects")
      .delete()
      .eq(
        "id",
        id
      );


  if (error) {

    console.error(
      "Error deleting project:",
      error
    );

    throw error;
  }
}


/* =========================================================
   GET PROJECT TECHNOLOGIES - SINGLE PROJECT
========================================================= */

async function getProjectTechnologies(
  projectId: string
): Promise<ProjectTechnology[]> {

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "project_technologies"
      )
      .select("*")
      .eq(
        "project_id",
        projectId
      )
      .order(
        "display_order",
        {
          ascending: true,
        }
      );


  if (error) {

    console.error(
      "Error fetching technologies:",
      error
    );

    return [];
  }


  return (
    data ?? []
  ).map(
    (item) => ({

      id:
        item.id,

      technology:
        item.technology,

    })
  );
}


/* =========================================================
   GET PROJECT HIGHLIGHTS - SINGLE PROJECT
========================================================= */

async function getProjectHighlights(
  projectId: string
): Promise<ProjectHighlight[]> {

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "project_highlights"
      )
      .select("*")
      .eq(
        "project_id",
        projectId
      )
      .order(
        "display_order",
        {
          ascending: true,
        }
      );


  if (error) {

    console.error(
      "Error fetching highlights:",
      error
    );

    return [];
  }


  return (
    data ?? []
  ).map(
    (item) => ({

      id:
        item.id,

      highlight:
        item.highlight,

    })
  );
}


/* =========================================================
   GET PROJECT GALLERY - SINGLE PROJECT
========================================================= */

async function getProjectGallery(
  projectId: string
): Promise<ProjectGallery[]> {

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "project_gallery"
      )
      .select("*")
      .eq(
        "project_id",
        projectId
      )
      .order(
        "display_order",
        {
          ascending: true,
        }
      );


  if (error) {

    console.error(
      "Error fetching project gallery:",
      error
    );

    return [];
  }


  return (
    data ?? []
  ).map(
    (item) => ({

      id:
        item.id,

      project_id:
        item.project_id,

      image_url:
        item.image_path,

      caption:
        item.caption ??
        null,

      display_order:
        item.display_order ??
        0,

    })
  );
}


/* =========================================================
   GET CASE STUDY - SINGLE PROJECT
========================================================= */

async function getProjectCaseStudy(
  projectId: string
): Promise<ProjectCaseStudy | null> {

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "case_studies"
      )
      .select("*")
      .eq(
        "project_id",
        projectId
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Error fetching case study:",
      error
    );

    return null;
  }


  if (!data) {
    return null;
  }


  return {

    id:
      data.id,

    project_id:
      data.project_id,

    title:
      data.title ??
      null,

    introduction:
      data.introduction ??
      null,

    overview:
      data.overview ??
      null,

    problem:
      data.problem ??
      null,

    goals:
      data.goals ??
      null,

    solution:
      data.solution ??
      null,

    role:
      data.role ??
      null,

    created_at:
      data.created_at,

    updated_at:
      data.updated_at,

  };
}


/* =========================================================
   GET FULL PROJECT - SINGLE PROJECT
   Used by project details/admin.
========================================================= */

export async function getFullProject(
  project: Project
): Promise<FullProject> {

  const [
    technologies,
    highlights,
    gallery,
    caseStudy,
  ] =
    await Promise.all([

      getProjectTechnologies(
        project.id
      ),

      getProjectHighlights(
        project.id
      ),

      getProjectGallery(
        project.id
      ),

      getProjectCaseStudy(
        project.id
      ),

    ]);


  return {

    ...project,

    technologies,

    highlights,

    gallery,

    case_study:
      caseStudy,

  };
}


/* =========================================================
   BATCH BUILD FULL PROJECTS
========================================================= */

async function buildFullProjects(
  projects: Project[]
): Promise<FullProject[]> {

  if (!projects.length) {
    return [];
  }


  const projectIds =
    projects.map(
      (project) =>
        project.id
    );


  /*
    Fetch every related dataset in ONE query
    each instead of FOUR queries per project.
  */

  const [
    technologiesResult,
    highlightsResult,
    galleryResult,
    caseStudiesResult,
  ] =
    await Promise.all([

      supabase
        .from(
          "project_technologies"
        )
        .select("*")
        .in(
          "project_id",
          projectIds
        )
        .order(
          "display_order",
          {
            ascending: true,
          }
        ),

      supabase
        .from(
          "project_highlights"
        )
        .select("*")
        .in(
          "project_id",
          projectIds
        )
        .order(
          "display_order",
          {
            ascending: true,
          }
        ),

      supabase
        .from(
          "project_gallery"
        )
        .select("*")
        .in(
          "project_id",
          projectIds
        )
        .order(
          "display_order",
          {
            ascending: true,
          }
        ),

      supabase
        .from(
          "case_studies"
        )
        .select("*")
        .in(
          "project_id",
          projectIds
        ),

    ]);


  if (technologiesResult.error) {

    throw new Error(
      technologiesResult.error.message
    );
  }


  if (highlightsResult.error) {

    throw new Error(
      highlightsResult.error.message
    );
  }


  if (galleryResult.error) {

    throw new Error(
      galleryResult.error.message
    );
  }


  if (caseStudiesResult.error) {

    throw new Error(
      caseStudiesResult.error.message
    );
  }


  /* =======================================================
     TECHNOLOGIES
  ======================================================= */

  const technologiesByProject =
    new Map<
      string,
      ProjectTechnology[]
    >();


  for (
    const item
    of technologiesResult.data ?? []
  ) {

    const technology: ProjectTechnology = {

      id:
        item.id,

      technology:
        item.technology,

    };


    const existing =
      technologiesByProject.get(
        item.project_id
      ) ?? [];


    existing.push(
      technology
    );


    technologiesByProject.set(
      item.project_id,
      existing
    );
  }


  /* =======================================================
     HIGHLIGHTS
  ======================================================= */

  const highlightsByProject =
    new Map<
      string,
      ProjectHighlight[]
    >();


  for (
    const item
    of highlightsResult.data ?? []
  ) {

    const highlight: ProjectHighlight = {

      id:
        item.id,

      highlight:
        item.highlight,

    };


    const existing =
      highlightsByProject.get(
        item.project_id
      ) ?? [];


    existing.push(
      highlight
    );


    highlightsByProject.set(
      item.project_id,
      existing
    );
  }


  /* =======================================================
     GALLERY
  ======================================================= */

  const galleryByProject =
    new Map<
      string,
      ProjectGallery[]
    >();


  for (
    const item
    of galleryResult.data ?? []
  ) {

    const galleryItem: ProjectGallery = {

      id:
        item.id,

      project_id:
        item.project_id,

      image_url:
        item.image_path,

      caption:
        item.caption ??
        null,

      display_order:
        item.display_order ??
        0,

    };


    const existing =
      galleryByProject.get(
        item.project_id
      ) ?? [];


    existing.push(
      galleryItem
    );


    galleryByProject.set(
      item.project_id,
      existing
    );
  }


  /* =======================================================
     CASE STUDIES
  ======================================================= */

  const caseStudyByProject =
    new Map<
      string,
      ProjectCaseStudy
    >();


  for (
    const item
    of caseStudiesResult.data ?? []
  ) {

    const caseStudy: ProjectCaseStudy = {

      id:
        item.id,

      project_id:
        item.project_id,

      title:
        item.title ??
        null,

      introduction:
        item.introduction ??
        null,

      overview:
        item.overview ??
        null,

      problem:
        item.problem ??
        null,

      goals:
        item.goals ??
        null,

      solution:
        item.solution ??
        null,

      role:
        item.role ??
        null,

      created_at:
        item.created_at,

      updated_at:
        item.updated_at,

    };


    caseStudyByProject.set(
      item.project_id,
      caseStudy
    );
  }


  /* =======================================================
     BUILD FINAL PROJECTS
  ======================================================= */

  return projects.map(
    (project) => ({

      ...project,

      technologies:
        technologiesByProject.get(
          project.id
        ) ?? [],

      highlights:
        highlightsByProject.get(
          project.id
        ) ?? [],

      gallery:
        galleryByProject.get(
          project.id
        ) ?? [],

      case_study:
        caseStudyByProject.get(
          project.id
        ) ?? null,

    }) as FullProject
  );
}


/* =========================================================
   GET ALL FULL PROJECTS
   PUBLIC WEBSITE - BATCHED
========================================================= */

export async function getFullProjects():
  Promise<FullProject[]> {

  const projects =
    await getProjects();


  return buildFullProjects(
    projects
  );
}


/* =========================================================
   GET FEATURED FULL PROJECTS
   HOME PAGE - BATCHED
========================================================= */

export async function getFeaturedFullProjects():
  Promise<FullProject[]> {

  const {
    data,
    error,
  } =
    await supabase
      .from("projects")
      .select("*")
      .eq(
        "featured",
        true
      )
      .eq(
        "published",
        true
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );


  if (error) {

    console.error(
      "Error fetching featured projects:",
      error
    );

    throw error;
  }


  const projects =
    ((data ?? []) as Project[])
      .map(
        normalizeProject
      );


  return buildFullProjects(
    projects
  );
}


/* =========================================================
   GET PROJECT BY SLUG
   SINGLE PROJECT PAGE
========================================================= */

export async function getProjectBySlug(
  slug: string
): Promise<FullProject | null> {

  const {
    data,
    error,
  } =
    await supabase
      .from("projects")
      .select("*")
      .eq(
        "slug",
        slug
      )
      .eq(
        "published",
        true
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Error fetching project by slug:",
      error
    );

    throw error;
  }


  if (!data) {
    return null;
  }


  return getFullProject(
    normalizeProject(
      data as Project
    )
  );
}


/* =========================================================
   GET PROJECT BY ID
========================================================= */

export async function getProjectById(
  id: string
): Promise<FullProject | null> {

  const {
    data,
    error,
  } =
    await supabase
      .from("projects")
      .select("*")
      .eq(
        "id",
        id
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Error fetching project by ID:",
      error
    );

    throw error;
  }


  if (!data) {
    return null;
  }


  return getFullProject(
    normalizeProject(
      data as Project
    )
  );
}


/* =========================================================
   CASE STUDY INPUT
========================================================= */

export interface CaseStudyInput {

  title?: string | null;

  introduction?: string | null;

  overview?: string | null;

  problem?: string | null;

  goals?: string | null;

  solution?: string | null;

  role?: string | null;
}


/* =========================================================
   GET CASE STUDY
========================================================= */

export async function getCaseStudy(
  projectId: string
): Promise<ProjectCaseStudy | null> {

  return getProjectCaseStudy(
    projectId
  );
}


/* =========================================================
   CREATE / UPDATE CASE STUDY
========================================================= */

export async function upsertCaseStudy(
  projectId: string,
  input: CaseStudyInput
): Promise<ProjectCaseStudy> {

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "case_studies"
      )
      .upsert(
        {
          project_id:
            projectId,

          title:
            input.title ??
            null,

          introduction:
            input.introduction ??
            null,

          overview:
            input.overview ??
            null,

          problem:
            input.problem ??
            null,

          goals:
            input.goals ??
            null,

          solution:
            input.solution ??
            null,

          role:
            input.role ??
            null,
        },
        {
          onConflict:
            "project_id",
        }
      )
      .select("*")
      .single();


  if (error) {

    console.error(
      "Error saving case study:",
      error
    );

    throw error;
  }


  return {

    id:
      data.id,

    project_id:
      data.project_id,

    title:
      data.title ??
      null,

    introduction:
      data.introduction ??
      null,

    overview:
      data.overview ??
      null,

    problem:
      data.problem ??
      null,

    goals:
      data.goals ??
      null,

    solution:
      data.solution ??
      null,

    role:
      data.role ??
      null,

    created_at:
      data.created_at,

    updated_at:
      data.updated_at,

  };
}


/* =========================================================
   DELETE CASE STUDY
========================================================= */

export async function deleteCaseStudy(
  projectId: string
): Promise<void> {

  const {
    error,
  } =
    await supabase
      .from(
        "case_studies"
      )
      .delete()
      .eq(
        "project_id",
        projectId
      );


  if (error) {

    console.error(
      "Error deleting case study:",
      error
    );

    throw error;
  }
}


/* =========================================================
   CREATE GALLERY ITEM
========================================================= */

export async function createGalleryItem(
  projectId: string,
  imageUrl: string,
  caption: string | null = null,
  displayOrder = 0
): Promise<ProjectGallery> {

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "project_gallery"
      )
      .insert({

        project_id:
          projectId,

        image_path:
          imageUrl,

        caption,

        display_order:
          displayOrder,

      })
      .select("*")
      .single();


  if (error) {

    console.error(
      "Gallery database insert failed:",
      error
    );

    throw new Error(
      `Gallery database insert failed: ${error.message}`
    );
  }


  return {

    id:
      data.id,

    project_id:
      data.project_id,

    image_url:
      data.image_path,

    caption:
      data.caption ??
      null,

    display_order:
      data.display_order ??
      0,

  };
}


/* =========================================================
   UPDATE GALLERY ITEM
========================================================= */

export async function updateGalleryItem(
  id: string,
  caption?: string | null,
  displayOrder?: number
): Promise<ProjectGallery> {

  const updates: {
    caption?: string | null;

    display_order?: number;
  } = {};


  if (
    caption !== undefined
  ) {

    updates.caption =
      caption;
  }


  if (
    displayOrder !== undefined
  ) {

    updates.display_order =
      displayOrder;
  }


  const {
    data,
    error,
  } =
    await supabase
      .from(
        "project_gallery"
      )
      .update(
        updates
      )
      .eq(
        "id",
        id
      )
      .select("*")
      .single();


  if (error) {

    console.error(
      "Error updating gallery item:",
      error
    );

    throw error;
  }


  return {

    id:
      data.id,

    project_id:
      data.project_id,

    image_url:
      data.image_path,

    caption:
      data.caption ??
      null,

    display_order:
      data.display_order ??
      0,

  };
}


/* =========================================================
   DELETE GALLERY ITEM
========================================================= */

export async function deleteGalleryItem(
  id: string
): Promise<void> {

  const {
    error,
  } =
    await supabase
      .from(
        "project_gallery"
      )
      .delete()
      .eq(
        "id",
        id
      );


  if (error) {

    console.error(
      "Error deleting gallery item:",
      error
    );

    throw error;
  }
}


/* =========================================================
   COVER IMAGE UPLOAD
========================================================= */

export async function uploadProjectImage(
  file: File
): Promise<string> {

  if (
    !file.type.startsWith(
      "image/"
    )
  ) {

    throw new Error(
      "Only image files are allowed."
    );
  }


  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    "jpg";


  const fileName =
    `${crypto.randomUUID()}.${extension}`;


  const filePath =
    `projects/${fileName}`;


  const {
    error:
      uploadError,
  } =
    await supabase
      .storage
      .from(
        PROJECT_IMAGE_BUCKET
      )
      .upload(
        filePath,
        file,
        {
          cacheControl:
            "3600",

          upsert:
            false,
        }
      );


  if (uploadError) {

    console.error(
      "Project image upload failed:",
      uploadError
    );

    throw new Error(
      `Project image upload failed: ${uploadError.message}`
    );
  }


  const {
    data,
  } =
    supabase
      .storage
      .from(
        PROJECT_IMAGE_BUCKET
      )
      .getPublicUrl(
        filePath
      );


  return data.publicUrl;
}


/* =========================================================
   GALLERY IMAGE UPLOAD
========================================================= */

export async function uploadProjectGalleryImage(
  file: File,
  projectId: string
): Promise<string> {

  if (
    !file.type.startsWith(
      "image/"
    )
  ) {

    throw new Error(
      "Only image files are allowed."
    );
  }


  if (!projectId) {

    throw new Error(
      "Project ID is required for gallery upload."
    );
  }


  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    "jpg";


  const fileName =
    `${crypto.randomUUID()}.${extension}`;


  const filePath =
    `project-gallery/${projectId}/${fileName}`;


  const {
    error:
      uploadError,
  } =
    await supabase
      .storage
      .from(
        PROJECT_IMAGE_BUCKET
      )
      .upload(
        filePath,
        file,
        {
          cacheControl:
            "3600",

          upsert:
            false,
        }
      );


  if (uploadError) {

    console.error(
      "Gallery storage upload failed:",
      uploadError
    );

    throw new Error(
      `Gallery storage upload failed: ${uploadError.message}`
    );
  }


  const {
    data,
  } =
    supabase
      .storage
      .from(
        PROJECT_IMAGE_BUCKET
      )
      .getPublicUrl(
        filePath
      );


  if (!data.publicUrl) {

    throw new Error(
      "Unable to generate gallery image URL."
    );
  }


  return data.publicUrl;
}


/* =========================================================
   DELETE STORAGE IMAGE
========================================================= */

export async function deleteProjectImage(
  imageUrl: string
): Promise<void> {

  if (!imageUrl) {
    return;
  }


  try {

    const marker =
      `/storage/v1/object/public/${PROJECT_IMAGE_BUCKET}/`;


    const index =
      imageUrl.indexOf(
        marker
      );


    if (
      index === -1
    ) {

      return;
    }


    const filePath =
      imageUrl.substring(
        index +
        marker.length
      );


    if (!filePath) {
      return;
    }


    const {
      error,
    } =
      await supabase
        .storage
        .from(
          PROJECT_IMAGE_BUCKET
        )
        .remove([
          filePath,
        ]);


    if (error) {
      throw error;
    }

  } catch (
    error
  ) {

    console.error(
      "Error deleting project image:",
      error
    );

    throw error;
  }
}