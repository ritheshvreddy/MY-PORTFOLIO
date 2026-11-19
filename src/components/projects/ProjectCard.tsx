import "./Projects.css";

import { Link } from "react-router-dom";

import {
  FaGithub,
  FaExternalLinkAlt,
  FaArrowRight,
  FaCalendarAlt,
} from "react-icons/fa";

import type {
  FullProject,
} from "../../types/project";
import CoverImage from "./CoverImage";


interface ProjectCardProps {
  project: FullProject;

  /*
    "grid": image on top (home page, 3 per row).
    "row":  image beside the details, one project per row
            (projects page). Stacks like "grid" on phones.
  */
  layout?: "grid" | "row";
}


export default function ProjectCard({
  project,
  layout = "grid",
}: ProjectCardProps) {

  const isRow =
    layout === "row";

  /* Row cards have room for more tags */
  const tagLimit =
    isRow ? 6 : 4;

  return (

    <article
      className={
        isRow
          ? "project-card project-card--row"
          : "project-card"
      }
    >


      {/* ================= IMAGE ================= */}

      <div className="project-banner">

        {project.cover_image ? (

          <CoverImage
            src={project.cover_image}
            alt={project.title}
            loading="lazy"
          />

        ) : (

          <div className="project-image-placeholder">

            No Image Available

          </div>

        )}


        {/* ================= DATE ================= */}

        {project.date && (

          <div className="project-date">

            <FaCalendarAlt />

            <span>

              {project.date}

            </span>

          </div>

        )}

      </div>


      {/* ================= CONTENT ================= */}

      <div className="project-body">


        {/* CATEGORY */}

        {project.category && (

          <p className="project-category">

            {project.category}

          </p>

        )}


        {/* TITLE */}

        <h3>

          {project.title}

        </h3>


        {/* TAGLINE */}

        {project.tagline && (

          <p className="project-tagline">

            {project.tagline}

          </p>

        )}


        {/* DESCRIPTION (row cards only) */}

        {isRow && project.description && (

          <p className="project-card-description">

            {project.description}

          </p>

        )}


        {/* TECHNOLOGIES */}

        {project.technologies.length > 0 && (

          <div className="project-technologies">

            {project.technologies
              .slice(0, tagLimit)
              .map((tech) => (

                <span
                  key={
                    tech.id ||
                    tech.technology
                  }
                >

                  {tech.technology}

                </span>

              ))}


            {project.technologies.length > tagLimit && (

              <span
                className="project-tech-more"
                title={project.technologies
                  .slice(tagLimit)
                  .map((tech) => tech.technology)
                  .join(", ")}
              >
                +{project.technologies.length - tagLimit}
              </span>

            )}

          </div>

        )}


        {/* ================= BUTTONS ================= */}

        <div className="project-buttons">


          {/* GITHUB */}

          {project.show_github_button !== false &&
            project.github_url && (

            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="project-btn github"
            >

              <FaGithub />

              GitHub

            </a>

          )}


          {/* LIVE DEMO */}

          {project.show_live_demo_button !== false &&
            project.live_url && (

            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="project-btn live"
            >

              <FaExternalLinkAlt />

              Live Demo

            </a>

          )}


          {/* PROJECT DETAILS */}

          <Link
            to={`/projects/${project.slug}`}
            className="project-btn details"
          >

            View Details

            <FaArrowRight />

          </Link>


        </div>


      </div>


    </article>

  );

}