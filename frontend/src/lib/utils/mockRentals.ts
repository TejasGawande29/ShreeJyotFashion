// Mock Rental Data Generator for Testing My Rentals Page
// This utility helps populate the My Rentals page with test data

import { RentalItem } from '@/lib/redux/slices/rentalSlice';

// Generate mock rental items for testing
export const generateMockRentals = () => {
  const today = new Date();
  
  // Helper to add/subtract days
  const addDays = (date: Date, days: number): string => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString();
  };

  // Active Rentals (currently ongoing)
  const activeRentals: RentalItem[] = [
    {
      id: 'rental-1',
      productId: 'men-golden-sherwani',
      name: 'Men Golden Sherwani',
      image: '/images/products/men-golden-sherwani.jpg',
      category: 'Sherwani',
      dailyRate: 300,
      securityDeposit: 6000,
      size: 'M',
      color: 'Golden',
      startDate: addDays(today, -5), // Started 5 days ago
      endDate: addDays(today, 2), // Ends in 2 days
      duration: 7,
      rentalTotal: 2100,
      totalAmount: 8100,
      addedAt: addDays(today, -10),
    },
    {
      id: 'rental-2',
      productId: 'women-red-lehenga',
      name: 'Women Red Lehenga Choli',
      image: '/images/products/women-red-lehenga.jpg',
      category: 'Lehenga',
      dailyRate: 500,
      securityDeposit: 10000,
      size: 'L',
      color: 'Red',
      startDate: addDays(today, -3), // Started 3 days ago
      endDate: addDays(today, 4), // Ends in 4 days
      duration: 7,
      rentalTotal: 3500,
      totalAmount: 13500,
      addedAt: addDays(today, -8),
    },
  ];

  // Upcoming Rentals (scheduled for future)
  const upcomingRentals: RentalItem[] = [
    {
      id: 'rental-3',
      productId: 'men-navy-suit',
      name: 'Men Navy Blue Suit',
      image: '/images/products/men-navy-suit.jpg',
      category: 'Suit',
      dailyRate: 250,
      securityDeposit: 5000,
      size: 'L',
      color: 'Navy Blue',
      startDate: addDays(today, 10), // Starts in 10 days
      endDate: addDays(today, 13), // Ends in 13 days
      duration: 3,
      rentalTotal: 750,
      totalAmount: 5750,
      addedAt: addDays(today, -2),
    },
    {
      id: 'rental-4',
      productId: 'women-pink-gown',
      name: 'Women Pink Evening Gown',
      image: '/images/products/women-pink-gown.jpg',
      category: 'Gown',
      dailyRate: 400,
      securityDeposit: 8000,
      size: 'M',
      color: 'Pink',
      startDate: addDays(today, 15), // Starts in 15 days
      endDate: addDays(today, 18), // Ends in 18 days
      duration: 3,
      rentalTotal: 1200,
      totalAmount: 9200,
      addedAt: addDays(today, -1),
    },
    {
      id: 'rental-5',
      productId: 'men-cream-kurta',
      name: 'Men Cream Kurta Pajama Set',
      image: '/images/products/men-cream-kurta.jpg',
      category: 'Kurta',
      dailyRate: 150,
      securityDeposit: 3000,
      size: 'XL',
      color: 'Cream',
      startDate: addDays(today, 20), // Starts in 20 days
      endDate: addDays(today, 22), // Ends in 22 days
      duration: 2,
      rentalTotal: 300,
      totalAmount: 3300,
      addedAt: today.toISOString(),
    },
  ];

  // Past Rentals (completed/returned)
  const pastRentals: RentalItem[] = [
    {
      id: 'rental-6',
      productId: 'men-black-tuxedo',
      name: 'Men Black Tuxedo',
      image: '/images/products/men-black-tuxedo.jpg',
      category: 'Tuxedo',
      dailyRate: 600,
      securityDeposit: 12000,
      size: 'L',
      color: 'Black',
      startDate: addDays(today, -30), // Started 30 days ago
      endDate: addDays(today, -27), // Ended 27 days ago
      duration: 3,
      rentalTotal: 1800,
      totalAmount: 13800,
      addedAt: addDays(today, -35),
    },
    {
      id: 'rental-7',
      productId: 'women-green-saree',
      name: 'Women Green Silk Saree',
      image: '/images/products/women-green-saree.jpg',
      category: 'Saree',
      dailyRate: 350,
      securityDeposit: 7000,
      size: 'Free Size',
      color: 'Green',
      startDate: addDays(today, -60), // Started 60 days ago
      endDate: addDays(today, -57), // Ended 57 days ago
      duration: 3,
      rentalTotal: 1050,
      totalAmount: 8050,
      addedAt: addDays(today, -65),
    },
    {
      id: 'rental-8',
      productId: 'men-maroon-sherwani',
      name: 'Men Maroon Sherwani',
      image: '/images/products/men-maroon-sherwani.jpg',
      category: 'Sherwani',
      dailyRate: 450,
      securityDeposit: 9000,
      size: 'M',
      color: 'Maroon',
      startDate: addDays(today, -90), // Started 90 days ago
      endDate: addDays(today, -85), // Ended 85 days ago
      duration: 5,
      rentalTotal: 2250,
      totalAmount: 11250,
      addedAt: addDays(today, -95),
    },
  ];

  return {
    active: activeRentals,
    upcoming: upcomingRentals,
    past: pastRentals,
  };
};

// Function to load mock rentals into Redux store
export const loadMockRentalsToStore = (dispatch: any) => {
  const mockData = generateMockRentals();
  
  // Import the loadMyRentals action
  import('@/lib/redux/slices/rentalSlice').then(({ loadMyRentals }) => {
    dispatch(loadMyRentals(mockData));
  });
};

// Console helper for testing
if (typeof window !== 'undefined') {
  (window as any).loadMockRentals = () => {
    console.log('Mock rentals generated:', generateMockRentals());
    console.log('To load into Redux, use: loadMockRentalsToStore(dispatch)');
  };
}
