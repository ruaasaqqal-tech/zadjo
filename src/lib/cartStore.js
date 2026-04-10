// Simple cart state management using localStorage
const CART_KEY = 'lugma_cart';

export function getCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToCart(meal) {
  const cart = getCart();
  const existing = cart.find(item => item.meal_id === meal.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      meal_id: meal.id,
      meal_name: meal.meal_name,
      cook_name: meal.cook_name,
      price: meal.price,
      image: meal.image,
      quantity: 1,
    });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
}

export function removeFromCart(mealId) {
  let cart = getCart();
  cart = cart.filter(item => item.meal_id !== mealId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
}

export function updateQuantity(mealId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.meal_id === mealId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cart-updated'));
  return [];
}

export function getCartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}