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


interface FeaturedProjectProps {
  project: FullProject;
}


export default function FeaturedProject({
  project,
}: FeaturedProjectProps) {

  return (

    <article className="featured-project">


      {/* ================= BANNER ================= */}

      <div className="featured-banner">

        {project.cover_image ? (

          <CoverImage
            src={project.cover_image}
            alt={project.title}
          />

        ) : (

          <div className="project-image-placeholder">

            No Image Available

          </div>

        )}


        {/* DATE */}

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

      <div className="featured-body">


        {/* CATEGORY */}

        {project.category && (

          <p className="project-category">

            {project.category}

          </p>

        )}


        {/* TITLE */}

        <h2>

          {project.title}

        </h2>


        {/* TAGLINE */}

        {project.tagline && (

          <h3>

            {project.tagline}

          </h3>

        )}


        {/* DESCRIPTION */}

        {project.description && (

          <p className="project-description">

            {project.description}

          </p>

        )}


        {/* ================= TECHNOLOGIES ================= */}

        {project.technologies.length > 0 && (

          <div className="project-technologies">

            {project.technologies.map(
              (tech) => (

                <span
                  key={
                    tech.id ||
                    tech.technology
                  }
                >

                  {tech.technology}

                </span>

              )
            )}

          </div>

        )}


        {/* ================= HIGHLIGHTS ================= */}

        {project.highlights.length > 0 && (

          <div className="project-highlights">

            {project.highlights.map(
              (item) => (

                <div
                  key={
                    item.id ||
                    item.highlight
                  }
                >

                  ✓ {item.highlight}

                </div>

              )
            )}

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