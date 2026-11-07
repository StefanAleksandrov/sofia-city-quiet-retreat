import Link from "next/link";
import {
  GALLERY_ROOMS,
  SHOWCASE_VIDEO_ID,
  SHOWCASE_VIDEO_PROVIDER,
} from "@/app/assets/configs/constants/siteConfig";
import Text from "@/app/assets/components/text";
import LocalizedIframe from "@/app/assets/components/localized-iframe";
import GalleryRoomSlider from "@/app/assets/components/gallery-room-slider";
import { galleryMetadata } from "@/app/assets/configs/metadata";

export const metadata = galleryMetadata;

export default function GalleryPage() {
  return (
    <>
      {SHOWCASE_VIDEO_ID && (
        <section className="relative left-1/2 mb-6 aspect-video w-screen -translate-x-1/2 overflow-hidden bg-[var(--surface)]">
          {SHOWCASE_VIDEO_PROVIDER === "youtube" ? (
            <LocalizedIframe
              src={`https://www.youtube.com/embed/${SHOWCASE_VIDEO_ID}?autoplay=1&mute=1&controls=1&playsinline=1&rel=0`}
              title="Apartment video tour"
              titleBg="Видео обиколка на апартамента"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="eager"
              className="h-full w-full"
            />
          ) : (
            <LocalizedIframe
              src={`https://player.vimeo.com/video/${SHOWCASE_VIDEO_ID}?autoplay=1&muted=1&playsinline=1`}
              title="Apartment video tour"
              titleBg="Видео обиколка на апартамента"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="eager"
              className="h-full w-full"
            />
          )}
        </section>
      )}

      <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <section>
          <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)]">
            <Text bg="Галерия">Gallery</Text>
          </h1>
          {GALLERY_ROOMS.map((room) => (
            <GalleryRoomSlider key={room.id} room={room} />
          ))}
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
    </>
  );
}
