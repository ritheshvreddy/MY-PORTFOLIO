import "./Certifications.css";

import type { Certification } from "../../types/certification";

import {
  FaExternalLinkAlt,
  FaArrowRight,
} from "react-icons/fa";

interface CertificationCardProps {
  certification: Certification;
}

export default function CertificationCard({
  certification,
}: CertificationCardProps) {
  return (
    <article className="certification-card">
      <div className="certification-content">
        <p className="certification-provider">
          {certification.organization}
        </p>

        <h2>{certification.title}</h2>

        <ul className="certification-points">
          {certification.points.map((point) => (
            <li key={point.id}>
              {point.point}
            </li>
          ))}
        </ul>

        {certification.credential_url && (
          <a
            href={certification.credential_url}
            target="_blank"
            rel="noreferrer"
            className="credential-btn"
          >
            View Credential

            <FaArrowRight />
          </a>
        )}
      </div>

      <div className="certification-icon">
        <FaExternalLinkAlt />
      </div>
    </article>
  );
}