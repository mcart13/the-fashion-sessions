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
    name: "Classic Aviators",
    thumbnail: "/images/try-on/sunglasses-1-thumb.png",
    type: "accessory",
    category: "sunglasses",
    overlayImage: "/images/try-on/sunglasses-1-overlay.png",
    anchor: { landmarks: "eyes", scale: 1.8, offsetX: 0, offsetY: -0.1 },
  },
  {
    id: "acc-sunglasses-2",
    name: "Oversized Frames",
    thumbnail: "/images/try-on/sunglasses-2-thumb.png",
    type: "accessory",
    category: "sunglasses",
    overlayImage: "/images/try-on/sunglasses-2-overlay.png",
    anchor: { landmarks: "eyes", scale: 2.0, offsetX: 0, offsetY: -0.05 },
  },
  {
    id: "acc-hat-1",
    name: "Wide Brim Hat",
    thumbnail: "/images/try-on/hat-1-thumb.png",
    type: "accessory",
    category: "hats",
    overlayImage: "/images/try-on/hat-1-overlay.png",
    anchor: { landmarks: "forehead", scale: 2.5, offsetX: 0, offsetY: -1.2 },
  },
  {
    id: "cloth-sweatshirt-1",
    name: "White Crewneck Sweatshirt",
    thumbnail: "/images/try-on/sweatshirt-thumb.jpg",
    type: "clothing",
    category: "tops",
    garmentImage: "/images/try-on/sweatshirt-garment.jpg",
    fashnCategory: "tops",
    fashnPhotoType: "flat-lay",
  },
  {
    id: "cloth-shirt-1",
    name: "Chambray Heart-Print Shirt",
    thumbnail: "/images/try-on/chambray-shirt-thumb.jpg",
    type: "clothing",
    category: "tops",
    garmentImage: "/images/try-on/chambray-shirt-garment.jpg",
    fashnCategory: "tops",
    fashnPhotoType: "flat-lay",
  },
  {
    id: "cloth-dress-1",
    name: "Red Floral Belted Dress",
    thumbnail: "/images/try-on/red-dress-thumb.jpg",
    type: "clothing",
    category: "dresses",
    garmentImage: "/images/try-on/red-dress-garment.jpg",
    fashnCategory: "one-pieces",
    fashnPhotoType: "model",
  },
];

export function getAccessories(): TryOnItem[] {
  return tryOnItems.filter((item) => item.type === "accessory");
}

export function getClothingItems(): TryOnItem[] {
  return tryOnItems.filter((item) => item.type === "clothing");
}
