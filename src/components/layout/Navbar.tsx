import "./Navbar.css";

import { NavLink } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

import { useSettings } from "../../contexts/SettingsContext";

export default function Navbar() {
  const { settings } = useSettings();

  return (
    <header className="navbar">

      {/* Logo */}

      <NavLink
        to="/"
        className="logo"
      >
        {settings?.portfolio_name ??
          "Portfolio"}
      </NavLink>

      {/* Right Side */}

      <div className="navbar-right">

        <nav className="nav-links">

          <NavLink to="/">
            Home
          </NavLink>

          <NavLink to="/about">
            About
          </NavLink>

          <NavLink to="/roles">
            Roles
          </NavLink>

          <NavLink to="/projects">
            Projects
          </NavLink>

          <NavLink to="/certifications">
            Certifications
          </NavLink>

          <NavLink to="/terminal">
            &gt;_ Terminal
          </NavLink>

        </nav>

        <ThemeToggle />

      </div>

    </header>
  );
}