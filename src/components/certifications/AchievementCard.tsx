import "./Certifications.css";

import type { Certification } from "../../types/certification";

import { FaArrowRight } from "react-icons/fa";

interface AchievementCardProps {
  achievement: Certification;
}

export default function AchievementCard({
  achievement,
}: AchievementCardProps) {
  return (
    <article className="achievement-card">
      <p className="achievement-org">
        {achievement.organization}
      </p>

      <h3>{achievement.title}</h3>

      <p className="achievement-description">
        {achievement.points[0]?.point}
      </p>

      {achievement.credential_url && (
        <a
          href={achievement.credential_url}
          target="_blank"
          rel="noreferrer"
          className="credential-btn small"
        >
          View Credential

          <FaArrowRight />
        </a>
      )}
    </article>
  );
}