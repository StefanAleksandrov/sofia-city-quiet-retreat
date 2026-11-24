"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js";
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
  MAX_COUNTED_GUESTS,
  WEEKDAY_RATE,
  WEEKEND_RATE,
} from "../configs/constants/bookingConfig";

const initial: BookingFormData = {
  checkIn: "",
  checkOut: "",
  earlyCheckIn: false,
  lateCheckOut: false,
  adults: 1,
  children: 0,
  babies: 0,
  name: "",
  email: "",
  phone: "",
  phoneCountry: "BG",
  message: "",
};

export default function BookingForm({
  initialPhoneCountry,
}: {
  initialPhoneCountry: CountryCode | null;
}) {
  const { language, translate } = useLanguage();
  const [form, setForm] = useState<BookingFormData>(() => ({
    ...initial,
    phoneCountry: initialPhoneCountry ?? initial.phoneCountry,
  }));
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
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);
  const guestPickerRef = useRef<HTMLDivElement>(null);
  const guestPickerButtonRef = useRef<HTMLButtonElement>(null);
  const [phoneCountryPickerOpen, setPhoneCountryPickerOpen] = useState(false);
  const [phoneCountrySearch, setPhoneCountrySearch] = useState("");
  const phoneCountryPickerRef = useRef<HTMLDivElement>(null);
  const phoneCountryPickerButtonRef = useRef<HTMLButtonElement>(null);
  const phoneCountrySearchRef = useRef<HTMLInputElement>(null);
  const guestCategories = [
    {
      key: "adults",
      label: translate("Adults", "Възрастни"),
      age: translate("Ages 13+", "Възраст: 13+"),
      decreaseLabel: translate("Decrease adults", "Намаляване на възрастните"),
      increaseLabel: translate("Increase adults", "Увеличаване на възрастните"),
    },
    {
      key: "children",
      label: translate("Children", "Деца"),
      age: translate("Ages 2-12", "Възраст: 2-12"),
      decreaseLabel: translate("Decrease children", "Намаляване на децата"),
      increaseLabel: translate("Increase children", "Увеличаване на децата"),
    },
    {
      key: "babies",
      label: translate("Babies", "Бебета"),
      age: translate("Under 2", "Под 2 години"),
      decreaseLabel: translate("Decrease babies", "Намаляване на бебетата"),
      increaseLabel: translate("Increase babies", "Увеличаване на бебетата"),
    },
  ] as const;
  const guestSummary = [
    `${form.adults} ${translate(
      form.adults === 1 ? "adult" : "adults",
      form.adults === 1 ? "възрастен" : "възрастни"
    )}`,
    ...(form.children > 0
      ? [
          `${form.children} ${translate(
            form.children === 1 ? "child" : "children",
            form.children === 1 ? "дете" : "деца"
          )}`,
        ]
      : []),
    ...(form.babies > 0
      ? [
          `${form.babies} ${translate(
            form.babies === 1 ? "baby" : "babies",
            form.babies === 1 ? "бебе" : "бебета"
          )}`,
        ]
      : []),
  ].join(", ");
  const locale = language === "bg" ? "bg" : "en";
  const displayCountryName = new Intl.DisplayNames([locale], { type: "region" });
  const phoneCountryOptions = getCountries()
    .map((country) => ({
      country,
      name: displayCountryName.of(country) ?? country,
      callingCode: `+${getCountryCallingCode(country)}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
  const searchTerm = phoneCountrySearch.trim().toLocaleLowerCase(locale);
  const filteredPhoneCountries = phoneCountryOptions.filter(
    (option) =>
      option.name.toLocaleLowerCase(locale).includes(searchTerm) ||
      option.callingCode.includes(searchTerm)
  );
  const selectedPhoneCountry =
    phoneCountryOptions.find((option) => option.country === form.phoneCountry) ??
    phoneCountryOptions.find((option) => option.country === "BG")!;

  function changeGuestCount(category: "adults" | "children" | "babies", amount: number) {
    setForm((current) => {
      const nextCount = current[category] + amount;
      const minimum = category === "adults" ? 1 : 0;
      if (nextCount < minimum || !Number.isSafeInteger(nextCount)) return current;
      if (
        category !== "babies" &&
        current.adults + current.children + amount > MAX_COUNTED_GUESTS
      ) {
        return current;
      }
      return { ...current, [category]: nextCount };
    });
  }

  function selectPhoneCountry(country: CountryCode) {
    setForm((current) => ({ ...current, phoneCountry: country }));
    setPhoneCountrySearch("");
    setPhoneCountryPickerOpen(false);
    phoneCountryPickerButtonRef.current?.focus();
  }

  useEffect(() => {
    if (!guestPickerOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !guestPickerRef.current?.contains(event.target)
      ) {
        setGuestPickerOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setGuestPickerOpen(false);
        guestPickerButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [guestPickerOpen]);

  useEffect(() => {
    if (!phoneCountryPickerOpen) return;
    phoneCountrySearchRef.current?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !phoneCountryPickerRef.current?.contains(event.target)
      ) {
        setPhoneCountryPickerOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPhoneCountryPickerOpen(false);
        phoneCountryPickerButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [phoneCountryPickerOpen]);

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

      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--foreground)]">
          <Text bg="Гости">Guests</Text>
        </p>
        <div className="relative" ref={guestPickerRef}>
          <button
            ref={guestPickerButtonRef}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={guestPickerOpen}
            aria-controls="guest-count-popover"
            onClick={() => setGuestPickerOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-left focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          >
            <span className="flex items-center gap-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="size-5 text-[var(--muted)]"
              >
                <path
                  d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{guestSummary}</span>
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className={`size-4 text-[var(--muted)] transition-transform ${guestPickerOpen ? "rotate-180" : ""}`}
            >
              <path
                d="m5 7.5 5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {guestPickerOpen && (
            <div
              id="guest-count-popover"
              role="dialog"
              aria-label={translate("Select guests", "Изберете гости")}
              className="absolute left-0 right-0 top-full z-30 mt-2 space-y-3 rounded-xl border border-[var(--border)] bg-white p-4 shadow-xl sm:left-auto sm:w-96"
            >
              {guestCategories.map(({ key, label, age, decreaseLabel, increaseLabel }) => {
                const value = form[key];
                const atMinimum = key === "adults" ? value <= 1 : value <= 0;
                const atMaximum =
                  key === "babies"
                    ? value >= Number.MAX_SAFE_INTEGER
                    : form.adults + form.children >= MAX_COUNTED_GUESTS;
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
                      <p className="text-xs text-[var(--muted)]">{age}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={decreaseLabel}
                        disabled={atMinimum}
                        onClick={() => changeGuestCount(key, -1)}
                        className="size-8 cursor-pointer rounded-full border border-[var(--border)] text-lg leading-none disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>
                      <output className="min-w-5 text-center" aria-label={`${label}: ${value}`}>
                        {value}
                      </output>
                      <button
                        type="button"
                        aria-label={increaseLabel}
                        disabled={atMaximum}
                        onClick={() => changeGuestCount(key, 1)}
                        className="size-8 cursor-pointer rounded-full border border-[var(--border)] text-lg leading-none disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-[var(--muted)]">
                <Text bg="Възрастните и децата са общо до 7. Бебетата не се включват в лимита.">
                  Adults and children are limited to 7 combined. Babies don&apos;t count toward this limit.
                </Text>
              </p>
            </div>
          )}
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--foreground)]">
          <Text bg="Допълнителни опции">Optional extras</Text>
        </legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-[var(--border)] p-3">
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
                className="size-4 cursor-pointer accent-[var(--accent)]"
              />
              <Text bg="Ранно настаняване">Early check-in</Text>
            </span>
            <span className="text-sm font-medium">
              {formatEuro(EARLY_CHECK_IN_FEE, language === "bg" ? "bg-BG" : "en-IE")}
            </span>
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-[var(--border)] p-3">
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
                className="size-4 cursor-pointer accent-[var(--accent)]"
              />
              <Text bg="Късно напускане">Late check-out</Text>
            </span>
            <span className="text-sm font-medium">
              {formatEuro(LATE_CHECK_OUT_FEE, language === "bg" ? "bg-BG" : "en-IE")}
            </span>
          </label>
        </div>
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

      <div>
        <span
          id="phone-number-label"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          <Text bg="Телефон (по избор)">Phone (optional)</Text>
        </span>
        <div className="mt-1 grid grid-cols-[6rem_minmax(0,1fr)] gap-2 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-3">
          <div className="relative" ref={phoneCountryPickerRef}>
            <button
              ref={phoneCountryPickerButtonRef}
              type="button"
              aria-label={translate(
                `Country calling code: ${selectedPhoneCountry.name} ${selectedPhoneCountry.callingCode}`,
                `Международен код: ${selectedPhoneCountry.name} ${selectedPhoneCountry.callingCode}`
              )}
              aria-haspopup="dialog"
              aria-expanded={phoneCountryPickerOpen}
              aria-controls="phone-country-picker"
              onClick={() => {
                setGuestPickerOpen(false);
                setPhoneCountryPickerOpen((open) => !open);
              }}
              className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] px-2 py-2 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            >
              <span>{selectedPhoneCountry.callingCode}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className={`size-4 text-[var(--muted)] transition-transform ${phoneCountryPickerOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="m5 7.5 5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {phoneCountryPickerOpen && (
              <div
                id="phone-country-picker"
                role="dialog"
                aria-label={translate("Select a country", "Изберете държава")}
                className="absolute left-0 top-full z-40 mt-2 w-72 max-w-[calc(100vw-3rem)] rounded-xl border border-[var(--border)] bg-white p-2 shadow-xl sm:w-80"
              >
                <input
                  ref={phoneCountrySearchRef}
                  type="search"
                  aria-label={translate("Search country by name", "Търсене по име на държава")}
                  autoComplete="off"
                  value={phoneCountrySearch}
                  onChange={(event) => setPhoneCountrySearch(event.target.value)}
                  placeholder={translate("Search country", "Търсене на държава")}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
                <div className="mt-2 max-h-64 overflow-y-auto">
                  {filteredPhoneCountries.length > 0 ? (
                    filteredPhoneCountries.map(({ country, name, callingCode }) => (
                      <button
                        key={country}
                        type="button"
                        aria-pressed={country === form.phoneCountry}
                        onClick={() => selectPhoneCountry(country)}
                        className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--surface)] focus:bg-[var(--surface)] focus:outline-none"
                      >
                        <span>{name}</span>
                        <span className="text-[var(--muted)]">{callingCode}</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-[var(--muted)]" role="status">
                      <Text bg="Няма намерени държави">No countries found</Text>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <input
            type="tel"
            aria-labelledby="phone-number-label"
            autoComplete="tel-national"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="min-w-0 w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
      </div>

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
