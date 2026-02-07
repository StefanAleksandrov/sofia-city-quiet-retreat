"use server";

import { Resend } from "resend";
import type { BookingFormData } from "@/app/configs/types/appTypes";
import { OWNER_EMAIL, FROM_EMAIL, SITE_NAME } from "@/app/configs/constants/siteConfig";

export async function sendBookingEmail(data: BookingFormData): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Email is not configured. Please set RESEND_API_KEY." };
  }

  const resend = new Resend(apiKey);
  const text = [
    `New booking inquiry from ${SITE_NAME}`,
    "",
    `Check-in: ${data.checkIn}`,
    `Check-out: ${data.checkOut}`,
    `Guests: ${data.guests}`,
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
    subject: `[${SITE_NAME}] Booking inquiry: ${data.checkIn} – ${data.checkOut} (${data.name})`,
    text,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
