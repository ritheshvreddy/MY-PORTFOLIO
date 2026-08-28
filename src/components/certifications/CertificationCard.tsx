import "./Certifications.css";

import type {
  Certification,
} from "../../types/certification";

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
    <article className="course-certification-card">

      <div className="course-certification-content">

        {/* ORGANIZATION */}

        <p className="course-certification-provider">
          {certification.organization}
        </p>


        {/* TITLE */}

        <h2>
          {certification.title}
        </h2>


        {/* POINTS */}

        <ul className="course-certification-points">

          {certification.points.map(
            (point) => (
              <li key={point.id}>
                {point.point}
              </li>
            )
          )}

        </ul>


        {/* CREDENTIAL */}

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


      {/* ICON */}

      <div className="course-certification-icon">
        <FaExternalLinkAlt />
      </div>

    </article>
  );
}