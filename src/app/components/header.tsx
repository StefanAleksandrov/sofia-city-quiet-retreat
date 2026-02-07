import Link from "next/link";
import { NAVIGATION_ITEMS } from "@/app/configs/constants/appConstants";
import { SITE_NAME } from "@/app/configs/constants/siteConfig";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold text-[var(--primary)] transition hover:text-[var(--primary-hover)]"
        >
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-1 sm:gap-4" aria-label="Main">
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
      </div>
    </header>
  );
}
