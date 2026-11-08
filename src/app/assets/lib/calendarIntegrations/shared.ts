import {
  parseICalendar,
  type BookedDateRange,
} from "@/app/assets/lib/icalendar";

export class CalendarSyncError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export async function loadCalendar(
  provider: "Airbnb" | "Booking.com",
  feedUrl: string,
  supportedHosts: readonly string[]
): Promise<BookedDateRange[]> {
  let url: URL;
  try {
    url = new URL(feedUrl);
  } catch {
    throw new CalendarSyncError(`${provider} calendar URL is invalid.`, 500);
  }

  if (url.protocol !== "https:" || !supportedHosts.includes(url.hostname)) {
    throw new CalendarSyncError(
      `${provider} calendar URL must use a supported ${provider} HTTPS address.`,
      500
    );
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "text/calendar" },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new CalendarSyncError(
      `${provider} calendar could not be retrieved or contains invalid calendar data.`,
      502
    );
  }

  if (!response.ok) {
    throw new CalendarSyncError(
      `${provider} calendar could not be loaded (HTTP ${response.status}).`,
      502
    );
  }

  let calendar: string;
  try {
    calendar = await response.text();
  } catch {
    throw new CalendarSyncError(
      `${provider} calendar could not be retrieved or contains invalid calendar data.`,
      502
    );
  }

  if (calendar.length > 1_000_000) {
    throw new CalendarSyncError(
      `${provider} calendar response is unexpectedly large.`,
      502
    );
  }

  try {
    return parseICalendar(calendar);
  } catch {
    throw new CalendarSyncError(
      `${provider} calendar could not be retrieved or contains invalid calendar data.`,
      502
    );
  }
}
