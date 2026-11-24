"use server";

import { OAuth2Client } from "google-auth-library";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import type { BookingFormData } from "@/app/assets/configs/types/appTypes";
import {
  OWNER_EMAIL,
  PARTNER_EMAILS,
  SITE_NAME,
} from "@/app/assets/configs/constants/siteConfig";
import { calculateReservationPrice, formatEuro } from "@/app/assets/lib/reservationPricing";
import {
  EARLY_CHECK_IN_FEE,
  LATE_CHECK_OUT_FEE,
  WEEKDAY_RATE,
  WEEKEND_RATE,
} from "../configs/constants/bookingConfig";
import { areGuestCountsValid } from "../lib/guestCounts";

export async function sendBookingEmail(data: BookingFormData): Promise<{ ok: boolean; error?: string }> {
  if (
    !data ||
    !areGuestCountsValid(data.adults, data.children, data.babies)
  ) {
    return { ok: false, error: "Guest counts are invalid." };
  }
  if (!getCountries().includes(data.phoneCountry)) {
    return { ok: false, error: "Phone country selection is invalid." };
  }
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    return {
      ok: false,
      error:
        "Email is not configured. Please set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN.",
    };
  }
  if (
    typeof data.earlyCheckIn !== "boolean" ||
    typeof data.lateCheckOut !== "boolean"
  ) {
    return { ok: false, error: "Booking options are invalid." };
  }

  let priceEstimate;
  try {
    priceEstimate = calculateReservationPrice(data.checkIn, data.checkOut, {
      earlyCheckIn: data.earlyCheckIn,
      lateCheckOut: data.lateCheckOut,
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Booking dates are invalid.",
    };
  }

  const text = [
    `New booking inquiry from ${SITE_NAME}`,
    "",
    `Check-in: ${data.checkIn}`,
    `Check-out: ${data.checkOut}`,
    `Guests: ${data.adults} adult${data.adults === 1 ? "" : "s"}, ${data.children} ${data.children === 1 ? "child" : "children"}, ${data.babies} ${data.babies === 1 ? "baby" : "babies"}`,
    "",
    "Estimated price breakdown:",
    ...(priceEstimate.weekdayNights > 0
      ? [`${priceEstimate.weekdayNights} weekday nights × ${formatEuro(WEEKDAY_RATE)}: ${formatEuro(priceEstimate.weekdaySubtotal)}`]
      : []),
    ...(priceEstimate.weekendNights > 0
      ? [`${priceEstimate.weekendNights} weekend nights × ${formatEuro(WEEKEND_RATE)}: ${formatEuro(priceEstimate.weekendSubtotal)}`]
      : []),
    ...priceEstimate.customDateRates.map(
      (rate) =>
        `${rate.label}: ${rate.nights} nights × ${formatEuro(rate.nightlyRate)}: ${formatEuro(rate.subtotal)}`,
    ),
    `Subtotal: ${formatEuro(priceEstimate.subtotal)}`,
    ...(priceEstimate.discountRate > 0
      ? [`Long-stay discount (${priceEstimate.discountRate * 100}%): −${formatEuro(priceEstimate.discountAmount)}`]
      : []),
    ...(priceEstimate.earlyCheckInFee > 0
      ? [`Early check-in: +${formatEuro(EARLY_CHECK_IN_FEE)}`]
      : []),
    ...(priceEstimate.lateCheckOutFee > 0
      ? [`Late check-out: +${formatEuro(LATE_CHECK_OUT_FEE)}`]
      : []),
    `Estimated total: ${formatEuro(priceEstimate.total)}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone.trim() ? `+${getCountryCallingCode(data.phoneCountry)} ${data.phone.trim()}` : "(not provided)"}`,
    "",
    "Message:",
    data.message || "(none)",
  ].join("\n");

  const subject = `BOOKING ${data.checkIn}-${data.checkOut}, ${data.adults + data.children} guests (+ ${data.babies} ${data.babies === 1 ? "baby" : "babies"}), (${data.name})`;
  const oauth2Client = new OAuth2Client(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
  const encodedText = Buffer.from(text, "utf8")
    .toString("base64")
    .match(/.{1,76}/g)
    ?.join("\r\n");
  const rawMessage = [
    `From: ${OWNER_EMAIL}`,
    `To: ${OWNER_EMAIL}`,
    ...(PARTNER_EMAILS.length > 0
      ? [`Cc: ${PARTNER_EMAILS.join(", ")}`]
      : []),
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    encodedText ?? "",
  ].join("\r\n");

  try {
    const { token } = await oauth2Client.getAccessToken();
    if (!token) {
      return { ok: false, error: "Gmail did not provide an access token." };
    }

    const response = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw: Buffer.from(rawMessage, "utf8").toString("base64url"),
        }),
      },
    );
    const responseText = await response.text();
    let responseBody: unknown;
    if (responseText) {
      try {
        responseBody = JSON.parse(responseText);
      } catch {
        return {
          ok: false,
          error: `Gmail returned an invalid response (HTTP ${response.status}).`,
        };
      }
    }

    if (!response.ok) {
      return {
        ok: false,
        error:
          getGmailApiError(responseBody) ??
          `Gmail API request failed (HTTP ${response.status}).`,
      };
    }
    if (!hasGmailMessageId(responseBody)) {
      return { ok: false, error: "Gmail did not confirm the email was sent." };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "The booking email could not be sent through Gmail.",
    };
  }
}

function getGmailApiError(value: unknown): string | undefined {
  if (typeof value !== "object" || value === null || !("error" in value)) {
    return undefined;
  }
  const apiError = value.error;
  if (
    typeof apiError === "object" &&
    apiError !== null &&
    "message" in apiError &&
    typeof apiError.message === "string"
  ) {
    return apiError.message;
  }
  return undefined;
}

function hasGmailMessageId(value: unknown): value is { id: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string"
  );
}
