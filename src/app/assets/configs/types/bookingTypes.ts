export type CustomDateRate = {
  startDate: string;
  endDate: string;
  nightlyRate: number;
  label: string;
  labelBg: string;
};

export type CustomDateRateBreakdown = {
  startDate: string;
  endDate: string;
  nightlyRate: number;
  nights: number;
  subtotal: number;
  label: string;
  labelBg: string;
};

export type ReservationPrice = {
  weekdayNights: number;
  weekendNights: number;
  customDateRates: CustomDateRateBreakdown[];
  nights: number;
  weekdaySubtotal: number;
  weekendSubtotal: number;
  subtotal: number;
  discountRate: number;
  discountAmount: number;
  earlyCheckInFee: number;
  lateCheckOutFee: number;
  total: number;
};
