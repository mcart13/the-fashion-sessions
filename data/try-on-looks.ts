export interface TryOnLook {
  id: string;
  name: string;
  description: string;
  itemIds: string[];
}

export const tryOnLooks: TryOnLook[] = [
  {
    id: "date-night",
    name: "Date Night",
    description: "A polished evening look with a blazer and sleek accessories",
    itemIds: ["blazer-1", "shirt-1", "bottoms-2", "sunglasses-1"],
  },
  {
    id: "cozy-weekend",
    name: "Cozy Weekend",
    description: "Relaxed layers for a casual weekend outing",
    itemIds: ["cardigan-1", "top-4", "bottoms-1", "hat-1"],
  },
  {
    id: "office-chic",
    name: "Office Chic",
    description: "Sharp yet comfortable workwear with a plaid blazer",
    itemIds: ["jacket-2", "top-1", "bottoms-2"],
  },
  {
    id: "fall-layers",
    name: "Fall Layers",
    description: "Warm autumn styling with a camel coat and cozy knits",
    itemIds: ["coat-1", "top-2", "bottoms-2", "scarf-1"],
  },
  {
    id: "summer-dress",
    name: "Summer Dress",
    description: "Light and breezy with a pleated dress and summer accessories",
    itemIds: ["dress-2", "sunglasses-2", "bag-1"],
  },
];
