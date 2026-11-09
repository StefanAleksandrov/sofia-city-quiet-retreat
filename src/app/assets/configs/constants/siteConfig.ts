/**
 * Site configuration for Sofia City Quiet Retreat for listing, media, and payment details.
 */

import type {
  GalleryImage,
  GalleryRoom,
  GalleryRoomId,
} from "../types/galleryTypes";

export const SITE_NAME = "Sofia City Quiet Retreat";
export const SITE_DESCRIPTION =
  "Book a short-term apartment in Sofia. Quiet, central, fully equipped. Direct booking with the host — no booking fees.";
export const SITE_URL = "https://sofia-city-quiet-retreat.com";
export const OWNER_EMAIL = "stefan.aleksandrov.mail@gmail.com";
export const FROM_EMAIL = "onboarding@resend.dev"; // Resend: use this for testing; for production use an address on your verified domain

export const GALLERY_ROOM_LABELS: Record<
  GalleryRoomId,
  { title: string; titleBg: string }
> = {
  "living-room": {
    title: "Living room, kitchen & dining area",
    titleBg: "Всекидневна, кухня и трапезария",
  },
  "bedroom-1": { title: "Bedroom 1", titleBg: "Спалня 1" },
  "bedroom-2": { title: "Bedroom 2", titleBg: "Спалня 2" },
  "bedroom-3": { title: "Bedroom 3", titleBg: "Спалня 3" },
  "bathroom-1": { title: "Bathroom 1", titleBg: "Баня 1" },
  "bathroom-2": { title: "Bathroom 2", titleBg: "Баня 2" },
  "terrace-and-shared-spaces": {
    title: "Balconies & shared spaces",
    titleBg: "Балкони и общи помещения",
  },
  building: { title: "Building", titleBg: "Сграда" },
};

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: "/images/living%20room%20(0).jpg", alt: "Living room", altBg: "Всекидневна", room: "living-room" },
  { src: "/images/bedroom%201%20(1).JPEG", alt: "Bedroom 1", altBg: "Спалня 1", room: "bedroom-1" },
  { src: "/images/bathroom%201%20(1).JPEG", alt: "Bathroom 1", altBg: "Баня 1", room: "bathroom-1" },
  { src: "/images/terraces%20(1).JPEG", alt: "Terrace", altBg: "Тераса", room: "terrace-and-shared-spaces" },
  { src: "/images/living%20room%20(1).JPEG", alt: "Living room seating area", altBg: "Кът за сядане във всекидневната", room: "living-room" },
  { src: "/images/living%20room%20(2).JPEG", alt: "Living room", altBg: "Всекидневна", room: "living-room" },
  { src: "/images/living%20room%20(3).JPEG", alt: "Living room", altBg: "Всекидневна", room: "living-room" },
  { src: "/images/living%20room%20(4).JPEG", alt: "Living room", altBg: "Всекидневна", room: "living-room" },
  { src: "/images/living%20room%20(5).JPEG", alt: "Living room", altBg: "Всекидневна", room: "living-room" },
  { src: "/images/bedroom%201%20(2).JPEG", alt: "Bedroom 1", altBg: "Спалня 1", room: "bedroom-1" },
  { src: "/images/bedroom%201%20(3).JPEG", alt: "Bedroom 1", altBg: "Спалня 1", room: "bedroom-1" },
  { src: "/images/bedroom%201%20(4).JPEG", alt: "Bedroom 1", altBg: "Спалня 1", room: "bedroom-1" },
  { src: "/images/bedroom%201%20(5).JPEG", alt: "Bedroom 1", altBg: "Спалня 1", room: "bedroom-1" },
  { src: "/images/bedroom%201%20(6).JPEG", alt: "Bedroom 1", altBg: "Спалня 1", room: "bedroom-1" },
  { src: "/images/bedroom%202%20(1).JPEG", alt: "Bedroom 2", altBg: "Спалня 2", room: "bedroom-2" },
  { src: "/images/bedroom%202%20(2).JPEG", alt: "Bedroom 2", altBg: "Спалня 2", room: "bedroom-2" },
  { src: "/images/bedroom%202%20(3).JPEG", alt: "Bedroom 2", altBg: "Спалня 2", room: "bedroom-2" },
  { src: "/images/bedroom%202%20(4).JPEG", alt: "Bedroom 2", altBg: "Спалня 2", room: "bedroom-2" },
  { src: "/images/bedroom%203%20(1).JPEG", alt: "Bedroom 3", altBg: "Спалня 3", room: "bedroom-3" },
  { src: "/images/bedroom%203%20(2).JPEG", alt: "Bedroom 3", altBg: "Спалня 3", room: "bedroom-3" },
  { src: "/images/bathroom%201%20(2).JPEG", alt: "Bathroom 1", altBg: "Баня 1", room: "bathroom-1" },
  { src: "/images/bathroom%201%20(3).JPEG", alt: "Bathroom 1", altBg: "Баня 1", room: "bathroom-1" },
  { src: "/images/bathroom%201%20(4).JPEG", alt: "Bathroom 1", altBg: "Баня 1", room: "bathroom-1" },
  { src: "/images/bathroom%202%20(1).JPEG", alt: "Bathroom 2", altBg: "Баня 2", room: "bathroom-2" },
  { src: "/images/bathroom%202%20(2).JPEG", alt: "Bathroom 2", altBg: "Баня 2", room: "bathroom-2" },
  { src: "/images/terraces%20(2).JPEG", alt: "Terrace", altBg: "Тераса", room: "terrace-and-shared-spaces" },
  { src: "/images/building%20(1).JPEG", alt: "Apartment building", altBg: "Жилищна сграда", room: "building" },
  { src: "/images/building%20(2).JPEG", alt: "Apartment building", altBg: "Жилищна сграда", room: "building" },
  { src: "/images/building%20(1)%20clear.jpg", alt: "Apartment building", altBg: "Жилищна сграда", room: "building" },
  { src: "/images/corridor%20(1).JPEG", alt: "Building corridor", altBg: "Коридор в сградата", room: "terrace-and-shared-spaces" },
  { src: "/images/corridor%20(2).JPEG", alt: "Building corridor", altBg: "Коридор в сградата", room: "terrace-and-shared-spaces" },
  { src: "/images/corridor%20(3).JPEG", alt: "Building corridor", altBg: "Коридор в сградата", room: "terrace-and-shared-spaces" },
  { src: "/images/laundry%20room%20(1).JPEG", alt: "Laundry room", altBg: "Перално помещение", room: "terrace-and-shared-spaces" },
  { src: "/images/laundry%20room%20(2).JPEG", alt: "Laundry room", altBg: "Перално помещение", room: "terrace-and-shared-spaces" },
  { src: "/images/elevator.JPEG", alt: "Building elevator", altBg: "Асансьор в сградата", room: "building" },
  { src: "/images/parking%20spot.JPEG", alt: "Parking spot", altBg: "Паркомясто", room: "building" },
  { src: "/images/parking%20spot.jpg", alt: "Parking spot", altBg: "Паркомясто", room: "building" },
];

