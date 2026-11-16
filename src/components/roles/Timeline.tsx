import "./Timeline.css";

import TimelineCard from "./TimelineCard";

import { useCachedData } from "../../lib/cache";

import {
  getFullRoles,
} from "../../services/roles.service";


export default function Timeline() {

  const {
    data,
    loading,
    error: loadError,
  } = useCachedData(
    "roles:full",
    getFullRoles
  );

  const roles = data ?? [];

  /* Only surface an error when there is nothing cached to show */
  const error =
    loadError && !data
      ? loadError instanceof Error
        ? loadError.message
        : "Unable to load roles."
      : "";


  /* ========================================================
     LOADING
  ======================================================== */

  if (loading) {

    return (
      <section className="timeline-section-page">

        <div className="timeline-header">

          <h1>
            Roles & Responsibilities
          </h1>

          <p>
            My professional journey,
            leadership experience,
            internships, education,
            and extracurricular
            milestones.
          </p>

        </div>


        <div className="timeline-loading">

          <div className="timeline-loading-spinner" />

          <p>
            Loading roles...
          </p>

        </div>

      </section>
    );

  }


  /* ========================================================
     ERROR
  ======================================================== */

  if (error) {

    return (
      <section className="timeline-section-page">

        <div className="timeline-header">

          <h1>
            Roles & Responsibilities
          </h1>

          <p>
            My professional journey,
            leadership experience,
            internships, education,
            and extracurricular
            milestones.
          </p>

        </div>


        <div className="timeline-error">

          <h2>
            Unable to load roles
          </h2>

          <p>
            {error}
          </p>

          <p className="timeline-error-help">
            Please check the browser console
            for the Supabase error.
          </p>

        </div>

      </section>
    );

  }


  /* ========================================================
     EMPTY
  ======================================================== */

  if (!roles.length) {

    return (
      <section className="timeline-section-page">

        <div className="timeline-header">

          <h1>
            Roles & Responsibilities
          </h1>

          <p>
            My professional journey,
            leadership experience,
            internships, education,
            and extracurricular
            milestones.
          </p>

        </div>


        <div className="timeline-empty">

          <h2>
            No published roles found
          </h2>

          <p>
            There are currently no roles
            available to display.
          </p>

        </div>

      </section>
    );

  }


  /* ========================================================
     MAIN TIMELINE
  ======================================================== */

  return (

    <section className="timeline-section-page">

      <div className="timeline-header">

        <h1>
          Roles & Responsibilities
        </h1>


        <p>
          My professional journey,
          leadership experience,
          internships, education,
          and extracurricular
          milestones.
        </p>

      </div>


      <div className="timeline">

        {roles.map(
          (role, index) => (

            <TimelineCard
              key={role.id}
              role={role}
              index={index}
            />

          )
        )}

      </div>

    </section>

  );
}