import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem, Product, ProductVariant } from '@/types';

const initialState: Cart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  shipping: 0,
  tax: 0,
  total: 0,
};

const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping above ₹1000
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  
  return { subtotal, itemCount, shipping, tax, total };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        variant?: ProductVariant;
        quantity: number;
        type: 'sale' | 'rental';
        rentalStartDate?: string;
        rentalEndDate?: string;
      }>
    ) => {
      const { product, variant, quantity, type, rentalStartDate, rentalEndDate } = action.payload;
      
      // Calculate price
      let price = type === 'rental' ? product.rentalPricePerDay || 0 : product.salePrice || product.price;
      
      // Calculate rental days and price
      let rentalDays = 1;
      if (type === 'rental' && rentalStartDate && rentalEndDate) {
        const start = new Date(rentalStartDate);
        const end = new Date(rentalEndDate);
        rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        price = price * rentalDays;
      }
      
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === product.id &&
          item.variantId === variant?.id &&
          item.type === type &&
          item.rentalStartDate === rentalStartDate &&
          item.rentalEndDate === rentalEndDate
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity
        state.items[existingItemIndex].quantity += quantity;
        state.items[existingItemIndex].total =
          state.items[existingItemIndex].price * state.items[existingItemIndex].quantity;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${variant?.id || 'novariant'}-${type}-${Date.now()}`,
          productId: typeof product.id === 'number' ? product.id : parseInt(product.id) || 0,
          product,
          variantId: variant?.id,
          variant,
          quantity,
          type,
          rentalStartDate,
          rentalEndDate,
          rentalDays: type === 'rental' ? rentalDays : undefined,
          price,
          total: price * quantity,
        };
        state.items.push(newItem);
      }
      
      // Recalculate totals
      const totals = calculateCartTotals(state.items);
      Object.assign(state, totals);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    
    updateCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      
      if (item) {
        item.quantity = quantity;
        item.total = item.price * quantity;
        
        // Recalculate totals
        const totals = calculateCartTotals(state.items);
        Object.assign(state, totals);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(state));
        }
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      
      // Recalculate totals
      const totals = calculateCartTotals(state.items);
      Object.assign(state, totals);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    
    clearCart: (state) => {
      Object.assign(state, initialState);
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
    },
    
    restoreCart: (state) => {
      if (typeof window !== 'undefined') {
        const cartStr = localStorage.getItem('cart');
        if (cartStr) {
          const savedCart = JSON.parse(cartStr);
          Object.assign(state, savedCart);
        }
      }
    },
  },
});

export const {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  restoreCart,
} = cartSlice.actions;

// Alias for consistency
export const updateQuantity = updateCartItemQuantity;

export default cartSlice.reducer;
