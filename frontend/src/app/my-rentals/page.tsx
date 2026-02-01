'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { selectMyRentals, updateRentalStatus, RentalItem } from '@/lib/redux/slices/rentalSlice';
import { 
  FiCalendar, 
  FiClock, 
  FiPackage, 
  FiRefreshCw, 
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiFileText,
  FiHome
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { RentalTestHelper } from '@/components/dev/RentalTestHelper';

type TabType = 'active' | 'upcoming' | 'past';

type RentalStatus = 'active' | 'upcoming' | 'returned' | 'overdue';

const MyRentalsPage = () => {
  const dispatch = useAppDispatch();
  const myRentals = useAppSelector(selectMyRentals);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [selectedRental, setSelectedRental] = useState<RentalItem | null>(null);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Calculate days remaining for active rentals
  const getDaysRemaining = (endDate: string): number => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get rental status
  const getRentalStatus = (rental: RentalItem, tab: TabType): RentalStatus => {
    if (tab === 'past') return 'returned';
    
    const today = new Date();
    const start = new Date(rental.startDate);
    const end = new Date(rental.endDate);

    if (today >= start && today <= end) {
      const daysRemaining = getDaysRemaining(rental.endDate);
      return daysRemaining < 0 ? 'overdue' : 'active';
    }
    
    if (today < start) return 'upcoming';
    return 'returned';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: RentalStatus) => {
    const badges = {
      active: {
        text: 'Active',
        bg: 'bg-green-100',
        text_color: 'text-green-700',
        icon: <FiCheckCircle className="w-4 h-4" />,
      },
      upcoming: {
        text: 'Upcoming',
        bg: 'bg-blue-100',
        text_color: 'text-blue-700',
        icon: <FiClock className="w-4 h-4" />,
      },
      returned: {
        text: 'Returned',
        bg: 'bg-gray-100',
        text_color: 'text-gray-700',
        icon: <FiPackage className="w-4 h-4" />,
      },
      overdue: {
        text: 'Overdue',
        bg: 'bg-red-100',
        text_color: 'text-red-700',
        icon: <FiAlertCircle className="w-4 h-4" />,
      },
    };

    const badge = badges[status];
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text_color}`}>
        {badge.icon}
        <span>{badge.text}</span>
      </span>
    );
  };

  // Handle extend rental
  const handleExtendRental = (rental: RentalItem) => {
    setSelectedRental(rental);
    setShowExtendModal(true);
  };

  // Handle request return
  const handleRequestReturn = async (rental: RentalItem) => {
    if (processingId) return; // Prevent multiple clicks
    
    setProcessingId(rental.id);
    
    try {
      await toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            // Move from active to past
            dispatch(updateRentalStatus({
              rentalId: rental.id,
              fromStatus: 'active',
              toStatus: 'past',
            }));
            resolve('Return requested successfully');
          }, 800); // Reduced from 1000ms
        }),
        {
          loading: 'Processing return request...',
          success: 'Return pickup scheduled! We will contact you soon.',
          error: 'Failed to request return',
        }
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Handle tab change with loading state
  const handleTabChange = (tab: TabType) => {
    setIsLoading(true);
    setActiveTab(tab);
    // Small delay to show loading state
    setTimeout(() => setIsLoading(false), 100);
  };

  // Get current rentals based on active tab
  const currentRentals = myRentals[activeTab];

  // Calculate stats
  const stats = {
    total: myRentals.active.length + myRentals.upcoming.length + myRentals.past.length,
    active: myRentals.active.length,
    upcoming: myRentals.upcoming.length,
    past: myRentals.past.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-pink-600 transition-colors flex items-center">
              <FiHome className="w-4 h-4 mr-1" />
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">My Rentals</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rentals</h1>
              <p className="text-gray-600">Manage your active, upcoming, and past rentals</p>
            </div>
            
            {/* Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Rentals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => handleTabChange('active')}
              disabled={isLoading}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors relative ${
                activeTab === 'active'
                  ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiCheckCircle className="w-5 h-5" />
                <span>Active</span>
                {stats.active > 0 && (
                  <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                    {stats.active}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => handleTabChange('upcoming')}
              disabled={isLoading}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors relative ${
                activeTab === 'upcoming'
                  ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiClock className="w-5 h-5" />
                <span>Upcoming</span>
                {stats.upcoming > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                    {stats.upcoming}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => handleTabChange('past')}
              disabled={isLoading}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors relative ${
                activeTab === 'past'
                  ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiPackage className="w-5 h-5" />
                <span>Past</span>
              </div>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : currentRentals.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="space-y-4">
            {currentRentals.map((rental) => {
              const status = getRentalStatus(rental, activeTab);
              const daysRemaining = activeTab === 'active' ? getDaysRemaining(rental.endDate) : 0;

              return (
                <div
                  key={rental.id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                      {/* Left: Product Info */}
                      <div className="flex space-x-4">
                        <div className="relative w-24 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={rental.image}
                            alt={rental.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder.jpg';
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <Link
                              href={`/products/${rental.productId}`}
                              className="text-lg font-semibold text-gray-900 hover:text-pink-600 transition-colors"
                            >
                              {rental.name}
                            </Link>
                            {getStatusBadge(status)}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            {rental.size && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                Size: {rental.size}
                              </span>
                            )}
                            {rental.color && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                Color: {rental.color}
                              </span>
                            )}
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-600">{rental.category}</span>
                          </div>

                          {/* Rental Dates */}
                          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4 mb-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs text-gray-600 mb-1">Start Date</div>
                                <div className="flex items-center text-sm font-medium text-gray-900">
                                  <FiCalendar className="w-4 h-4 mr-2 text-pink-500" />
                                  {formatDate(rental.startDate)}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600 mb-1">End Date</div>
                                <div className="flex items-center text-sm font-medium text-gray-900">
                                  <FiCalendar className="w-4 h-4 mr-2 text-purple-500" />
                                  {formatDate(rental.endDate)}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-pink-200">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-purple-700 font-medium">
                                  <FiClock className="inline w-4 h-4 mr-1" />
                                  {rental.duration} Days Rental
                                </span>
                                {activeTab === 'active' && daysRemaining >= 0 && (
                                  <span className={`text-sm font-medium ${
                                    daysRemaining <= 2 ? 'text-red-600' : 'text-green-600'
                                  }`}>
                                    {daysRemaining === 0 
                                      ? 'Ends today' 
                                      : `${daysRemaining} days remaining`
                                    }
                                  </span>
                                )}
                                {activeTab === 'active' && daysRemaining < 0 && (
                                  <span className="text-sm font-medium text-red-600">
                                    Overdue by {Math.abs(daysRemaining)} days
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Price Info */}
                          <div className="flex items-center space-x-6 text-sm">
                            <div>
                              <span className="text-gray-600">Rental: </span>
                              <span className="font-semibold text-gray-900">
                                ₹{rental.rentalTotal.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Deposit: </span>
                              <span className="font-semibold text-green-700">
                                ₹{rental.securityDeposit.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="text-gray-400">|</div>
                            <div>
                              <span className="text-gray-600">Total: </span>
                              <span className="font-bold text-pink-600 text-base">
                                ₹{rental.totalAmount.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 lg:ml-4">
                        <button
                          onClick={() => {
                            toast.success('Coming soon: View detailed rental information');
                          }}
                          className="flex-1 lg:flex-initial px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                        >
                          <FiFileText className="w-4 h-4" />
                          <span>View Details</span>
                        </button>

                        {activeTab === 'active' && daysRemaining > 0 && (
                          <>
                            <button
                              onClick={() => handleExtendRental(rental)}
                              disabled={processingId === rental.id}
                              className="flex-1 lg:flex-initial px-4 py-2 text-sm font-medium text-pink-700 bg-pink-50 border border-pink-300 rounded-lg hover:bg-pink-100 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiRefreshCw className="w-4 h-4" />
                              <span>Extend</span>
                            </button>
                            <button
                              onClick={() => handleRequestReturn(rental)}
                              disabled={processingId === rental.id}
                              className="flex-1 lg:flex-initial px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingId === rental.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Processing...</span>
                                </>
                              ) : (
                                <>
                                  <FiPackage className="w-4 h-4" />
                                  <span>Request Return</span>
                                </>
                              )}
                            </button>
                          </>
                        )}

                        {activeTab === 'active' && daysRemaining < 0 && (
                          <button
                            onClick={() => handleRequestReturn(rental)}
                            disabled={processingId === rental.id}
                            className="flex-1 lg:flex-initial px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingId === rental.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <FiAlertCircle className="w-4 h-4" />
                                <span>Return Overdue Item</span>
                              </>
                            )}
                          </button>
                        )}

                        {activeTab === 'upcoming' && (
                          <button
                            onClick={() => {
                              toast.success('Coming soon: Modify upcoming rental dates');
                            }}
                            className="flex-1 lg:flex-initial px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                          >
                            <FiCalendar className="w-4 h-4" />
                            <span>Modify Dates</span>
                          </button>
                        )}

                        {activeTab === 'past' && (
                          <>
                            <button
                              onClick={() => {
                                toast.success('Coming soon: View invoice');
                              }}
                              className="flex-1 lg:flex-initial px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                            >
                              <FiFileText className="w-4 h-4" />
                              <span>View Invoice</span>
                            </button>
                            <button
                              onClick={() => {
                                toast.success('Coming soon: Book this item again');
                              }}
                              className="flex-1 lg:flex-initial px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
                            >
                              <FiRefreshCw className="w-4 h-4" />
                              <span>Book Again</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Extend Modal (Placeholder) */}
      {showExtendModal && selectedRental && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Extend Rental</h3>
            <p className="text-gray-600 mb-4">
              Extend your rental for <span className="font-semibold">{selectedRental.name}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This feature is coming soon. You'll be able to extend your rental period and pay the additional amount.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowExtendModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success('Extension feature coming soon!');
                  setShowExtendModal(false);
                }}
                className="flex-1 px-4 py-2 text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Test Helper (Remove in production) */}
      {process.env.NODE_ENV === 'development' && <RentalTestHelper />}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ tab }: { tab: TabType }) => {
  const messages = {
    active: {
      icon: <FiCheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />,
      title: 'No Active Rentals',
      description: 'You don\'t have any active rentals at the moment.',
      action: 'Browse Products',
    },
    upcoming: {
      icon: <FiClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />,
      title: 'No Upcoming Rentals',
      description: 'You don\'t have any upcoming rentals scheduled.',
      action: 'Browse Products',
    },
    past: {
      icon: <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />,
      title: 'No Past Rentals',
      description: 'You haven\'t completed any rentals yet.',
      action: 'Browse Products',
    },
  };

  const message = messages[tab];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
      {message.icon}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{message.title}</h3>
      <p className="text-gray-600 mb-6">{message.description}</p>
      <Link
        href="/products"
        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all"
      >
        <span>{message.action}</span>
        <FiArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default MyRentalsPage;
