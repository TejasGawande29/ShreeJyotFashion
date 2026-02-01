import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { HeroSection } from '@/components/home/HeroSection';

// Lazy load below-the-fold components for faster initial load
const FeaturedProducts = dynamic(() => import('@/components/home/FeaturedProducts').then(mod => ({ default: mod.FeaturedProducts })), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: true,
});

const RentalSection = dynamic(() => import('@/components/home/RentalSection').then(mod => ({ default: mod.RentalSection })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
  ssr: true,
});

const CategoriesSection = dynamic(() => import('@/components/home/CategoriesSection').then(mod => ({ default: mod.CategoriesSection })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
  ssr: true,
});

const WhyChooseUs = dynamic(() => import('@/components/home/WhyChooseUs').then(mod => ({ default: mod.WhyChooseUs })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
  ssr: true,
});

const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection').then(mod => ({ default: mod.TestimonialsSection })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
  ssr: true,
});

const NewsletterSection = dynamic(() => import('@/components/home/NewsletterSection').then(mod => ({ default: mod.NewsletterSection })), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse" />,
  ssr: true,
});

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Load immediately */}
      <HeroSection />

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-heading">Featured Collection</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium clothing for every occasion
            </p>
          </div>
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* Rental Section - Unique Feature */}
      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
        <RentalSection />
      </Suspense>

      {/* Categories */}
      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
        <CategoriesSection />
      </Suspense>

      {/* Why Choose Us */}
      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
        <WhyChooseUs />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
        <TestimonialsSection />
      </Suspense>

      {/* Newsletter */}
      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse" />}>
        <NewsletterSection />
      </Suspense>
    </main>
  );
}
