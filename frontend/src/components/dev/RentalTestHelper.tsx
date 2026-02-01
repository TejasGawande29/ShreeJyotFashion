'use client';

import React from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { loadMyRentals } from '@/lib/redux/slices/rentalSlice';
import { generateMockRentals } from '@/lib/utils/mockRentals';
import toast from 'react-hot-toast';

/**
 * Developer Test Component for My Rentals Page
 * 
 * This component provides a button to load mock rental data for testing.
 * Usage: Add this component to your page during development
 * 
 * Example:
 * import { RentalTestHelper } from '@/components/dev/RentalTestHelper';
 * 
 * <RentalTestHelper />
 */
export function RentalTestHelper() {
  const dispatch = useAppDispatch();

  const handleLoadMockData = () => {
    const mockData = generateMockRentals();
    dispatch(loadMyRentals(mockData));
    
    toast.success(
      `✅ Loaded ${mockData.active.length + mockData.upcoming.length + mockData.past.length} mock rentals`,
      {
        duration: 3000,
        icon: '📅',
      }
    );
  };

  const handleClearData = () => {
    dispatch(loadMyRentals({
      active: [],
      upcoming: [],
      past: [],
    }));
    
    toast.success('🗑️ Cleared all rental data', {
      duration: 2000,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg border-2 border-pink-300 p-4">
      <div className="text-sm font-semibold text-gray-900 mb-2">🔧 Dev Tools</div>
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleLoadMockData}
          className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors"
        >
          Load Mock Rentals
        </button>
        <button
          onClick={handleClearData}
          className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Clear All Data
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        For testing My Rentals page
      </div>
    </div>
  );
}
