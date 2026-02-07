import Image from "next/image";
import Link from "next/link";
import {
  GALLERY_IMAGES,
  SHOWCASE_VIDEO_ID,
  SHOWCASE_VIDEO_PROVIDER,
} from "@/app/configs/constants/siteConfig";

export const metadata = {
  title: "Gallery",
  description:
    "Photos and video of our Sofia apartment. Living room, bedroom, kitchen, bathroom and views.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Gallery</h1>
        <p className="mt-2 text-[var(--muted)]">
          A closer look at the apartment and its amenities.
        </p>
      </div>

      {SHOWCASE_VIDEO_ID && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Video tour</h2>
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-[var(--surface)]">
            {SHOWCASE_VIDEO_PROVIDER === "youtube" ? (
              <iframe
                src={`https://www.youtube.com/embed/${SHOWCASE_VIDEO_ID}?rel=0`}
                title="Apartment video tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="h-full w-full"
              />
            ) : (
              <iframe
                src={`https://player.vimeo.com/video/${SHOWCASE_VIDEO_ID}`}
                title="Apartment video tour"
                allow="fullscreen; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-semibold">Photos</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--border)]"
            >
              <Image
                src={img.src}
                alt={img.alt}
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
          Book your stay
        </Link>
      </div>
    </div>
  );
}
