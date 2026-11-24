# Sofia City Quiet Retreat

A conversion-focused website for short-term apartment bookings. No login required — guests send a booking request via a form; you receive an email and confirm with bank transfer (or optional card payment).

## Features

- **Booking.com-style** layout and CTAs
- **Gallery** for photos and optional YouTube/Vimeo video
- **Book now** form that sends inquiries through the Gmail API using OAuth
- **Payment**: bank transfer details on the site; optional [Stripe Payment Link](https://dashboard.stripe.com/payment-links) for card payments
- **Languages**: English and Bulgarian, with explicit selections saved in the browser; new visitors are shown Bulgarian when the hosting platform reports Bulgaria or their device timezone is set to Sofia, and English otherwise
- **SEO**: metadata, JSON-LD (Accommodation), sitemap, robots

## Setup

1. **Install and run**
   ```bash
   npm install
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

2. **Configure your listing**  
   Edit `src/app/assets/configs/constants/siteConfig.ts`:
   - `OWNER_EMAIL` – where booking emails are sent
   - `SITE_URL` – your production URL (for SEO)
   - `GALLERY_IMAGES` – replace placeholder URLs with your photos (use `/gallery/photo.jpg` if you add files to `public/gallery/`)
   - `SHOWCASE_VIDEO_ID` – optional YouTube or Vimeo video ID
   - `ADDRESS`, `BANK_TRANSFER` – for Location page and payment section
   - `STRIPE_PAYMENT_LINK` – optional; add a Stripe Payment Link URL to show “Pay by card”

3. **Email (booking form, Gmail API OAuth)**
   - In [Google Cloud Console](https://console.cloud.google.com/), select your project and enable the Gmail API.
   - Create a **Web application** OAuth client and add this authorized redirect URI:
     `http://localhost:8787/oauth2callback`
   - Add `GMAIL_CLIENT_ID` and `GMAIL_CLIENT_SECRET` to your local `.env` file. Do not commit `.env` or share these credentials.
   - Run `npm run gmail:authorize`, open the URL printed in the terminal, and authorize with the Gmail account configured as `OWNER_EMAIL`. The script saves `GMAIL_REFRESH_TOKEN` to `.env`.
   - Add `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, and `GMAIL_REFRESH_TOKEN` to your hosting provider’s environment variables and redeploy. The booking email goes to `OWNER_EMAIL`; `PARTNER_EMAILS` are copied.

4. **Optional: card payments**  
   In [Stripe Dashboard → Payment Links](https://dashboard.stripe.com/payment-links), create a link (e.g. for a deposit or fixed amount). Add the URL to `STRIPE_PAYMENT_LINK` in `siteConfig`. The site will show a “Pay by card” option; you can send the same link by email after confirming a booking.

## Project structure

- `src/app/page.tsx` – Home (hero, gallery strip, why book, CTA)
- `src/app/gallery/` – Photos and video
- `src/app/amenities/` – Amenities list
- `src/app/location/` – Address and map (map is generated from `ADDRESS` in config)
- `src/app/book/` – Booking form + payment options
- `src/app/assets/actions/sendBookingEmail.ts` – Server action (Gmail API)
- `src/app/assets/configs/constants/siteConfig.ts` – Site and email configuration

## Deploy

Works on Vercel, Netlify, or any Node host. Set the three Gmail OAuth variables in the hosting environment. Set `SITE_URL` in `siteConfig` to your production URL for sitemap and Open Graph.
