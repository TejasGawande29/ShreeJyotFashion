'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiGrid, FiList, FiFilter, FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addToCart } from '@/lib/redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/lib/redux/slices/wishlistSlice';
import SearchFiltersComponent, { SearchFilters } from '@/components/search/SearchFilters';
import { toast, toastMessages } from '@/utils/toast';

// Mock products data
const mockProducts = [
  { id: '1', name: 'Floral Summer Dress', price: 899, originalPrice: 1299, category: 'Dresses', size: ['S', 'M', 'L'], color: ['Pink', 'Blue'], rating: 4.5, reviews: 120, inStock: true, rentalAvailable: true, image: '/images/products/dress1.jpg' },
  { id: '2', name: 'Casual White Sneakers', price: 1200, originalPrice: 1500, category: 'Footwear', size: ['7', '8', '9'], color: ['White'], rating: 4.3, reviews: 85, inStock: true, rentalAvailable: false, image: '/images/products/shoes1.jpg' },
  { id: '3', name: 'Designer Saree', price: 1499, originalPrice: 2499, category: 'Sarees', size: ['One Size'], color: ['Red', 'Purple'], rating: 4.8, reviews: 200, inStock: true, rentalAvailable: true, image: '/images/products/saree1.jpg' },
  { id: '4', name: 'Leather Handbag', price: 400, originalPrice: 600, category: 'Bags', size: ['One Size'], color: ['Brown', 'Black'], rating: 4.2, reviews: 65, inStock: true, rentalAvailable: false, image: '/images/products/bag1.jpg' },
  { id: '5', name: 'Winter Coat', price: 1299, originalPrice: 1999, category: 'Outerwear', size: ['M', 'L', 'XL'], color: ['Black', 'Gray'], rating: 4.6, reviews: 95, inStock: false, rentalAvailable: true, image: '/images/products/coat1.jpg' },
  { id: '6', name: 'Party Dress', price: 1299, originalPrice: 1799, category: 'Dresses', size: ['S', 'M'], color: ['Pink', 'Red'], rating: 4.7, reviews: 150, inStock: true, rentalAvailable: true, image: '/images/products/dress2.jpg' },
  { id: '7', name: 'Denim Jeans', price: 500, originalPrice: 799, category: 'Bottoms', size: ['28', '30', '32'], color: ['Blue'], rating: 4.0, reviews: 78, inStock: true, rentalAvailable: false, image: '/images/products/jeans1.jpg' },
  { id: '8', name: 'Cotton T-Shirt', price: 499, originalPrice: 699, category: 'Tops', size: ['S', 'M', 'L', 'XL'], color: ['White', 'Black', 'Blue'], rating: 4.1, reviews: 110, inStock: true, rentalAvailable: false, image: '/images/products/tshirt1.jpg' },
  { id: '9', name: 'Gold Plated Necklace', price: 300, originalPrice: 500, category: 'Jewelry', size: ['One Size'], color: ['Yellow'], rating: 4.4, reviews: 55, inStock: true, rentalAvailable: false, image: '/images/products/jewelry1.jpg' },
  { id: '10', name: 'Casual Shirt', price: 699, originalPrice: 999, category: 'Tops', size: ['M', 'L', 'XL'], color: ['Blue', 'White'], rating: 4.3, reviews: 92, inStock: true, rentalAvailable: false, image: '/images/products/shirt1.jpg' },
];

type ViewMode = 'grid' | 'list';
type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
  const query = searchParams?.get('q') || '';
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    priceRange: { min: 0, max: 10000 },
    sizes: [],
    colors: [],
    availability: 'all',
    rating: 0,
  });

  // Filter products based on search query and filters
  const filteredProducts = mockProducts.filter((product) => {
    // Search query
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase());

    // Category filter
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);

    // Price filter
    const matchesPrice =
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max;

    // Size filter
    const matchesSize =
      filters.sizes.length === 0 ||
      product.size.some((s) => filters.sizes.includes(s));

    // Color filter
    const matchesColor =
      filters.colors.length === 0 ||
      product.color.some((c) => filters.colors.includes(c));

    // Availability filter
    const matchesAvailability =
      filters.availability === 'all' ||
      (filters.availability === 'in-stock' && product.inStock) ||
      (filters.availability === 'rental-available' && product.rentalAvailable);

    // Rating filter
    const matchesRating =
      filters.rating === 0 || product.rating >= filters.rating;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesPrice &&
      matchesSize &&
      matchesColor &&
      matchesAvailability &&
      matchesRating
    );
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return parseInt(b.id) - parseInt(a.id);
      case 'relevance':
      default:
        return 0;
    }
  });

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 10000 },
      sizes: [],
      colors: [],
      availability: 'all',
      rating: 0,
    });
  };

  const handleAddToCart = (product: any) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.id,
        price: product.price,
        image: product.image,
        type: 'sale',
      })
    );
    toast.success(toastMessages.cart.addSuccess);
  };

  const handleToggleWishlist = (productId: string) => {
    if (wishlist.has(productId)) {
      wishlist.delete(productId);
      setWishlist(new Set(wishlist));
      dispatch(removeFromWishlist(productId));
      toast.success(toastMessages.wishlist.removeSuccess);
    } else {
      wishlist.add(productId);
      setWishlist(new Set(wishlist));
      const product = mockProducts.find((p) => p.id === productId);
      if (product) {
        dispatch(
          addToWishlist({
            id: product.id,
            name: product.name,
            slug: product.id,
            price: product.price,
            image: product.image,
            inStock: product.inStock,
            type: product.rentalAvailable ? 'rental' : 'sale',
            addedAt: new Date().toISOString(),
          })
        );
        toast.success(toastMessages.wishlist.addSuccess);
      }
    }
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.priceRange.min > 0 || filters.priceRange.max < 10000 ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {query ? `Search results for "${query}"` : 'All Products'}
              </h1>
              <p className="text-gray-600 mt-1">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-pink-100 text-pink-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-pink-100 text-pink-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-pink-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <SearchFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onClearAll={handleClearFilters}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {sortedProducts.length === 0 ? (
              /* No Results */
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiFilter className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search query to find what you're looking for
                </p>
                <button
                  onClick={handleClearFilters}
                  className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${product.id}`}
                      className={`relative ${
                        viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'
                      } bg-gray-100 flex items-center justify-center group`}
                    >
                      <div className="w-16 h-16 text-gray-300">
                        <FiShoppingCart className="w-full h-full" />
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleWishlist(product.id);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                      >
                        <FiHeart
                          className={`w-5 h-5 ${
                            wishlist.has(product.id)
                              ? 'fill-pink-600 text-pink-600'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>

                      {/* Discount Badge */}
                      {product.originalPrice > product.price && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </div>
                      )}

                      {/* Out of Stock */}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="p-4 flex-1">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-pink-600 transition-colors mb-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-2">{product.category}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Rental Badge */}
                      {product.rentalAvailable && (
                        <div className="mb-3">
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                            Available for Rent
                          </span>
                        </div>
                      )}

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}></div>
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <SearchFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onClearAll={handleClearFilters}
              isMobile
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
