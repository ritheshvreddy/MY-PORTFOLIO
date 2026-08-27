import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import SkyBackground from "./components/background/SkyBackground";
import Footer from "./components/footer/Footer";


/* =========================================================
   WEBSITE
========================================================= */

import Home from "./pages/Home";
import About from "./pages/About";
import RolesPage from "./pages/Roles";
import ProjectsPage from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import CertificationsPage from "./pages/Certifications";
import TerminalPage from "./pages/Terminal";


/* =========================================================
   AUTH
========================================================= */

import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";


/* =========================================================
   ADMIN
========================================================= */

import AdminLayout from "./admin/AdminLayout";

import Dashboard from "./admin/pages/Dashboard";
import Hero from "./admin/pages/Hero";
import Projects from "./admin/pages/Projects";
import Certifications from "./admin/pages/Certifications";
import AboutAdmin from "./admin/pages/About";
import Skills from "./admin/pages/Skills";
import Roles from "./admin/pages/Roles";
import Messages from "./admin/pages/Messages";
import AdminTerminal from "./admin/pages/Terminal";
import AdminSettings from "./admin/pages/Settings";


/* =========================================================
   LAYOUT
========================================================= */

function Layout() {
  const location = useLocation();

  const isAdmin =
    location.pathname.startsWith("/admin");


  return (
    <>
      {/* =====================================================
          WEBSITE ONLY
      ===================================================== */}

      {!isAdmin && (
        <SkyBackground />
      )}

      {!isAdmin && (
        <Navbar />
      )}


      {/* =====================================================
          ROUTES
      ===================================================== */}

      <Routes>


        {/* ===================================================
            WEBSITE
        =================================================== */}

        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/about"
          element={<About />}
        />


        <Route
          path="/roles"
          element={<RolesPage />}
        />


        <Route
          path="/projects"
          element={<ProjectsPage />}
        />


        <Route
          path="/projects/:slug"
          element={<ProjectDetails />}
        />


        <Route
          path="/certifications"
          element={<CertificationsPage />}
        />


        <Route
          path="/terminal"
          element={<TerminalPage />}
        />


        {/* ===================================================
            ADMIN LOGIN
        =================================================== */}

        <Route
          path="/admin/login"
          element={<Login />}
        />


        {/* ===================================================
            PROTECTED ADMIN
        =================================================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route
            index
            element={<Dashboard />}
          />


          {/* =================================================
              HERO
          ================================================= */}

          <Route
            path="hero"
            element={<Hero />}
          />


          {/* =================================================
              PROJECTS
          ================================================= */}

          <Route
            path="projects"
            element={<Projects />}
          />


          {/* =================================================
              CERTIFICATIONS
          ================================================= */}

          <Route
            path="certifications"
            element={<Certifications />}
          />


          {/* =================================================
              ABOUT
          ================================================= */}

          <Route
            path="about"
            element={<AboutAdmin />}
          />


          {/* =================================================
              SKILLS
          ================================================= */}

          <Route
            path="skills"
            element={<Skills />}
          />


          {/* =================================================
              ROLES
          ================================================= */}

          <Route
            path="roles"
            element={<Roles />}
          />


          {/* =================================================
              MESSAGES
          ================================================= */}

          <Route
            path="messages"
            element={<Messages />}
          />

          {/* =================================================
              TERMINAL
          ================================================= */}

          <Route
            path="terminal"
            element={<AdminTerminal />}
          />

          {/* =================================================
              SETTINGS
          ================================================= */}

          <Route
            path="settings"
            element={<AdminSettings />}
          />

        </Route>

      </Routes>


      {/* =====================================================
          WEBSITE FOOTER ONLY
      ===================================================== */}

      {!isAdmin && (
        <Footer />
      )}
    </>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}