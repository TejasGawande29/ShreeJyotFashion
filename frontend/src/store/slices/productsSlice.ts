import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';

interface ProductsState {
  items: Product[];
  featured: Product[];
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  };
}

const initialState: ProductsState = {
  items: [],
  featured: [],
  loading: false,
  error: null,
  filters: {},
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featured = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const {
  setProducts,
  setFeaturedProducts,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
