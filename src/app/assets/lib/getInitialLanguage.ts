import { cookies, headers } from "next/headers";
import type { Language } from "@/app/assets/components/language-provider";

export async function getInitialLanguage(): Promise<{
  initialLanguage: Language;
  hasPersistedLanguage: boolean;
}> {
  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
  const savedLanguage = cookieStore.get("sofia-city-quiet-retreat-language")?.value;
  const hasPersistedLanguage = savedLanguage === "en" || savedLanguage === "bg";
  const countryCode = [
    "x-vercel-ip-country",
    "cf-ipcountry",
    "x-nf-country",
    "x-country-code",
  ]
    .map((name) => requestHeaders.get(name)?.trim().toUpperCase())
    .find((value) => value) ?? "";

  return {
    initialLanguage:
      savedLanguage === "en" || savedLanguage === "bg"
        ? savedLanguage
        : countryCode === "BG"
          ? "bg"
          : "en",
    hasPersistedLanguage,
  };
}
