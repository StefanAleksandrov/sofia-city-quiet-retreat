import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  CalendarSyncError,
  refreshIntegratedBookedDateRanges,
} from "@/app/assets/lib/calendarIntegrations";

const COOLDOWN_MS = 2 * 60 * 1000;
let cooldownUntil = 0;

function getTimeCode(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;
  return `${hour}${minute}`;
}

function isRefreshPayload(
  value: unknown
): value is { code?: unknown; timeZone?: unknown } {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isRefreshPayload(payload)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    typeof payload.code !== "string" ||
    !/^\d{4}$/.test(payload.code) ||
    typeof payload.timeZone !== "string" ||
    payload.timeZone.length > 100
  ) {
    return NextResponse.json({ error: "Enter a valid four-digit time code." }, { status: 400 });
  }

  const now = new Date();
  let validCodes: string[];
  try {
    validCodes = [
      getTimeCode(now, payload.timeZone),
      getTimeCode(new Date(now.getTime() - 60_000), payload.timeZone),
    ];
  } catch {
    return NextResponse.json({ error: "The local timezone is invalid." }, { status: 400 });
  }

  if (!validCodes.includes(payload.code)) {
    return NextResponse.json({ error: "The time code is incorrect." }, { status: 401 });
  }

  const retryAfter = Math.ceil((cooldownUntil - now.getTime()) / 1000);
  if (retryAfter > 0) {
    return NextResponse.json(
      { error: `Please wait ${retryAfter} seconds before refreshing again.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  cooldownUntil = now.getTime() + COOLDOWN_MS;

  try {
    const bookedDateRanges = await refreshIntegratedBookedDateRanges();
    revalidatePath("/api/availability");
    return NextResponse.json({ bookedDateRanges });
  } catch (error) {
    if (error instanceof CalendarSyncError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Calendar refresh failed unexpectedly." },
      { status: 502 }
    );
  }
}
