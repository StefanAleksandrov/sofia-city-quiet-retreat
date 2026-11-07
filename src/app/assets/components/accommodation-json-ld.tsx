import { ADDRESS, SITE_NAME, SITE_URL } from "@/app/assets/configs/constants/siteConfig";

export default function AccommodationJsonLd({
  description,
}: {
  description: string;
}) {
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
