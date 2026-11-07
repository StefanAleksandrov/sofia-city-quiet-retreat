# Sofia City Quiet Retreat

A conversion-focused website for short-term apartment bookings. No login required — guests send a booking request via a form; you receive an email and confirm with bank transfer (or optional card payment).

## Features

- **Booking.com-style** layout and CTAs
- **Gallery** for photos and optional YouTube/Vimeo video
- **Book now** form that sends inquiries to your inbox (Resend)
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
   Edit `src/app/configs/constants/siteConfig.ts`:
   - `OWNER_EMAIL` – where booking emails are sent
   - `SITE_URL` – your production URL (for SEO)
   - `GALLERY_IMAGES` – replace placeholder URLs with your photos (use `/gallery/photo.jpg` if you add files to `public/gallery/`)
   - `SHOWCASE_VIDEO_ID` – optional YouTube or Vimeo video ID
   - `ADDRESS`, `BANK_TRANSFER` – for Location page and payment section
   - `STRIPE_PAYMENT_LINK` – optional; add a Stripe Payment Link URL to show “Pay by card”

3. **Email (booking form)**  
   - Sign up at [Resend](https://resend.com), get an API key.
   - Copy `.env.example` to `.env` and set `RESEND_API_KEY=re_...`.
   - For testing you can use Resend’s default sender; for production, set `FROM_EMAIL` in `siteConfig` to an address on a domain you verify in Resend.

4. **Optional: card payments**  
   In [Stripe Dashboard → Payment Links](https://dashboard.stripe.com/payment-links), create a link (e.g. for a deposit or fixed amount). Add the URL to `STRIPE_PAYMENT_LINK` in `siteConfig`. The site will show a “Pay by card” option; you can send the same link by email after confirming a booking.

## Project structure

- `src/app/page.tsx` – Home (hero, gallery strip, why book, CTA)
- `src/app/gallery/` – Photos and video
- `src/app/amenities/` – Amenities list
- `src/app/location/` – Address and map (map is generated from `ADDRESS` in config)
- `src/app/book/` – Booking form + payment options
- `src/app/actions/sendBookingEmail.ts` – Server action (Resend)
- `src/app/configs/constants/siteConfig.ts` – All config

## Deploy

Works on Vercel, Netlify, or any Node host. Set `RESEND_API_KEY` (and optionally `STRIPE_*`) in the environment. Set `SITE_URL` in `siteConfig` to your production URL for sitemap and Open Graph.
