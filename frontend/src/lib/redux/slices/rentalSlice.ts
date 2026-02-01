import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Rental Item Interface
export interface RentalItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  category: string;
  dailyRate: number;
  securityDeposit: number;
  size?: string;
  color?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  duration: number; // days
  rentalTotal: number; // dailyRate × duration
  totalAmount: number; // rentalTotal + securityDeposit
  addedAt: string;
}

// Rental Booking State
export interface RentalBooking {
  productId: string;
  startDate: string | null;
  endDate: string | null;
  duration: number;
  dailyRate: number;
  securityDeposit: number;
  rentalTotal: number;
  totalAmount: number;
}

// Rental State
interface RentalState {
  items: RentalItem[]; // Active rental bookings in cart
  currentBooking: RentalBooking | null; // Current rental being configured
  myRentals: {
    active: RentalItem[];
    upcoming: RentalItem[];
    past: RentalItem[];
  };
  totalItems: number;
  totalRentalAmount: number; // Sum of all rental amounts
  totalDeposit: number; // Sum of all security deposits
  totalAmount: number; // Grand total
}

const initialState: RentalState = {
  items: [],
  currentBooking: null,
  myRentals: {
    active: [],
    upcoming: [],
    past: [],
  },
  totalItems: 0,
  totalRentalAmount: 0,
  totalDeposit: 0,
  totalAmount: 0,
};

// Helper: Calculate rental duration in days
const calculateDuration = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1; // Minimum 1 day
};

// Helper: Calculate totals
const calculateTotals = (items: RentalItem[]) => {
  const totalItems = items.length;
  const totalRentalAmount = items.reduce((sum, item) => sum + item.rentalTotal, 0);
  const totalDeposit = items.reduce((sum, item) => sum + item.securityDeposit, 0);
  const totalAmount = totalRentalAmount + totalDeposit;

  return { totalItems, totalRentalAmount, totalDeposit, totalAmount };
};

// Helper: Persist to localStorage
const persistRentals = (items: RentalItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rentals', JSON.stringify(items));
  }
};

