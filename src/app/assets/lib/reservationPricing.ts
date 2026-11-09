import {
  CUSTOM_DATE_RATES,
  EARLY_CHECK_IN_FEE,
  LATE_CHECK_OUT_FEE,
  WEEKDAY_RATE,
  WEEKEND_RATE,
} from "../configs/constants/bookingConfig";
import type {
  CustomDateRateBreakdown,
  ReservationPrice,
} from "../configs/types/bookingTypes";

function parseDate(value: string, context = "Booking dates"): Date {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error(`${context} must use YYYY-MM-DD format.`);

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    throw new Error(`${context} must be valid calendar dates.`);
  }

  return date;
}

function validateCustomDateRates() {
  const rates = CUSTOM_DATE_RATES.map((rate) => {
    const startDate = parseDate(rate.startDate, "Custom price dates");
    const endDate = parseDate(rate.endDate, "Custom price dates");
    if (endDate <= startDate) {
      throw new Error("Custom price end dates must be after start dates.");
    }
    if (!Number.isFinite(rate.nightlyRate) || rate.nightlyRate < 0) {
      throw new Error("Custom nightly rates must be non-negative numbers.");
    }

    return { ...rate, startDate, endDate };
  }).sort((left, right) => left.startDate.getTime() - right.startDate.getTime());

  for (let index = 1; index < rates.length; index += 1) {
    if (rates[index].startDate < rates[index - 1].endDate) {
      throw new Error("Custom price date ranges must not overlap.");
    }
  }

  return rates;
}

export function calculateReservationPrice(
  checkIn: string,
  checkOut: string,
  options: { earlyCheckIn?: boolean; lateCheckOut?: boolean } = {},
): ReservationPrice {
  const night = parseDate(checkIn);
  const checkOutDate = parseDate(checkOut);
  if (checkOutDate <= night) {
    throw new Error("Check-out must be after check-in.");
  }

  let weekdayNights = 0;
  let weekendNights = 0;
  const customDateRates = validateCustomDateRates();
  const customRateBreakdown = new Map<string, CustomDateRateBreakdown>();

  while (night < checkOutDate) {
    const customRate = customDateRates.find(
      (rate) => night >= rate.startDate && night < rate.endDate,
    );
    if (customRate) {
      const key = `${customRate.startDate.toISOString()}-${customRate.endDate.toISOString()}`;
      const breakdown = customRateBreakdown.get(key) ?? {
        startDate: customRate.startDate.toISOString().slice(0, 10),
        endDate: customRate.endDate.toISOString().slice(0, 10),
        nightlyRate: customRate.nightlyRate,
        nights: 0,
        subtotal: 0,
        label: customRate.label,
        labelBg: customRate.labelBg,
      };
      breakdown.nights += 1;
      breakdown.subtotal += customRate.nightlyRate;
      customRateBreakdown.set(key, breakdown);
    } else {
      const dayOfWeek = night.getUTCDay();
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        weekendNights += 1;
      } else {
        weekdayNights += 1;
      }
    }
    night.setUTCDate(night.getUTCDate() + 1);
  }

  const customDateRateBreakdowns = [...customRateBreakdown.values()];
  const customDateSubtotal = customDateRateBreakdowns.reduce(
    (total, rate) => total + rate.subtotal,
    0,
  );
  const nights =
    weekdayNights +
    weekendNights +
    customDateRateBreakdowns.reduce((total, rate) => total + rate.nights, 0);
  const weekdaySubtotal = weekdayNights * WEEKDAY_RATE;
  const weekendSubtotal = weekendNights * WEEKEND_RATE;
  const subtotal = weekdaySubtotal + weekendSubtotal + customDateSubtotal;
  const discountRate = nights > 28 ? 0.3 : nights > 7 ? 0.15 : 0;
  const discountAmount = subtotal * discountRate;
  const earlyCheckInFee = options.earlyCheckIn ? EARLY_CHECK_IN_FEE : 0;
  const lateCheckOutFee = options.lateCheckOut ? LATE_CHECK_OUT_FEE : 0;

  return {
    weekdayNights,
    weekendNights,
    customDateRates: customDateRateBreakdowns,
    nights,
    weekdaySubtotal,
    weekendSubtotal,
    subtotal,
    discountRate,
    discountAmount,
    earlyCheckInFee,
    lateCheckOutFee,
    total: subtotal - discountAmount + earlyCheckInFee + lateCheckOutFee,
  };
}

export function formatEuro(amount: number, locale = "en-IE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
