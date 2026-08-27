import { FaMapMarkerAlt } from "react-icons/fa";

import type { FullRole } from "../../types/roles";

interface TimelineCardProps {
  role: FullRole;
  index: number;
}

export default function TimelineCard({
  role,
  index,
}: TimelineCardProps) {
  const isLeft = index % 2 === 0;

  return (
    <div
      className={`timeline-item ${
        isLeft ? "left" : "right"
      }`}
    >
      <div className="timeline-marker">
        <span className="timeline-dot" />
      </div>

      <article className="timeline-card">
        <div className="timeline-card-header">
          <div className="timeline-heading">
            <div className="timeline-title-row">
              <h2>{role.position}</h2>

              <span className="timeline-date">
                {role.duration}
              </span>
            </div>

            <h3>{role.company}</h3>

            {role.location && (
              <div className="timeline-location">
                <FaMapMarkerAlt />

                <span>{role.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="timeline-divider" />

        <div className="timeline-section">
          <h4>Role & Responsibilities</h4>

          {role.responsibilities.length === 1 ? (
            <p>
              {role.responsibilities[0].responsibility}
            </p>
          ) : (
            <ul>
              {role.responsibilities.map((item) => (
                <li key={item.id}>
                  {item.responsibility}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="timeline-divider" />

        <div className="timeline-section">
          <h4>Skills</h4>

          <div className="timeline-skills">
            {role.skills.map((skill) => (
              <span key={skill.id}>
                {skill.skill}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}