import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  SiteSettings,
} from "../types/settings";

import {
  getSiteSettings,
} from "../services/settings.service";


/* =========================================================
   CONSTANTS
========================================================= */

const SETTINGS_CACHE_KEY =
  "portfolio_site_settings";


/* =========================================================
   CONTEXT TYPE
========================================================= */

interface SettingsContextType {
  settings: SiteSettings | null;

  loading: boolean;

  refresh: () => Promise<void>;
}


/* =========================================================
   CONTEXT
========================================================= */

const SettingsContext =
  createContext<
    SettingsContextType | undefined
  >(undefined);


/* =========================================================
   CACHE HELPERS
========================================================= */

function getCachedSettings():
  SiteSettings | null {

  try {

    const cached =
      sessionStorage.getItem(
        SETTINGS_CACHE_KEY
      );

    if (!cached) {
      return null;
    }

    return JSON.parse(
      cached
    ) as SiteSettings;

  } catch (error) {

    console.warn(
      "Unable to read cached settings:",
      error
    );

    return null;
  }
}


function cacheSettings(
  settings: SiteSettings
) {

  try {

    sessionStorage.setItem(
      SETTINGS_CACHE_KEY,
      JSON.stringify(settings)
    );

  } catch (error) {

    console.warn(
      "Unable to cache settings:",
      error
    );

  }
}


/* =========================================================
   SETTINGS PROVIDER
========================================================= */

export function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {

  const cachedSettings =
    getCachedSettings();


  const [
    settings,
    setSettings,
  ] =
    useState<SiteSettings | null>(
      cachedSettings
    );


  const [
    loading,
    setLoading,
  ] =
    useState(
      !cachedSettings
    );


  /* =======================================================
     LOAD SETTINGS
  ======================================================= */

  async function loadSettings(
    showLoading = true
  ) {

    try {

      if (showLoading) {
        setLoading(true);
      }


      const data =
        await getSiteSettings();


      if (data) {

        setSettings(
          data
        );

        cacheSettings(
          data
        );

      }

    } catch (error) {

      console.error(
        "Error loading site settings:",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {

    /*
      If cached settings exist, show them immediately
      and refresh silently in the background.
    */

    void loadSettings(
      !cachedSettings
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* =======================================================
     UPDATE DOCUMENT META
  ======================================================= */

  useEffect(() => {

    if (!settings) {
      return;
    }


    /* =====================================================
       TITLE
    ===================================================== */

    if (settings.seo_title) {

      document.title =
        settings.seo_title;

    } else if (
      settings.portfolio_name
    ) {

      document.title =
        settings.portfolio_name;

    }


    /* =====================================================
       FAVICON
    ===================================================== */

    if (
      settings.favicon_url
    ) {

      let favicon =
        document.querySelector(
          'link[rel="icon"]'
        ) as HTMLLinkElement | null;


      if (!favicon) {

        favicon =
          document.createElement(
            "link"
          );

        favicon.rel =
          "icon";

        document.head.appendChild(
          favicon
        );

      }


      favicon.type =
        "image/*";

      favicon.href =
        settings.favicon_url;

    }

  }, [
    settings,
  ]);


  /* =======================================================
     REFRESH
  ======================================================= */

  async function refresh() {

    await loadSettings(
      false
    );

  }


  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refresh,
      }}
    >

      {children}

    </SettingsContext.Provider>
  );
}


/* =========================================================
   USE SETTINGS
========================================================= */

export function useSettings() {

  const context =
    useContext(
      SettingsContext
    );


  if (!context) {

    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );

  }


  return context;
}