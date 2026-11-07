"use client";

import { useCallback, useEffect, useRef } from "react";
import LocalizedImage from "@/app/assets/components/localized-image";
import { useLanguage } from "@/app/assets/components/language-provider";
import type { GALLERY_IMAGES } from "@/app/assets/configs/constants/siteConfig";

type GalleryImage = (typeof GALLERY_IMAGES)[number];

type PageScrollState = {
  overflow: string;
  position: string;
  top: string;
  width: string;
  scrollY: number;
};

export default function GalleryImageViewer({
  image,
}: {
  image: GalleryImage;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pageScrollStateRef = useRef<PageScrollState | null>(null);
  const { translate } = useLanguage();

  const restorePageScroll = useCallback(() => {
    const scrollState = pageScrollStateRef.current;
    if (!scrollState) return;

    const body = document.body;
    body.style.overflow = scrollState.overflow;
    body.style.position = scrollState.position;
    body.style.top = scrollState.top;
    body.style.width = scrollState.width;
    pageScrollStateRef.current = null;
    window.scrollTo(0, scrollState.scrollY);
  }, []);

  useEffect(() => restorePageScroll, [restorePageScroll]);

  const openFullscreen = () => {
    const body = document.body;
    pageScrollStateRef.current = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      scrollY: window.scrollY,
    };
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${window.scrollY}px`;
    body.style.width = "100%";
    dialogRef.current?.showModal();
  };

  const openLabel = translate(
    `View ${image.alt} full screen`,
    `Покажи на цял екран: ${image.altBg}`,
  );
  const closeLabel = translate("Close full screen image", "Затвори снимката");

  return (
    <>
      <div className="gallery-photo">
        <LocalizedImage
          src={image.src}
          alt={image.alt}
          altBg={image.altBg}
          fill
          className="object-cover"
          sizes="(max-width: 1023px) 90vw, 32vw"
        />
        <button
          type="button"
          aria-label={openLabel}
          onClick={openFullscreen}
          className="gallery-photo-trigger"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3" />
          </svg>
        </button>
      </div>
      <dialog
        ref={dialogRef}
        aria-label={openLabel}
        className="gallery-image-dialog"
        onClose={restorePageScroll}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            dialogRef.current?.close();
          }
        }}
      >
        <button
          type="button"
          aria-label={closeLabel}
          onClick={() => dialogRef.current?.close()}
          className="gallery-image-close"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
          >
            <path d="m18 6-12 12M6 6l12 12" />
          </svg>
        </button>
        <LocalizedImage
          src={image.src}
          alt={image.alt}
          altBg={image.altBg}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </dialog>
    </>
  );
}
