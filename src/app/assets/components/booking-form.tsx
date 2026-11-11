"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { sendBookingEmail } from "@/app/assets/actions/sendBookingEmail";
import { useLanguage } from "@/app/assets/hooks/useLanguage";
import Text from "@/app/assets/components/text";
import {
  isAvailabilityResponse,
  isDateInBookedRanges,
  toYYYYMMDD,
  translateBookingError,
} from "@/app/assets/lib/bookingFormUtils";
import { calculateReservationPrice, formatEuro } from "@/app/assets/lib/reservationPricing";
import type { BookedDateRange, BookingFormData } from "@/app/assets/configs/types/appTypes";
import "react-day-picker/style.css";
import {
  EARLY_CHECK_IN_FEE,
  LATE_CHECK_OUT_FEE,
  WEEKDAY_RATE,
  WEEKEND_RATE,
} from "../configs/constants/bookingConfig";

const initial: BookingFormData = {
  checkIn: "",
  checkOut: "",
  earlyCheckIn: false,
  lateCheckOut: false,
  guests: 1,
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function BookingForm() {
  const { language, translate } = useLanguage();
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
  const [calendarReady, setCalendarReady] = useState(false);

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
    setCalendarReady(true);
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
  const normalizeDate = (date: Date) => {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    return day;
  };
  const isPastDate = (date: Date) => normalizeDate(date) < today;
  const isFutureUnavailable = (date: Date) =>
    !isPastDate(date) &&
    (normalizeDate(date) > lastBookableDay ||
      (availabilityStatus === "ready" &&
        isDateInBookedRanges(date, bookedDateRanges)));
  const disabledDays = (date: Date) => {
    return (
      isPastDate(date) ||
      normalizeDate(date) > lastBookableDay ||
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
      ? calculateReservationPrice(form.checkIn, form.checkOut, {
          earlyCheckIn: form.earlyCheckIn,
          lateCheckOut: form.lateCheckOut,
        })
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
        <p className="font-semibold">
          <Text bg="Заявката е изпратена успешно">Request sent successfully</Text>
        </p>
        <p className="mt-2 text-sm">
          <Text
            bg={
              <>
                Получихме запитването ви и ще отговорим на{" "}
                <strong>{submittedEmail || "имейла ви"}</strong> до 24 часа с информация за наличността и плащането.
              </>
            }
          >
            We've received your inquiry and will reply to{" "}
            <strong>{submittedEmail || "your email"}</strong> within 24 hours with availability and payment details.
          </Text>
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-green-700 underline hover:no-underline"
        >
          <Text bg="Изпратете друга заявка">Send another request</Text>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-[var(--border)] bg-white p-6">
      <div>
        <span className="block text-sm font-medium text-[var(--foreground)]">
          <Text bg="Дати">Dates</Text>
        </span>
        <p className="mt-0.5 text-xs text-[var(--muted)]" role="status">
          {availabilityStatus === "loading"
            ? translate("Loading Airbnb availability…", "Зареждане на наличността от Airbnb…")
            : availabilityStatus === "error"
              ? translateBookingError(availabilityError, translate)
              : translate(
                  "Past and unavailable dates are dimmed. Future unavailable dates have a light gray background, and today has a darker gray border. Select your check-in and check-out within the next 12 months.",
                  "Миналите и недостъпните дати са приглушени. Бъдещите недостъпни дати са със светлосив фон, а днешната дата е с по-тъмна сива рамка. Изберете настаняване и напускане в рамките на следващите 12 месеца."
                )}
        </p>
        <div className="mt-2 flex justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
          {calendarReady ? (
            <DayPicker
              mode="range"
              weekStartsOn={1}
              today={today}
              selected={selectedRange}
              onSelect={handleRangeSelect}
              disabled={disabledDays}
              modifiers={{
                futureUnavailable: isFutureUnavailable,
              }}
              modifiersClassNames={{
                futureUnavailable: "booking-calendar-future-unavailable",
              }}
              excludeDisabled
              numberOfMonths={numberOfMonths}
              defaultMonth={new Date()}
              startMonth={new Date()}
              endMonth={new Date(lastBookableDay.getFullYear(), lastBookableDay.getMonth())}
              lang={language === "bg" ? "bg-BG" : "en-GB"}
              formatters={{
                formatCaption: (month) =>
                  new Intl.DateTimeFormat(language === "bg" ? "bg-BG" : "en-GB", {
                    month: "long",
                    year: "numeric",
                  }).format(month),
                formatWeekdayName: (date) =>
                  new Intl.DateTimeFormat(language === "bg" ? "bg-BG" : "en-GB", {
                    weekday: "short",
                  }).format(date),
              }}
              labels={{
                labelNav: () =>
                  translate("Month navigation", "Навигация по месеци"),
                labelNext: () => translate("Next month", "Следващ месец"),
                labelPrevious: () => translate("Previous month", "Предишен месец"),
                labelWeekday: (date) =>
                  new Intl.DateTimeFormat(language === "bg" ? "bg-BG" : "en-GB", {
                    weekday: "long",
                  }).format(date),
                labelDayButton: (date) =>
                  new Intl.DateTimeFormat(language === "bg" ? "bg-BG" : "en-GB", {
                    dateStyle: "full",
                  }).format(date),
              }}
              className="booking-calendar rdp-root w-full max-w-none border-0 p-0"
              classNames={{
                months: "flex flex-wrap gap-4 justify-center",
                month: "flex flex-col gap-2",
                month_caption: "flex justify-center items-center h-8 font-medium",
                weekdays: "flex gap-1",
                weekday: "w-8 text-center text-xs text-[var(--muted)]",
                weeks: "rdp-weeks gap-1",
                week: "flex gap-1",
                day: "w-8 h-8 rounded-md text-center text-sm",
                day_button: "rdp-day_button w-8 h-8 rounded-md hover:bg-[var(--primary-light)] focus:bg-[var(--accent)] focus:text-white",
                selected:
                  "bg-[var(--accent)] text-white hover:bg-[var(--accent)] hover:text-white",
                today: "rdp-today font-semibold",
                disabled: "rdp-disabled booking-calendar-disabled cursor-not-allowed",
                outside: "text-[var(--muted)] opacity-60",
                range_start: "rounded-s-md bg-[var(--accent)] text-white",
                range_end: "rounded-e-md bg-[var(--accent)] text-white",
                range_middle: "rounded-none bg-[var(--primary-light)]",
              }}
            />
          ) : (
            <div className="min-h-[17rem] w-full" aria-hidden="true" />
          )}
        </div>
        {(form.checkIn || form.checkOut) && (
          <p className="mt-2 text-sm text-[var(--muted)]">
            {form.checkIn && form.checkOut
              ? `${form.checkIn} → ${form.checkOut}`
              : form.checkIn
                ? `${translate("Check-in", "Настаняване")}: ${form.checkIn} (${translate("select check-out", "изберете напускане")})`
                : ""}
          </p>
        )}
        {priceEstimate && (
          <div
            className="mt-4 rounded-lg border border-[var(--border)] bg-white p-4 text-sm"
            aria-live="polite"
          >
            <h2 className="font-semibold text-[var(--foreground)]">
              <Text bg="Очаквана цена на резервацията">
                Estimated reservation price
              </Text>
            </h2>
            <p className="mt-1 text-[var(--muted)]">
              {priceEstimate.nights}{" "}
              {language === "bg"
                ? priceEstimate.nights === 1
                  ? "нощувка"
                  : "нощувки"
                : priceEstimate.nights === 1
                  ? "night"
                  : "nights"}
            </p>
            <dl className="mt-3 space-y-1">
              {priceEstimate.weekdayNights > 0 && (
                <div className="flex justify-between gap-4">
                  <dt>
                    {priceEstimate.weekdayNights}{" "}
                    {translate("weekday nights", "делнични нощувки")} ×{" "}
                    {formatEuro(WEEKDAY_RATE, language === "bg" ? "bg-BG" : "en-IE")}
                  </dt>
                  <dd>{formatEuro(priceEstimate.weekdaySubtotal, language === "bg" ? "bg-BG" : "en-IE")}</dd>
                </div>
              )}
              {priceEstimate.weekendNights > 0 && (
                <div className="flex justify-between gap-4">
                  <dt>
                    {priceEstimate.weekendNights}{" "}
                    {translate("weekend nights", "уикенд нощувки")} ×{" "}
                    {formatEuro(WEEKEND_RATE, language === "bg" ? "bg-BG" : "en-IE")}
                  </dt>
                  <dd>{formatEuro(priceEstimate.weekendSubtotal, language === "bg" ? "bg-BG" : "en-IE")}</dd>
                </div>
              )}
              {priceEstimate.customDateRates.map((rate) => (
                <div
                  key={`${rate.startDate}-${rate.endDate}`}
                  className="flex justify-between gap-4"
                >
                  <dt>
                    <Text bg={rate.labelBg}>{rate.label}</Text>: {rate.nights}{" "}
                    {language === "bg"
                      ? rate.nights === 1
                        ? "нощувка"
                        : "нощувки"
                      : rate.nights === 1
                        ? "night"
                        : "nights"}{" "}
                    ×{" "}
                    {formatEuro(rate.nightlyRate, language === "bg" ? "bg-BG" : "en-IE")}
                  </dt>
                  <dd>{formatEuro(rate.subtotal, language === "bg" ? "bg-BG" : "en-IE")}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4">
                <dt><Text bg="Междинна сума">Subtotal</Text></dt>
                <dd>{formatEuro(priceEstimate.subtotal, language === "bg" ? "bg-BG" : "en-IE")}</dd>
              </div>
              {priceEstimate.discountRate > 0 && (
                <div className="flex justify-between gap-4 text-green-700">
                  <dt>
                    <Text bg="Отстъпка за дълъг престой">
                      Long-stay discount
                    </Text>{" "}
                    ({priceEstimate.discountRate * 100}%)
                  </dt>
                  <dd>
                    −{formatEuro(priceEstimate.discountAmount, language === "bg" ? "bg-BG" : "en-IE")}
                  </dd>
                </div>
              )}
              {priceEstimate.earlyCheckInFee > 0 && (
                <div className="flex justify-between gap-4 font-medium text-[var(--foreground)]">
                  <dt>
                    <Text bg="Ранно настаняване (без отстъпка)">
                      Early check-in
                    </Text>
                  </dt>
                  <dd>{formatEuro(priceEstimate.earlyCheckInFee, language === "bg" ? "bg-BG" : "en-IE")}</dd>
                </div>
              )}
              {priceEstimate.lateCheckOutFee > 0 && (
                <div className="flex justify-between gap-4 font-medium text-[var(--foreground)]">
                  <dt>
                    <Text bg="Късно напускане (без отстъпка)">
                      Late check-out
                    </Text>
                  </dt>
                  <dd>{formatEuro(priceEstimate.lateCheckOutFee, language === "bg" ? "bg-BG" : "en-IE")}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-2 font-semibold">
                <dt><Text bg="Очаквана обща сума">Estimated total</Text></dt>
                <dd>{formatEuro(priceEstimate.total, language === "bg" ? "bg-BG" : "en-IE")}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-[var(--muted)]">
              <Text bg="Ориентировъчна цена; домакинът ще потвърди крайната сума.">
                Informational estimate; the host will confirm the final price.
              </Text>
            </p>
          </div>
        )}
      </div>

      <label className="block">
        <span className="block text-sm font-medium text-[var(--foreground)]">
          <Text bg="Гости">Guests</Text>
        </span>
        <select
          required
          value={form.guests}
          onChange={(e) => setForm((f) => ({ ...f, guests: Number(e.target.value) }))}
          className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n}>
              {n} {language === "bg" ? (n === 1 ? "гост" : "гости") : (n === 1 ? "guest" : "guests")}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-[var(--foreground)]">
          <Text bg="Допълнителни опции">Optional extras</Text>
        </legend>
        <label className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] p-3">
          <span className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.earlyCheckIn}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  earlyCheckIn: event.target.checked,
                }))
              }
              className="size-4 accent-[var(--accent)]"
            />
            <Text bg="Ранно настаняване">Early check-in</Text>
          </span>
          <span className="text-sm font-medium">
            {formatEuro(EARLY_CHECK_IN_FEE, language === "bg" ? "bg-BG" : "en-IE")}
          </span>
        </label>
        <label className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] p-3">
          <span className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.lateCheckOut}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  lateCheckOut: event.target.checked,
                }))
              }
              className="size-4 accent-[var(--accent)]"
            />
            <Text bg="Късно напускане">Late check-out</Text>
          </span>
          <span className="text-sm font-medium">
            {formatEuro(LATE_CHECK_OUT_FEE, language === "bg" ? "bg-BG" : "en-IE")}
          </span>
        </label>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-medium text-[var(--foreground)]">
            <Text bg="Вашето име">Your name</Text>
          </span>
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
          <span className="block text-sm font-medium text-[var(--foreground)]">
            <Text bg="Имейл">Email</Text>
          </span>
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
        <span className="block text-sm font-medium text-[var(--foreground)]">
          <Text bg="Телефон (по избор)">Phone (optional)</Text>
        </span>
        <input
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
      </label>

      <label className="block">
        <span className="block text-sm font-medium text-[var(--foreground)]">
          <Text bg="Съобщение (по избор)">Message (optional)</Text>
        </span>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder={translate(
            "Special requests, arrival time, etc.",
            "Специални изисквания, час на пристигане и др."
          )}
          className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
      </label>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {translateBookingError(errorMessage, translate)}
        </p>
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
        {status === "sending" ? (
          <Text bg="Изпращане…">Sending…</Text>
        ) : (
          <Text bg="Изпратете заявка за резервация">Send booking request</Text>
        )}
      </button>
    </form>
  );
}
