import { Product, CartItem } from '../types/product';

// Counter for generating unique IDs when product ID is missing
let idCounter = 0;

// Unified price formatting function
export const formatPrice = (price: number | string | undefined): string => {
  if (price === undefined || price === null || price === '') return 'EGP 0.00';
  
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) return 'EGP 0.00';
  
  return numericPrice.toLocaleString('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Convert API product to standardized format
export const normalizeProduct = (apiProduct: any): Product => {
  // Generate a unique ID if none exists - this was the main issue!
  let productId = apiProduct.id;
  if (!productId) {
    productId = `generated_${Date.now()}_${++idCounter}`;
    console.warn('⚠️ Product missing ID, generated:', productId, 'for product:', apiProduct.name);
  }

  console.log('🏷️ Normalizing product:', { originalId: apiProduct.id, newId: productId, name: apiProduct.name });

  return {
    id: String(productId), // Always ensure string ID for consistency
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
  console.log('🔄 Converting product to cart item:', {
    productId: product.id,
    name: product.name || product.title,
    quantity
  });

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