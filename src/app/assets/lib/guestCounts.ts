import { MAX_COUNTED_GUESTS } from "../configs/constants/bookingConfig";

export function areGuestCountsValid(
  adults: unknown,
  children: unknown,
  babies: unknown
): boolean {
  return (
    typeof adults === "number" &&
    Number.isSafeInteger(adults) &&
    adults >= 1 &&
    typeof children === "number" &&
    Number.isSafeInteger(children) &&
    children >= 0 &&
    typeof babies === "number" &&
    Number.isSafeInteger(babies) &&
    babies >= 0 &&
    adults + children <= MAX_COUNTED_GUESTS
  );
}
