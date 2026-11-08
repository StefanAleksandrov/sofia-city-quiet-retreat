import { loadCalendar } from "./shared";

export const BOOKING_COM_CACHE_TAG = "calendar-booking-com";

export function getBookingComBookedDateRanges(forceRefresh = false) {
  const feedUrl = process.env.BOOKING_ICAL_URL;
  return feedUrl
    ? loadCalendar(
        "Booking.com",
        feedUrl,
        ["ical.booking.com"],
        BOOKING_COM_CACHE_TAG,
        forceRefresh
      )
    : [];
}
