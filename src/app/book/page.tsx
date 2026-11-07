import {
  BANK_TRANSFER,
  STRIPE_PAYMENT_LINK,
} from "@/app/assets/configs/constants/siteConfig";
import BookingForm from "@/app/assets/components/booking-form";
import Text from "@/app/assets/components/text";
import { bookMetadata } from "@/app/assets/configs/metadata";

export const metadata = bookMetadata;

export default function BookPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          <Text bg="Резервирайте престоя си">Book your stay</Text>
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          <Text bg="Попълнете датите и данните си. Ще отговорим до 24 часа с потвърждение и инструкции за плащане.">
            Fill in your dates and details. We'll reply within 24 hours with confirmation and payment instructions.
          </Text>
        </p>
      </div>

      <BookingForm />

      <section className="mt-14 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          <Text bg="Начини на плащане">Payment options</Text>
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          <Text bg="След като потвърдим датите, можете да платите с банков превод или с Revolut.">
            After we confirm your dates, you can pay by bank transfer or by Revolut you prefer.
          </Text>
        </p>

        <div className="mt-6 space-y-6">
          {BANK_TRANSFER.iban &&
            <div>
              <h3 className="font-medium text-[var(--primary)]">
                <Text bg="Банков превод">Bank transfer</Text>
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                <Text bg="Използвайте данните по-долу за банков превод. Ще изпратим точната сума и основанието в потвърждението.">
                  Use the details below for a bank transfer. We’ll send the exact amount and reference in our confirmation.
                </Text>
              </p>
                <ul className="mt-3 space-y-1 rounded-lg bg-white p-4 text-sm">
                  <li><strong><Text bg="Банка:">Bank:</Text></strong> {BANK_TRANSFER.bankName}</li>
                  <li><strong><Text bg="Титуляр на сметката:">Account holder:</Text></strong> {BANK_TRANSFER.accountHolder}</li>
                  <li><strong>IBAN:</strong> {BANK_TRANSFER.iban}</li>
                  <li><strong>BIC:</strong> {BANK_TRANSFER.bic}</li>
                  <li><strong><Text bg="Основание:">Reference:</Text></strong> {BANK_TRANSFER.referenceNote}</li>
                </ul>
            </div>
          }

          {STRIPE_PAYMENT_LINK && (
            <div>
              <h3 className="font-medium text-[var(--primary)]">
                <Text bg="Плащане с карта">Pay by card</Text>
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                <Text bg="Сигурно плащане чрез Stripe. Ще изпратим връзка за плащане след потвърждение на датите и сумата.">
                  Secure payment via Stripe. We'll send you the payment link after confirming your dates and total.
                </Text>
              </p>
              <a
                href={STRIPE_PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                <Text bg="Платете с карта (Stripe)">Pay with card (Stripe)</Text>
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
