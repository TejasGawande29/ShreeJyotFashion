'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiCalendar, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export function RentalSection() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call for rental products
    const fetchRentalProducts = async () => {
      setLoading(true);
      
      // Mock rental products
      const mockRentalProducts: Product[] = [
        {
          id: 'r1',
          name: 'Wedding Sherwani',
          slug: 'wedding-sherwani',
          description: 'Premium designer wedding sherwani',
          category: 'men',
          subcategory: 'ethnic',
          price: 15999,
          images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop'],
          sizes: ['M', 'L', 'XL'],
          colors: ['Gold', 'Cream', 'Maroon'],
          stock: 8,
          isRentalAvailable: true,
          rentalPricePerDay: 799,
          rentalPrice3Days: 1999,
          rentalPrice7Days: 3499,
          securityDeposit: 3000,
          tags: ['wedding', 'designer', 'ethnic'],
          rating: 4.9,
          reviewCount: 67,
          isFeatured: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'r2',
          name: 'Party Gown',
          slug: 'party-gown',
          description: 'Elegant evening party gown',
          category: 'women',
          subcategory: 'gowns',
          price: 12999,
          images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop'],
          sizes: ['S', 'M', 'L'],
          colors: ['Black', 'Red', 'Navy'],
          stock: 12,
          isRentalAvailable: true,
          rentalPricePerDay: 599,
          rentalPrice3Days: 1499,
          rentalPrice7Days: 2699,
          securityDeposit: 2500,
          tags: ['party', 'gown', 'elegant'],
          rating: 4.8,
          reviewCount: 54,
          isFeatured: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'r3',
          name: 'Birthday Outfit',
          slug: 'birthday-outfit-kids',
          description: 'Adorable birthday outfit for kids',
          category: 'kids',
          subcategory: 'party-wear',
          price: 1499,
          images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&h=600&fit=crop'],
          sizes: ['4-5Y', '6-7Y', '8-9Y'],
          colors: ['Blue', 'Pink', 'Yellow'],
          stock: 20,
          isRentalAvailable: true,
          rentalPricePerDay: 99,
          rentalPrice3Days: 249,
          rentalPrice7Days: 449,
          securityDeposit: 400,
          tags: ['birthday', 'party', 'kids'],
          rating: 4.7,
          reviewCount: 43,
          isFeatured: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'r4',
          name: 'Designer Suit',
          slug: 'designer-suit-rental',
          description: 'Premium 3-piece designer suit',
          category: 'men',
          subcategory: 'suits',
          price: 9999,
          images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop'],
          sizes: ['M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'Grey', 'Navy'],
          stock: 15,
          isRentalAvailable: true,
          rentalPricePerDay: 499,
          rentalPrice3Days: 1299,
          rentalPrice7Days: 2199,
          securityDeposit: 2000,
          tags: ['formal', 'designer', 'business'],
          rating: 4.8,
          reviewCount: 89,
          isFeatured: true,
          createdAt: new Date().toISOString(),
        },
      ];

      setTimeout(() => {
        setItems(mockRentalProducts);
        setLoading(false);
      }, 500);
    };

    fetchRentalProducts();
  }, []);

  const rentalProducts = items.filter((p: Product) => p.isRentalAvailable).slice(0, 4);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="rental" className="mb-4">
                <FiCalendar className="mr-2" />
                Rental Service
              </Badge>
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Rent Latest Fashion
              </h2>
              <p className="text-white/80 text-lg">
                Try designer wear without the designer price tag. Perfect for weddings, parties, and special events.
              </p>
            </motion.div>
          </div>
          <Link href="/rentals" className="mt-6 md:mt-0">
            <Button variant="secondary" size="lg" className="group">
              Browse All Rentals
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/10 aspect-[3/4] rounded-lg mb-4" />
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {rentalProducts.map((product: Product, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link href={`/products/${product.slug}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4 bg-white/5">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-product.jpg';
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="rental" className="shadow-lg">
                        <FiCalendar className="mr-1" />
                        Rental
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4">
                        <Button size="sm" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-gold transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold font-bold text-xl">
                      {formatPrice(product.rentalPricePerDay || 0)}/day
                    </span>
                  </div>
                  <p className="text-white/60 text-sm">
                    3 days: {formatPrice(product.rentalPrice3Days || 0)} • 7 days: {formatPrice(product.rentalPrice7Days || 0)}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
              <FiDollarSign className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Affordable Luxury</h3>
            <p className="text-white/70">
              Wear designer outfits at a fraction of the retail price. Starting at just ₹99/day.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
              <FiRefreshCw className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Try Before You Buy</h3>
            <p className="text-white/70">
              Love it? Get 20% off if you decide to purchase the outfit you rented.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
              <FiCalendar className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Hassle-Free Returns</h3>
            <p className="text-white/70">
              Free pickup and delivery. Dry cleaning included. No hidden charges.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
