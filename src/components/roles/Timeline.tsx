import "./Timeline.css";

import {
  useEffect,
  useState,
} from "react";

import TimelineCard from "./TimelineCard";

import {
  getFullRoles,
} from "../../services/roles.service";

import type {
  FullRole,
} from "../../types/roles";


export default function Timeline() {

  const [
    roles,
    setRoles,
  ] =
    useState<FullRole[]>([]);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState("");


  useEffect(() => {

    let mounted = true;


    async function loadRoles() {

      try {

        setLoading(true);

        setError("");


        const data =
          await getFullRoles();


        if (!mounted) {
          return;
        }


        setRoles(
          data
        );

      } catch (error) {

        console.error(
          "Failed to load roles:",
          error
        );


        if (!mounted) {
          return;
        }


        setError(
          error instanceof Error
            ? error.message
            : "Unable to load roles."
        );

        setRoles([]);

      } finally {

        if (mounted) {

          setLoading(false);

        }

      }

    }


    void loadRoles();


    return () => {

      mounted = false;

    };

  }, []);


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