export type ClothingCategory = "tops" | "bottoms" | "outerwear" | "dresses";

export interface TryOnItem {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  image: string;
  type: "clothing" | "accessory";
  category?: ClothingCategory;
  /** LTK affiliate link. When provided, item becomes shoppable in results. */
  url?: string;
}

export const tryOnItems: TryOnItem[] = [
  // ── Tops ──────────────────────────────────────────────
  {
    id: "shirt-1",
    name: "Oversized White Button-Down",
    description:
      "White oversized cotton button-down shirt with a relaxed fit and classic collar",
    thumbnail: "/images/try-on/white-buttondown-thumb.jpg",
    image: "/images/try-on/white-buttondown-garment.jpg",
    type: "clothing",
    category: "tops",
  },
  {
    id: "top-1",
    name: "Foxcroft Tunic",
    description:
      "White no-iron pinpoint tunic with a clean tailored silhouette and button-front closure",
    thumbnail: "/images/try-on/top-1-thumb.jpg",
    image: "/images/try-on/top-1-garment.jpg",
    type: "clothing",
    category: "tops",
  },
  {
    id: "top-2",
    name: "Off-Shoulder Chunky Sweater",
    description:
      "Cream off-the-shoulder chunky knit sweater with a relaxed oversized fit",
    thumbnail: "/images/try-on/top-2-thumb.jpg",
    image: "/images/try-on/top-2-garment.jpg",
    type: "clothing",
    category: "tops",
  },
  {
    id: "top-3",
    name: "Sweater Vest",
    description:
      "Neutral knit sweater vest, perfect for layering over blouses and tees",
    thumbnail: "/images/try-on/top-3-thumb.jpg",
    image: "/images/try-on/top-3-garment.jpg",
    type: "clothing",
    category: "tops",
  },
  {
    id: "top-4",
    name: "Free People Easy Street Tunic",
    description:
      "Cream oversized tunic sweater with a relaxed drapey fit and ribbed texture",
    thumbnail: "/images/try-on/top-4-thumb.jpg",
    image: "/images/try-on/top-4-garment.jpg",
    type: "clothing",
    category: "tops",
  },

  // ── Bottoms ───────────────────────────────────────────
  {
    id: "bottoms-1",
    name: "Corduroy Skirt",
    description:
      "Fall corduroy skirt in a warm neutral tone with a fitted silhouette",
    thumbnail: "/images/try-on/bottoms-1-thumb.jpg",
    image: "/images/try-on/bottoms-1-garment.jpg",
    type: "clothing",
    category: "bottoms",
  },
  {
    id: "bottoms-2",
    name: "Straight Crop Jeans",
    description:
      "Abercrombie straight crop jeans in a classic medium wash with a relaxed straight leg",
    thumbnail: "/images/try-on/bottoms-2-thumb.jpg",
    image: "/images/try-on/bottoms-2-garment.jpg",
    type: "clothing",
    category: "bottoms",
  },

  // ── Outerwear ─────────────────────────────────────────
  {
    id: "blazer-1",
    name: "Cameron Blazer (Taupe)",
    description:
      "Taupe/khaki oversized single-breasted blazer with notch lapels, one-button closure, and flap pockets",
    thumbnail: "/images/try-on/cameron-blazer-taupe-thumb.jpg",
    image: "/images/try-on/cameron-blazer-taupe-garment.jpg",
    type: "clothing",
    category: "outerwear",
  },
  {
    id: "cardigan-1",
    name: "Long Knit Cardigan",
    description:
      "Long open-front knit cardigan in a neutral oatmeal/beige tone with a relaxed drapey fit",
    thumbnail: "/images/try-on/long-cardigan-thumb.jpg",
    image: "/images/try-on/long-cardigan-garment.jpg",
    type: "clothing",
    category: "outerwear",
  },
  {
    id: "jacket-1",
    name: "Denim Jacket",
    description:
      "Oversized denim jacket in a classic blue wash with a fun relaxed fit",
    thumbnail: "/images/try-on/jacket-1-thumb.jpg",
    image: "/images/try-on/jacket-1-garment.jpg",
    type: "clothing",
    category: "outerwear",
  },
  {
    id: "coat-1",
    name: "Camel Wool Coat",
    description:
      "Abercrombie dad wool coat in camel/tan, calf-length with a tailored single-breasted silhouette",
    thumbnail: "/images/try-on/coat-1-thumb.jpg",
    image: "/images/try-on/coat-1-garment.jpg",
    type: "clothing",
    category: "outerwear",
  },
  {
    id: "jacket-2",
    name: "Plaid Blazer",
    description:
      "H&M plaid boyfriend blazer with a relaxed oversized fit in neutral check pattern",
    thumbnail: "/images/try-on/jacket-2-thumb.jpg",
    image: "/images/try-on/jacket-2-garment.jpg",
    type: "clothing",
    category: "outerwear",
  },
  {
    id: "coat-2",
    name: "Sherpa Coat",
    description:
      "Abercrombie long sherpa jacket in cream with a cozy oversized fit",
    thumbnail: "/images/try-on/coat-2-thumb.jpg",
    image: "/images/try-on/coat-2-garment.jpg",
    type: "clothing",
    category: "outerwear",
  },

  // ── Dresses ───────────────────────────────────────────
  {
    id: "dress-1",
    name: "Babydoll Dress",
    description:
      "Feminine fall babydoll dress with a relaxed A-line silhouette and soft neutral tones",
    thumbnail: "/images/try-on/dress-1-thumb.jpg",
    image: "/images/try-on/dress-1-garment.jpg",
    type: "clothing",
    category: "dresses",
  },
  {
    id: "dress-2",
    name: "WHBM Pleated Dress",
    description:
      "White House Black Market summer pleated dress with a flowy silhouette and elegant drape",
    thumbnail: "/images/try-on/dress-2-thumb.jpg",
    image: "/images/try-on/dress-2-garment.jpg",
    type: "clothing",
    category: "dresses",
  },

  // ── Accessories ───────────────────────────────────────
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
  {
    id: "bag-1",
    name: "Messenger Crossbody Bag",
    description:
      "Neutral-tone messenger crossbody bag with a structured shape and adjustable strap",
    thumbnail: "/images/try-on/bag-1-thumb.jpg",
    image: "/images/try-on/bag-1-garment.jpg",
    type: "accessory",
  },
  {
    id: "scarf-1",
    name: "Oversized Plaid Scarf",
    description:
      "Oversized flannel plaid scarf in warm fall tones, perfect for layering",
    thumbnail: "/images/try-on/scarf-1-thumb.jpg",
    image: "/images/try-on/scarf-1-garment.jpg",
    type: "accessory",
  },
];
