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


interface ProjectCardProps {
  project: FullProject;
}


export default function ProjectCard({
  project,
}: ProjectCardProps) {

  return (

    <article className="project-card">


      {/* ================= IMAGE ================= */}

      <div className="project-banner">

        {project.cover_image ? (

          <img
            src={project.cover_image}
            alt={project.title}
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


        {/* TECHNOLOGIES */}

        {project.technologies.length > 0 && (

          <div className="project-technologies">

            {project.technologies
              .slice(0, 4)
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

          </div>

        )}


        {/* ================= BUTTONS ================= */}

        <div className="project-buttons">


          {/* GITHUB */}

          {project.github_url && (

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

          {project.live_url && (

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