import "./Roles.css";

import RoleCard from "./RoleCard";

import { useCachedData } from "../../lib/cache";

import {
  getFullRoles,
} from "../../services/roles.service";

export default function RolesPage() {
  const { data, loading } = useCachedData(
    "roles:full",
    getFullRoles
  );

  const roles = data ?? [];

  if (loading) {
    return (
      <section className="roles-page">
        <div className="roles-header">
          <h1>Role & Responsibilities</h1>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="roles-page">

      <div className="roles-header">

        <h1>
          Role & Responsibilities
        </h1>

        <p>
          My professional journey,
          leadership experience and
          responsibilities.
        </p>

      </div>

      <div className="roles-list">

        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
          />
        ))}

      </div>

    </section>
  );
}