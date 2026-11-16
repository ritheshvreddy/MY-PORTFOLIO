import "./Certifications.css";

import CertificationCard from "./CertificationCard";
import AchievementCard from "./AchievementCard";

import { useCachedData } from "../../lib/cache";

import { getCertifications } from "../../services/certifications.service";

export default function Certifications() {

  const { data, loading } = useCachedData(
    "certifications:all",
    getCertifications
  );

  const certifications = data ?? [];

  if (loading) {
    return (
      <section className="certifications-page">
        Loading...
      </section>
    );
  }

  const courseCertifications =
    certifications.filter(
      cert => cert.type === "course"
    );

  const achievements =
    certifications.filter(
      cert =>
        cert.type === "achievement" ||
        cert.type === "leadership" ||
        cert.type === "award"
    );

  return (
    <section className="certifications-page">

      <div className="certifications-header">

        <h1>Certifications</h1>

        <p>
          A collection of professional certifications,
          technical learning, leadership positions
          and achievements throughout my academic
          and professional journey.
        </p>

      </div>

      {/* ====================================== */}

      <section className="course-section">

        <h2 className="section-title">

          Course Certifications

        </h2>

        <div className="course-list">

          {courseCertifications.map(certification => (

            <CertificationCard
              key={certification.id}
              certification={certification}
            />

          ))}

        </div>

      </section>

      {/* ====================================== */}

      <section className="achievement-section">

        <h2 className="section-title">

          Achievements & Recognition

        </h2>

        <div className="achievement-grid">

          {achievements.map(achievement => (

            <AchievementCard
              key={achievement.id}
              achievement={achievement}
            />

          ))}

        </div>

      </section>

    </section>
  );
}