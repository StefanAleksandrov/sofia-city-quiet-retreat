export interface NavigationItem {
  href: string;
  textContent: string;
  bulgarianTextContent: string;
}

export interface BookingFormData {
  checkIn: string;
  checkOut: string;
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
  guests: number;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export type BookedDateRange = { checkIn: string; checkOut: string };
export type AvailabilityResponse = { bookedDateRanges: BookedDateRange[] };
export type Language = "en" | "bg";

export type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (english: string, bulgarian: string) => string;
};
