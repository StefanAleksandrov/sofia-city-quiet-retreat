import { NextResponse } from "next/server";
import {
  BOOKED_DATE_RANGES,
} from "@/app/assets/configs/constants/siteConfig";
import {
  mergeBookedDateRanges,
  parseAirbnbCalendar,
} from "@/app/assets/lib/airbnbCalendar";

export const revalidate = 900;

export async function GET() {
  const feedUrl = process.env.AIRBNB_ICAL_URL;
  if (!feedUrl) {
    return NextResponse.json(
      { error: "Airbnb calendar sync is not configured." },
      { status: 503 }
    );
  }

  let url: URL;
  try {
    url = new URL(feedUrl);
  } catch {
    return NextResponse.json(
      { error: "Airbnb calendar URL is invalid." },
      { status: 500 }
    );
  }

  if (
    url.protocol !== "https:" ||
    !["www.airbnb.co.uk", "www.airbnb.com"].includes(url.hostname)
  ) {
    return NextResponse.json(
      { error: "Airbnb calendar URL must use a supported Airbnb HTTPS address." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(url, {
      headers: { Accept: "text/calendar" },
      next: { revalidate },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Airbnb calendar could not be loaded (HTTP ${response.status}).` },
        { status: 502 }
      );
    }

    const calendar = await response.text();
    if (calendar.length > 1_000_000) {
      return NextResponse.json(
        { error: "Airbnb calendar response is unexpectedly large." },
        { status: 502 }
      );
    }

    const airbnbRanges = parseAirbnbCalendar(calendar);
    const bookedDateRanges = mergeBookedDateRanges([
      ...BOOKED_DATE_RANGES,
      ...airbnbRanges,
    ]);

    return NextResponse.json({ bookedDateRanges });
  } catch {
    return NextResponse.json(
      { error: "Airbnb calendar could not be retrieved or contains invalid calendar data." },
      { status: 502 }
    );
  }
}
