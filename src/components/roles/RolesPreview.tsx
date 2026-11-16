import "./Roles.css";

import { Link } from "react-router-dom";

import RoleCard from "./RoleCard";

import { useCachedData } from "../../lib/cache";
import { getPreviewRoles } from "../../services/rolesPreview.service";

export default function RolesPreview() {
  const { data: roles } = useCachedData(
    "roles:preview",
    getPreviewRoles
  );

  if (!roles) {
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
