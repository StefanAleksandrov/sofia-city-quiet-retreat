export const WEEKDAY_RATE = 180;
export const WEEKEND_RATE = 210;

export type ReservationPrice = {
  weekdayNights: number;
  weekendNights: number;
  nights: number;
  weekdaySubtotal: number;
  weekendSubtotal: number;
  subtotal: number;
  discountRate: number;
  discountAmount: number;
  total: number;
};

function parseDate(value: string): Date {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error("Booking dates must use YYYY-MM-DD format.");

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    throw new Error("Booking dates must be valid calendar dates.");
  }

  return date;
}

export function calculateReservationPrice(
  checkIn: string,
  checkOut: string
): ReservationPrice {
  const night = parseDate(checkIn);
  const checkOutDate = parseDate(checkOut);
  if (checkOutDate <= night) {
    throw new Error("Check-out must be after check-in.");
  }

  let weekdayNights = 0;
  let weekendNights = 0;

  while (night < checkOutDate) {
    const dayOfWeek = night.getUTCDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      weekendNights += 1;
    } else {
      weekdayNights += 1;
    }
    night.setUTCDate(night.getUTCDate() + 1);
  }

  const nights = weekdayNights + weekendNights;
  const weekdaySubtotal = weekdayNights * WEEKDAY_RATE;
  const weekendSubtotal = weekendNights * WEEKEND_RATE;
  const subtotal = weekdaySubtotal + weekendSubtotal;
  const discountRate = nights > 28 ? 0.3 : nights > 7 ? 0.15 : 0;
  const discountAmount = subtotal * discountRate;

  return {
    weekdayNights,
    weekendNights,
    nights,
    weekdaySubtotal,
    weekendSubtotal,
    subtotal,
    discountRate,
    discountAmount,
    total: subtotal - discountAmount,
  };
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
