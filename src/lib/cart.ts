// /lib/cart.ts
export type CartItem = {
  id: number | string;
  name: string;
  price?: string;
  imageSrc?: string;
  imageAlt?: string;
  color?: string;
  colorHex?: string;
  category?: string;
  // any other fields you want to store
};

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
  const cart = getCart();
  cart.push(item);
  setCart(cart);
}

export function removeFromCart(itemId: string | number) {
  const cart = getCart().filter((i) => i.id !== itemId);
  setCart(cart);
}

export function clearCart() {
  setCart([]);
}
