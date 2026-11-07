import { ADDRESS } from "@/app/assets/configs/constants/siteConfig";
import Text from "@/app/assets/components/text";
import LocalizedIframe from "@/app/assets/components/localized-iframe";
import { locationMetadata } from "@/app/assets/configs/metadata";
import {
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsSearchUrl,
} from "@/app/assets/lib/maps";

export const metadata = locationMetadata;

export default function LocationPage() {
  const fullAddress = [
    ADDRESS.street,
    ADDRESS.postalCode,
    ADDRESS.city,
    ADDRESS.country,
  ].join(", ");
  const mapEmbedUrl = buildGoogleMapsEmbedUrl(fullAddress);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          <Text bg="Местоположение">Location</Text>
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          <Text bg="Тих квартал с удобен достъп до центъра на града и обществения транспорт.">
            Quiet neighborhood with easy access to the city center and public transport.
          </Text>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            <Text bg="Адрес">Address</Text>
          </h2>
          <address className="mt-3 not-italic text-[var(--muted)]">
            {ADDRESS.street}<br />
            {ADDRESS.postalCode} {ADDRESS.city}<br />
            {ADDRESS.country}
          </address>
          <a
            href={buildGoogleMapsSearchUrl(fullAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-[var(--accent)] hover:underline"
          >
            <Text bg="Отворете в Google Maps →">Open in Google Maps →</Text>
          </a>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            <Text bg="Как да стигнете">Getting there</Text>
          </h2>
          <ul className="mt-3 space-y-2 text-[var(--muted)]">
            <li>• <Text bg="Метростанции и автобусни спирки на пешеходно разстояние">Metro and bus stops within walking distance</Text></li>
            <li>• <Text bg="Има таксита и услуги за споделено пътуване">Taxi and ride-share available</Text></li>
            <li>• <Text bg="Летище София (SOF) — около 30 минути с кола или 45 минути с метро">Sofia Airport (SOF) ~30 min by car or ~45 minutes by metro</Text></li>
          </ul>
        </section>
      </div>

      <div className="mt-8 aspect-video w-full overflow-hidden rounded-xl border border-[var(--border)]">
        <LocalizedIframe
          src={mapEmbedUrl}
          title="Map location"
          titleBg="Местоположение на картата"
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
          <Text bg="Резервирайте престоя си">Book your stay</Text>
        </a>
      </div>
    </div>
  );
}
