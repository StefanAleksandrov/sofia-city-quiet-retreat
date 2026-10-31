export type BookedDateRange = { checkIn: string; checkOut: string };

function parseCalendarDate(lines: string[], property: "DTSTART" | "DTEND"): string {
  const line = lines.find((entry) => {
    const separator = entry.indexOf(":");
    if (separator < 0) return false;
    const name = entry.slice(0, separator).toUpperCase();
    return name === property || name.startsWith(`${property};`);
  });
  const value = line?.slice(line.indexOf(":") + 1);
  const match = value?.match(/^(\d{4})(\d{2})(\d{2})(?:T\d{6}Z?)?$/i);

  if (!match) {
    throw new Error(`Calendar event is missing a valid ${property}.`);
  }

  const [, year, month, day] = match;
  const timestamp = Date.UTC(Number(year), Number(month) - 1, Number(day));
  const date = new Date(timestamp);
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    throw new Error(`Calendar event contains an invalid ${property}.`);
  }

  return `${year}-${month}-${day}`;
}

export function parseAirbnbCalendar(ical: string): BookedDateRange[] {
  const lines = ical.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
  while (lines[lines.length - 1] === "") lines.pop();
  if (
    lines[0]?.replace(/^\uFEFF/, "") !== "BEGIN:VCALENDAR" ||
    lines[lines.length - 1] !== "END:VCALENDAR"
  ) {
    throw new Error("Calendar response is not a valid iCalendar document.");
  }

  const ranges: BookedDateRange[] = [];
  let eventLines: string[] | undefined;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      if (eventLines) throw new Error("Calendar contains a nested event.");
      eventLines = [];
    } else if (line === "END:VEVENT") {
      if (!eventLines) throw new Error("Calendar contains an unmatched event end.");

      const cancelled = eventLines.some((entry) => entry.toUpperCase() === "STATUS:CANCELLED");
      if (!cancelled) {
        const checkIn = parseCalendarDate(eventLines, "DTSTART");
        const checkOut = parseCalendarDate(eventLines, "DTEND");
        if (checkOut <= checkIn) {
          throw new Error("Calendar event has an invalid date range.");
        }
        ranges.push({ checkIn, checkOut });
      }

      eventLines = undefined;
    } else if (eventLines) {
      eventLines.push(line);
    }
  }

  if (eventLines) throw new Error("Calendar contains an unclosed event.");

  return ranges.sort((a, b) => a.checkIn.localeCompare(b.checkIn));
}

export function mergeBookedDateRanges(ranges: BookedDateRange[]): BookedDateRange[] {
  const sorted = [...ranges].sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const merged: BookedDateRange[] = [];

  for (const range of sorted) {
    const previous = merged[merged.length - 1];
    if (previous && range.checkIn <= previous.checkOut) {
      if (range.checkOut > previous.checkOut) previous.checkOut = range.checkOut;
    } else {
      merged.push({ ...range });
    }
  }

  return merged;
}