export const GALLERY_ROOMS: GalleryRoom[] = (Object.keys(
  GALLERY_ROOM_LABELS,
) as GalleryRoomId[])
  .map((id) => ({
    id,
    ...GALLERY_ROOM_LABELS[id],
    images: GALLERY_IMAGES.filter((image) => image.room === id),
  }))
  .filter((room) => room.images.length > 0);

/** Optional: YouTube or Vimeo embed ID for a showcase video */
export const SHOWCASE_VIDEO_ID = "lVNpOV7d0Mw";
export const SHOWCASE_VIDEO_PROVIDER = "youtube" as const;

/** Amenities to display */
export const AMENITIES = [
  { label: "Air conditioning", labelBg: "Климатик", detail: "A system that cools and controls indoor humidity.", detailBg: "Система за охлаждане и контрол на влажността в помещението.", icon: "ac" },
  { label: "Bed linen", labelBg: "Спално бельо", detail: "Cotton.", detailBg: "Памучно.", icon: "linen" },
  { label: "Body soap", labelBg: "Сапун за тяло", icon: "toiletries" },
  { label: "Cleaning products", labelBg: "Почистващи препарати", icon: "cleaning" },
  { label: "Clothes drying rack", labelBg: "Сушилник за дрехи", icon: "laundry" },
  { label: "Clothes storage", labelBg: "Място за съхранение на дрехи", detail: "Chest of drawers, closet and wardrobe.", detailBg: "Скрин, гардероб и място за дрехи.", icon: "storage" },
  { label: "Coffee", labelBg: "Кафе", icon: "coffee" },
  { label: "Coffee maker", labelBg: "Кафемашина", icon: "coffee" },
  { label: "Cooker", labelBg: "Готварски плот", detail: "Electric, with 4 hobs.", detailBg: "Електрически, с 4 котлона.", icon: "cooker" },
  { label: "Cooking basics", labelBg: "Основни продукти и принадлежности за готвене", detail: "Pots and pans, oil, salt and pepper.", detailBg: "Тенджери и тигани, олио, сол и пипер.", icon: "cooking" },
  { label: "Crockery and cutlery", labelBg: "Съдове и прибори", detail: "Plates, bowls, cups, cutlery and other utensils.", detailBg: "Чинии, купи, чаши, прибори и други кухненски принадлежности.", icon: "dining" },
  { label: "Dining table", labelBg: "Трапезна маса", detail: "Seats 8.", detailBg: "За 8 души.", icon: "dining" },
  { label: "Free parking on premises", labelBg: "Безплатен паркинг на място", detail: "On-site parking at no charge.", detailBg: "Паркинг на място без такса.", icon: "parking" },
  { label: "Freezer", labelBg: "Фризер", icon: "fridge" },
  { label: "Fridge", labelBg: "Хладилник", icon: "fridge" },
  { label: "Hairdryer", labelBg: "Сешоар", icon: "hairdryer" },
  { label: "Hangers", labelBg: "Закачалки", icon: "storage" },
  { label: "Heating", labelBg: "Отопление", detail: "Equipment for warming the space.", detailBg: "Уреди за отопление на помещението.", icon: "heating" },
  { label: "Hot water", labelBg: "Топла вода", detail: "Available at the sink and in the shower.", detailBg: "Налична на мивката и в душа.", icon: "hot-water" },
  { label: "Iron", labelBg: "Ютия", icon: "iron" },
  { label: "Kettle", labelBg: "Електрическа кана", icon: "kettle" },
  { label: "Kitchen", labelBg: "Кухня", detail: "For preparing meals; includes a fridge, oven and hob.", detailBg: "За приготвяне на храна; разполага с хладилник, фурна и котлони.", icon: "kitchen" },
  { label: "Kitchenette", labelBg: "Кухненски бокс", detail: "A space to refrigerate and heat food.", detailBg: "Място за съхранение и затопляне на храна.", icon: "kitchen" },
  { label: "Lift", labelBg: "Асансьор", detail: "The building has a lift.", detailBg: "Сградата разполага с асансьор.", icon: "elevator" },
  { label: "Long-term stays allowed", labelBg: "Разрешен е дългосрочен престой", detail: "Stays of 28 days or longer.", detailBg: "Престой от 28 или повече дни.", icon: "calendar" },
  { label: "Microwave", labelBg: "Микровълнова фурна", icon: "microwave" },
  { label: "Mosquito net", labelBg: "Комарник", icon: "mosquito" },
  { label: "Oven", labelBg: "Фурна", detail: "Single oven.", detailBg: "Една фурна.", icon: "oven" },
  { label: "Balcony", labelBg: "Балкон", detail: "Private.", detailBg: "Самостоятелен.", icon: "balcony" },
  { label: "Private entrance", labelBg: "Самостоятелен вход", detail: "An entrance used only by guests.", detailBg: "Вход, използван само от гостите.", icon: "entrance" },
  { label: "Private living room", labelBg: "Самостоятелна всекидневна", icon: "living-room" },
  { label: "Room-darkening blinds", labelBg: "Затъмняващи щори", icon: "blinds" },
  { label: "Shampoo", labelBg: "Шампоан", icon: "toiletries" },
  { label: "Shower gel", labelBg: "Душ гел", icon: "toiletries" },
  { label: "Travel cot", labelBg: "Детско кошче за пътуване", detail: "Available on request.", detailBg: "Предоставя се при поискване.", icon: "cot" },
  { label: "Tumble dryer", labelBg: "Сушилня", detail: "In the unit and included with your stay.", detailBg: "В жилището, включена в престоя.", icon: "laundry" },
  { label: "TV", labelBg: "Телевизор", detail: "HD.", detailBg: "HD качество.", icon: "tv" },
  { label: "Washing machine", labelBg: "Пералня", detail: "A machine for washing clothes.", detailBg: "Машина за пране на дрехи.", icon: "laundry" },
  { label: "Wi-Fi", labelBg: "Wi-Fi", detail: "Wireless internet access.", detailBg: "Безжичен достъп до интернет.", icon: "wifi" },
  { label: "Wine glasses", labelBg: "Чаши за вино", icon: "dining" },
];

/** Address and map: used for SEO and Location page. Map embed URL is built from this address. */
export const ADDRESS = {
  street: "Byal Lyulyak street 23",
  city: "Sofia",
  postalCode: "1000",
  country: "Bulgaria",
};

/** Additional manually blocked dates; Airbnb calendar events are synced separately. checkOut is exclusive. */
export const BOOKED_DATE_RANGES: { checkIn: string; checkOut: string }[] = [
  { checkIn: "2026-03-01", checkOut: "2026-03-05" },
  { checkIn: "2026-03-13", checkOut: "2026-03-25" },
];

/** Bank transfer instructions (shown after form submit). Customize for your bank. */
export const BANK_TRANSFER = {
  bankName: null,
  accountHolder: null,
  iban: null,
  bic: null,
  referenceNote: null,
};

/** Optional: Stripe Payment Link for card payments. Create at https://dashboard.stripe.com/payment-links */
export const STRIPE_PAYMENT_LINK = ""; // e.g. "https://buy.stripe.com/..."
