import Link from "next/link";
import {
  GALLERY_IMAGES,
  SHOWCASE_VIDEO_ID,
  SHOWCASE_VIDEO_PROVIDER,
} from "@/app/assets/configs/constants/siteConfig";
import Text from "@/app/assets/components/text";
import LocalizedIframe from "@/app/assets/components/localized-iframe";
import LocalizedImage from "@/app/assets/components/localized-image";
import { galleryMetadata } from "@/app/assets/configs/metadata";

export const metadata = galleryMetadata;

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          <Text bg="Галерия">Gallery</Text>
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          <Text bg="Разгледайте апартамента и удобствата отблизо.">
            A closer look at the apartment and its amenities.
          </Text>
        </p>
      </div>

      {SHOWCASE_VIDEO_ID && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">
            <Text bg="Видео обиколка">Video tour</Text>
          </h2>
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-[var(--surface)]">
            {SHOWCASE_VIDEO_PROVIDER === "youtube" ? (
              <LocalizedIframe
                src={`https://www.youtube.com/embed/${SHOWCASE_VIDEO_ID}?rel=0`}
                title="Apartment video tour"
                titleBg="Видео обиколка на апартамента"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="h-full w-full"
              />
            ) : (
              <LocalizedIframe
                src={`https://player.vimeo.com/video/${SHOWCASE_VIDEO_ID}`}
                title="Apartment video tour"
                titleBg="Видео обиколка на апартамента"
                allow="fullscreen; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          <Text bg="Снимки">Photos</Text>
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--border)]"
            >
              <LocalizedImage
                src={img.src}
                alt={img.alt}
                altBg={img.altBg}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={i < 3}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 text-center">
        <Link
          href="/book"
          className="inline-flex rounded-lg bg-[var(--accent-cta)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent-cta-hover)]"
        >
          <Text bg="Резервирайте престоя си">Book your stay</Text>
        </Link>
      </div>
    </div>
  );
}
