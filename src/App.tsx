import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import {
  lazy,
  Suspense,
} from "react";

import Navbar from "./components/layout/Navbar";
import SkyBackground from "./components/background/SkyBackground";
import Footer from "./components/footer/Footer";


/* =========================================================
   AUTH
========================================================= */

import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";


/* =========================================================
   LAZY LOADED WEBSITE PAGES
========================================================= */

const Home = lazy(
  () => import("./pages/Home")
);

const About = lazy(
  () => import("./pages/About")
);

const RolesPage = lazy(
  () => import("./pages/Roles")
);

const ProjectsPage = lazy(
  () => import("./pages/Projects")
);

const ProjectDetails = lazy(
  () => import("./pages/ProjectDetails")
);

const CertificationsPage = lazy(
  () => import("./pages/Certifications")
);

const TerminalPage = lazy(
  () => import("./pages/Terminal")
);


/* =========================================================
   LAZY LOADED ADMIN
========================================================= */

const AdminLayout = lazy(
  () => import("./admin/AdminLayout")
);

const Dashboard = lazy(
  () => import("./admin/pages/Dashboard")
);

const Hero = lazy(
  () => import("./admin/pages/Hero")
);

const AdminProjects = lazy(
  () => import("./admin/pages/Projects")
);

const AdminCertifications = lazy(
  () => import("./admin/pages/Certifications")
);

const AboutAdmin = lazy(
  () => import("./admin/pages/About")
);

const Skills = lazy(
  () => import("./admin/pages/Skills")
);

const Roles = lazy(
  () => import("./admin/pages/Roles")
);

const Messages = lazy(
  () => import("./admin/pages/Messages")
);

const AdminTerminal = lazy(
  () => import("./admin/pages/Terminal")
);

const AdminSettings = lazy(
  () => import("./admin/pages/Settings")
);


/* =========================================================
   LOADING SCREEN
========================================================= */

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        boxSizing: "border-box",
        color: "var(--text-color)",
      }}
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: "3px solid rgba(59, 130, 246, 0.2)",
          borderTopColor: "#3b82f6",
          animation: "appLoaderSpin .8s linear infinite",
        }}
      />
    </div>
  );
}


/* =========================================================
   LAYOUT
========================================================= */

function Layout() {
  const location = useLocation();

  const isAdmin =
    location.pathname.startsWith(
      "/admin"
    );


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

      <Suspense fallback={<PageLoader />}>

        <Routes>

          {/* =================================================
              WEBSITE
          ================================================= */}

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


          {/* =================================================
              ADMIN LOGIN
          ================================================= */}

          <Route
            path="/admin/login"
            element={<Login />}
          />


          {/* =================================================
              ADMIN
          ================================================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >

            {/* ===============================================
                DASHBOARD
            =============================================== */}

            <Route
              index
              element={<Dashboard />}
            />


            {/* ===============================================
                HERO
            =============================================== */}

            <Route
              path="hero"
              element={<Hero />}
            />


            {/* ===============================================
                PROJECTS
            =============================================== */}

            <Route
              path="projects"
              element={<AdminProjects />}
            />


            {/* ===============================================
                CERTIFICATIONS
            =============================================== */}

            <Route
              path="certifications"
              element={
                <AdminCertifications />
              }
            />


            {/* ===============================================
                ABOUT
            =============================================== */}

            <Route
              path="about"
              element={<AboutAdmin />}
            />


            {/* ===============================================
                SKILLS
            =============================================== */}

            <Route
              path="skills"
              element={<Skills />}
            />


            {/* ===============================================
                ROLES
            =============================================== */}

            <Route
              path="roles"
              element={<Roles />}
            />


            {/* ===============================================
                MESSAGES
            =============================================== */}

            <Route
              path="messages"
              element={<Messages />}
            />


            {/* ===============================================
                TERMINAL
            =============================================== */}

            <Route
              path="terminal"
              element={<AdminTerminal />}
            />


            {/* ===============================================
                SETTINGS
            =============================================== */}

            <Route
              path="settings"
              element={<AdminSettings />}
            />

          </Route>

        </Routes>

      </Suspense>


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