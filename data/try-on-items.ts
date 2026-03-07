export interface TryOnItem {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  image: string;
  type: "clothing" | "accessory";
}

export const tryOnItems: TryOnItem[] = [
  {
    id: "blazer-1",
    name: "Cameron Blazer (Taupe)",
    description:
      "Taupe/khaki oversized single-breasted blazer with notch lapels, one-button closure, and flap pockets",
    thumbnail: "/images/try-on/cameron-blazer-taupe-thumb.jpg",
    image: "/images/try-on/cameron-blazer-taupe-garment.jpg",
    type: "clothing",
  },
  {
    id: "shirt-1",
    name: "Oversized White Button-Down",
    description:
      "White oversized cotton button-down shirt with a relaxed fit and classic collar",
    thumbnail: "/images/try-on/white-buttondown-thumb.jpg",
    image: "/images/try-on/white-buttondown-garment.jpg",
    type: "clothing",
  },
  {
    id: "cardigan-1",
    name: "Long Knit Cardigan",
    description:
      "Long open-front knit cardigan in a neutral oatmeal/beige tone with a relaxed drapey fit",
    thumbnail: "/images/try-on/long-cardigan-thumb.jpg",
    image: "/images/try-on/long-cardigan-garment.jpg",
    type: "clothing",
  },
  {
    id: "sunglasses-1",
    name: "Oversized Black Sunnies",
    description:
      "Oversized hexagonal black sunglasses with gold metal frame accents and dark lenses",
    thumbnail: "/images/try-on/sunglasses-1-thumb.png",
    image: "/images/try-on/sunglasses-1-thumb.png",
    type: "accessory",
  },
  {
    id: "sunglasses-2",
    name: "Tortoise Shell Frames",
    description:
      "Classic tortoise shell pattern sunglasses with warm brown tones and rounded frames",
    thumbnail: "/images/try-on/sunglasses-2-thumb.png",
    image: "/images/try-on/sunglasses-2-thumb.png",
    type: "accessory",
  },
  {
    id: "hat-1",
    name: "Straw Wide Brim Hat",
    description: "Natural straw wide-brim sun hat with a clean minimal band",
    thumbnail: "/images/try-on/hat-1-thumb.png",
    image: "/images/try-on/hat-1-thumb.png",
    type: "accessory",
  },
];
