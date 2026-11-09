"use client";

import { useLanguage } from "@/app/assets/hooks/useLanguage";

export default function Text({
  children,
  bg,
}: {
  children: React.ReactNode;
  bg: React.ReactNode;
}) {
  const { language } = useLanguage();
  return <>{language === "bg" ? bg : children}</>;
}
