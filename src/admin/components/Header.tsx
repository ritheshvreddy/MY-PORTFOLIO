import { useNavigate } from "react-router-dom";

import { FaSignOutAlt } from "react-icons/fa";

import { logout } from "../../services/auth.service";

import "./AdminLayout.css";

export default function Header() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();

    navigate("/admin/login");
  }

  return (
    <header className="admin-header">

      <h1>
        Portfolio Admin
      </h1>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        <FaSignOutAlt />

        Logout
      </button>

    </header>
  );
}