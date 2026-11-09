"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Text from "@/app/assets/components/text";
import { useLanguage } from "@/app/assets/hooks/useLanguage";
import GalleryImageViewer from "@/app/assets/components/gallery-image-viewer";
import type { GalleryRoom } from "../configs/types/galleryTypes";

export default function GalleryRoomSlider({
  room,
}: {
  room: GalleryRoom;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const { translate } = useLanguage();

  const updateScrollControls = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    setCanScrollPrevious(slider.scrollLeft > 1);
    setCanScrollNext(
      slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    updateScrollControls();
    slider.addEventListener("scroll", updateScrollControls, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollControls);
    resizeObserver.observe(slider);

    return () => {
      slider.removeEventListener("scroll", updateScrollControls);
      resizeObserver.disconnect();
    };
  }, [updateScrollControls]);

  const scrollByImage = (direction: -1 | 1) => {
    const slider = sliderRef.current;
    const firstImage = slider?.firstElementChild;
    if (!slider || !(firstImage instanceof HTMLElement)) return;

    const gap = Number.parseFloat(getComputedStyle(slider).columnGap) || 0;
    slider.scrollBy({
      left: direction * (firstImage.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  };

  return (
    <section aria-labelledby={`gallery-${room.id}`} className="mb-8 last:mb-0">
      <h2
        id={`gallery-${room.id}`}
        className="mb-3 text-lg font-semibold text-[var(--foreground)]"
      >
        <Text bg={room.titleBg}>{room.title}</Text>
      </h2>
      <div className="relative">
        <div
          ref={sliderRef}
          role="region"
          aria-labelledby={`gallery-${room.id}`}
          tabIndex={0}
          className="gallery-slider"
        >
          {room.images.map((image) => (
            <div
              key={image.src}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--border)]"
            >
              <GalleryImageViewer image={image} />
            </div>
          ))}
        </div>
        <button
          type="button"
          aria-label={translate(
            `Previous ${room.title} photo`,
            `Предишна снимка: ${room.titleBg}`,
          )}
          disabled={!canScrollPrevious}
          onClick={() => scrollByImage(-1)}
          className="gallery-slider-arrow left-2"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={translate(
            `Next ${room.title} photo`,
            `Следваща снимка: ${room.titleBg}`,
          )}
          disabled={!canScrollNext}
          onClick={() => scrollByImage(1)}
          className="gallery-slider-arrow right-2"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
