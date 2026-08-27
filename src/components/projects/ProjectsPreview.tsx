import "./Projects.css";

import { Link } from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import ProjectCard from "./ProjectCard";

import {
  getFeaturedFullProjects,
} from "../../services/projects.service";

import type {
  FullProject,
} from "../../types/project";


export default function ProjectsPreview() {

  const [projects, setProjects] =
    useState<FullProject[]>([]);

  const [loading, setLoading] =
    useState(true);


  /* ================= LOAD PROJECTS ================= */

  useEffect(() => {

    async function loadProjects() {

      try {

        const data =
          await getFeaturedFullProjects();

        setProjects(data);

      } catch (error) {

        console.error(
          "Error loading featured projects:",
          error
        );

      } finally {

        setLoading(false);

      }

    }

    loadProjects();

  }, []);


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