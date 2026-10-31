import Link from "next/link";
import { NAVIGATION_ITEMS } from "@/app/assets/configs/constants/appConstants";
import { SITE_NAME } from "@/app/assets/configs/constants/siteConfig";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[var(--primary)]">{SITE_NAME}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Short-term apartment rentals in Sofia. Book directly with the host.
            </p>
          </div>
          <nav className="flex flex-wrap gap-4" aria-label="Footer">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[var(--accent)] hover:underline"
              >
                {item.textContent}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 border-t border-[var(--border)] pt-6 text-center text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
