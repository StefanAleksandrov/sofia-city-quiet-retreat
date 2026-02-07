import { ADDRESS } from "@/app/configs/constants/siteConfig";

export const metadata = {
  title: "Location",
  description:
    "Find us in Sofia. Central, quiet neighborhood with easy access to transport and city center.",
};

/** Builds a Google Maps embed URL from the apartment address in config. */
function getMapEmbedUrl(fullAddress: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
}

export default function LocationPage() {
  const fullAddress = [
    ADDRESS.street,
    ADDRESS.postalCode,
    ADDRESS.city,
    ADDRESS.country,
  ].join(", ");
  const mapEmbedUrl = getMapEmbedUrl(fullAddress);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Location</h1>
        <p className="mt-2 text-[var(--muted)]">
          Quiet neighborhood with easy access to the city center and public transport.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Address</h2>
          <address className="mt-3 not-italic text-[var(--muted)]">
            {ADDRESS.street}<br />
            {ADDRESS.postalCode} {ADDRESS.city}<br />
            {ADDRESS.country}
          </address>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-[var(--accent)] hover:underline"
          >
            Open in Google Maps →
          </a>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Getting there</h2>
          <ul className="mt-3 space-y-2 text-[var(--muted)]">
            <li>• Metro and bus stops within walking distance</li>
            <li>• Taxi and ride-share available</li>
            <li>• Sofia Airport (SOF) ~30 min by car or ~45 minutes by metro</li>
          </ul>
        </section>
      </div>

      <div className="mt-8 aspect-video w-full overflow-hidden rounded-xl border border-[var(--border)]">
        <iframe
          src={mapEmbedUrl}
          title="Map location"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="min-h-[300px]"
        />
      </div>

      <div className="mt-10 text-center">
        <a
          href="/book"
          className="inline-flex rounded-lg bg-[var(--accent-cta)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent-cta-hover)]"
        >
          Book your stay
        </a>
      </div>
    </div>
  );
}
