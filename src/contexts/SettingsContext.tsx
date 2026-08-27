import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { SiteSettings } from "../types/settings";

import { getSiteSettings } from "../services/settings.service";

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext =
  createContext<SettingsContextType | undefined>(
    undefined
  );

export function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] =
    useState<SiteSettings | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadSettings() {
    setLoading(true);

    const data =
      await getSiteSettings();

    setSettings(data);

    setLoading(false);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refresh: loadSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context =
    useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
}