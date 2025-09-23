// /lib/cart.ts
import { CartItem } from '../types/product';

const STORAGE_KEY = 'myapp_cart_v1';

function safeParse<T>(str: string | null): T | null {
  try {
    return str ? (JSON.parse(str) as T) : null;
  } catch {
    return null;
  }
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  return safeParse<CartItem[]>(localStorage.getItem(STORAGE_KEY)) || [];
}

export function setCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  // broadcast update
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: items }));
}

export function addToCart(item: CartItem) {
  console.log('🛒 Adding item to cart:', item);
  
  const cart = getCart();
  console.log('📦 Current cart:', cart);
  
  // Ensure we're comparing the right types and values
  const itemId = String(item.id); // Convert to string for consistent comparison
  const existingItem = cart.find(cartItem => String(cartItem.id) === itemId);
  
  console.log('🔍 Looking for existing item with ID:', itemId);
  console.log('✅ Found existing item:', existingItem);
  
  if (existingItem) {
    console.log('📈 Updating quantity for existing item');
    existingItem.quantity += item.quantity;
  } else {
    console.log('🆕 Adding new item to cart');
    // Ensure the item has a proper ID
    const newItem = {
      ...item,
      id: itemId // Ensure consistent ID format
    };
    cart.push(newItem);
  }
  
  console.log('💾 Final cart:', cart);
  setCart(cart);
}

export function updateCartItemQuantity(itemId: string | number, quantity: number) {
  const cart = getCart();
  const normalizedId = String(itemId);
  const item = cart.find(cartItem => String(cartItem.id) === normalizedId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(normalizedId);
    } else {
      item.quantity = quantity;
      setCart(cart);
    }
  }
}

export function removeFromCart(itemId: string | number) {
  const normalizedId = String(itemId);
  const cart = getCart().filter((i) => String(i.id) !== normalizedId);
  setCart(cart);
}

export function clearCart() {
  setCart([]);
}