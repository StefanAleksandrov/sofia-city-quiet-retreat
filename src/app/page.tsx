import Link from "next/link";
import GalleryStrip from "@/app/assets/components/gallery-strip";

export default function Home() {
  return (
    <>
      <section className="relative bg-[var(--primary)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Your quiet retreat in the heart of Sofia
          </h1>
          <p className="mt-4 max-w-xl text-lg opacity-95">
            Fully equipped apartment for short stays. Central location, no booking fees — book directly with the host.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/book"
              className="inline-flex items-center rounded-lg bg-[var(--accent-cta)] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[var(--accent-cta-hover)]"
            >
              Check availability & book
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center rounded-lg border-2 border-white/80 bg-white/10 px-6 py-3 font-semibold backdrop-blur-sm transition hover:bg-white/20"
            >
              View gallery
            </Link>
          </div>
        </div>
      </section>

      <GalleryStrip />

      <section className="bg-[var(--surface)] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-[var(--foreground)]">
            Why book with us
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "No booking fees",
                text: "Book directly and pay the host. No middleman, no extra charges.",
              },
              {
                title: "Central & quiet",
                text: "Best of both: walk to the center, sleep in a peaceful neighborhood.",
              },
              {
                title: "Fully equipped",
                text: "Kitchen, WiFi, AC, washing machine — everything you need for a comfortable stay.",
              },
              {
                title: "Flexible stays",
                text: "Short or longer stays. Contact us with your dates and we’ll confirm quickly.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-[var(--primary)]">{item.title}</h3>
                <p className="mt-2 text-[var(--muted)]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-2xl bg-[var(--primary-light)] p-8 sm:p-12 text-center">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Ready to book your stay?
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              Send an inquiry with your dates. We’ll reply within 24 hours with availability and payment details.
            </p>
            <Link
              href="/book"
              className="mt-6 inline-flex rounded-lg bg-[var(--accent-cta)] px-8 py-3 font-semibold text-white transition hover:bg-[var(--accent-cta-hover)]"
            >
              Send booking request
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
