import { revalidateTag } from "next/cache";
import { mergeBookedDateRanges } from "@/app/assets/lib/icalendar";
import { getAirbnbBookedDateRanges } from "./airbnb";
import { getBookingComBookedDateRanges } from "./bookingCom";
import { AIRBNB_CACHE_TAG, BOOKING_COM_CACHE_TAG } from "../../configs/constants/bookingConfig";

export { CalendarSyncError } from "./shared";

const calendarIntegrations = [
  { cacheTag: AIRBNB_CACHE_TAG, load: getAirbnbBookedDateRanges },
  { cacheTag: BOOKING_COM_CACHE_TAG, load: getBookingComBookedDateRanges },
];

export async function getIntegratedBookedDateRanges(forceRefresh = false) {
  const ranges = await Promise.all(
    calendarIntegrations.map((integration) => integration.load(forceRefresh))
  );
  return mergeBookedDateRanges(ranges.flat());
}

export async function refreshIntegratedBookedDateRanges() {
  const ranges = await getIntegratedBookedDateRanges(true);
  for (const integration of calendarIntegrations) {
    revalidateTag(integration.cacheTag, { expire: 0 });
  }
  return ranges;
}
