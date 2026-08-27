import "./Timeline.css";

import { useEffect, useState } from "react";

import TimelineCard from "./TimelineCard";

import { getFullRoles } from "../../services/roles.service";

import type { FullRole } from "../../types/roles";

export default function Timeline() {
  const [roles, setRoles] = useState<FullRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoles() {
      try {
        const data = await getFullRoles();
        setRoles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadRoles();
  }, []);

  if (loading) return null;

  return (
    <section className="timeline-section-page">
      <div className="timeline-header">
        <h1>Roles & Responsibilities</h1>

        <p>
          My professional journey, leadership experience,
          internships, education, and extracurricular
          milestones.
        </p>
      </div>

      <div className="timeline">
        {roles.map((role, index) => (
          <TimelineCard
            key={role.id}
            role={role}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}