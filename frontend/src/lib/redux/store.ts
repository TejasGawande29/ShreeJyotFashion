import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { loadCartFromStorage } from './slices/cartSlice';
import wishlistReducer, { loadWishlistFromStorage } from './slices/wishlistSlice';
import checkoutReducer, { loadSavedAddresses, loadShippingFromStorage } from './slices/checkoutSlice';
import rentalReducer, { loadRentalsFromStorage } from './slices/rentalSlice';
import authReducer, { loadUserFromStorage } from './slices/authSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    checkout: checkoutReducer,
    rental: rentalReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Load persisted state from localStorage
if (typeof window !== 'undefined') {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      const cartItems = JSON.parse(savedCart);
      store.dispatch(loadCartFromStorage(cartItems));
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  }

  const savedWishlist = localStorage.getItem('wishlist');
  if (savedWishlist) {
    try {
      const wishlistItems = JSON.parse(savedWishlist);
      store.dispatch(loadWishlistFromStorage(wishlistItems));
    } catch (error) {
      console.error('Failed to load wishlist from storage:', error);
    }
  }

  const savedAddresses = localStorage.getItem('savedAddresses');
  if (savedAddresses) {
    try {
      const addresses = JSON.parse(savedAddresses);
      store.dispatch(loadSavedAddresses(addresses));
    } catch (error) {
      console.error('Failed to load saved addresses from storage:', error);
    }
  }

  const savedShipping = localStorage.getItem('shippingAddress');
  if (savedShipping) {
    try {
      const shipping = JSON.parse(savedShipping);
      store.dispatch(loadShippingFromStorage(shipping));
    } catch (error) {
      console.error('Failed to load shipping address from storage:', error);
    }
  }

  const savedRentals = localStorage.getItem('rentals');
  if (savedRentals) {
    try {
      const rentals = JSON.parse(savedRentals);
      store.dispatch(loadRentalsFromStorage(rentals));
    } catch (error) {
      console.error('Failed to load rentals from storage:', error);
    }
  }

  // Load auth state from storage
  store.dispatch(loadUserFromStorage());
}

// Subscribe to store changes to persist to localStorage
store.subscribe(() => {
  if (typeof window !== 'undefined') {
    const state = store.getState();
    
    try {
      localStorage.setItem('cart', JSON.stringify(state.cart.items));
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist.items));
      localStorage.setItem('rentals', JSON.stringify(state.rental.items));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
