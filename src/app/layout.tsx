import { Geist, Geist_Mono } from "next/font/google";
import AccommodationJsonLd from "@/app/assets/components/accommodation-json-ld";
import Header from "@/app/assets/components/header";
import Footer from "@/app/assets/components/footer";
import { LanguageProvider } from "@/app/assets/components/language-provider";
import { SITE_DESCRIPTION } from "@/app/assets/configs/constants/siteConfig";
import { rootMetadata } from "@/app/assets/configs/metadata";
import { getInitialLanguage } from "@/app/assets/lib/getInitialLanguage";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = rootMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { initialLanguage, hasPersistedLanguage } = await getInitialLanguage();

  return (
    <html lang={initialLanguage}>
      <head>
        <AccommodationJsonLd description={SITE_DESCRIPTION} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider
          initialLanguage={initialLanguage}
          hasPersistedLanguage={hasPersistedLanguage}
        >
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
