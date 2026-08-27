import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  createGalleryItem,
  createProject,
  deleteGalleryItem,
  deleteProject,
  deleteProjectImage,
  getFullProjects,
  updateGalleryItem,
  updateProject,
  uploadProjectGalleryImage,
  uploadProjectImage,
  upsertCaseStudy,
} from "../../services/projects.service";

import type {
  FullProject,
  Project,
} from "../../types/project";

import "./Projects.css";


/* =========================================================
   TYPES
========================================================= */

type ActiveTab =
  | "general"
  | "case-study";


interface ProjectFormData {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  cover_image: string;
  github_url: string;
  live_url: string;
  date: string;
  featured: boolean;
  published: boolean;
  show_case_study: boolean;
  show_github_button: boolean;
  show_live_demo_button: boolean;
}


interface CaseStudyFormData {
  title: string;
  introduction: string;
  overview: string;
  problem: string;
  goals: string;
  solution: string;
  role: string;
}


/* =========================================================
   INITIAL DATA
========================================================= */

const initialFormData: ProjectFormData = {
  title: "",
  slug: "",
  tagline: "",
  description: "",
  category: "",
  cover_image: "",
  github_url: "",
  live_url: "",
  date: "",
  featured: false,
  published: false,
  show_case_study: false,
  show_github_button: true,
  show_live_demo_button: true,
};


const initialCaseStudyData: CaseStudyFormData = {
  title: "",
  introduction: "",
  overview: "",
  problem: "",
  goals: "",
  solution: "",
  role: "",
};


/* =========================================================
   COMPONENT
========================================================= */

export default function Projects() {
  /* =======================================================
     PROJECT STATE
  ======================================================= */

  const [
    projects,
    setProjects,
  ] = useState<FullProject[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  const [
    isFormOpen,
    setIsFormOpen,
  ] = useState(false);


  const [
    editingProject,
    setEditingProject,
  ] = useState<FullProject | null>(null);


  const [
    activeTab,
    setActiveTab,
  ] = useState<ActiveTab>("general");


  const [
    formData,
    setFormData,
  ] = useState<ProjectFormData>(
    initialFormData
  );


  /* =======================================================
     CASE STUDY
  ======================================================= */

  const [
    caseStudyData,
    setCaseStudyData,
  ] = useState<CaseStudyFormData>(
    initialCaseStudyData
  );


  /* =======================================================
     GALLERY
  ======================================================= */

  const [
    gallery,
    setGallery,
  ] = useState<FullProject["gallery"]>(
    []
  );


  /* =======================================================
     FILE INPUTS
  ======================================================= */

  const coverImageRef =
    useRef<HTMLInputElement | null>(
      null
    );


  const galleryInputRef =
    useRef<HTMLInputElement | null>(
      null
    );


  /* =========================================================
     LOAD PROJECTS
  ========================================================= */

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getFullProjects();

      setProjects(data);

    } catch (loadError) {
      console.error(
        "Error loading projects:",
        loadError
      );

      setProjects([]);

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load projects."
      );

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    void loadProjects();
  }, []);


  /* =========================================================
     SLUG GENERATOR
  ========================================================= */

  function generateSlug(
    value: string
  ): string {
    return value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      );
  }


  /* =========================================================
     GENERAL FORM CHANGE
  ========================================================= */

