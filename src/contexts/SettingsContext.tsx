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


  /*
    Page titles, descriptions and icons are no longer set from here:
    each page sets its own (src/seo/usePageMeta.ts), and the favicon
    set is served statically from /public so crawlers see it too.
  */


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