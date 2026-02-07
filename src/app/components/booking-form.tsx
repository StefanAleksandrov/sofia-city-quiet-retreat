"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { sendBookingEmail } from "@/app/actions/sendBookingEmail";
import type { BookingFormData } from "@/app/configs/types/appTypes";
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

type BookedRange = { checkIn: string; checkOut: string };

export default function BookingForm({
  bookedDateRanges = [],
}: {
  bookedDateRanges: BookedRange[];
}) {
  const [form, setForm] = useState<BookingFormData>(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const disabledDays = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today || isDateInBookedRanges(date, bookedDateRanges);
  };
  const selectedRange =
    form.checkIn || form.checkOut
      ? {
          from: form.checkIn ? new Date(form.checkIn + "T12:00:00") : undefined,
          to: form.checkOut ? new Date(form.checkOut + "T12:00:00") : undefined,
        }
      : undefined;

  function handleRangeSelect(range: { from?: Date; to?: Date } | undefined) {
    setForm((f) => ({
      ...f,
      checkIn: range?.from ? toYYYYMMDD(range.from) : "",
      checkOut: range?.to ? toYYYYMMDD(range.to) : "",
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
        <p className="mt-0.5 text-xs text-[var(--muted)]">
          Grey dates are already booked. Select your check-in and check-out.
        </p>
        <div className="mt-2 flex justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={handleRangeSelect}
            disabled={disabledDays}
            excludeDisabled
            numberOfMonths={2}
            defaultMonth={new Date()}
            startMonth={new Date()}
            className="rdp-root border-0 p-0"
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
      </div>

      <label className="block">
        <span className="block text-sm font-medium text-[var(--foreground)]">Guests</span>
        <select
          required
          value={form.guests}
          onChange={(e) => setForm((f) => ({ ...f, guests: Number(e.target.value) }))}
          className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
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
        disabled={status === "sending" || !form.checkIn || !form.checkOut}
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
