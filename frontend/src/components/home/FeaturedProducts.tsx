'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { ProductCard } from '../products/ProductCard';
import { Button } from '../common/Button';
import type { Product } from '@/types';

export function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'men' | 'women' | 'kids'>('all');

  useEffect(() => {
    // Simulate API call - replace with actual API call
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Cotton Shirt',
          slug: 'premium-cotton-shirt',
          description: 'Comfortable and stylish cotton shirt',
          category: 'men',
          subcategory: 'shirts',
          price: 1299,
          compareAtPrice: 1899,
          images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop'],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['White', 'Blue', 'Black'],
          stock: 50,
          isRentalAvailable: true,
          rentalPricePerDay: 149,
          rentalPrice3Days: 399,
          rentalPrice7Days: 799,
          securityDeposit: 500,
          tags: ['casual', 'cotton', 'new-arrival'],
          rating: 4.5,
          reviewCount: 28,
          isFeatured: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Designer Lehenga',
          slug: 'designer-lehenga',
          description: 'Elegant designer lehenga for special occasions',
          category: 'women',
          subcategory: 'ethnic',
          price: 8999,
          compareAtPrice: 12999,
          images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop'],
          sizes: ['S', 'M', 'L'],
          colors: ['Red', 'Pink', 'Gold'],
          stock: 15,
          isRentalAvailable: true,
          rentalPricePerDay: 499,
          rentalPrice3Days: 1299,
          rentalPrice7Days: 2499,
          securityDeposit: 2000,
          tags: ['wedding', 'ethnic', 'designer'],
          rating: 4.8,
          reviewCount: 45,
          isFeatured: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Kids Party Dress',
          slug: 'kids-party-dress',
          description: 'Adorable party dress for kids',
          category: 'kids',
          subcategory: 'dresses',
          price: 899,
          compareAtPrice: 1299,
          images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop'],
          sizes: ['2-3Y', '4-5Y', '6-7Y'],
          colors: ['Pink', 'Purple', 'Yellow'],
          stock: 30,
          isRentalAvailable: true,
          rentalPricePerDay: 99,
          rentalPrice3Days: 249,
          rentalPrice7Days: 499,
          securityDeposit: 300,
          tags: ['party', 'kids', 'festive'],
          rating: 4.6,
          reviewCount: 32,
          isFeatured: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Formal Suit',
          slug: 'formal-suit',
          description: 'Premium formal suit for business',
          category: 'men',
          subcategory: 'suits',
          price: 6999,
          compareAtPrice: 9999,
          images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop'],
          sizes: ['M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'Navy', 'Grey'],
          stock: 20,
          isRentalAvailable: true,
          rentalPricePerDay: 399,
          rentalPrice3Days: 999,
          rentalPrice7Days: 1899,
          securityDeposit: 1500,
          tags: ['formal', 'business', 'wedding'],
          rating: 4.7,
          reviewCount: 56,
          isFeatured: true,
          createdAt: new Date().toISOString(),
        },
      ];

      setTimeout(() => {
        setFeatured(mockProducts);
        setLoading(false);
      }, 500);
    };

    fetchFeaturedProducts();
  }, []);

  const filteredProducts = activeTab === 'all' 
    ? featured 
    : featured.filter((p: Product) => p.category === activeTab);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-2">
              New Arrivals
            </h2>
            <p className="text-neutral-600">Discover the latest trends in fashion</p>
          </div>
          <Link href="/products" className="mt-4 md:mt-0">
            <Button variant="ghost" className="group">
              View All
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 md:gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { key: 'all', label: 'All Products' },
            { key: 'men', label: 'Men' },
            { key: 'women', label: 'Women' },
            { key: 'kids', label: 'Kids' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-200 aspect-[3/4] rounded-lg mb-4" />
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
