import "./ThemeToggle.css";

import {
  FaMoon,
  FaSun,
} from "react-icons/fa";

import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle() {

  const { theme, toggleTheme } =
    useTheme();

  return (

    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >

      {theme === "light"
        ? <FaMoon size={18}/>
        : <FaSun size={18}/>}

    </button>

  );
}