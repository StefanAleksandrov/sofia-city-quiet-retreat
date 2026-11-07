/**
 * Site configuration for Sofia City Quiet Retreat for listing, media, and payment details.
 */

export const SITE_NAME = "Sofia City Quiet Retreat";
export const SITE_URL = "https://sofia-city-quiet-retreat.com";
export const OWNER_EMAIL = "stefan.aleksandrov.mail@gmail.com";
export const FROM_EMAIL = "onboarding@resend.dev"; // Resend: use this for testing; for production use an address on your verified domain

/** Gallery: image paths are relative to the public directory. */
export const GALLERY_IMAGES = [
  { src: "/images/living%20room%20(0).jpg", alt: "Living room", altBg: "Всекидневна" },
  { src: "/images/bedroom%201%20(1).JPEG", alt: "Bedroom 1", altBg: "Спалня 1" },
  { src: "/images/bathroom%201%20(1).JPEG", alt: "Bathroom 1", altBg: "Баня 1" },
  { src: "/images/terraces%20(1).JPEG", alt: "Terrace", altBg: "Тераса" },
  { src: "/images/building%20(1)%20clear.jpg", alt: "Apartment building", altBg: "Жилищна сграда" },
  { src: "/images/parking%20spot.JPEG", alt: "Parking spot", altBg: "Паркомясто" },
  { src: "/images/living%20room%20(1).JPEG", alt: "Living room seating area", altBg: "Кът за сядане във всекидневната" },
  { src: "/images/living%20room%20(2).JPEG", alt: "Living room", altBg: "Всекидневна" },
  { src: "/images/living%20room%20(3).JPEG", alt: "Living room", altBg: "Всекидневна" },
  { src: "/images/living%20room%20(4).JPEG", alt: "Living room", altBg: "Всекидневна" },
  { src: "/images/living%20room%20(5).JPEG", alt: "Living room", altBg: "Всекидневна" },
  { src: "/images/bedroom%201%20(2).JPEG", alt: "Bedroom 1", altBg: "Спалня 1" },
  { src: "/images/bedroom%201%20(3).JPEG", alt: "Bedroom 1", altBg: "Спалня 1" },
  { src: "/images/bedroom%201%20(4).JPEG", alt: "Bedroom 1", altBg: "Спалня 1" },
  { src: "/images/bedroom%201%20(5).JPEG", alt: "Bedroom 1", altBg: "Спалня 1" },
  { src: "/images/bedroom%201%20(6).JPEG", alt: "Bedroom 1", altBg: "Спалня 1" },
  { src: "/images/bedroom%202%20(1).JPEG", alt: "Bedroom 2", altBg: "Спалня 2" },
  { src: "/images/bedroom%202%20(2).JPEG", alt: "Bedroom 2", altBg: "Спалня 2" },
  { src: "/images/bedroom%202%20(3).JPEG", alt: "Bedroom 2", altBg: "Спалня 2" },
  { src: "/images/bedroom%202%20(4).JPEG", alt: "Bedroom 2", altBg: "Спалня 2" },
  { src: "/images/bedroom%203%20(1).JPEG", alt: "Bedroom 3", altBg: "Спалня 3" },
  { src: "/images/bedroom%203%20(2).JPEG", alt: "Bedroom 3", altBg: "Спалня 3" },
  { src: "/images/bathroom%201%20(2).JPEG", alt: "Bathroom 1", altBg: "Баня 1" },
  { src: "/images/bathroom%201%20(3).JPEG", alt: "Bathroom 1", altBg: "Баня 1" },
  { src: "/images/bathroom%201%20(4).JPEG", alt: "Bathroom 1", altBg: "Баня 1" },
  { src: "/images/bathroom%202%20(1).JPEG", alt: "Bathroom 2", altBg: "Баня 2" },
  { src: "/images/bathroom%202%20(2).JPEG", alt: "Bathroom 2", altBg: "Баня 2" },
  { src: "/images/terraces%20(2).JPEG", alt: "Terrace", altBg: "Тераса" },
  { src: "/images/building%20(1).JPEG", alt: "Apartment building", altBg: "Жилищна сграда" },
  { src: "/images/building%20(2).JPEG", alt: "Apartment building", altBg: "Жилищна сграда" },
  { src: "/images/corridor%20(1).JPEG", alt: "Building corridor", altBg: "Коридор в сградата" },
  { src: "/images/corridor%20(2).JPEG", alt: "Building corridor", altBg: "Коридор в сградата" },
  { src: "/images/corridor%20(3).JPEG", alt: "Building corridor", altBg: "Коридор в сградата" },
  { src: "/images/elevator.JPEG", alt: "Building elevator", altBg: "Асансьор в сградата" },
  { src: "/images/laundry%20room%20(1).JPEG", alt: "Laundry room", altBg: "Перално помещение" },
  { src: "/images/laundry%20room%20(2).JPEG", alt: "Laundry room", altBg: "Перално помещение" },
  { src: "/images/parking%20spot.jpg", alt: "Parking spot", altBg: "Паркомясто" },
];

/** Optional: YouTube or Vimeo embed ID for a showcase video */
export const SHOWCASE_VIDEO_ID = "lVNpOV7d0Mw";
export const SHOWCASE_VIDEO_PROVIDER = "youtube" as const;

/** Amenities to display */
export const AMENITIES = [
  { label: "Free WiFi", labelBg: "Безплатен Wi-Fi", icon: "wifi" },
  { label: "Fully equipped kitchen", labelBg: "Напълно оборудвана кухня", icon: "kitchen" },
  { label: "Air conditioning", labelBg: "Климатик", icon: "ac" },
  { label: "Washing machine", labelBg: "Пералня", icon: "washing" },
  { label: "Smart TV", labelBg: "Смарт телевизор", icon: "tv" },
  { label: "Parking available", labelBg: "Наличен паркинг", icon: "parking" },
  { label: "Elevator", labelBg: "Асансьор", icon: "elevator" },
  { label: "City center nearby", labelBg: "Близо до центъра на града", icon: "location" },
];

/** Address and map: used for SEO and Location page. Map embed URL is built from this address. */
export const ADDRESS = {
  street: "Byal Lyulyak street 23",
  city: "Sofia",
  postalCode: "1000",
  country: "Bulgaria",
};

/** Additional manually blocked dates; Airbnb calendar events are synced separately. checkOut is exclusive. */
export const BOOKED_DATE_RANGES: { checkIn: string; checkOut: string }[] = [
  { checkIn: "2026-03-01", checkOut: "2026-03-05" },
  { checkIn: "2026-03-13", checkOut: "2026-03-25" },
];

/** Bank transfer instructions (shown after form submit). Customize for your bank. */
export const BANK_TRANSFER = {
  bankName: "Your Bank Name",
  accountHolder: "Your Full Name",
  iban: "BG00 XXXX XXXX XXXX XXXX XX",
  bic: "XXXXXXXX",
  referenceNote: "Booking: [Your name] + dates",
};

/** Optional: Stripe Payment Link for card payments. Create at https://dashboard.stripe.com/payment-links */
export const STRIPE_PAYMENT_LINK = ""; // e.g. "https://buy.stripe.com/..."
