import "./Navbar.css";

import {
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import ThemeToggle from "./ThemeToggle";

import {
  useSettings,
} from "../../contexts/SettingsContext";


export default function Navbar() {

  const { settings } =
    useSettings();

  const location =
    useLocation();

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);


  const headerRef =
    useRef<HTMLElement>(null);


  function closeMenu() {
    setMenuOpen(false);
  }


  /* Close the menu whenever the page changes */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);


  /* Close on outside tap or Escape */
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(
          event.target as Node
        )
      ) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);


  return (
    <header
      className="navbar"
      ref={headerRef}
    >

      {/* ==================================================
          LOGO
      ================================================== */}

      <NavLink
        to="/"
        className="logo"
        onClick={closeMenu}
      >
        {settings?.portfolio_name ??
          "Portfolio"}
      </NavLink>


      {/* ==================================================
          DESKTOP / RIGHT SIDE
      ================================================== */}

      <div className="navbar-right">

        <nav
          className={`nav-links ${
            menuOpen
              ? "mobile-open"
              : ""
          }`}
        >

          <NavLink
            to="/"
            className={
              location.pathname === "/"
                ? "active"
                : undefined
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>


          <NavLink
            to="/about"
            onClick={closeMenu}
          >
            About
          </NavLink>


          <NavLink
            to="/roles"
            onClick={closeMenu}
          >
            Roles
          </NavLink>


          <NavLink
            to="/projects"
            onClick={closeMenu}
          >
            Projects
          </NavLink>


          <NavLink
            to="/certifications"
            onClick={closeMenu}
          >
            Certifications
          </NavLink>


          <NavLink
            to="/terminal"
            onClick={closeMenu}
          >
            &gt;_ Terminal
          </NavLink>

        </nav>


        {/* ==================================================
            THEME TOGGLE
        ================================================== */}

        <ThemeToggle />


        {/* ==================================================
            MOBILE MENU BUTTON
        ================================================== */}

        <button
          type="button"
          className={`mobile-menu-button${
            menuOpen ? " open" : ""
          }`}
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen(
              (previous) =>
                !previous
            )
          }
        >

          <span />
          <span />
          <span />

        </button>

      </div>

    </header>
  );
}