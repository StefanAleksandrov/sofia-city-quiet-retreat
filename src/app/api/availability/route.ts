import { NextResponse } from "next/server";
import {
  BOOKED_DATE_RANGES,
} from "@/app/assets/configs/constants/siteConfig";
import { getIntegratedBookedDateRanges, CalendarSyncError } from "@/app/assets/lib/calendarIntegrations";
import { mergeBookedDateRanges } from "@/app/assets/lib/icalendar";

export const revalidate = 900;

export async function GET() {
  try {
    const bookedDateRanges = mergeBookedDateRanges([
      ...BOOKED_DATE_RANGES,
      ...(await getIntegratedBookedDateRanges()),
    ]);

    return NextResponse.json({ bookedDateRanges });
  } catch (error) {
    if (error instanceof CalendarSyncError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Calendar sync failed unexpectedly." },
      { status: 502 }
    );
  }
}
