import { Product, CartItem } from '../types/product';

// Unified price formatting function
export const formatPrice = (price: number | string | undefined): string => {
  if (price === undefined || price === null || price === '') return '$0.00';
  
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) return '$0.00';
  
  return numericPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Convert API product to standardized format
export const normalizeProduct = (apiProduct: any): Product => {
  return {
    id: apiProduct.id || Date.now(),
    name: apiProduct.name || apiProduct.title || '',
    title: apiProduct.title || apiProduct.name || '',
    description: apiProduct.description || '',
    price: typeof apiProduct.price === 'string' ? parseFloat(apiProduct.price) : (apiProduct.price || 0),
    image: apiProduct.image || '/logo.png',
    imageAlt: apiProduct.imageAlt || apiProduct.name || '',
    color: apiProduct.color || '',
    colorHex: apiProduct.colorHex || '#6366f1',
    category: apiProduct.category || '',
    rating: apiProduct.rating || 0,
    reviewCount: apiProduct.reviewCount || 0,
    featured: Boolean(apiProduct.featured),
    oldPrice: apiProduct.oldPrice || '',
    buttonText: apiProduct.buttonText || 'Shop Now',
    discount: apiProduct.discount || ''
  };
};

// Convert Product to CartItem
export const productToCartItem = (product: Product, quantity: number = 1): CartItem => {
  return {
    ...product,
    quantity
  };
};

// Validate product data
export const isValidProduct = (product: any): product is Product => {
  return (
    product &&
    typeof product.name === 'string' &&
    (typeof product.price === 'number' || typeof product.price === 'string') &&
    product.name.trim().length > 0
  );
};

// Get product display name (name or title)
export const getProductDisplayName = (product: Product): string => {
  return product.title || product.name;
};

// Check if product is featured
export const isFeaturedProduct = (product: Product): boolean => {
  return Boolean(product.featured);
};
