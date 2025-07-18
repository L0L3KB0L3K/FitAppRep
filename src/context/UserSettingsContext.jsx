import React, { createContext, useContext, useEffect, useState } from "react";

// Ključi za localStorage (lahko jih kasneje nadomestiš s Firebase get/set)
const LOCAL_KEY = "fitapp_user";

// SAMO TVOJA custom tema!
const DEFAULT_SETTINGS = {
  displayName: "",
  avatar: "",
  dailyReminders: false,
  showStreakBadge: true
};

const UserSettingsContext = createContext();

export function UserSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage (ali Firebase)
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
    setLoading(false);
  }, []);

  // Update in localStorage (in v prihodnje v Firestore)
  function updateSettings(newData) {
    const updated = { ...settings, ...newData };
    setSettings(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    // TODO: Po migraciji na Firebase tukaj dodaš update v Firestore!
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(LOCAL_KEY);
    // TODO: Firebase reset če boš hotel!
  }

  // Ob vsakem renderju dodaš svoj class na <html>
  useEffect(() => {
    document.documentElement.classList.remove("custom-dark", "light", "dark");
    document.documentElement.classList.add("custom-dark");
  }, []);

  return (
    <UserSettingsContext.Provider value={{
      settings,
      updateSettings,
      resetSettings,
      loading
    }}>
      {children}
    </UserSettingsContext.Provider>
  );
}

// Custom hook za uporabo contexta v komponentah
export function useUserSettings() {
  return useContext(UserSettingsContext);
}
