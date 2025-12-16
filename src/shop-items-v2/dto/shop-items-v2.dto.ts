export type TranslatableField = {
  en: string;
  ua: string;
};

export type MulticurrencyField = {
  uah: number;
  eur: number;
};

type SizeGuide = {
  parameter: string; // e.g. "height" | "chest" | "waist" | "hips" | "length" | "width"
  values: {
    size: string;
    value: string;
  }[]; // e.g. [{ "size": "XS", "value": "50" }, { "size": "S", "value": "52" }, { "size": "M", "value": "54" }]
};

export class CreateShopItemV2Dto {
  id: string; // Unique product identifier (e.g., "PROD-001", "ITEM-123")
  photos: string[];

  price: MulticurrencyField;
  discountPrice: MulticurrencyField;
  isDiscountActive: boolean; // defines if item has crossed out original price and has discount price on the website

  title: TranslatableField;
  description: TranslatableField;
  detailedDescription: TranslatableField;
  color: {
    name: TranslatableField;
    hex?: string; // to display a small block painted in this color on the website if needed
  };

  sizeGuides?: SizeGuide[];
  amount: Record<string, number>; // e.g. { "XS": 2, "S": 3, "M": 4, "L": 5 } | { "one size": 6 } | { "36": 3, "37": 5 } | {"XS-S": 2, "M-L": 3}

  collectionName: string; // e.g. "FW24-25" | "SS23" | "Maritime23" | "Earth is calling"
  categories: string[]; // e.g. "jewelry" | "hoodies and sweatshirts" | "accessories"

  isComingSoon?: boolean; // defines if item has "coming soon" status on the website
  isSoldOut?: boolean; // defines if item is sold out has "sold out" status on the website
  isHidden?: boolean; // defines if item is hidden for clients on the website
  
  position?: number; // For custom ordering in grid display (lower numbers appear first)
}
