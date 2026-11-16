import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import {
  lazy,
  Suspense,
  useEffect,
} from "react";

import { usePageMeta } from "./seo/usePageMeta";
import site from "./seo/site.json";

import Navbar from "./components/layout/Navbar";
import SkyBackground from "./components/background/SkyBackground";
import Footer from "./components/footer/Footer";

/*
  Home is the landing page, so it ships in the main bundle
  instead of waiting for a second chunk to download.
*/
import Home from "./pages/Home";


/* =========================================================
   AUTH
========================================================= */

import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";


/* =========================================================
   LAZY LOADED WEBSITE PAGES
========================================================= */

const loadAbout = () => import("./pages/About");
const loadRoles = () => import("./pages/Roles");
const loadProjects = () => import("./pages/Projects");
const loadProjectDetails = () => import("./pages/ProjectDetails");
const loadCertifications = () => import("./pages/Certifications");
const loadTerminal = () => import("./pages/Terminal");

const About = lazy(loadAbout);

const RolesPage = lazy(loadRoles);

const ProjectsPage = lazy(loadProjects);

const ProjectDetails = lazy(loadProjectDetails);

const CertificationsPage = lazy(loadCertifications);

const TerminalPage = lazy(loadTerminal);


/*
  Once the first page has painted, quietly download the other
  public pages so navigating between them is instant.
*/
function prefetchPages() {
  const run = () => {
    for (const load of [
      loadAbout,
      loadRoles,
      loadProjects,
      loadCertifications,
      loadProjectDetails,
      loadTerminal,
    ]) {
      void load().catch(() => {});
    }
  };

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean };
    }
  ).connection;

  if (connection?.saveData) {
    return;
  }

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 4000 });
  } else {
    setTimeout(run, 2500);
  }
}


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


  /* Admin pages must never appear in search results */
  usePageMeta(
    isAdmin
      ? {
          title: `Admin | ${site.siteName}`,
          description: "Portfolio admin panel.",
          path: location.pathname,
          noindex: true,
        }
      : null
  );


  /* Start each new page at the top (hash links still scroll to their target) */
  useEffect(() => {
    if (location.hash) {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname, location.hash]);


  useEffect(() => {
    if (!isAdmin) {
      prefetchPages();
    }
    // Only once, on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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