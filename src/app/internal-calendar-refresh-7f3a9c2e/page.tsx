import type { Metadata } from "next";
import CalendarRefreshForm from "./refresh-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CalendarRefreshPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-12">
      <section className="w-full rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Refresh calendars</h1>
        <p className="mt-2 text-sm text-stone-600">
          Enter the current four-digit time in your local timezone to fetch the latest
          Airbnb and Booking.com availability.
        </p>
        <CalendarRefreshForm />
      </section>
    </main>
  );
}
