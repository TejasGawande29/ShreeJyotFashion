import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  type: 'sale' | 'rental';
  rentalPrice?: number;
  addedAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
}

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (!existingItem) {
        state.items.push({
          ...action.payload,
          addedAt: new Date().toISOString(),
        });
        state.totalItems = state.items.length;
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalItems = state.items.length;
    },

    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
    },

    loadWishlistFromStorage: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
      state.totalItems = action.payload.length;
    },

    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (existingItem) {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      } else {
        state.items.push({
          ...action.payload,
          addedAt: new Date().toISOString(),
        });
      }
      state.totalItems = state.items.length;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  loadWishlistFromStorage,
  toggleWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
