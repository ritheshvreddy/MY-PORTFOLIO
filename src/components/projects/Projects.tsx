import "./Projects.css";

import ProjectCard from "./ProjectCard";

import { useCachedData } from "../../lib/cache";

import {
  getFullProjects,
} from "../../services/projects.service";


/* Only show published projects */

async function getPublishedFullProjects() {

  const data =
    await getFullProjects();

  return data.filter(
    (project) =>
      project.published === true
  );

}


export default function Projects() {

  const {
    data,
    loading,
  } = useCachedData(
    "projects:published",
    getPublishedFullProjects
  );

  const projects = data ?? [];


  /* ================= LOADING ================= */

  if (loading) {

    return (

      <section className="projects-page">

        <div className="projects-header">

          <h1>
            Projects
          </h1>

          <p>
            Loading projects...
          </p>

        </div>

      </section>

    );

  }


  /* ================= PAGE ================= */

  return (

    <section className="projects-page">


      {/* ================= HEADER ================= */}

      <div className="projects-header">

        <h1>
          Projects
        </h1>

        <p>
          A collection of AI systems, full-stack
          applications, machine learning models,
          research work, and software products
          I've designed and developed.
        </p>

      </div>


      {/* ================= ALL PROJECTS (one per row) ================= */}

      {projects.length > 0 && (

        <div className="projects-list">

          {projects.map(
            (project) => (

              <ProjectCard
                key={project.id}
                project={project}
                layout="row"
              />

            )
          )}

        </div>

      )}


      {/* ================= EMPTY STATE ================= */}

      {projects.length === 0 && (

        <div className="projects-empty">

          <p>
            No projects available yet.
          </p>

        </div>

      )}

    </section>

  );

}
