"use client";

import { useEffect, useState } from "react";
import type { Language } from "../configs/types/appTypes";
import {
  LANGUAGE_COOKIE_NAME,
  LANGUAGE_STORAGE_KEY,
} from "../configs/constants/languageConfig";
import { LanguageContext } from "../hooks/useLanguage";

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
