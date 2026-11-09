"use server";

import { Resend } from "resend";
import type { BookingFormData } from "@/app/assets/configs/types/appTypes";
import { OWNER_EMAIL, FROM_EMAIL, SITE_NAME } from "@/app/assets/configs/constants/siteConfig";
import { calculateReservationPrice, formatEuro } from "@/app/assets/lib/reservationPricing";
import { WEEKDAY_RATE, WEEKEND_RATE } from "../configs/constants/bookingConfig";

export async function sendBookingEmail(data: BookingFormData): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Email is not configured. Please set RESEND_API_KEY." };
  }

  let priceEstimate;
  try {
    priceEstimate = calculateReservationPrice(data.checkIn, data.checkOut);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Booking dates are invalid.",
    };
  }

  const resend = new Resend(apiKey);
  const text = [
    `New booking inquiry from ${SITE_NAME}`,
    "",
    `Check-in: ${data.checkIn}`,
    `Check-out: ${data.checkOut}`,
    `Guests: ${data.guests}`,
    "",
    "Estimated price breakdown:",
    `${priceEstimate.weekdayNights} weekday nights × ${formatEuro(WEEKDAY_RATE)}: ${formatEuro(priceEstimate.weekdaySubtotal)}`,
    `${priceEstimate.weekendNights} weekend nights × ${formatEuro(WEEKEND_RATE)}: ${formatEuro(priceEstimate.weekendSubtotal)}`,
    `Subtotal: ${formatEuro(priceEstimate.subtotal)}`,
    ...(priceEstimate.discountRate > 0
      ? [`Long-stay discount (${priceEstimate.discountRate * 100}%): −${formatEuro(priceEstimate.discountAmount)}`]
      : []),
    `Estimated total: ${formatEuro(priceEstimate.total)}`,
    "Informational estimate; confirm final price with the host.",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    "",
    "Message:",
    data.message || "(none)",
  ].join("\n");

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `BOOKING ${data.checkIn}-${data.checkOut}, ${data.guests} guests, (${data.name})`,
    text,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
