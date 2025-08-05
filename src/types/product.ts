export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  color?: string;
  image_urls: string[];
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}