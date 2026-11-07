import Link from "next/link";
import GalleryStrip from "@/app/assets/components/gallery-strip";
import Text from "@/app/assets/components/text";

export default function Home() {
  return (
    <>
      <section className="relative bg-[var(--primary)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <Text bg="Вашето тихо убежище в сърцето на София">
              Your quiet retreat in the heart of Sofia
            </Text>
          </h1>
          <p className="mt-4 max-w-xl text-lg opacity-95">
            <Text bg="Напълно оборудван апартамент за кратък престой. Централно местоположение, без такси за резервация — резервирайте директно при домакина.">
              Fully equipped apartment for short stays. Central location, no booking fees — book directly with the host.
            </Text>
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/book"
              className="inline-flex items-center rounded-lg bg-[var(--accent-cta)] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[var(--accent-cta-hover)]"
            >
              <Text bg="Резервирайте Вашия престой">
                Book your stay
              </Text>
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center rounded-lg border-2 border-white/80 bg-white/10 px-6 py-3 font-semibold backdrop-blur-sm transition hover:bg-white/20"
            >
              <Text bg="Разгледайте галерията">View gallery</Text>
            </Link>
          </div>
        </div>
      </section>

      <GalleryStrip />

      <section className="bg-[var(--surface)] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-[var(--foreground)]">
            <Text bg="Защо да резервирате при нас">Why book with us</Text>
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "No booking fees",
                titleBg: "Без такси за резервация",
                text: "Book directly and pay the host. No middleman, no extra charges.",
                textBg: "Резервирайте директно и платете на домакина. Без посредници и допълнителни такси.",
              },
              {
                title: "Central & quiet",
                titleBg: "Централно и тихо",
                text: "Best of both: walk to the center, sleep in a peaceful neighborhood.",
                textBg: "Най-доброто от двата свята: разходете се до центъра и си починете в спокоен квартал.",
              },
              {
                title: "Fully equipped",
                titleBg: "Напълно оборудван",
                text: "Kitchen, WiFi, AC, washing machine — everything you need for a comfortable stay.",
                textBg: "Кухня, Wi-Fi, климатик, пералня — всичко необходимо за комфортен престой.",
              },
              {
                title: "Flexible stays",
                titleBg: "Гъвкав престой",
                text: "Short or longer stays. Contact us with your dates and we'll confirm quickly.",
                textBg: "Кратък или по-дълъг престой. Изпратете ни датите си и ще потвърдим бързо.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-[var(--primary)]">
                  <Text bg={item.titleBg}>{item.title}</Text>
                </h3>
                <p className="mt-2 text-[var(--muted)]">
                  <Text bg={item.textBg}>{item.text}</Text>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-2xl bg-[var(--primary-light)] p-8 sm:p-12 text-center">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              <Text bg="Готови ли сте да резервирате престоя си?">
                Ready to book your stay?
              </Text>
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              <Text bg="Изпратете запитване с желаните дати. Ще отговорим до 24 часа с информация за наличността и плащането.">
                Send an inquiry with your dates. We'll reply within 24 hours with availability and payment details.
              </Text>
            </p>
            <Link
              href="/book"
              className="mt-6 inline-flex rounded-lg bg-[var(--accent-cta)] px-8 py-3 font-semibold text-white transition hover:bg-[var(--accent-cta-hover)]"
            >
              <Text bg="Изпратете заявка за резервация">
                Send booking request
              </Text>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
