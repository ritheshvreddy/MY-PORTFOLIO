import { Link } from "react-router-dom";

import {
  FaPlus,
  FaFolderOpen,
  FaCode,
  FaBriefcase,
  FaCertificate,
} from "react-icons/fa";

export default function QuickActions() {
  const actions = [
    {
      title: "Project",
      icon: <FaFolderOpen />,
      to: "/admin/projects",
    },
    {
      title: "Skill",
      icon: <FaCode />,
      to: "/admin/skills",
    },
    {
      title: "Role",
      icon: <FaBriefcase />,
      to: "/admin/roles",
    },
    {
      title: "Certification",
      icon: <FaCertificate />,
      to: "/admin/certifications",
    },
  ];

  return (
    <div className="quick-actions">

      <h2>Quick Actions</h2>

      <div className="quick-grid">

        {actions.map((action) => (

          <Link
            key={action.title}
            to={action.to}
            className="quick-card"
          >
            {action.icon}

            <span>Add {action.title}</span>

            <FaPlus />
          </Link>

        ))}

      </div>

    </div>
  );
}