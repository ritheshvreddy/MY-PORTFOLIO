import "./Roles.css";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import RoleCard from "./RoleCard";

import { getPreviewRoles } from "../../services/rolesPreview.service";
import type { FullRole } from "../../types/roles";

export default function RolesPreview() {
  const [roles, setRoles] = useState<FullRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoles() {
      try {
        const data = await getPreviewRoles();
        setRoles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadRoles();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <section className="roles-page roles-preview-page">
      <div className="roles-header">
        <h1>Role & Responsibilities</h1>

        <p>
          A quick overview of my recent professional experience.
        </p>
      </div>

      <div className="roles-preview">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
          />
        ))}
      </div>

      <div className="roles-view-all">
        <Link
          to="/roles"
          className="roles-button"
        >
          View All Roles
        </Link>
      </div>
    </section>
  );
}