"use client";

import Image, { type ImageProps } from "next/image";
import { useLanguage } from "@/app/assets/components/language-provider";

export default function LocalizedImage({
  alt,
  altBg,
  ...props
}: Omit<ImageProps, "alt"> & { alt: string; altBg: string }) {
  const { language } = useLanguage();
  return <Image {...props} alt={language === "bg" ? altBg : alt} />;
}
