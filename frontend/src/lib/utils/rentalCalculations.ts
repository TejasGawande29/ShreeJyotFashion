/**
 * Rental Calculation Utilities
 * Helper functions for rental date validation, duration calculation, and pricing
 */

import { differenceInDays, isAfter, isBefore, isEqual, startOfDay } from 'date-fns';

// Constants
export const MIN_RENTAL_DAYS = 1;
export const MAX_RENTAL_DAYS = 30;

/**
 * Calculate the number of days between two dates (inclusive)
 * @param startDate - Rental start date
 * @param endDate - Rental end date
 * @returns Number of rental days
 */
export function calculateRentalDays(startDate: Date | null, endDate: Date | null): number {
  if (!startDate || !endDate) return 0;
  
  const days = differenceInDays(endDate, startDate) + 1; // +1 to include both start and end day
  return days > 0 ? days : 0;
}

/**
 * Calculate total rental cost
 * @param dailyRate - Daily rental rate
 * @param days - Number of rental days
 * @returns Total rental cost
 */
export function calculateRentalCost(dailyRate: number, days: number): number {
  if (days <= 0) return 0;
  return dailyRate * days;
}

/**
 * Calculate grand total (rental cost + security deposit)
 * @param rentalCost - Total rental cost
 * @param securityDeposit - Security deposit amount
 * @returns Grand total
 */
export function calculateGrandTotal(rentalCost: number, securityDeposit: number): number {
  return rentalCost + securityDeposit;
}

/**
 * Check if a date is in the past (before today)
 * @param date - Date to check
 * @returns true if date is in the past
 */
export function isPastDate(date: Date): boolean {
  const today = startOfDay(new Date());
  return isBefore(startOfDay(date), today);
}

/**
 * Check if a date is in the unavailable dates list
 * @param date - Date to check
 * @param unavailableDates - Array of unavailable date strings (YYYY-MM-DD)
 * @returns true if date is unavailable
 */
export function isDateUnavailable(date: Date, unavailableDates: string[]): boolean {
  const dateString = formatDateToString(date);
  return unavailableDates.includes(dateString);
}

/**
 * Validate rental date range
 * @param startDate - Rental start date
 * @param endDate - Rental end date
 * @param unavailableDates - Array of unavailable date strings
 * @returns Validation result with error message if invalid
 */
export function validateRentalDates(
  startDate: Date | null,
  endDate: Date | null,
  unavailableDates: string[] = []
): { isValid: boolean; error?: string } {
  // Check if both dates are selected
  if (!startDate || !endDate) {
    return { isValid: false, error: 'Please select both start and end dates' };
  }

  // Check if start date is in the past
  if (isPastDate(startDate)) {
    return { isValid: false, error: 'Start date cannot be in the past' };
  }

  // Check if end date is before start date
  if (isBefore(endDate, startDate)) {
    return { isValid: false, error: 'End date must be after start date' };
  }

  // Calculate rental duration
  const days = calculateRentalDays(startDate, endDate);

  // Check minimum rental days
  if (days < MIN_RENTAL_DAYS) {
    return { isValid: false, error: `Minimum rental period is ${MIN_RENTAL_DAYS} day(s)` };
  }

  // Check maximum rental days
  if (days > MAX_RENTAL_DAYS) {
    return { isValid: false, error: `Maximum rental period is ${MAX_RENTAL_DAYS} days` };
  }

  // Check if any date in the range is unavailable
  const datesInRange = getDateRangeArray(startDate, endDate);
  for (const date of datesInRange) {
    if (isDateUnavailable(date, unavailableDates)) {
      return { isValid: false, error: 'Selected dates include unavailable periods' };
    }
  }

  return { isValid: true };
}

/**
 * Get array of dates between start and end date (inclusive)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of dates
 */
export function getDateRangeArray(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * Format date to YYYY-MM-DD string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse date string to Date object
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object
 */
export function parseStringToDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Format date for display (e.g., "Nov 15, 2025")
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateForDisplay(date: Date | null): string {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Get minimum selectable date (today)
 * @returns Today's date at start of day
 */
export function getMinSelectableDate(): Date {
  return startOfDay(new Date());
}

/**
 * Get maximum selectable date (today + max rental days + 90 days buffer)
 * @returns Maximum date
 */
export function getMaxSelectableDate(): Date {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + MAX_RENTAL_DAYS + 90); // 90 days booking window
  return maxDate;
}

/**
 * Calculate suggested end date based on start date and default rental period
 * @param startDate - Start date
 * @param defaultDays - Default rental period (default: 3 days)
 * @returns Suggested end date
 */
export function calculateSuggestedEndDate(startDate: Date, defaultDays: number = 3): Date {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + defaultDays - 1); // -1 because range is inclusive
  return endDate;
}

/**
 * Check if rental dates overlap with unavailable dates
 * @param startDate - Rental start date
 * @param endDate - Rental end date
 * @param unavailableDates - Array of unavailable date strings
 * @returns Array of overlapping dates
 */
export function getOverlappingDates(
  startDate: Date,
  endDate: Date,
  unavailableDates: string[]
): Date[] {
  const datesInRange = getDateRangeArray(startDate, endDate);
  return datesInRange.filter((date) => isDateUnavailable(date, unavailableDates));
}

/**
 * Calculate late return penalty
 * @param returnDate - Actual return date
 * @param expectedReturnDate - Expected return date
 * @param dailyRate - Daily rental rate
 * @param penaltyMultiplier - Penalty multiplier (default: 2x daily rate)
 * @returns Penalty amount
 */
export function calculateLateReturnPenalty(
  returnDate: Date,
  expectedReturnDate: Date,
  dailyRate: number,
  penaltyMultiplier: number = 2
): number {
  if (!isAfter(returnDate, expectedReturnDate)) return 0;
  
  const lateDays = differenceInDays(returnDate, expectedReturnDate);
  return lateDays * dailyRate * penaltyMultiplier;
}

/**
 * Format currency amount
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
