import "./About.css";

import { useEffect, useState } from "react";

import { FaDownload } from "react-icons/fa";

import { getAboutProfile } from "../../services/about.service";

import type { AboutProfile } from "../../types/about";

import { downloadFile } from "../../utils/download";

export default function AboutCard() {
  const [about, setAbout] =
    useState<AboutProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadAbout() {
      const data = await getAboutProfile();

      setAbout(data);

      setLoading(false);
    }

    loadAbout();
  }, []);

  if (loading) {
    return (
      <section className="about-section">
        <div className="about-card">
          Loading...
        </div>
      </section>
    );
  }

  if (!about) {
    return null;
  }

  return (
    <section className="about-section">
      <div className="about-header">
        <h1>{about.title}</h1>

        <p>{about.subtitle}</p>
      </div>

      <div className="about-card">
        <div className="about-content">
          <p>{about.background_1}</p>

          {about.background_2 && (
            <p>{about.background_2}</p>
          )}
        </div>

        {about.resume_url && (
          <div className="about-actions">
            <button
  className="resume-button"
  onClick={() =>
    downloadFile(
      about.resume_url!,
      "Rithesh_V_Reddy_Resume.pdf"
    )
  }
>
  <FaDownload />

  Download Resume
</button>
          </div>
        )}
      </div>
    </section>
  );
}