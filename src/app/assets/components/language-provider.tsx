"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "bg";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (english: string, bulgarian: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANGUAGE_STORAGE_KEY = "sofia-city-quiet-retreat-language";
const LANGUAGE_COOKIE_NAME = "sofia-city-quiet-retreat-language";

export function LanguageProvider({
  children,
  initialLanguage,
  hasPersistedLanguage,
}: {
  children: React.ReactNode;
  initialLanguage: Language;
  hasPersistedLanguage: boolean;
}) {
  const [language, setLanguageState] = useState(initialLanguage);

  useEffect(() => {
    if (hasPersistedLanguage) return;

    try {
      const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage === "en" || savedLanguage === "bg") {
        setLanguageState(savedLanguage);
        return;
      }
    } catch (error) {
      console.error("Could not read the saved language preference.", error);
    }

    if (
      Intl.DateTimeFormat().resolvedOptions().timeZone === "Europe/Sofia"
    ) {
      setLanguageState("bg");
    }
  }, [hasPersistedLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (error) {
      console.error("Could not save the language preference in local storage.", error);
    }
    try {
      document.cookie = `${LANGUAGE_COOKIE_NAME}=${nextLanguage}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch (error) {
      console.error("Could not save the language preference in a cookie.", error);
    }
  };
  const translate = (english: string, bulgarian: string) =>
    language === "bg" ? bulgarian : english;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }
  return context;
}
