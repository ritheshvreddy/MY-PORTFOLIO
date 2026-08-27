import "./Roles.css";

import { useEffect, useState } from "react";

import RoleCard from "./RoleCard";

import {
  getFullRoles,
} from "../../services/roles.service";

import type {
  FullRole,
} from "../../types/roles";

export default function RolesPage() {
  const [roles, setRoles] = useState<
    FullRole[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadRoles() {
      try {
        const data =
          await getFullRoles();

        setRoles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadRoles();
  }, []);

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