import type { BookedDateRange } from "@/app/assets/lib/airbnbCalendar";

type AvailabilityResponse = { bookedDateRanges: BookedDateRange[] };

/** Booked ranges include check-in and exclude check-out. */
export function isDateInBookedRanges(
  date: Date,
  ranges: { checkIn: string; checkOut: string }[]
): boolean {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  for (const range of ranges) {
    const [ciY, ciM, ciD] = range.checkIn.split("-").map(Number);
    const [coY, coM, coD] = range.checkOut.split("-").map(Number);
    const checkInTime = new Date(ciY, ciM - 1, ciD).getTime();
    const checkOutTime = new Date(coY, coM - 1, coD).getTime();
    if (day >= checkInTime && day < checkOutTime) return true;
  }
  return false;
}

export function isAvailabilityResponse(value: unknown): value is AvailabilityResponse {
  if (!value || typeof value !== "object" || !("bookedDateRanges" in value)) {
    return false;
  }

  const ranges = value.bookedDateRanges;
  return (
    Array.isArray(ranges) &&
    ranges.every(
      (range) =>
        range &&
        typeof range === "object" &&
        "checkIn" in range &&
        typeof range.checkIn === "string" &&
        "checkOut" in range &&
        typeof range.checkOut === "string"
    )
  );
}

export function translateBookingError(
  message: string,
  translate: (english: string, bulgarian: string) => string
): string {
  const knownErrors: Record<string, string> = {
    "Airbnb availability could not be loaded.": "Наличността от Airbnb не можа да бъде заредена.",
    "Airbnb availability response is invalid.": "Отговорът за наличността от Airbnb е невалиден.",
    "Airbnb calendar sync is not configured.": "Синхронизирането с календара на Airbnb не е настроено.",
    "Airbnb calendar URL is invalid.": "Адресът на календара на Airbnb е невалиден.",
    "Airbnb calendar URL must use a supported Airbnb HTTPS address.": "Адресът на календара трябва да е поддържан HTTPS адрес на Airbnb.",
    "Airbnb calendar response is unexpectedly large.": "Отговорът от календара на Airbnb е неочаквано голям.",
    "Airbnb calendar could not be retrieved or contains invalid calendar data.": "Календарът на Airbnb не можа да бъде извлечен или съдържа невалидни данни.",
    "Email is not configured. Please set RESEND_API_KEY.": "Имейлът не е настроен. Моля, задайте RESEND_API_KEY.",
    "Booking dates must use YYYY-MM-DD format.": "Датите за резервация трябва да са във формат YYYY-MM-DD.",
    "Booking dates must be valid calendar dates.": "Датите за резервация трябва да са валидни календарни дати.",
    "Check-out must be after check-in.": "Датата на напускане трябва да е след датата на настаняване.",
    "Something went wrong.": "Възникна грешка.",
  };
  const calendarStatus = message.match(/^Airbnb calendar could not be loaded \(HTTP (\d+)\)\.$/);
  if (calendarStatus) {
    return translate(
      message,
      `Календарът на Airbnb не можа да бъде зареден (HTTP ${calendarStatus[1]}).`
    );
  }
  const bulgarian = knownErrors[message];
  return bulgarian ? translate(message, bulgarian) : message;
}

export function toYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
