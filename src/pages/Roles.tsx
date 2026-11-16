import Timeline from "../components/roles/Timeline";
import { metaFor, usePageMeta } from "../seo/usePageMeta";

export default function RolesPage() {
  usePageMeta(metaFor("/roles"));

  return <Timeline />;
}
