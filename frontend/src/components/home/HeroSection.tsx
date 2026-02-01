'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from '../common/Button';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: {
    primary: { text: string; link: string };
    secondary: { text: string; link: string };
  };
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop',
    title: 'Elevate Your Style',
    subtitle: 'Discover Premium Fashion for Every Occasion',
    cta: {
      primary: { text: 'Shop Now', link: '/products' },
      secondary: { text: 'Explore Rentals', link: '/rentals' },
    },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
    title: 'Rent Latest Fashion',
    subtitle: 'Try Designer Wear Starting at ₹99/day',
    cta: {
      primary: { text: 'Browse Rentals', link: '/rentals' },
      secondary: { text: 'Learn More', link: '/about' },
    },
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop',
    title: 'New Arrivals',
    subtitle: 'Fresh Styles for Men, Women & Kids',
    cta: {
      primary: { text: 'Shop Collection', link: '/products?sort=newest' },
      secondary: { text: 'View All', link: '/products' },
    },
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-neutral-900">
      {/* Slides with CSS transitions */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.background =
                  'linear-gradient(135deg, #6B46C1 0%, #D4AF37 100%)';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div
              className={`max-w-2xl text-white transition-all duration-500 delay-200 ${
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Subtitle */}
              <p className="text-gold text-sm md:text-base font-medium tracking-wider uppercase mb-4">
                {slide.subtitle}
              </p>

              {/* Title */}
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                {slide.title}
              </h1>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={slide.cta.primary.link}>
                  <Button size="lg" className="w-full sm:w-auto min-w-[160px]">
                    {slide.cta.primary.text}
                  </Button>
                </Link>
                <Link href={slide.cta.secondary.link}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto min-w-[160px] border-white text-white hover:bg-white hover:text-primary"
                  >
                    {slide.cta.secondary.text}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-4 pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white"
          aria-label="Previous slide"
        >
          <FiChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white"
          aria-label="Next slide"
        >
          <FiChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-gold'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden lg:block animate-bounce">
        <div className="text-white/60 text-sm flex flex-col items-center gap-2">
          <span className="rotate-90">→</span>
          <span className="text-xs">Scroll</span>
        </div>
      </div>
    </section>
  );
}

// Memoize to prevent unnecessary re-renders
export const MemoizedHeroSection = memo(HeroSection);
