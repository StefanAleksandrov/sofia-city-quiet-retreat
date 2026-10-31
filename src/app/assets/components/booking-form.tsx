"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { sendBookingEmail } from "@/app/assets/actions/sendBookingEmail";
import type { BookedDateRange } from "@/app/assets/lib/airbnbCalendar";
import {
  calculateReservationPrice,
  formatEuro,
  WEEKDAY_RATE,
  WEEKEND_RATE,
} from "@/app/assets/lib/reservationPricing";
import type { BookingFormData } from "@/app/assets/configs/types/appTypes";
import "react-day-picker/style.css";

const initial: BookingFormData = {
  checkIn: "",
  checkOut: "",
  guests: 1,
  name: "",
  email: "",
  phone: "",
  message: "",
};

/** Booked range: checkIn/checkOut are "YYYY-MM-DD". checkOut is the day guests leave (exclusive). */
function isDateInBookedRanges(
  date: Date,
  ranges: { checkIn: string; checkOut: string }[]
): boolean {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const t = new Date(y, m, d).getTime();

  for (const range of ranges) {
    const [ciY, ciM, ciD] = range.checkIn.split("-").map(Number);
    const [coY, coM, coD] = range.checkOut.split("-").map(Number);
    const checkInTime = new Date(ciY, ciM - 1, ciD).getTime();
    const checkOutTime = new Date(coY, coM - 1, coD).getTime();
    if (t >= checkInTime && t < checkOutTime) return true;
  }
  return false;
}

type AvailabilityResponse = { bookedDateRanges: BookedDateRange[] };

function isAvailabilityResponse(value: unknown): value is AvailabilityResponse {
  if (!value || typeof value !== "object" || !("bookedDateRanges" in value)) {
    return false;
  }

  const ranges = value.bookedDateRanges;
  return (
    Array.isArray(ranges) &&
    ranges.every(
      (range) =>
        range &&
        typeof range === "object" &&
        "checkIn" in range &&
        typeof range.checkIn === "string" &&
        "checkOut" in range &&
        typeof range.checkOut === "string"
    )
  );
}

