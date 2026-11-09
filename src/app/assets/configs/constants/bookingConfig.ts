import type { CustomDateRate } from "../types/bookingTypes";

export const WEEKDAY_RATE = 150;
export const WEEKEND_RATE = 180;
export const EARLY_CHECK_IN_FEE = 30;
export const LATE_CHECK_OUT_FEE = 30;
// Date ranges include startDate and exclude endDate, matching the check-out date.
export const CUSTOM_DATE_RATES: CustomDateRate[] = [
  {
    startDate: "2026-12-04",
    endDate: "2026-12-08",
    nightlyRate: 210,
    label: "8th of December",
    labelBg: "8-ми декември",
  },
  {
    startDate: "2026-12-21",
    endDate: "2027-01-03",
    nightlyRate: 240,
    label: "Holidays",
    labelBg: "Празници",
  },
];
export const AIRBNB_CACHE_TAG = "calendar-airbnb";
export const BOOKING_COM_CACHE_TAG = "calendar-booking-com";
