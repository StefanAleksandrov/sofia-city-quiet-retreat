import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/app/assets/components/header";
import Footer from "@/app/assets/components/footer";
import { SITE_NAME, SITE_URL, ADDRESS } from "@/app/assets/configs/constants/siteConfig";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Book a short-term apartment in Sofia. Quiet, central, fully equipped. Direct booking with the host — no booking fees.";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Short-term apartment rental in Sofia`,
    template: `%s | ${SITE_NAME}`,
  },
  description,
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
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Short-term apartment rental in Sofia`,
    description,
  },
  robots: "index, follow",
  alternates: { canonical: SITE_URL },
};

function AccommodationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: SITE_NAME,
    description,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.city,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.country,
    },
    url: SITE_URL,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <AccommodationJsonLd />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

