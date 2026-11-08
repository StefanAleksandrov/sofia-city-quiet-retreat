import { loadCalendar } from "./shared";

export function getBookingComBookedDateRanges() {
  const feedUrl = process.env.BOOKING_ICAL_URL;
  return feedUrl ? loadCalendar("Booking.com", feedUrl, ["ical.booking.com"]) : [];
}
