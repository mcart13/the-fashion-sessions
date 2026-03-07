export interface TryOnAccessoryAnchor {
  landmarks: "eyes" | "forehead";
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface TryOnItem {
  id: string;
  name: string;
  thumbnail: string;
  type: "accessory" | "clothing";
  category: string;
  overlayImage?: string;
  anchor?: TryOnAccessoryAnchor;
  garmentImage?: string;
  fashnCategory?: "tops" | "bottoms" | "one-pieces";
  fashnPhotoType?: "flat-lay" | "model";
}

export const tryOnItems: TryOnItem[] = [
  {
    id: "acc-sunglasses-1",
    name: "Oversized Black Sunnies",
    thumbnail: "/images/try-on/sunglasses-1-thumb.png",
    type: "accessory",
    category: "sunglasses",
    overlayImage: "/images/try-on/sunglasses-1-overlay.png",
    anchor: { landmarks: "eyes", scale: 1.8, offsetX: 0, offsetY: -0.1 },
  },
  {
    id: "acc-sunglasses-2",
    name: "Tortoise Shell Frames",
    thumbnail: "/images/try-on/sunglasses-2-thumb.png",
    type: "accessory",
    category: "sunglasses",
    overlayImage: "/images/try-on/sunglasses-2-overlay.png",
    anchor: { landmarks: "eyes", scale: 2.0, offsetX: 0, offsetY: -0.05 },
  },
  {
    id: "acc-hat-1",
    name: "Straw Wide Brim Hat",
    thumbnail: "/images/try-on/hat-1-thumb.png",
    type: "accessory",
    category: "hats",
    overlayImage: "/images/try-on/hat-1-overlay.png",
    anchor: { landmarks: "forehead", scale: 2.5, offsetX: 0, offsetY: -1.2 },
  },
  {
    id: "cloth-blazer-1",
    name: "Cameron Blazer (Taupe)",
    thumbnail: "/images/try-on/cameron-blazer-taupe-thumb.jpg",
    type: "clothing",
    category: "tops",
    garmentImage: "/images/try-on/cameron-blazer-taupe-garment.jpg",
    fashnCategory: "tops",
    fashnPhotoType: "model",
  },
  {
    id: "cloth-shirt-1",
    name: "Oversized White Button-Down",
    thumbnail: "/images/try-on/white-buttondown-thumb.jpg",
    type: "clothing",
    category: "tops",
    garmentImage: "/images/try-on/white-buttondown-garment.jpg",
    fashnCategory: "tops",
    fashnPhotoType: "model",
  },
  {
    id: "cloth-cardigan-1",
    name: "Long Knit Cardigan",
    thumbnail: "/images/try-on/long-cardigan-thumb.jpg",
    type: "clothing",
    category: "tops",
    garmentImage: "/images/try-on/long-cardigan-garment.jpg",
    fashnCategory: "tops",
    fashnPhotoType: "model",
  },
];

export function getAccessories(): TryOnItem[] {
  return tryOnItems.filter((item) => item.type === "accessory");
}

export function getClothingItems(): TryOnItem[] {
  return tryOnItems.filter((item) => item.type === "clothing");
}
