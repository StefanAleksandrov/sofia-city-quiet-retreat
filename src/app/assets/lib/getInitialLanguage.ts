import { cookies, headers } from "next/headers";
import { getCountries, type CountryCode } from "libphonenumber-js";
import type { Language } from "../configs/types/appTypes";

const COUNTRY_HEADER_NAMES = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-nf-country",
  "x-country-code",
];

export async function getInitialCountry(): Promise<CountryCode | null> {
  const requestHeaders = await headers();
  const countryCode = COUNTRY_HEADER_NAMES
    .map((name) => requestHeaders.get(name)?.trim().toUpperCase())
    .find((value) => value) ?? "";

  return getCountries().find((country) => country === countryCode) ?? null;
}

export async function getInitialLanguage(): Promise<{
  initialLanguage: Language;
  hasPersistedLanguage: boolean;
}> {
  const [cookieStore, countryCode] = await Promise.all([cookies(), getInitialCountry()]);
  const savedLanguage = cookieStore.get("sofia-city-quiet-retreat-language")?.value;
  const hasPersistedLanguage = savedLanguage === "en" || savedLanguage === "bg";

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
