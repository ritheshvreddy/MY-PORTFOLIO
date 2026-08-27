import "./Footer.css";

import { Link } from "react-router-dom";

import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

import { useSettings } from "../../contexts/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left */}

        <div className="footer-left">
          <h2>
            {settings?.portfolio_name ??
              "Portfolio"}
          </h2>

          <p>
            {settings?.tagline ??
              ""}
          </p>
        </div>

        {/* Center */}

        <div className="footer-center">
          <Link to="/">
            Home
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/roles">
            Roles
          </Link>

          <Link to="/projects">
            Projects
          </Link>

          <Link to="/certifications">
            Certifications
          </Link>

          <Link to="/terminal">
            &gt;_ Terminal
          </Link>
        </div>

        {/* Right */}

        <div className="footer-right">

          <a
            href={`mailto:${settings?.email ?? ""}`}
          >
            <FaEnvelope />

            Email
          </a>

          <a
            href={
              settings?.linkedin_url ??
              "#"
            }
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin />

            LinkedIn
          </a>

          <a
            href={
              settings?.github_url ??
              "#"
            }
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub />

            GitHub
          </a>

        </div>

      </div>

      <div className="footer-bottom">
        {settings?.copyright ??
          `© ${new Date().getFullYear()}`}
      </div>
    </footer>
  );
}