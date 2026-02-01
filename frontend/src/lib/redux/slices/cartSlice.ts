import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  type: 'sale' | 'rental';
  // Rental-specific fields
  rentalPrice?: number;
  securityDeposit?: number;
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalDays?: number;
  rentalTotalCost?: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    if (item.type === 'rental' && item.rentalTotalCost) {
      return sum + item.rentalTotalCost;
    }
    return sum + item.price * item.quantity;
  }, 0);
  return { totalItems, totalPrice };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color &&
          item.type === 'sale'
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },

    addRentalToCart: (
      state,
      action: PayloadAction<Omit<CartItem, 'quantity'>>
    ) => {
      // Rentals are unique items (can't combine)
      state.items.push({ ...action.payload, quantity: 1 });

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; size?: string; color?: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
        
        // Recalculate totals
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(state.items));
        }
      }
    },

    removeItem: (
      state,
      action: PayloadAction<{ id: string; size?: string; color?: string; rentalStartDate?: string }>
    ) => {
      state.items = state.items.filter((item) => {
        if (item.type === 'rental') {
          return !(
            item.id === action.payload.id &&
            item.rentalStartDate === action.payload.rentalStartDate
          );
        }
        return !(
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
        );
      });

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
    },

    loadCartFromStorage: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
  },
});

export const {
  addToCart,
  addRentalToCart,
  updateQuantity,
  removeItem,
  clearCart,
  loadCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
