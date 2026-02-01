'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
  date: string;
  productType: 'Purchase' | 'Rental';
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    comment:
      'Absolutely loved my wedding lehenga rental! The quality was top-notch and delivery was on time. The rental service saved me a lot of money. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    date: 'December 2023',
    productType: 'Rental',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Delhi',
    rating: 5,
    comment:
      'Great collection of formal wear. Bought a premium suit for my office and the fit is perfect. Customer service was excellent throughout the purchase process.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    date: 'November 2023',
    productType: 'Purchase',
  },
  {
    id: 3,
    name: 'Anita Patel',
    location: 'Ahmedabad, Gujarat',
    rating: 4,
    comment:
      'The kids section has amazing options. Rented a birthday outfit for my daughter and she looked adorable. Will definitely rent again for future events!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    date: 'January 2024',
    productType: 'Rental',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Jaipur, Rajasthan',
    rating: 5,
    comment:
      'Fantastic experience! Rented a sherwani for my brothers wedding. The deposit was refunded quickly and the outfit was in pristine condition. 10/10 service.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    date: 'October 2023',
    productType: 'Rental',
  },
  {
    id: 5,
    name: 'Neha Reddy',
    location: 'Hyderabad, Telangana',
    rating: 5,
    comment:
      'Love the variety of sarees and ethnic wear. The website is easy to navigate and the checkout process is smooth. My go-to place for traditional outfits!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    date: 'December 2023',
    productType: 'Purchase',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = testimonials.length - 1;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 md:py-20 bg-neutral-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-neutral-600 text-lg">
            Join thousands of satisfied customers who trust Shreejyot Fashion
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Customer Image */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-neutral-200 relative">
                    <Image
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-avatar.jpg';
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4 justify-center md:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < currentTestimonial.rating
                            ? 'fill-gold text-gold'
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-neutral-700 text-lg leading-relaxed mb-6 text-center md:text-left">
                    "{currentTestimonial.comment}"
                  </p>

                  {/* Customer Info */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-center md:text-left">
                    <div>
                      <h4 className="font-semibold text-neutral-900 text-lg">
                        {currentTestimonial.name}
                      </h4>
                      <p className="text-neutral-500 text-sm">
                        {currentTestimonial.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          currentTestimonial.productType === 'Rental'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {currentTestimonial.productType}
                      </span>
                      <span className="text-neutral-400 text-sm">
                        {currentTestimonial.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => paginate(-1)}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-neutral-700 hover:text-primary"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-neutral-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-neutral-700 hover:text-primary"
              aria-label="Next testimonial"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              50K+
            </div>
            <div className="text-neutral-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              25K+
            </div>
            <div className="text-neutral-600">Rentals Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              4.8/5
            </div>
            <div className="text-neutral-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              98%
            </div>
            <div className="text-neutral-600">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}
