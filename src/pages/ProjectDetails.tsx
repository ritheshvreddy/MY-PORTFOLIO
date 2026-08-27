import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaGithub,
  FaExternalLinkAlt,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  getProjectBySlug,
} from "../services/projects.service";

import type {
  FullProject,
} from "../types/project";

import "../components/projects/Projects.css";


/* =========================================================
   PROJECT DETAILS PAGE
========================================================= */

export default function ProjectDetails() {

  const { slug } =
    useParams<{
      slug: string;
    }>();


  const [
    project,
    setProject,
  ] =
    useState<FullProject | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState("");


  /* =========================================================
     LOAD PROJECT
  ========================================================= */

  useEffect(() => {

    async function loadProject() {

      if (!slug) {

        setError(
          "Project not found."
        );

        setLoading(false);

        return;

      }


      try {

        setLoading(true);

        setError("");


        const data =
          await getProjectBySlug(
            slug
          );


        if (!data) {

          setProject(null);

          setError(
            "Project not found."
          );

          return;

        }


        setProject(
          data
        );

      } catch (
        loadError
      ) {

        console.error(
          "Error loading project:",
          loadError
        );


        setProject(null);

        setError(
          "Unable to load project."
        );

      } finally {

        setLoading(false);

      }

    }


    void loadProject();

  }, [slug]);


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <main className="project-details-page">

        <div className="project-details-container">

          <div className="project-details-loading">

            <p>
              Loading project...
            </p>

          </div>

        </div>

      </main>

    );

  }


  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (
    error ||
    !project
  ) {

    return (

      <main className="project-details-page">

        <div className="project-details-container">

          <Link
            to="/projects"
            className="back-projects"
          >

            <FaArrowLeft />

            Back to Projects

          </Link>


          <div className="project-details-not-found">

            <h1>
              Project Not Found
            </h1>

            <p>
              The project you are looking for
              does not exist.
            </p>

          </div>

        </div>

      </main>

    );

  }


  /* =========================================================
     CASE STUDY
  ========================================================= */

  const caseStudy =
    project.case_study;


  const hasCaseStudy =
    project.show_case_study === true &&
    caseStudy !== null;


  /* =========================================================
     PAGE
  ========================================================= */

  return (

    <main className="project-details-page">

      <div className="project-details-container">


        {/* ===================================================
            BACK TO PROJECTS
        =================================================== */}

        <Link
          to="/projects"
          className="back-projects"
        >

          <FaArrowLeft />

          Back to Projects

        </Link>


        {/* ===================================================
            HERO
        =================================================== */}

        <section className="project-details-hero">


          {/* ================= HERO CONTENT ================= */}

          <div className="project-details-content">

            {project.category && (

              <p className="project-category">
                {project.category}
              </p>

            )}


            <h1>
              {project.title}
            </h1>


            {project.tagline && (

              <p className="project-details-tagline">
                {project.tagline}
              </p>

            )}


            {/* ================= DATE ================= */}

            {project.date && (

              <div className="project-details-meta">

                <span>

                  <FaCalendarAlt />

                  {project.date}

                </span>

              </div>

            )}


            {/* ================= BUTTONS ================= */}

            <div className="project-details-buttons">


              {project.show_github_button &&
                project.github_url && (

                  <a
                    href={
                      project.github_url
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="project-btn github"
                  >

                    <FaGithub />

                    View GitHub

                  </a>

                )}


              {project.show_live_demo_button &&
                project.live_url && (

                  <a
                    href={
                      project.live_url
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="project-btn live"
                  >

                    <FaExternalLinkAlt />

                    Live Demo

                  </a>

                )}

            </div>

          </div>


          {/* ================= COVER IMAGE ================= */}

          {project.cover_image && (

            <div className="project-details-image">

              <img
                src={
                  project.cover_image
                }
                alt={
                  project.title
                }
              />

            </div>

          )}

        </section>


        {/* ===================================================
            CASE STUDY ENABLED
        =================================================== */}

        {hasCaseStudy && caseStudy && (

          <div className="project-case-study">


            {/* =================================================
                CASE STUDY HEADER
            ================================================= */}

            <section className="case-study-block case-study-introduction">

              <p className="case-study-eyebrow">
                Case Study
              </p>


              <h2>
                {caseStudy.title ||
                  project.title}
              </h2>


              {caseStudy.introduction && (

                <p className="case-study-lead">

                  {caseStudy.introduction}

                </p>

              )}

            </section>


            {/* =================================================
                OVERVIEW
            ================================================= */}

            {caseStudy.overview && (

              <section className="case-study-block">

                <h2>
                  Overview
                </h2>


                <div className="case-study-text">

                  <p>
                    {caseStudy.overview}
                  </p>

                </div>

              </section>

            )}


            {/* =================================================
                PROBLEM
            ================================================= */}

            {caseStudy.problem && (

              <section className="case-study-block">

                <h2>
                  Problem
                </h2>


                <div className="case-study-text">

                  <p>
                    {caseStudy.problem}
                  </p>

                </div>

              </section>

            )}


            {/* =================================================
                GOALS
            ================================================= */}

            {caseStudy.goals && (

              <section className="case-study-block">

                <h2>
                  Goals & Objectives
                </h2>


                <div className="case-study-text">

                  <p>
                    {caseStudy.goals}
                  </p>

                </div>

              </section>

            )}


            {/* =================================================
                SOLUTION
            ================================================= */}

            {caseStudy.solution && (

              <section className="case-study-block">

                <h2>
                  Solution
                </h2>


                <div className="case-study-text">

                  <p>
                    {caseStudy.solution}
                  </p>

                </div>

              </section>

            )}


            {/* =================================================
                ROLE
            ================================================= */}

            {caseStudy.role && (

              <section className="case-study-block">

                <h2>
                  My Role & Contribution
                </h2>


                <div className="case-study-text">

                  <p>
                    {caseStudy.role}
                  </p>

                </div>

              </section>

            )}


            {/* =================================================
                TECHNOLOGIES
            ================================================= */}

            {project.technologies.length > 0 && (

              <section className="case-study-block">

                <h2>
                  Technologies Used
                </h2>


                <div className="project-technologies">

                  {project.technologies.map(
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

              </section>

            )}


            {/* =================================================
                GALLERY
            ================================================= */}

            {project.gallery.length > 0 && (

              <section className="case-study-block">

                <h2>
                  Project Gallery
                </h2>


                <div className="project-gallery-grid">

                  {project.gallery.map(
                    (image) => (

                      <figure
                        key={
                          image.id
                        }
                        className="project-gallery-item"
                      >

                        <img
                          src={
                            image.image_url
                          }
                          alt={
                            image.caption ||
                            project.title
                          }
                          loading="lazy"
                        />


                        {image.caption && (

                          <figcaption>
                            {image.caption}
                          </figcaption>

                        )}

                      </figure>

                    )
                  )}

                </div>

              </section>

            )}

          </div>

        )}


        {/* ===================================================
            NO CASE STUDY
        =================================================== */}

        {!hasCaseStudy && (

          <>

            {/* ================= DESCRIPTION ================= */}

            {project.description && (

              <section className="project-details-description">

                <h2>
                  About the Project
                </h2>


                <p>
                  {project.description}
                </p>

              </section>

            )}


            {/* ================= TECHNOLOGIES ================= */}

            {project.technologies.length > 0 && (

              <section className="project-details-tech">

                <h2>
                  Technologies Used
                </h2>


                <div className="project-technologies">

                  {project.technologies.map(
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

              </section>

            )}


            {/* ================= GALLERY ================= */}

            {project.gallery.length > 0 && (

              <section className="project-details-gallery">

                <h2>
                  Project Gallery
                </h2>


                <div className="project-gallery-grid">

                  {project.gallery.map(
                    (image) => (

                      <figure
                        key={
                          image.id
                        }
                        className="project-gallery-item"
                      >

                        <img
                          src={
                            image.image_url
                          }
                          alt={
                            image.caption ||
                            project.title
                          }
                          loading="lazy"
                        />


                        {image.caption && (

                          <figcaption>
                            {image.caption}
                          </figcaption>

                        )}

                      </figure>

                    )
                  )}

                </div>

              </section>

            )}

          </>

        )}

      </div>

    </main>

  );
}