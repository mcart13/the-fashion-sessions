export interface TryOnLook {
  id: string;
  name: string;
  description: string;
  /** Path to the Instagram post image used as the look thumbnail. */
  image: string;
  /** Original Instagram post URL (optional, shown as "View post" link). */
  instagramUrl?: string;
  itemIds: string[];
}

export const tryOnLooks: TryOnLook[] = [
  {
    id: "date-night",
    name: "Date Night",
    description: "A polished evening look with a blazer and sleek accessories",
    image: "/images/try-on/looks/date-night.jpg",
    instagramUrl: "https://www.instagram.com/thefashionsessions/p/DTFt8awDrdz/",
    itemIds: ["blazer-1", "shirt-1", "bottoms-2", "sunglasses-1"],
  },
  {
    id: "cozy-weekend",
    name: "Cozy Weekend",
    description: "Relaxed layers for a casual weekend outing",
    image: "/images/try-on/looks/cozy-weekend.jpg",
    instagramUrl: "https://www.instagram.com/thefashionsessions/p/DTFt8awDrdz/",
    itemIds: ["cardigan-1", "top-4", "bottoms-1", "hat-1"],
  },
  {
    id: "office-chic",
    name: "Office Chic",
    description: "Sharp yet comfortable workwear with a plaid blazer",
    image: "/images/try-on/looks/office-chic.jpg",
    instagramUrl: "https://www.instagram.com/thefashionsessions/p/DTFt8awDrdz/",
    itemIds: ["jacket-2", "top-1", "bottoms-2"],
  },
  {
    id: "fall-layers",
    name: "Fall Layers",
    description: "Warm autumn styling with a camel coat and cozy knits",
    image: "/images/try-on/looks/fall-layers.jpg",
    instagramUrl: "https://www.instagram.com/thefashionsessions/p/DTFt8awDrdz/",
    itemIds: ["coat-1", "top-2", "bottoms-2", "scarf-1"],
  },
  {
    id: "summer-dress",
    name: "Summer Dress",
    description: "Light and breezy with a pleated dress and summer accessories",
    image: "/images/try-on/looks/summer-dress.jpg",
    instagramUrl: "https://www.instagram.com/thefashionsessions/p/DVn2aNzDkEj/",
    itemIds: ["dress-2", "sunglasses-2", "bag-1"],
  },
];
