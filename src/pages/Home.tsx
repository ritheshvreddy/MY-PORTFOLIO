import "./Home.css";

import Hero from "../components/home/Hero";
import Skills from "../components/skills/Skills";
import RolesPreview from "../components/roles/RolesPreview";
import ProjectsPreview from "../components/projects/ProjectsPreview";
import Contact from "../components/about/Contact";

export default function Home() {
  return (
    <main className="home-page">
      <Hero />

      <Skills />

      <RolesPreview />

      <ProjectsPreview />

      <Contact />
    </main>
  );
}