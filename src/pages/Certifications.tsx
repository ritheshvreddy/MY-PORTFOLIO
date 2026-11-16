import Certifications from "../components/certifications/Certifications";
import { metaFor, usePageMeta } from "../seo/usePageMeta";

export default function CertificationsPage() {
  usePageMeta(metaFor("/certifications"));

  return <Certifications />;
}
