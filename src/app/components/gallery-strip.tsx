import Image from "next/image";
import Link from "next/link";
import { GALLERY_IMAGES } from "@/app/configs/constants/siteConfig";

export default function GalleryStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Photos & video</h2>
          <Link
            href="/gallery"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            View gallery →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {GALLERY_IMAGES.slice(0, 6).map((img, i) => (
            <Link
              key={i}
              href="/gallery"
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[var(--border)]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
