"use client";

import { useLanguage } from "@/app/assets/hooks/useLanguage";

export default function LanguageToggle({
  onLanguageChange,
}: {
  onLanguageChange?: () => void;
}) {
  const { language, setLanguage, translate } = useLanguage();

  return (
    <div
      role="group"
      aria-label={translate("Language", "Език")}
      className="inline-flex rounded-md border border-[var(--border)] p-0.5"
    >
      {(["en", "bg"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-label={option === "en" ? "English" : "Български"}
          aria-pressed={language === option}
          onClick={() => {
            setLanguage(option);
            onLanguageChange?.();
          }}
          className={`rounded px-2 py-1 text-xs font-semibold transition ${
            language === option
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--foreground)] hover:bg-[var(--surface)]"
          }`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