const rentalSlice = createSlice({
  name: 'rental',
  initialState,
  reducers: {
    // Set current booking details (when user is configuring rental)
    setCurrentBooking: (state, action: PayloadAction<{
      productId: string;
      dailyRate: number;
      securityDeposit: number;
    }>) => {
      state.currentBooking = {
        productId: action.payload.productId,
        startDate: null,
        endDate: null,
        duration: 0,
        dailyRate: action.payload.dailyRate,
        securityDeposit: action.payload.securityDeposit,
        rentalTotal: 0,
        totalAmount: action.payload.securityDeposit,
      };
    },

    // Update rental dates
    setRentalDates: (state, action: PayloadAction<{
      startDate: string;
      endDate: string;
    }>) => {
      if (state.currentBooking) {
        const { startDate, endDate } = action.payload;
        const duration = calculateDuration(startDate, endDate);
        const rentalTotal = state.currentBooking.dailyRate * duration;
        const totalAmount = rentalTotal + state.currentBooking.securityDeposit;

        state.currentBooking = {
          ...state.currentBooking,
          startDate,
          endDate,
          duration,
          rentalTotal,
          totalAmount,
        };
      }
    },

    // Clear current booking
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },

    // Add rental to cart
    addRentalToCart: (state, action: PayloadAction<{
      id: string;
      productId: string;
      name: string;
      image: string;
      category: string;
      size?: string;
      color?: string;
    }>) => {
      if (!state.currentBooking || !state.currentBooking.startDate || !state.currentBooking.endDate) {
        return; // Cannot add without dates
      }

      const existingIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId &&
          item.startDate === state.currentBooking?.startDate &&
          item.endDate === state.currentBooking?.endDate
      );

      if (existingIndex >= 0) {
        // Update existing rental booking
        state.items[existingIndex] = {
          ...state.items[existingIndex],
          ...action.payload,
          dailyRate: state.currentBooking.dailyRate,
          securityDeposit: state.currentBooking.securityDeposit,
          startDate: state.currentBooking.startDate,
          endDate: state.currentBooking.endDate,
          duration: state.currentBooking.duration,
          rentalTotal: state.currentBooking.rentalTotal,
          totalAmount: state.currentBooking.totalAmount,
        };
      } else {
        // Add new rental booking
        const newRental: RentalItem = {
          ...action.payload,
          dailyRate: state.currentBooking.dailyRate,
          securityDeposit: state.currentBooking.securityDeposit,
          startDate: state.currentBooking.startDate,
          endDate: state.currentBooking.endDate,
          duration: state.currentBooking.duration,
          rentalTotal: state.currentBooking.rentalTotal,
          totalAmount: state.currentBooking.totalAmount,
          addedAt: new Date().toISOString(),
        };
        state.items.push(newRental);
      }

      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalRentalAmount = totals.totalRentalAmount;
      state.totalDeposit = totals.totalDeposit;
      state.totalAmount = totals.totalAmount;

      // Persist to localStorage
      persistRentals(state.items);

      // Clear current booking
      state.currentBooking = null;
    },

    // Remove rental from cart
    removeRentalFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalRentalAmount = totals.totalRentalAmount;
      state.totalDeposit = totals.totalDeposit;
      state.totalAmount = totals.totalAmount;

      // Persist to localStorage
      persistRentals(state.items);
    },

    // Update rental dates in cart
    updateRentalDates: (state, action: PayloadAction<{
      id: string;
      startDate: string;
      endDate: string;
    }>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        const { startDate, endDate } = action.payload;
        const duration = calculateDuration(startDate, endDate);
        const rentalTotal = state.items[index].dailyRate * duration;
        const totalAmount = rentalTotal + state.items[index].securityDeposit;

        state.items[index] = {
          ...state.items[index],
          startDate,
          endDate,
          duration,
          rentalTotal,
          totalAmount,
        };

        // Recalculate totals
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalRentalAmount = totals.totalRentalAmount;
        state.totalDeposit = totals.totalDeposit;
        state.totalAmount = totals.totalAmount;

        // Persist to localStorage
        persistRentals(state.items);
      }
    },

    // Clear rental cart
    clearRentalCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalRentalAmount = 0;
      state.totalDeposit = 0;
      state.totalAmount = 0;
      persistRentals([]);
    },

    // Load rentals from localStorage
    loadRentalsFromStorage: (state, action: PayloadAction<RentalItem[]>) => {
      state.items = action.payload;
      const totals = calculateTotals(action.payload);
      state.totalItems = totals.totalItems;
      state.totalRentalAmount = totals.totalRentalAmount;
      state.totalDeposit = totals.totalDeposit;
      state.totalAmount = totals.totalAmount;
    },

    // Add to My Rentals (after booking confirmation)
    addToMyRentals: (state, action: PayloadAction<{
      rental: RentalItem;
      status: 'active' | 'upcoming' | 'past';
    }>) => {
      const { rental, status } = action.payload;
      state.myRentals[status].push(rental);
    },

    // Update rental status
    updateRentalStatus: (state, action: PayloadAction<{
      rentalId: string;
      fromStatus: 'active' | 'upcoming' | 'past';
      toStatus: 'active' | 'upcoming' | 'past';
    }>) => {
      const { rentalId, fromStatus, toStatus } = action.payload;
      const rentalIndex = state.myRentals[fromStatus].findIndex((r) => r.id === rentalId);
      
      if (rentalIndex >= 0) {
        const rental = state.myRentals[fromStatus][rentalIndex];
        state.myRentals[fromStatus].splice(rentalIndex, 1);
        state.myRentals[toStatus].push(rental);
      }
    },

    // Load My Rentals from API
    loadMyRentals: (state, action: PayloadAction<{
      active: RentalItem[];
      upcoming: RentalItem[];
      past: RentalItem[];
    }>) => {
      state.myRentals = action.payload;
    },
  },
});

// Actions
export const {
  setCurrentBooking,
  setRentalDates,
  clearCurrentBooking,
  addRentalToCart,
  removeRentalFromCart,
  updateRentalDates,
  clearRentalCart,
  loadRentalsFromStorage,
  addToMyRentals,
  updateRentalStatus,
  loadMyRentals,
} = rentalSlice.actions;

// Selectors
export const selectRentalItems = (state: RootState) => state.rental.items;
export const selectCurrentBooking = (state: RootState) => state.rental.currentBooking;
export const selectRentalTotals = (state: RootState) => ({
  totalItems: state.rental.totalItems,
  totalRentalAmount: state.rental.totalRentalAmount,
  totalDeposit: state.rental.totalDeposit,
  totalAmount: state.rental.totalAmount,
});
export const selectMyRentals = (state: RootState) => state.rental.myRentals;

export default rentalSlice.reducer;
