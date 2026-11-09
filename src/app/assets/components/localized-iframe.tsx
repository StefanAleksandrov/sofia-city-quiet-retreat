"use client";

import { useLanguage } from "@/app/assets/hooks/useLanguage";

export default function LocalizedIframe({
  title,
  titleBg,
  ...props
}: React.IframeHTMLAttributes<HTMLIFrameElement> & { titleBg: string }) {
  const { language } = useLanguage();
  return <iframe {...props} title={language === "bg" ? titleBg : title} />;
}
