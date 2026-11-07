import type { NavigationItem } from "@/app/assets/configs/types/appTypes";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/gallery", textContent: "Gallery", bulgarianTextContent: "Галерия" },
  { href: "/amenities", textContent: "Amenities", bulgarianTextContent: "Удобства" },
  { href: "/location", textContent: "Location", bulgarianTextContent: "Местоположение" },
  { href: "/book", textContent: "Book now", bulgarianTextContent: "Резервирайте" },
];

export default { NAVIGATION_ITEMS };
