import "./Projects.css";

import { Link } from "react-router-dom";

import ProjectCard from "./ProjectCard";

import { useCachedData } from "../../lib/cache";

import {
  getFeaturedFullProjects,
} from "../../services/projects.service";


export default function ProjectsPreview() {

  const {
    data,
    loading,
  } = useCachedData(
    "projects:featured",
    getFeaturedFullProjects
  );

  const projects = data ?? [];


  /* ================= LOADING ================= */

  if (loading) {

    return null;

  }


  /* ================= UI ================= */

  return (

    <section className="projects-page projects-preview-page">


      {/* ================= HEADER ================= */}

      <div className="projects-header">

        <h1>
          Featured Projects
        </h1>

        <p>
          A selection of AI systems and software
          products I've designed and developed.
        </p>

      </div>


      {/* ================= PROJECTS ================= */}

      <div className="projects-preview">

        {projects.length > 0 ? (

          projects.map((project) => (

            <ProjectCard
              key={project.id}
              project={project}
            />

          ))

        ) : (

          <p className="projects-empty">

            No featured projects available.

          </p>

        )}

      </div>


      {/* ================= VIEW ALL ================= */}

      <div className="projects-view-all">

        <Link
          to="/projects"
          className="projects-button"
        >

          View All Projects

        </Link>

      </div>


    </section>

  );

}