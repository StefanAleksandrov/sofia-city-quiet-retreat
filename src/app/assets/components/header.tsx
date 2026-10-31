"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NAVIGATION_ITEMS } from "@/app/assets/configs/constants/appConstants";
import { SITE_NAME } from "@/app/assets/configs/constants/siteConfig";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (
        isMobileMenuOpen &&
        event.target instanceof Node &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label={SITE_NAME}
          className="whitespace-nowrap text-base font-bold text-[var(--primary)] transition hover:text-[var(--primary-hover)] sm:text-lg"
        >
          {SITE_NAME}
        </Link>
        <nav className="hidden items-center gap-1 sm:flex sm:gap-4" aria-label="Main">
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.href === "/book"
                  ? "rounded-md bg-[var(--accent-cta)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--accent-cta-hover)]"
                  : "rounded-md px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)]"
              }
            >
              {item.textContent}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/book"
            className="whitespace-nowrap rounded-md bg-[var(--accent-cta)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--accent-cta-hover)]"
          >
            Book now
          </Link>
          <div
            ref={mobileMenuRef}
            className={`mobile-menu relative${isMobileMenuOpen ? " is-open" : ""}`}
          >
            <button
              ref={mobileMenuButtonRef}
              type="button"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--foreground)] hover:bg-[var(--surface)]"
            >
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            {isMobileMenuOpen && (
              <nav
                id="mobile-navigation"
                aria-label="Mobile"
                className="absolute right-0 top-full z-50 mt-2 flex min-w-44 flex-col rounded-lg border border-[var(--border)] bg-white p-2 shadow-lg"
              >
                {NAVIGATION_ITEMS.filter((item) => item.href !== "/book").map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)]"
                  >
                    {item.textContent}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
