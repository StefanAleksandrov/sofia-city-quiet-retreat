import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/app/assets/configs/constants/siteConfig";

export const SITE_DESCRIPTION =
  "Book a short-term apartment in Sofia. Quiet, central, fully equipped. Direct booking with the host — no booking fees.";

export const rootMetadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Short-term apartment rental in Sofia`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Sofia apartment rental",
    "short-term rental Sofia",
    "Sofia accommodation",
    "apartment Sofia",
    "vacation rental Sofia",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Short-term apartment rental in Sofia`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Short-term apartment rental in Sofia`,
    description: SITE_DESCRIPTION,
  },
  robots: "index, follow",
  alternates: { canonical: SITE_URL },
};

export const amenitiesMetadata: Metadata = {
  title: "Amenities",
  description:
    "What’s included: WiFi, kitchen, air conditioning, washing machine, TV, parking, and more.",
};

export const bookMetadata: Metadata = {
  title: "Book now",
  description:
    "Send a booking request for your dates. We’ll confirm availability and send payment instructions (bank transfer or card).",
};

export const galleryMetadata: Metadata = {
  title: "Gallery",
  description:
    "Photos and video of our Sofia apartment. Living room, bedroom, kitchen, bathroom and views.",
};

export const locationMetadata: Metadata = {
  title: "Location",
  description:
    "Find us in Sofia. Central, quiet neighborhood with easy access to transport and city center.",
};
