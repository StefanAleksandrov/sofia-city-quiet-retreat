import { loadCalendar, CalendarSyncError } from "./shared";

export function getAirbnbBookedDateRanges() {
  const feedUrl = process.env.AIRBNB_ICAL_URL;
  if (!feedUrl) {
    throw new CalendarSyncError("Airbnb calendar sync is not configured.", 503);
  }

  return loadCalendar("Airbnb", feedUrl, ["www.airbnb.co.uk", "www.airbnb.com"]);
}