function handleChange(
  event: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement
  >
) {
  const target = event.target;

  const {
    name,
    value,
    type,
  } = target;

  if (
    type === "checkbox" &&
    target instanceof HTMLInputElement
  ) {
    setFormData((previous) => ({
      ...previous,
      [name]: target.checked,
    }));

    return;
  }

  if (name === "title") {
    setFormData((previous) => ({
      ...previous,
      title: value,
      slug: editingProject
        ? previous.slug
        : generateSlug(value),
    }));

    return;
  }

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
}


  /* =========================================================
     CASE STUDY FORM CHANGE
  ========================================================= */

  function handleCaseStudyChange(
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) {
    const {
      name,
      value,
    } = event.target;


    setCaseStudyData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  }


  /* =========================================================
     RESET FORM
  ========================================================= */

  function resetFormState() {
    setFormData(
      initialFormData
    );

    setCaseStudyData(
      initialCaseStudyData
    );

    setGallery([]);

    setActiveTab(
      "general"
    );
  }


  /* =========================================================
     CREATE PROJECT
  ========================================================= */

  function handleCreate() {
    setEditingProject(
      null
    );

    resetFormState();

    setError("");
    setSuccess("");

    setIsFormOpen(
      true
    );
  }


  /* =========================================================
     EDIT PROJECT
  ========================================================= */

  function handleEdit(
    project: FullProject
  ) {
    setEditingProject(
      project
    );


    setFormData({
      title:
        project.title || "",

      slug:
        project.slug || "",

      tagline:
        project.tagline || "",

      description:
        project.description || "",

      category:
        project.category || "",

      cover_image:
        project.cover_image || "",

      github_url:
        project.github_url || "",

      live_url:
        project.live_url || "",

      date:
        project.date || "",

      featured:
        project.featured === true,

      published:
        project.published === true,

      show_case_study:
        project.show_case_study === true,

      show_github_button:
        project.show_github_button !== false,

      show_live_demo_button:
        project.show_live_demo_button !== false,
    });


    setCaseStudyData({
      title:
        project.case_study?.title ||
        "",

      introduction:
        project.case_study?.introduction ||
        "",

      overview:
        project.case_study?.overview ||
        "",

      problem:
        project.case_study?.problem ||
        "",

      goals:
        project.case_study?.goals ||
        "",

      solution:
        project.case_study?.solution ||
        "",

      role:
        project.case_study?.role ||
        "",
    });


    setGallery(
      project.gallery || []
    );


    setActiveTab(
      "general"
    );

    setError("");
    setSuccess("");

    setIsFormOpen(
      true
    );
  }


  /* =========================================================
     CLOSE FORM
  ========================================================= */

  function closeForm() {
    if (
      saving ||
      uploadingImage
    ) {
      return;
    }


    setIsFormOpen(
      false
    );

    setEditingProject(
      null
    );

    resetFormState();

    setError("");
    setSuccess("");
  }


  /* =========================================================
     COVER IMAGE UPLOAD
  ========================================================= */

  async function handleCoverImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select a valid image file."
      );

      return;
    }


    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");


      const oldImage =
        formData.cover_image;


      const imageUrl =
        await uploadProjectImage(
          file
        );


      setFormData(
        (previous) => ({
          ...previous,
          cover_image:
            imageUrl,
        })
      );


      if (
        oldImage &&
        oldImage !== imageUrl
      ) {
        try {
          await deleteProjectImage(
            oldImage
          );
        } catch (cleanupError) {
          console.error(
            "Old cover image cleanup failed:",
            cleanupError
          );
        }
      }


      setSuccess(
        "Cover image uploaded successfully."
      );

    } catch (uploadError) {
      console.error(
        "Error uploading cover image:",
        uploadError
      );


      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload cover image."
      );

    } finally {
      setUploadingImage(false);


      if (
        coverImageRef.current
      ) {
        coverImageRef.current.value =
          "";
      }
    }
  }


  /* =========================================================
     DELETE COVER IMAGE
  ========================================================= */

  async function handleDeleteCoverImage() {
    if (
      !formData.cover_image
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        "Delete this cover image?"
      );


    if (!confirmed) {
      return;
    }


    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");


      await deleteProjectImage(
        formData.cover_image
      );


      setFormData(
        (previous) => ({
          ...previous,
          cover_image:
            "",
        })
      );


      setSuccess(
        "Cover image deleted successfully."
      );

    } catch (deleteError) {
      console.error(
        "Error deleting cover image:",
        deleteError
      );


      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete cover image."
      );

    } finally {
      setUploadingImage(false);
    }
  }


  /* =========================================================
     SAVE PROJECT
  ========================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    if (
      !formData.title.trim()
    ) {
      setError(
        "Project title is required."
      );

      setActiveTab(
        "general"
      );

      return;
    }


    if (
      !formData.slug.trim()
    ) {
      setError(
        "Project slug is required."
      );

      setActiveTab(
        "general"
      );

      return;
    }


    try {
      setSaving(true);
      setError("");
      setSuccess("");


      const projectData:
        Omit<
          Project,
          "id" |
          "created_at" |
          "updated_at"
        > = {

        title:
          formData.title.trim(),

        slug:
          formData.slug.trim(),

        tagline:
          formData.tagline.trim(),

        description:
          formData.description.trim(),

        category:
          formData.category.trim(),

        cover_image:
          formData.cover_image.trim() ||
          null,

        github_url:
          formData.github_url.trim() ||
          null,

        live_url:
          formData.live_url.trim() ||
          null,

        case_study_url:
          null,

        ppt_url:
          null,

        video_url:
          null,

        date:
          formData.date.trim() ||
          null,

        role:
          null,

        featured:
          formData.featured,

        published:
          formData.published,

        show_case_study:
          formData.show_case_study,

        show_github_button:
          formData.show_github_button,

        show_live_demo_button:
          formData.show_live_demo_button,
      };


      let projectId =
        editingProject?.id;


      /* =====================================================
         CREATE / UPDATE PROJECT
      ===================================================== */

      if (
        editingProject
      ) {
        await updateProject(
          editingProject.id,
          projectData
        );

      } else {
        const created =
          await createProject(
            projectData
          );

        projectId =
          created.id;
      }


      /* =====================================================
         SAVE CASE STUDY
      ===================================================== */

      if (
        projectId &&
        formData.show_case_study
      ) {
        await upsertCaseStudy(
          projectId,
          {
            title:
              caseStudyData.title.trim() ||
              formData.title.trim(),

            introduction:
              caseStudyData.introduction.trim(),

            overview:
              caseStudyData.overview.trim(),

            problem:
              caseStudyData.problem.trim(),

            goals:
              caseStudyData.goals.trim(),

            solution:
              caseStudyData.solution.trim(),

            role:
              caseStudyData.role.trim(),
          }
        );
      }


      await loadProjects();


      setSuccess(
        editingProject
          ? "Project updated successfully."
          : "Project created successfully."
      );


      setIsFormOpen(
        false
      );

      setEditingProject(
        null
      );

      resetFormState();

    } catch (saveError) {
      console.error(
        "Error saving project:",
        saveError
      );


      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save project."
      );

    } finally {
      setSaving(false);
    }
  }


  /* =========================================================
     GALLERY UPLOAD
  ========================================================= */

  async function handleGalleryUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (!editingProject) {
      setError(
        "Save the project first before adding gallery images."
      );

      return;
    }


    const files =
      Array.from(
        event.target.files ?? []
      );


    if (
      files.length === 0
    ) {
      return;
    }


    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");


      let displayOrder =
        gallery.length;


      for (
        const file of files
      ) {
        if (
          !file.type.startsWith(
            "image/"
          )
        ) {
          continue;
        }


        const imageUrl =
          await uploadProjectGalleryImage(
            file,
            editingProject.id
          );


        const galleryItem =
          await createGalleryItem(
            editingProject.id,
            imageUrl,
            null,
            displayOrder
          );


        displayOrder += 1;


        setGallery(
          (previous) => [
            ...previous,
            galleryItem,
          ]
        );
      }


      setSuccess(
        "Gallery image(s) uploaded successfully."
      );

    } catch (galleryError) {
      console.error(
        "Gallery upload error:",
        galleryError
      );


      setError(
        galleryError instanceof Error
          ? galleryError.message
          : "Unable to upload gallery image."
      );

    } finally {
      setUploadingImage(false);


      if (
        galleryInputRef.current
      ) {
        galleryInputRef.current.value =
          "";
      }
    }
  }


  /* =========================================================
     REPLACE GALLERY IMAGE
  ========================================================= */

  async function handleReplaceGalleryImage(
    item: FullProject["gallery"][number]
  ) {
    if (!editingProject) {
      return;
    }


    const input =
      document.createElement(
        "input"
      );


    input.type = "file";

    input.accept =
      "image/*";


    input.onchange =
      async () => {

        const file =
          input.files?.[0];


        if (!file) {
          return;
        }


        if (
          !file.type.startsWith(
            "image/"
          )
        ) {
          setError(
            "Please select a valid image file."
          );

          return;
        }


        try {
          setUploadingImage(
            true
          );

          setError("");
          setSuccess("");


          const newImageUrl =
            await uploadProjectGalleryImage(
              file,
              editingProject.id
            );


          /*
            Preserve the existing caption
            and display order.
          */

          const updatedItem =
            await updateGalleryItem(
              item.id,
              item.caption,
              item.display_order
            );


          /*
            updateGalleryItem only updates
            database metadata, so we need
            to update image_path separately.
          */

          const {
            error: imageUpdateError,
          } =
            await (
              await import(
                "../../lib/supabase"
              )
            ).supabase
              .from(
                "project_gallery"
              )
              .update({
                image_path:
                  newImageUrl,
              })
              .eq(
                "id",
                item.id
              );


          if (
            imageUpdateError
          ) {
            throw imageUpdateError;
          }


          try {
            await deleteProjectImage(
              item.image_url
            );
          } catch (
            cleanupError
          ) {
            console.error(
              "Old gallery image cleanup failed:",
              cleanupError
            );
          }


          setGallery(
            (previous) =>
              previous.map(
                (current) =>
                  current.id === item.id
                    ? {
                        ...updatedItem,
                        image_url:
                          newImageUrl,
                      }
                    : current
              )
          );


          setSuccess(
            "Gallery image replaced successfully."
          );

        } catch (
          replaceError
        ) {
          console.error(
            "Gallery replace error:",
            replaceError
          );


          setError(
            replaceError instanceof Error
              ? replaceError.message
              : "Unable to replace gallery image."
          );

        } finally {
          setUploadingImage(
            false
          );
        }
      };


    input.click();
  }


  /* =========================================================
     UPDATE GALLERY CAPTION
  ========================================================= */

  async function handleGalleryCaptionChange(
    item: FullProject["gallery"][number],
    caption: string
  ) {
    try {

      const updatedItem =
        await updateGalleryItem(
          item.id,
          caption,
          item.display_order
        );


      setGallery(
        (previous) =>
          previous.map(
            (current) =>
              current.id === item.id
                ? {
                    ...current,
                    caption:
                      updatedItem.caption,
                  }
                : current
          )
      );

    } catch (
      captionError
    ) {

      console.error(
        "Error updating gallery caption:",
        captionError
      );


      setError(
        captionError instanceof Error
          ? captionError.message
          : "Unable to update gallery caption."
      );
    }
  }


  /* =========================================================
     DELETE GALLERY IMAGE
  ========================================================= */

  async function handleDeleteGalleryImage(
    item: FullProject["gallery"][number]
  ) {

    const confirmed =
      window.confirm(
        "Delete this gallery image?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setUploadingImage(
        true
      );

      setError("");
      setSuccess("");


      if (
        item.image_url
      ) {
        try {
          await deleteProjectImage(
            item.image_url
          );
        } catch (
          storageError
        ) {
          console.error(
            "Gallery storage deletion failed:",
            storageError
          );
        }
      }


      await deleteGalleryItem(
        item.id
      );


      setGallery(
        (previous) =>
          previous.filter(
            (current) =>
              current.id !== item.id
          )
      );


      setSuccess(
        "Gallery image deleted successfully."
      );

    } catch (
      galleryError
    ) {

      console.error(
        "Error deleting gallery image:",
        galleryError
      );


      setError(
        galleryError instanceof Error
          ? galleryError.message
          : "Unable to delete gallery image."
      );

    } finally {

      setUploadingImage(
        false
      );
    }
  }


  /* =========================================================
     DELETE PROJECT
  ========================================================= */

  async function handleDeleteProject(
    project: FullProject
  ) {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${project.title}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setSuccess("");


      /* ===============================================
         COVER IMAGE CLEANUP
      =============================================== */

      if (
        project.cover_image
      ) {

        try {
          await deleteProjectImage(
            project.cover_image
          );
        } catch (
          imageError
        ) {
          console.error(
            "Cover image cleanup failed:",
            imageError
          );
        }
      }


      /* ===============================================
         GALLERY CLEANUP
      =============================================== */

      for (
        const image
        of project.gallery
      ) {

        if (
          image.image_url
        ) {

          try {
            await deleteProjectImage(
              image.image_url
            );
          } catch (
            imageError
          ) {
            console.error(
              "Gallery image cleanup failed:",
              imageError
            );
          }
        }
      }


      await deleteProject(
        project.id
      );


      setProjects(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== project.id
          )
      );


      setSuccess(
        "Project deleted successfully."
      );

    } catch (
      deleteError
    ) {

      console.error(
        "Error deleting project:",
        deleteError
      );


      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete project."
      );
    }
  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <div className="admin-projects-page">

        <div className="admin-page-header">

          <div>

            <h1>
              Projects
            </h1>

            <p>
              Loading projects...
            </p>

          </div>

        </div>

      </div>

    );
  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (

    <div className="admin-projects-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="admin-page-header">

        <div>

          <h1>
            Projects
          </h1>

          <p>
            Create, edit and manage your portfolio projects.
          </p>

        </div>


        <button
          type="button"
          className="admin-primary-button"
          onClick={
            handleCreate
          }
        >
          + Add Project
        </button>

      </div>


      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (

        <div className="admin-error-message">

          {error}

        </div>

      )}


      {success && (

        <div className="admin-success-message">

          {success}

        </div>

      )}


      {/* =====================================================
          FORM
      ===================================================== */}

      {isFormOpen && (

        <div className="project-form-wrapper">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="project-form-header">

            <h2>

              {editingProject
                ? `Edit ${editingProject.title}`
                : "Create Project"}

            </h2>


            <button
              type="button"
              className="admin-close-button"
              onClick={
                closeForm
              }
              disabled={
                saving ||
                uploadingImage
              }
            >
              ×
            </button>

          </div>


          {/* =================================================
              TABS
          ================================================= */}

          <div className="project-tabs">

            <button
              type="button"
              className={
                activeTab === "general"
                  ? "project-tab active"
                  : "project-tab"
              }
              onClick={() =>
                setActiveTab(
                  "general"
                )
              }
            >
              General
            </button>


            <button
              type="button"
              className={
                activeTab === "case-study"
                  ? "project-tab active"
                  : "project-tab"
              }
              onClick={() =>
                setActiveTab(
                  "case-study"
                )
              }
            >

              Case Study

              {formData.show_case_study && (
                <span className="tab-dot">
                  •
                </span>
              )}

            </button>

          </div>


          <form
            className="project-form"
            onSubmit={
              handleSubmit
            }
          >


            {/* =================================================
                GENERAL TAB
            ================================================= */}

            {activeTab === "general" && (

              <div className="project-tab-content">


                {/* =============================================
                    COVER IMAGE
                ============================================= */}

                <div className="form-group form-group-full">

                  <label>
                    Cover Image
                  </label>


                  <input
                    ref={
                      coverImageRef
                    }
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={
                      handleCoverImageUpload
                    }
                  />


                  {formData.cover_image ? (

                    <div className="project-image-preview">

                      <img
                        src={
                          formData.cover_image
                        }
                        alt={
                          formData.title ||
                          "Project cover"
                        }
                      />


                      <div className="project-image-actions">

                        <button
                          type="button"
                          className="admin-secondary-button"
                          disabled={
                            uploadingImage
                          }
                          onClick={() =>
                            coverImageRef.current?.click()
                          }
                        >
                          Replace Image
                        </button>


                        <button
                          type="button"
                          className="admin-danger-button"
                          disabled={
                            uploadingImage
                          }
                          onClick={
                            handleDeleteCoverImage
                          }
                        >
                          Delete Image
                        </button>

                      </div>

                    </div>

                  ) : (

                    <div className="project-image-upload-empty">

                      <strong>
                        No cover image
                      </strong>


                      <p>
                        Upload the project cover image.
                      </p>


                      <button
                        type="button"
                        className="admin-primary-button"
                        disabled={
                          uploadingImage
                        }
                        onClick={() =>
                          coverImageRef.current?.click()
                        }
                      >
                        Upload Image
                      </button>

                    </div>

                  )}

                </div>


                {/* =============================================
                    TITLE
                ============================================= */}

                <div className="form-group">

                  <label>
                    Project Title
                  </label>


                  <input
                    type="text"
                    name="title"
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter project title"
                    required
                  />

                </div>


                {/* =============================================
                    SLUG
                ============================================= */}

                <div className="form-group">

                  <label>
                    Slug
                  </label>


                  <input
                    type="text"
                    name="slug"
                    value={
                      formData.slug
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="project-slug"
                    required
                  />

                </div>


                {/* =============================================
                    CATEGORY
                ============================================= */}

                <div className="form-group">

                  <label>
                    Category
                  </label>


                  <input
                    type="text"
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="AI / Full Stack / Machine Learning"
                  />

                </div>


                {/* =============================================
                    DATE
                ============================================= */}

                <div className="form-group">

                  <label>
                    Project Date
                  </label>


                  <input
                    type="text"
                    name="date"
                    value={
                      formData.date
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="2026"
                  />

                </div>


                {/* =============================================
                    TAGLINE
                ============================================= */}

                <div className="form-group form-group-full">

                  <label>
                    Tagline
                  </label>


                  <input
                    type="text"
                    name="tagline"
                    value={
                      formData.tagline
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Short description of the project"
                  />

                </div>


                {/* =============================================
                    DESCRIPTION
                ============================================= */}

                <div className="form-group form-group-full">

                  <label>
                    Description
                  </label>


                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    rows={6}
                    placeholder="Describe the project..."
                  />

                </div>


                {/* =============================================
                    GITHUB
                ============================================= */}

                <div className="form-group">

                  <label>
                    GitHub URL
                  </label>


                  <input
                    type="url"
                    name="github_url"
                    value={
                      formData.github_url
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://github.com/..."
                  />

                </div>


                {/* =============================================
                    LIVE DEMO
                ============================================= */}

                <div className="form-group">

                  <label>
                    Live Demo URL
                  </label>


                  <input
                    type="url"
                    name="live_url"
                    value={
                      formData.live_url
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://..."
                  />

                </div>


                {/* =============================================
                    BUTTON CONTROLS
                ============================================= */}

                <div className="project-settings-box">

                  <h3>
                    Project Buttons
                  </h3>


                  <label className="form-checkbox">

                    <input
                      type="checkbox"
                      name="show_github_button"
                      checked={
                        formData.show_github_button
                      }
                      onChange={
                        handleChange
                      }
                    />

                    Show GitHub Button

                  </label>


                  <label className="form-checkbox">

                    <input
                      type="checkbox"
                      name="show_live_demo_button"
                      checked={
                        formData.show_live_demo_button
                      }
                      onChange={
                        handleChange
                      }
                    />

                    Show Live Demo Button

                  </label>

                </div>


                {/* =============================================
                    CASE STUDY CONTROL
                ============================================= */}

                <div className="project-settings-box">

                  <h3>
                    Case Study
                  </h3>


                  <label className="form-checkbox">

                    <input
                      type="checkbox"
                      name="show_case_study"
                      checked={
                        formData.show_case_study
                      }
                      onChange={
                        handleChange
                      }
                    />

                    Enable Case Study

                  </label>


                  <p>
                    Enable this to show the detailed
                    Case Study page for this project.
                  </p>

                </div>


                {/* =============================================
                    STATUS
                ============================================= */}

                <div className="project-checkbox-row">

                  <label className="form-checkbox">

                    <input
                      type="checkbox"
                      name="featured"
                      checked={
                        formData.featured
                      }
                      onChange={
                        handleChange
                      }
                    />

                    Featured Project

                  </label>


                  <label className="form-checkbox">

                    <input
                      type="checkbox"
                      name="published"
                      checked={
                        formData.published
                      }
                      onChange={
                        handleChange
                      }
                    />

                    Published

                  </label>

                </div>

              </div>

            )}


            {/* =================================================
                CASE STUDY TAB
            ================================================= */}

            {activeTab === "case-study" && (

              <div className="project-tab-content">


                {!editingProject ? (

                  <div className="admin-info-message">

                    Save the project first.
                    Then edit it again to manage
                    the Case Study.

                  </div>

                ) : !formData.show_case_study ? (

                  <div className="admin-info-message">

                    Go to the General tab and enable
                    <strong>
                      {" "}Case Study
                    </strong>
                    first.

                  </div>

                ) : (

                  <>


                    {/* =========================================
                        CASE STUDY TITLE
                    ========================================= */}

                    <div className="form-group form-group-full">

                      <label>
                        Case Study Title
                      </label>


                      <input
                        type="text"
                        name="title"
                        value={
                          caseStudyData.title
                        }
                        onChange={
                          handleCaseStudyChange
                        }
                        placeholder={
                          formData.title
                        }
                      />

                    </div>


                    {/* =========================================
                        INTRODUCTION
                    ========================================= */}

                    <div className="form-group form-group-full">

                      <label>
                        Introduction
                      </label>


                      <textarea
                        name="introduction"
                        value={
                          caseStudyData.introduction
                        }
                        onChange={
                          handleCaseStudyChange
                        }
                        rows={6}
                        placeholder="Introduce the project..."
                      />

                    </div>


                    {/* =========================================
                        OVERVIEW
                    ========================================= */}

                    <div className="form-group form-group-full">

                      <label>
                        Overview
                      </label>


                      <textarea
                        name="overview"
                        value={
                          caseStudyData.overview
                        }
                        onChange={
                          handleCaseStudyChange
                        }
                        rows={7}
                        placeholder="Give an overview of the project..."
                      />

                    </div>


                    {/* =========================================
                        PROBLEM
                    ========================================= */}

                    <div className="form-group form-group-full">

                      <label>
                        Problem
                      </label>


                      <textarea
                        name="problem"
                        value={
                          caseStudyData.problem
                        }
                        onChange={
                          handleCaseStudyChange
                        }
                        rows={7}
                        placeholder="What problem were you solving?"
                      />

                    </div>


                    {/* =========================================
                        GOALS
                    ========================================= */}

                    <div className="form-group form-group-full">

                      <label>
                        Goals & Objectives
                      </label>


                      <textarea
                        name="goals"
                        value={
                          caseStudyData.goals
                        }
                        onChange={
                          handleCaseStudyChange
                        }
                        rows={7}
                        placeholder="What were the goals and objectives?"
                      />

                    </div>


                    {/* =========================================
                        SOLUTION
                    ========================================= */}

                    <div className="form-group form-group-full">

                      <label>
                        Solution
                      </label>


                      <textarea
                        name="solution"
                        value={
                          caseStudyData.solution
                        }
                        onChange={
                          handleCaseStudyChange
                        }
                        rows={7}
                        placeholder="How did you solve the problem?"
                      />

                    </div>


                    {/* =========================================
                        ROLE
                    ========================================= */}

                    <div className="form-group form-group-full">

                      <label>
                        My Role & Contribution
                      </label>


                      <textarea
                        name="role"
                        value={
                          caseStudyData.role
                        }
                        onChange={
                          handleCaseStudyChange
                        }
                        rows={7}
                        placeholder="Describe your role and contribution..."
                      />

                    </div>


                    {/* =========================================
                        GALLERY
                    ========================================= */}

                    <div className="case-study-manager">

                      <div className="case-study-manager-header">

                        <div>

                          <h3>
                            Project Gallery
                          </h3>


                          <p>
                            Upload screenshots and project visuals.
                          </p>

                        </div>


                        <input
                          ref={
                            galleryInputRef
                          }
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={
                            handleGalleryUpload
                          }
                        />


                        <button
                          type="button"
                          className="admin-primary-button"
                          disabled={
                            uploadingImage
                          }
                          onClick={() =>
                            galleryInputRef.current?.click()
                          }
                        >

                          {uploadingImage
                            ? "Uploading..."
                            : "Upload Images"}

                        </button>

                      </div>


                      {gallery.length === 0 ? (

                        <div className="admin-info-message">

                          No gallery images yet.

                        </div>

                      ) : (

                        <div className="case-study-gallery-grid">

                          {gallery.map(
                            (item) => (

                              <div
                                key={
                                  item.id
                                }
                                className="case-study-gallery-item"
                              >

                                <img
                                  src={
                                    item.image_url
                                  }
                                  alt={
                                    item.caption ||
                                    formData.title ||
                                    "Project gallery image"
                                  }
                                />


                                <div className="gallery-item-content">

                                  <input
                                    type="text"
                                    value={
                                      item.caption ||
                                      ""
                                    }
                                    placeholder="Add image caption..."
                                    onChange={(event) =>
                                      setGallery(
                                        (previous) =>
                                          previous.map(
                                            (current) =>
                                              current.id === item.id
                                                ? {
                                                    ...current,
                                                    caption:
                                                      event.target.value,
                                                  }
                                                : current
                                          )
                                      )
                                    }
                                    onBlur={(event) =>
                                      void handleGalleryCaptionChange(
                                        item,
                                        event.target.value
                                      )
                                    }
                                  />


                                  <div className="gallery-item-actions">

                                    <button
                                      type="button"
                                      className="admin-secondary-button"
                                      disabled={
                                        uploadingImage
                                      }
                                      onClick={() =>
                                        void handleReplaceGalleryImage(
                                          item
                                        )
                                      }
                                    >
                                      Replace
                                    </button>


                                    <button
                                      type="button"
                                      className="admin-danger-button"
                                      disabled={
                                        uploadingImage
                                      }
                                      onClick={() =>
                                        void handleDeleteGalleryImage(
                                          item
                                        )
                                      }
                                    >
                                      Delete
                                    </button>

                                  </div>

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      )}

                    </div>

                  </>

                )}

              </div>

            )}


            {/* =================================================
                FORM ACTIONS
            ================================================= */}

            <div className="project-form-actions">

              <button
                type="button"
                className="admin-secondary-button"
                onClick={
                  closeForm
                }
                disabled={
                  saving ||
                  uploadingImage
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                className="admin-primary-button"
                disabled={
                  saving ||
                  uploadingImage
                }
              >

                {saving
                  ? "Saving..."
                  : editingProject
                    ? "Save Project"
                    : "Create Project"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* =====================================================
          PROJECT LIST
      ===================================================== */}

      <div className="admin-projects-list">

        {projects.length === 0 ? (

          <div className="admin-empty-state">

            <h3>
              No projects found
            </h3>

            <p>
              Create your first project to get started.
            </p>

          </div>

        ) : (

          projects.map(
            (project) => (

              <article
                key={
                  project.id
                }
                className="admin-project-card"
              >


                {/* =============================================
                    IMAGE
                ============================================= */}

                <div className="admin-project-image">

                  {project.cover_image ? (

                    <img
                      src={
                        project.cover_image
                      }
                      alt={
                        project.title
                      }
                    />

                  ) : (

                    <div className="admin-project-image-placeholder">

                      No Image

                    </div>

                  )}

                </div>


                {/* =============================================
                    CONTENT
                ============================================= */}

                <div className="admin-project-content">


                  <div className="admin-project-top">

                    <div>

                      <h3>
                        {project.title}
                      </h3>


                      {project.category && (

                        <p className="admin-project-category">

                          {project.category}

                        </p>

                      )}

                    </div>


                    <div className="admin-project-statuses">

                      <span
                        className={
                          project.published
                            ? "status published"
                            : "status draft"
                        }
                      >

                        {project.published
                          ? "Published"
                          : "Draft"}

                      </span>


                      {project.featured && (

                        <span className="status featured">
                          Featured
                        </span>

                      )}


                      {project.show_case_study && (

                        <span className="status case-study">
                          Case Study
                        </span>

                      )}

                    </div>

                  </div>


                  {project.tagline && (

                    <p className="admin-project-tagline">

                      {project.tagline}

                    </p>

                  )}


                  <div className="admin-project-meta">

                    {project.date && (

                      <span>
                        {project.date}
                      </span>

                    )}


                    <span>
                      /{project.slug}
                    </span>

                  </div>


                  {project.technologies.length > 0 && (

                    <div className="admin-project-technologies">

                      {project.technologies
                        .slice(
                          0,
                          5
                        )
                        .map(
                          (technology) => (

                            <span
                              key={
                                technology.id
                              }
                            >

                              {
                                technology.technology
                              }

                            </span>

                          )
                        )}

                    </div>

                  )}


                  <div className="admin-project-actions">

                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() =>
                        handleEdit(
                          project
                        )
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      className="admin-danger-button"
                      onClick={() =>
                        void handleDeleteProject(
                          project
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </article>

            )
          )

        )}

      </div>

    </div>
  );
}