export default function BookingForm() {
  const [form, setForm] = useState<BookingFormData>(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [bookedDateRanges, setBookedDateRanges] = useState<BookedDateRange[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [availabilityError, setAvailabilityError] = useState("");
  const [numberOfMonths, setNumberOfMonths] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAvailability() {
      try {
        const response = await fetch("/api/availability", {
          cache: "no-store",
          signal: controller.signal,
        });
        const result: unknown = await response.json();

        if (!response.ok) {
          const message =
            result &&
            typeof result === "object" &&
            "error" in result &&
            typeof result.error === "string"
              ? result.error
              : "Airbnb availability could not be loaded.";
          throw new Error(message);
        }

        if (!isAvailabilityResponse(result)) {
          throw new Error("Airbnb availability response is invalid.");
        }

        setBookedDateRanges(result.bookedDateRanges);
        setAvailabilityStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        setAvailabilityError(
          error instanceof Error ? error.message : "Airbnb availability could not be loaded."
        );
        setAvailabilityStatus("error");
      }
    }

    void loadAvailability();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 640px)");
    const updateMonthCount = () => setNumberOfMonths(desktopQuery.matches ? 2 : 1);

    updateMonthCount();
    desktopQuery.addEventListener("change", updateMonthCount);
    return () => desktopQuery.removeEventListener("change", updateMonthCount);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastBookableDayOfMonth = new Date(today.getFullYear() + 1, today.getMonth() + 1, 0).getDate();
  const lastBookableDay = new Date(
    today.getFullYear() + 1,
    today.getMonth(),
    Math.min(today.getDate(), lastBookableDayOfMonth)
  );
  const disabledDays = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return (
      d < today ||
      d > lastBookableDay ||
      availabilityStatus !== "ready" ||
      isDateInBookedRanges(date, bookedDateRanges)
    );
  };
  const selectedRange =
    form.checkIn || form.checkOut
      ? {
          from: form.checkIn ? new Date(form.checkIn + "T12:00:00") : undefined,
          to: form.checkOut ? new Date(form.checkOut + "T12:00:00") : undefined,
        }
      : undefined;
  const priceEstimate =
    form.checkIn && form.checkOut && form.checkOut > form.checkIn
      ? calculateReservationPrice(form.checkIn, form.checkOut)
      : null;

  function handleRangeSelect(range: { from?: Date; to?: Date } | undefined) {
    const checkIn = range?.from ? toYYYYMMDD(range.from) : "";
    const checkOut =
      range?.from && range.to && toYYYYMMDD(range.to) > checkIn
        ? toYYYYMMDD(range.to)
        : "";

    setForm((f) => ({
      ...f,
      checkIn,
      checkOut,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    const result = await sendBookingEmail(form);
    if (result.ok) {
      setSubmittedEmail(form.email);
      setStatus("success");
      setForm(initial);
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-800">
        <p className="font-semibold">Request sent successfully</p>
        <p className="mt-2 text-sm">
          We've received your inquiry and will reply to <strong>{submittedEmail || "your email"}</strong> within 24 hours with availability and payment details.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-green-700 underline hover:no-underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-[var(--border)] bg-white p-6">
      <div>
        <span className="block text-sm font-medium text-[var(--foreground)]">Dates</span>
        <p className="mt-0.5 text-xs text-[var(--muted)]" role="status">
          {availabilityStatus === "loading"
            ? "Loading Airbnb availability…"
            : availabilityStatus === "error"
              ? availabilityError
              : "Grey dates are booked or closed. Select your check-in and check-out within the next 12 months."}
        </p>
        <div className="mt-2 flex justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
          <DayPicker
            mode="range"
            weekStartsOn={1}
            selected={selectedRange}
            onSelect={handleRangeSelect}
            disabled={disabledDays}
            excludeDisabled
            numberOfMonths={numberOfMonths}
            defaultMonth={new Date()}
            startMonth={new Date()}
            endMonth={new Date(lastBookableDay.getFullYear(), lastBookableDay.getMonth())}
            className="booking-calendar rdp-root w-full max-w-none border-0 p-0"
            classNames={{
              months: "flex flex-wrap gap-4 justify-center",
              month: "flex flex-col gap-2",
              month_caption: "flex justify-center items-center h-8 font-medium",
              weekdays: "flex gap-1",
              weekday: "w-8 text-center text-xs text-[var(--muted)]",
              week: "flex gap-1",
              day: "w-8 h-8 rounded-md text-center text-sm",
              day_button: "w-8 h-8 rounded-md hover:bg-[var(--primary-light)] focus:bg-[var(--accent)] focus:text-white",
              selected:
                "bg-[var(--accent)] text-white hover:bg-[var(--accent)] hover:text-white",
              today: "font-semibold",
              disabled: "opacity-40 cursor-not-allowed line-through",
              outside: "text-[var(--muted)] opacity-60",
              range_start: "rounded-s-md bg-[var(--accent)] text-white",
              range_end: "rounded-e-md bg-[var(--accent)] text-white",
              range_middle: "rounded-none bg-[var(--primary-light)]",
            }}
          />
        </div>
        {(form.checkIn || form.checkOut) && (
          <p className="mt-2 text-sm text-[var(--muted)]">
            {form.checkIn && form.checkOut
              ? `${form.checkIn} → ${form.checkOut}`
              : form.checkIn
                ? `Check-in: ${form.checkIn} (select check-out)`
                : ""}
          </p>
        )}
        {priceEstimate && (
          <div
            className="mt-4 rounded-lg border border-[var(--border)] bg-white p-4 text-sm"
            aria-live="polite"
          >
            <h2 className="font-semibold text-[var(--foreground)]">
              Estimated reservation price
            </h2>
            <p className="mt-1 text-[var(--muted)]">
              {priceEstimate.nights} {priceEstimate.nights === 1 ? "night" : "nights"}:{" "}
              {priceEstimate.weekdayNights} weekday × {formatEuro(WEEKDAY_RATE)} and{" "}
              {priceEstimate.weekendNights} weekend × {formatEuro(WEEKEND_RATE)}
            </p>
            <dl className="mt-3 space-y-1">
              <div className="flex justify-between gap-4">
                <dt>Subtotal</dt>
                <dd>{formatEuro(priceEstimate.subtotal)}</dd>
              </div>
              {priceEstimate.discountRate > 0 && (
                <div className="flex justify-between gap-4 text-green-700">
                  <dt>Long-stay discount ({priceEstimate.discountRate * 100}%)</dt>
                  <dd>
                    −{formatEuro(priceEstimate.discountAmount)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-2 font-semibold">
                <dt>Estimated total</dt>
                <dd>{formatEuro(priceEstimate.total)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Informational estimate; the host will confirm the final price.
            </p>
          </div>
        )}
      </div>

      <label className="block">
        <span className="block text-sm font-medium text-[var(--foreground)]">Guests</span>
        <select
          required
          value={form.guests}
          onChange={(e) => setForm((f) => ({ ...f, guests: Number(e.target.value) }))}
          className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-medium text-[var(--foreground)]">Your name</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-[var(--foreground)]">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </label>
      </div>

      <label className="block">
        <span className="block text-sm font-medium text-[var(--foreground)]">Phone (optional)</span>
        <input
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
      </label>

      <label className="block">
        <span className="block text-sm font-medium text-[var(--foreground)]">Message (optional)</span>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Special requests, arrival time, etc."
          className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
      </label>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={
          status === "sending" ||
          availabilityStatus !== "ready" ||
          !form.checkIn ||
          !form.checkOut
        }
        className="w-full rounded-lg bg-[var(--accent-cta)] py-3 font-semibold text-white transition hover:bg-[var(--accent-cta-hover)] disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Send booking request"}
      </button>
    </form>
  );
}

function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
