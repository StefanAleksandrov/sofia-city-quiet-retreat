import { loadCalendar, CalendarSyncError } from "./shared";

export const AIRBNB_CACHE_TAG = "calendar-airbnb";

export function getAirbnbBookedDateRanges(forceRefresh = false) {
  const feedUrl = process.env.AIRBNB_ICAL_URL;
  if (!feedUrl) {
    throw new CalendarSyncError("Airbnb calendar sync is not configured.", 503);
  }

  return loadCalendar(
    "Airbnb",
    feedUrl,
    ["www.airbnb.co.uk", "www.airbnb.com"],
    AIRBNB_CACHE_TAG,
    forceRefresh
  );
}
