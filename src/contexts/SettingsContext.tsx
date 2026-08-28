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
   SETTINGS PROVIDER
========================================================= */

export function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [
    settings,
    setSettings,
  ] =
    useState<SiteSettings | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  /* =======================================================
     LOAD SETTINGS
  ======================================================= */

  async function loadSettings() {

    try {

      setLoading(true);

      const data =
        await getSiteSettings();

      setSettings(
        data
      );

    } catch (error) {

      console.error(
        "Error loading site settings:",
        error
      );

      setSettings(
        null
      );

    } finally {

      setLoading(false);

    }

  }


  /* =======================================================
     LOAD ON START
  ======================================================= */

  useEffect(() => {

    void loadSettings();

  }, []);


  /* =======================================================
     UPDATE DOCUMENT META
  ======================================================= */

  useEffect(() => {

    if (
      !settings
    ) {
      return;
    }


    /* =====================================================
       TITLE
    ===================================================== */

    if (
      settings.seo_title
    ) {

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
     PROVIDER
  ======================================================= */

  return (

    <SettingsContext.Provider
      value={{
        settings,

        loading,

        refresh:
          loadSettings,
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