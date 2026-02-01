'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productsCount: number;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Men',
    slug: 'men',
    description: 'Discover premium menswear collection',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=750&fit=crop',
    productsCount: 450,
  },
  {
    id: '2',
    name: 'Women',
    slug: 'women',
    description: 'Explore elegant womens fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=750&fit=crop',
    productsCount: 680,
  },
  {
    id: '3',
    name: 'Kids',
    slug: 'kids',
    description: 'Adorable styles for your little ones',
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=750&fit=crop',
    productsCount: 320,
  },
  {
    id: '4',
    name: 'Wedding',
    slug: 'wedding',
    description: 'Special occasion ethnic wear',
    image: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=600&h=750&fit=crop',
    productsCount: 240,
  },
  {
    id: '5',
    name: 'Party Wear',
    slug: 'party',
    description: 'Stand out at every celebration',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=750&fit=crop',
    productsCount: 380,
  },
  {
    id: '6',
    name: 'Casual',
    slug: 'casual',
    description: 'Everyday comfort and style',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=750&fit=crop',
    productsCount: 520,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-neutral-600 text-lg">
            Find the perfect outfit for every occasion
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group block relative aspect-[4/5] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div>
                    <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/90 mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">
                        {category.productsCount}+ Products
                      </span>
                      <div className="flex items-center gap-2 text-gold group-hover:gap-3 transition-all">
                        <span className="font-medium">Shop Now</span>
                        <FiArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
