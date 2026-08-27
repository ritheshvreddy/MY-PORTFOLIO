import { FaMapMarkerAlt } from "react-icons/fa";
import type { FullRole } from "../../types/roles";

interface RoleCardProps {
  role: FullRole;
}

export default function RoleCard({ role }: RoleCardProps) {
  return (
    <article className="role-card">
      <div className="role-card-header">
        <div>

          <h2>{role.position}</h2>

          <h3>{role.company}</h3>

          {role.location && (
            <div className="role-location">
              <FaMapMarkerAlt />
              <span>{role.location}</span>
            </div>
          )}

        </div>

        <span className="role-date">
          {role.duration}
        </span>
      </div>

      <div className="role-divider" />

      <div className="role-section">

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

      <div className="role-divider" />

      <div className="role-section">

        <h4>Skills</h4>

        <div className="role-skills">
          {role.skills.map((skill) => (
            <span key={skill.id}>
              {skill.skill}
            </span>
          ))}
        </div>

      </div>

    </article>
  );
}