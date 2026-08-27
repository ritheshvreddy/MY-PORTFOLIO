import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { AuthProvider } from "./auth/AuthProvider";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import { Toaster } from "react-hot-toast";

import "./styles/globals.css";
import "./styles/variables.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <ThemeProvider>
          <App />

          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,

              style: {
                background: "#18181b",
                color: "#fff",
                borderRadius: "14px",
                padding: "16px",
                fontSize: "15px",
              },

              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },

              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);