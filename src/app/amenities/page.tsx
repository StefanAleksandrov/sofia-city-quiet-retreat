import Link from "next/link";
import { AMENITIES } from "@/app/assets/configs/constants/siteConfig";

const iconMap: Record<string, string> = {
  wifi: "📶",
  kitchen: "🍳",
  ac: "❄️",
  washing: "🧺",
  tv: "📺",
  parking: "🅿️",
  elevator: "🛗",
  location: "📍",
};

export const metadata = {
  title: "Amenities",
  description:
    "What’s included: WiFi, kitchen, air conditioning, washing machine, TV, parking, and more.",
};

export default function AmenitiesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Amenities</h1>
        <p className="mt-2 text-[var(--muted)]">
          Everything you need for a comfortable short-term stay.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {AMENITIES.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-white p-4"
          >
            <span className="text-2xl" aria-hidden>
              {iconMap[item.icon] ?? "✓"}
            </span>
            <span className="font-medium text-[var(--foreground)]">{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12 text-center">
        <Link
          href="/book"
          className="inline-flex rounded-lg bg-[var(--accent-cta)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent-cta-hover)]"
        >
          Check availability
        </Link>
      </div>
    </div>
  );
}
