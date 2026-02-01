import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WishlistItem } from '@/types';

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      state.items.push(action.payload);
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setWishlist, addToWishlist, removeFromWishlist, setLoading } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
