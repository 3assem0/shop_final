// Unified Product interface for the entire application
export interface Product {
  id?: string | number;
  name: string;
  title?: string; // For backward compatibility with Hero
  description: string;
  price: number; // Always number for consistency
  image?: string;
  imageAlt?: string;
  color?: string;
  colorHex?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  oldPrice?: string | number;
  buttonText?: string; // For Hero carousel
  discount?: string; // For Hero carousel
}

// Cart item extends Product with quantity
export interface CartItem extends Product {
  quantity: number;
}

// Product data response from API
export interface ProductData {
  products: Product[];
  lastUpdated: string;
}
