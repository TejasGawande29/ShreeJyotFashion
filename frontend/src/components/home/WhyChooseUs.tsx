'use client';

import { motion } from 'framer-motion';
import { FiTruck, FiShield, FiRefreshCw, FiHeart, FiClock, FiAward } from 'react-icons/fi';

const features = [
  {
    icon: FiTruck,
    title: 'Free Shipping',
    description: 'On orders above ₹1000 across India',
    color: 'text-primary',
  },
  {
    icon: FiShield,
    title: 'Secure Payments',
    description: 'Multiple payment options with 100% security',
    color: 'text-green-600',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy Returns',
    description: '7-day hassle-free return policy',
    color: 'text-blue-600',
  },
  {
    icon: FiHeart,
    title: 'Premium Quality',
    description: 'Handpicked garments with quality assurance',
    color: 'text-pink-600',
  },
  {
    icon: FiClock,
    title: 'Fast Delivery',
    description: 'Express delivery in 2-3 business days',
    color: 'text-orange-600',
  },
  {
    icon: FiAward,
    title: 'Best Prices',
    description: 'Competitive pricing with great deals',
    color: 'text-gold',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Why Choose Shreejyot Fashion?
          </h2>
          <p className="text-neutral-600 text-lg">
            Experience the perfect blend of style, quality, and convenience
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="bg-neutral-50 rounded-lg p-6 h-full hover:shadow-lg transition-shadow border border-neutral-100 hover:border-primary/20">
                <div
                  className={`w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
