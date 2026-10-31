import {
  BANK_TRANSFER,
  STRIPE_PAYMENT_LINK,
} from "@/app/assets/configs/constants/siteConfig";
import BookingForm from "@/app/assets/components/booking-form";

export const metadata = {
  title: "Book now",
  description:
    "Send a booking request for your dates. We’ll confirm availability and send payment instructions (bank transfer or card).",
};

export default function BookPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Book your stay</h1>
        <p className="mt-2 text-[var(--muted)]">
          Fill in your dates and details. We’ll reply within 24 hours with confirmation and payment instructions.
        </p>
      </div>

      <BookingForm />

      <section className="mt-14 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Payment options</h2>
        <p className="mt-2 text-[var(--muted)]">
          After we confirm your dates, you can pay by bank transfer (no fees) or by card if you prefer.
        </p>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="font-medium text-[var(--primary)]">Bank transfer</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Use the details below for a bank transfer. We’ll send the exact amount and reference in our confirmation.
            </p>
            <ul className="mt-3 space-y-1 rounded-lg bg-white p-4 text-sm">
              <li><strong>Bank:</strong> {BANK_TRANSFER.bankName}</li>
              <li><strong>Account holder:</strong> {BANK_TRANSFER.accountHolder}</li>
              <li><strong>IBAN:</strong> {BANK_TRANSFER.iban}</li>
              <li><strong>BIC:</strong> {BANK_TRANSFER.bic}</li>
              <li><strong>Reference:</strong> {BANK_TRANSFER.referenceNote}</li>
            </ul>
          </div>

          {STRIPE_PAYMENT_LINK && (
            <div>
              <h3 className="font-medium text-[var(--primary)]">Pay by card</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Secure payment via Stripe. We’ll send you the payment link after confirming your dates and total.
              </p>
              <a
                href={STRIPE_PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Pay with card (Stripe)
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
