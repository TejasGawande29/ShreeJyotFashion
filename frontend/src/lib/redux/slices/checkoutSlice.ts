import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface PaymentDetails {
  method: 'cod' | 'card' | 'upi' | 'netbanking';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCVV?: string;
  upiId?: string;
}

export interface CheckoutState {
  currentStep: number;
  shippingAddress: ShippingAddress | null;
  paymentDetails: PaymentDetails | null;
  orderNotes?: string;
  couponCode?: string;
  savedAddresses: ShippingAddress[];
}

// Initial state
const initialState: CheckoutState = {
  currentStep: 1,
  shippingAddress: null,
  paymentDetails: null,
  orderNotes: '',
  couponCode: '',
  savedAddresses: [],
};

// Slice
const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    // Step navigation
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    
    nextStep: (state) => {
      if (state.currentStep < 3) {
        state.currentStep += 1;
      }
    },
    
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    
    // Shipping address
    setShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
      }
    },
    
    // Payment details
    setPaymentDetails: (state, action: PayloadAction<PaymentDetails>) => {
      state.paymentDetails = action.payload;
      
      // Save payment method to localStorage (not sensitive data)
      if (typeof window !== 'undefined') {
        localStorage.setItem('paymentMethod', action.payload.method);
      }
    },
    
    // Order notes
    setOrderNotes: (state, action: PayloadAction<string>) => {
      state.orderNotes = action.payload;
    },
    
    // Coupon code
    setCouponCode: (state, action: PayloadAction<string>) => {
      state.couponCode = action.payload;
    },
    
    // Saved addresses
    addSavedAddress: (state, action: PayloadAction<ShippingAddress>) => {
      // If this is default, remove default from others
      if (action.payload.isDefault) {
        state.savedAddresses = state.savedAddresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
      }
      
      state.savedAddresses.push(action.payload);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedAddresses', JSON.stringify(state.savedAddresses));
      }
    },
    
    updateSavedAddress: (state, action: PayloadAction<{ index: number; address: ShippingAddress }>) => {
      const { index, address } = action.payload;
      
      // If this is default, remove default from others
      if (address.isDefault) {
        state.savedAddresses = state.savedAddresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
      }
      
      state.savedAddresses[index] = address;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedAddresses', JSON.stringify(state.savedAddresses));
      }
    },
    
    removeSavedAddress: (state, action: PayloadAction<number>) => {
      state.savedAddresses.splice(action.payload, 1);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedAddresses', JSON.stringify(state.savedAddresses));
      }
    },
    
    loadSavedAddresses: (state, action: PayloadAction<ShippingAddress[]>) => {
      state.savedAddresses = action.payload;
    },
    
    // Load shipping from localStorage
    loadShippingFromStorage: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
    },
    
    // Reset checkout
    resetCheckout: (state) => {
      state.currentStep = 1;
      state.shippingAddress = null;
      state.paymentDetails = null;
      state.orderNotes = '';
      state.couponCode = '';
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');
      }
    },
  },
});

// Actions
export const {
  setCurrentStep,
  nextStep,
  previousStep,
  setShippingAddress,
  setPaymentDetails,
  setOrderNotes,
  setCouponCode,
  addSavedAddress,
  updateSavedAddress,
  removeSavedAddress,
  loadSavedAddresses,
  loadShippingFromStorage,
  resetCheckout,
} = checkoutSlice.actions;

// Selectors
export const selectCurrentStep = (state: { checkout: CheckoutState }) => state.checkout.currentStep;
export const selectShippingAddress = (state: { checkout: CheckoutState }) => state.checkout.shippingAddress;
export const selectPaymentDetails = (state: { checkout: CheckoutState }) => state.checkout.paymentDetails;
export const selectOrderNotes = (state: { checkout: CheckoutState }) => state.checkout.orderNotes;
export const selectCouponCode = (state: { checkout: CheckoutState }) => state.checkout.couponCode;
export const selectSavedAddresses = (state: { checkout: CheckoutState }) => state.checkout.savedAddresses;

// Reducer
export default checkoutSlice.reducer;
