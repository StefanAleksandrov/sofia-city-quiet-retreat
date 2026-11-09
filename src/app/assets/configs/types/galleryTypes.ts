export type GalleryRoomId =
  | "living-room"
  | "bedroom-1"
  | "bedroom-2"
  | "bedroom-3"
  | "bathroom-1"
  | "bathroom-2"
  | "terrace-and-shared-spaces"
  | "building";

export type GalleryImage = {
  src: string;
  alt: string;
  altBg: string;
  room: GalleryRoomId;
};

export type GalleryRoom = {
  id: GalleryRoomId;
  title: string;
  titleBg: string;
  images: GalleryImage[];
};

export type PageScrollState = {
  overflow: string;
  position: string;
  top: string;
  width: string;
  scrollY: number;
};
