"use client";

import { FormEvent, useState } from "react";

export default function CalendarRefreshForm() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsRefreshing(true);

    try {
      const response = await fetch("/api/calendar-refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      const result: { error?: string; bookedDateRanges?: unknown[] } =
        await response.json();

      if (!response.ok) {
        setMessage(result.error ?? "Calendar refresh failed.");
        return;
      }

      setMessage(
        `Calendar refresh complete. ${result.bookedDateRanges?.length ?? 0} date ranges loaded.`
      );
      setCode("");
    } catch {
      setMessage("Calendar refresh failed. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium" htmlFor="refresh-code">
        Current time code
      </label>
      <input
        autoComplete="one-time-code"
        className="w-full rounded-md border border-stone-300 px-3 py-2 text-lg tracking-[0.3em]"
        id="refresh-code"
        inputMode="numeric"
        maxLength={4}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 4))}
        pattern="\d{4}"
        required
        value={code}
      />
      <button
        className="rounded-md bg-stone-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isRefreshing || code.length !== 4}
        type="submit"
      >
        {isRefreshing ? "Refreshing…" : "Refresh calendars"}
      </button>
      {message && (
        <p aria-live="polite" className="text-sm" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
