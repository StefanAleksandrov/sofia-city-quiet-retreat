import Link from "next/link";
import { AMENITIES } from "@/app/assets/configs/constants/siteConfig";
import Text from "@/app/assets/components/text";
import { amenitiesMetadata } from "@/app/assets/configs/metadata";

const iconMap: Record<string, string> = {
  wifi: "📶",
  kitchen: "🍳",
  ac: "❄️",
  linen: "🛏️",
  toiletries: "🧴",
  cleaning: "🧹",
  laundry: "🧺",
  storage: "👔",
  tv: "📺",
  parking: "🅿️",
  elevator: "🛗",
  coffee: "☕",
  cooker: "♨️",
  cooking: "🍳",
  dining: "🍽️",
  fridge: "🧊",
  hairdryer: "💨",
  heating: "🌡️",
  "hot-water": "🚿",
  iron: "👕",
  kettle: "🫖",
  calendar: "📅",
  microwave: "〰️",
  mosquito: "🦟",
  oven: "♨️",
  balcony: "🌿",
  entrance: "🚪",
  "living-room": "🛋️",
  blinds: "🪟",
  cot: "🛏️",
};

export const metadata = amenitiesMetadata;

export default function AmenitiesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          <Text bg="Удобства">Amenities</Text>
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          <Text bg="Всичко необходимо за комфортен краткосрочен престой.">
            Everything you need for a comfortable short-term stay.
          </Text>
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {AMENITIES.map((item) => (
          <li
            key={item.label}
            className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-white p-4"
          >
            <span className="mt-0.5 text-2xl" aria-hidden>
              {iconMap[item.icon] ?? "✓"}
            </span>
            <span>
              <span className="font-medium text-[var(--foreground)]">
                <Text bg={item.labelBg}>{item.label}</Text>
              </span>
              {item.detail && item.detailBg && (
                <span className="mt-1 block text-sm text-[var(--muted)]">
                  <Text bg={item.detailBg}>{item.detail}</Text>
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-12 text-center">
        <Link
          href="/book"
          className="inline-flex rounded-lg bg-[var(--accent-cta)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent-cta-hover)]"
        >
          <Text bg="Проверете наличността">Check availability</Text>
        </Link>
      </div>
    </div>
  );
}
