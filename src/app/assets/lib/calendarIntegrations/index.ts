import { mergeBookedDateRanges } from "@/app/assets/lib/icalendar";
import { getAirbnbBookedDateRanges } from "./airbnb";
import { getBookingComBookedDateRanges } from "./bookingCom";

export { CalendarSyncError } from "./shared";

const calendarIntegrations = [
  getAirbnbBookedDateRanges,
  getBookingComBookedDateRanges,
];

export async function getIntegratedBookedDateRanges() {
  const ranges = await Promise.all(
    calendarIntegrations.map((integration) => integration())
  );
  return mergeBookedDateRanges(ranges.flat());
}
