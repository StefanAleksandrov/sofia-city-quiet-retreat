/**
 * Site configuration for Sofia City Quiet Retreat for listing, media, and payment details.
 */

export const SITE_NAME = "Sofia City Quiet Retreat";
export const SITE_URL = "https://sofia-city-quiet-retreat.com";
export const OWNER_EMAIL = "stefan.aleksandrov.mail@gmail.com";
export const FROM_EMAIL = "onboarding@resend.dev"; // Resend: use this for testing; for production use an address on your verified domain

/** Gallery: use /public/gallery/ filenames (e.g. 01-living.jpg) or full URLs */
export const GALLERY_IMAGES = [
  { src: "https://placehold.co/800x600/e8f0fa/003580?text=Living+Room", alt: "Living area" },
  { src: "https://placehold.co/800x600/e8f0fa/003580?text=Bedroom", alt: "Bedroom" },
  { src: "https://placehold.co/800x600/e8f0fa/003580?text=Kitchen", alt: "Kitchen" },
  { src: "https://placehold.co/800x600/e8f0fa/003580?text=Bathroom", alt: "Bathroom" },
  { src: "https://placehold.co/800x600/e8f0fa/003580?text=City+View", alt: "City view" },
  { src: "https://placehold.co/800x600/e8f0fa/003580?text=Outdoor", alt: "Outdoor space" },
];

/** Optional: YouTube or Vimeo embed ID for a showcase video */
export const SHOWCASE_VIDEO_ID = "lVNpOV7d0Mw";
export const SHOWCASE_VIDEO_PROVIDER = "youtube" as const;

/** Amenities to display */
export const AMENITIES = [
  { label: "Free WiFi", icon: "wifi" },
  { label: "Fully equipped kitchen", icon: "kitchen" },
  { label: "Air conditioning", icon: "ac" },
  { label: "Washing machine", icon: "washing" },
  { label: "Smart TV", icon: "tv" },
  { label: "Parking available", icon: "parking" },
  { label: "Elevator", icon: "elevator" },
  { label: "City center nearby", icon: "location" },
];

/** Address and map: used for SEO and Location page. Map embed URL is built from this address. */
export const ADDRESS = {
  street: "Byal Lyulyak street 23",
  city: "Sofia",
  postalCode: "1000",
  country: "Bulgaria",
};

/** Booked date ranges: dates shown as unavailable in the booking calendar. Add a new entry when you confirm a booking (checkOut = day guests leave). */
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
