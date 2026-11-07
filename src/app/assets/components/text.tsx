"use client";

import { useLanguage } from "@/app/assets/components/language-provider";

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
