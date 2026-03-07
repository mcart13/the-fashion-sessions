export interface TryOnItem {
  id: string;
  name: string;
  thumbnail: string;
  image: string;
  type: "clothing" | "accessory";
}

export const tryOnItems: TryOnItem[] = [
  {
    id: "blazer-1",
    name: "Cameron Blazer (Taupe)",
    thumbnail: "/images/try-on/cameron-blazer-taupe-thumb.jpg",
    image: "/images/try-on/cameron-blazer-taupe-garment.jpg",
    type: "clothing",
  },
  {
    id: "shirt-1",
    name: "Oversized White Button-Down",
    thumbnail: "/images/try-on/white-buttondown-thumb.jpg",
    image: "/images/try-on/white-buttondown-garment.jpg",
    type: "clothing",
  },
  {
    id: "cardigan-1",
    name: "Long Knit Cardigan",
    thumbnail: "/images/try-on/long-cardigan-thumb.jpg",
    image: "/images/try-on/long-cardigan-garment.jpg",
    type: "clothing",
  },
  {
    id: "sunglasses-1",
    name: "Oversized Black Sunnies",
    thumbnail: "/images/try-on/sunglasses-1-thumb.png",
    image: "/images/try-on/sunglasses-1-thumb.png",
    type: "accessory",
  },
  {
    id: "sunglasses-2",
    name: "Tortoise Shell Frames",
    thumbnail: "/images/try-on/sunglasses-2-thumb.png",
    image: "/images/try-on/sunglasses-2-thumb.png",
    type: "accessory",
  },
  {
    id: "hat-1",
    name: "Straw Wide Brim Hat",
    thumbnail: "/images/try-on/hat-1-thumb.png",
    image: "/images/try-on/hat-1-thumb.png",
    type: "accessory",
  },
];
