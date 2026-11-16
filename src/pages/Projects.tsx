import Projects from "../components/projects/Projects";
import { metaFor, usePageMeta } from "../seo/usePageMeta";

export default function ProjectsPage() {
  usePageMeta(metaFor("/projects"));

  return <Projects />;
}
