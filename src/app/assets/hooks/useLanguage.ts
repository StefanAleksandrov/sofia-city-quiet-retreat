"use client";

import { createContext, useContext } from "react";
import type { LanguageContextValue } from "../configs/types/appTypes";

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }
  return context;
}
