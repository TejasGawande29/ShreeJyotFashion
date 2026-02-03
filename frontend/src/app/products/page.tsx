'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Breadcrumb, type BreadcrumbItem } from '@/components/common/Breadcrumb';
import { ProductHeader, type SortOption } from '@/components/products/ProductHeader';
import { ProductFilters, type FilterState } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/products/Pagination';
import { getPlaceholderImage } from '@/lib/utils/placeholderImages';
import type { Product } from '@/types';

const ITEMS_PER_PAGE = 20;

// Mock products data (expanded for filtering)
const generateMockProducts = (): Product[] => {
  const categories = ['men', 'women', 'kids'];
  const subcategories = {
    men: ['shirts', 'trousers', 'jeans', 'suits'],
    women: ['dresses', 'tops', 'skirts', 'ethnic'],
    kids: ['dresses', 'tshirts', 'shorts', 'sets'],
  };
  const sizes = {
    men: ['S', 'M', 'L', 'XL', 'XXL'],
    women: ['XS', 'S', 'M', 'L', 'XL'],
    kids: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
  };
  const colors = ['Red', 'Blue', 'Black', 'White', 'Green', 'Pink', 'Purple', 'Yellow'];

  const products: Product[] = [];
  let id = 1;

  categories.forEach((category) => {
    const catSubcategories = subcategories[category as keyof typeof subcategories];
    const catSizes = sizes[category as keyof typeof sizes];

    catSubcategories.forEach((subcategory) => {
      // Generate 5-8 products per subcategory
      const productCount = Math.floor(Math.random() * 4) + 5;

      for (let i = 0; i < productCount; i++) {
        const basePrice = Math.floor(Math.random() * 8000) + 500;
        const hasDiscount = Math.random() > 0.6;
        const isRental = Math.random() > 0.5;

        products.push({
          id: id.toString(),
          name: `${category.charAt(0).toUpperCase() + category.slice(1)}'s ${
            subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
          } ${i + 1}`,
          slug: `${category}-${subcategory}-${i + 1}`,
          description: `High quality ${subcategory} perfect for any occasion`,
          category,
          subcategory,
          price: basePrice,
          compareAtPrice: hasDiscount ? basePrice + Math.floor(basePrice * 0.3) : undefined,
          discount: hasDiscount ? Math.floor(Math.random() * 40) + 10 : undefined,
          images: [getPlaceholderImage(category, subcategory)],
          sizes: catSizes.slice(0, Math.floor(Math.random() * 3) + 2),
          colors: colors.slice(0, Math.floor(Math.random() * 4) + 2),
          stock: Math.floor(Math.random() * 50) + 5,
          isRentalAvailable: isRental,
          rentalPricePerDay: isRental ? Math.floor(basePrice * 0.15) : undefined,
          rentalPrice3Days: isRental ? Math.floor(basePrice * 0.4) : undefined,
          rentalPrice7Days: isRental ? Math.floor(basePrice * 0.8) : undefined,
          securityDeposit: isRental ? Math.floor(basePrice * 0.5) : undefined,
          tags: hasDiscount ? ['sale'] : ['new-arrival'],
          rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
          reviewCount: Math.floor(Math.random() * 100) + 5,
          isFeatured: Math.random() > 0.7,
          createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        });

        id++;
      }
    });
  });

  return products;
};

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Mock products (in real app, this would come from API/Redux)
  const [allProducts] = useState<Product[]>(generateMockProducts());
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Initialize filters from URL
  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams?.get('category')?.split(',').filter(Boolean) || [],
    minPrice: parseInt(searchParams?.get('minPrice') || '0'),
    maxPrice: parseInt(searchParams?.get('maxPrice') || '10000'),
    sizes: searchParams?.get('sizes')?.split(',').filter(Boolean) || [],
    colors: searchParams?.get('colors')?.split(',').filter(Boolean) || [],
    type: (searchParams?.get('type') as FilterState['type']) || 'all',
  });

  const [sort, setSort] = useState<SortOption>(
    (searchParams?.get('sort') as SortOption) || 'popular'
  );

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams?.get('page') || '1')
  );

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: FilterState, newSort: SortOption, newPage: number) => {
      const params = new URLSearchParams();

      if (newFilters.categories.length) {
        params.set('category', newFilters.categories.join(','));
      }
      if (newFilters.minPrice > 0) {
        params.set('minPrice', newFilters.minPrice.toString());
      }
      if (newFilters.maxPrice < 10000) {
        params.set('maxPrice', newFilters.maxPrice.toString());
      }
      if (newFilters.sizes.length) {
        params.set('sizes', newFilters.sizes.join(','));
      }
      if (newFilters.colors.length) {
        params.set('colors', newFilters.colors.join(','));
      }
      if (newFilters.type !== 'all') {
        params.set('type', newFilters.type);
      }
      if (newSort !== 'popular') {
        params.set('sort', newSort);
      }
      if (newPage > 1) {
        params.set('page', newPage.toString());
      }

      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    },
    [router, pathname]
  );

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(product.category as string)) {
          return false;
        }
      }

      // Price filter
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      // Size filter
      if (filters.sizes.length > 0) {
        if (!product.sizes?.some((size) => filters.sizes.includes(size))) {
          return false;
        }
      }

      // Color filter
      if (filters.colors.length > 0) {
        if (!product.colors?.some((color) => filters.colors.includes(color))) {
          return false;
        }
      }

      // Type filter
      if (filters.type === 'sale') {
        if (!product.discount) return false;
      } else if (filters.type === 'rental') {
        if (!product.isRentalAvailable) return false;
      }

      return true;
    });
  }, [allProducts, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sort) {
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // 'popular'
        sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    return sorted;
  }, [filteredProducts, sort]);

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return sortedProducts.slice(start, end);
  }, [sortedProducts, currentPage]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.minPrice > 0 || filters.maxPrice < 10000) count += 1;
    if (filters.sizes.length > 0) count += filters.sizes.length;
    if (filters.colors.length > 0) count += filters.colors.length;
    if (filters.type !== 'all') count += 1;
    return count;
  }, [filters]);

  // Handlers
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters, sort, 1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setCurrentPage(1);
    updateURL(filters, newSort, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(filters, sort, page);
  };

  // Breadcrumb
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Products', href: '/products' },
  ];

  if (filters.categories.length === 1) {
    const category = filters.categories[0];
    breadcrumbItems.push({
      label: category.charAt(0).toUpperCase() + category.slice(1),
    });
  }

  // Page title
  const pageTitle = useMemo(() => {
    if (filters.categories.length === 1) {
      const category = filters.categories[0];
      return `${category.charAt(0).toUpperCase() + category.slice(1)}'s Clothing`;
    }
    return 'All Products';
  }, [filters.categories]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Page Header */}
        <ProductHeader
          title={pageTitle}
          count={sortedProducts.length}
          sort={sort}
          onSortChange={handleSortChange}
          onFilterToggle={() => setFiltersOpen(true)}
          className="mb-8"
        />

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                activeCount={activeFilterCount}
              />
            </div>
          </aside>

          {/* Filters Drawer - Mobile */}
          {filtersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl animate-slide-in-left overflow-y-auto">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  isOpen={filtersOpen}
                  onClose={() => setFiltersOpen(false)}
                  activeCount={activeFilterCount}
                />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            <ProductGrid
              products={paginatedProducts}
              loading={loading}
              emptyMessage="No products match your filters"
            />

            {/* Pagination */}
            {!loading && sortedProducts.length > 0 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsPageContent />
    </Suspense>
  );
}
