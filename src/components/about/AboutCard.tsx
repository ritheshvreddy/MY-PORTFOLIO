import "./About.css";

import { FaDownload } from "react-icons/fa";

import { useCachedData } from "../../lib/cache";

import { getAboutProfile } from "../../services/about.service";

import { downloadFile } from "../../utils/download";

export default function AboutCard() {
  const { data: about, loading } = useCachedData(
    "about:profile",
    getAboutProfile
  );

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