import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaUser,
  FaCode,
  FaBriefcase,
  FaFolderOpen,
  FaCertificate,
  FaInfoCircle,
  FaEnvelope,
  FaTerminal,
  FaCog,
} from "react-icons/fa";

import "./AdminLayout.css";

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">

      <h2 className="admin-logo">
        Portfolio CMS
      </h2>

      <nav>

        <NavLink to="/admin">
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/admin/hero">
          <FaUser />
          Hero
        </NavLink>

        <NavLink to="/admin/skills">
          <FaCode />
          Skills
        </NavLink>

        <NavLink to="/admin/roles">
          <FaBriefcase />
          Roles
        </NavLink>

        <NavLink to="/admin/projects">
          <FaFolderOpen />
          Projects
        </NavLink>

        <NavLink to="/admin/certifications">
          <FaCertificate />
          Certifications
        </NavLink>

        <NavLink to="/admin/about">
          <FaInfoCircle />
          About
        </NavLink>

        <NavLink to="/admin/messages">
          <FaEnvelope />
          Messages
        </NavLink>

        <NavLink to="/admin/terminal">
          <FaTerminal />
          Terminal
        </NavLink>

        <NavLink to="/admin/settings">
          <FaCog />
          Settings
        </NavLink>

      </nav>

    </aside>
  );
}