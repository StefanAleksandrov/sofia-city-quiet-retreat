export interface NavigationItem {
  href: string;
  textContent: string;
}

export interface BookingFormData {
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  message: string;
}
