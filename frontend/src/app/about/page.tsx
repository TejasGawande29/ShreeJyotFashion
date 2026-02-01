'use client';

import Link from 'next/link';
import { FiUsers, FiHeart, FiAward, FiTrendingUp, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { useEffect } from 'react';

export default function AboutPage() {
  // Set page metadata
  useEffect(() => {
    document.title = 'About Us - Shreejyot Fashion | Our Story & Values';
  }, []);
  
  const values = [
    {
      icon: FiHeart,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do, ensuring quality and satisfaction.',
    },
    {
      icon: FiAward,
      title: 'Quality Promise',
      description: 'Every product is carefully curated to meet our high standards of quality and style.',
    },
    {
      icon: FiTrendingUp,
      title: 'Innovation',
      description: 'Pioneering the rental fashion model in India, making designer wear accessible to all.',
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'Building a community of fashion enthusiasts who believe in sustainable choices.',
    },
  ];

  const milestones = [
    { year: '2020', event: 'Shreejyot Fashion founded in Bangalore' },
    { year: '2021', event: 'Launched rental services for ethnic wear' },
    { year: '2022', event: 'Expanded to 5 cities across India' },
    { year: '2023', event: 'Introduced Western wear collection' },
    { year: '2024', event: 'Reached 100,000+ happy customers' },
    { year: '2025', event: 'Launched sustainable fashion line' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Shreejyot Fashion</h1>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto">
              Redefining fashion retail in India by making designer wear accessible, affordable, and sustainable
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Founded in 2020 in the vibrant city of Bangalore, Shreejyot Fashion began with a simple yet powerful idea: 
                everyone deserves to look their best without breaking the bank.
              </p>
              <p>
                We noticed that Indian fashion lovers often faced a dilemma – invest heavily in designer wear for special 
                occasions that would only be worn once, or compromise on style. This realization sparked the creation of 
                our innovative rental model.
              </p>
              <p>
                Today, we're proud to serve over 100,000 customers across India, offering both purchase and rental options 
                for ethnic and Western wear. Our mission goes beyond fashion – we're committed to promoting sustainable 
                consumption and making premium fashion accessible to all.
              </p>
              <p>
                What started as a small boutique has grown into India's trusted fashion destination, combining the best of 
                traditional craftsmanship with modern convenience.
              </p>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                To revolutionize the Indian fashion industry by providing high-quality, stylish clothing that is accessible, 
                affordable, and sustainable. We believe that fashion should be inclusive, and everyone should have the 
                opportunity to express themselves through what they wear.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become India's most loved fashion platform where customers can confidently explore, experiment, and 
                express their unique style while contributing to a more sustainable future.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from product selection to customer service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Key milestones that shaped Shreejyot Fashion into what it is today
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-600 to-purple-600 transform -translate-x-1/2"></div>

          {/* Timeline Items */}
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="bg-white rounded-lg shadow-md p-6 inline-block">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
                      {milestone.year}
                    </div>
                    <p className="text-gray-700">{milestone.event}</p>
                  </div>
                </div>

                <div className="hidden md:block w-4 h-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full border-4 border-white shadow-lg relative z-10"></div>

                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Shreejyot Fashion?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're more than just a fashion store – we're your style partner
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">👗</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Curated Collections</h3>
              <p className="text-gray-600">
                Hand-picked designs from top Indian and international brands, ensuring quality and style.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Affordable Luxury</h3>
              <p className="text-gray-600">
                Rent designer wear starting at ₹99/day or shop our competitively priced collections.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainable Fashion</h3>
              <p className="text-gray-600">
                Reduce fashion waste by renting instead of buying for one-time occasions.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pan-India Delivery</h3>
              <p className="text-gray-600">
                Fast and reliable shipping across India with free delivery on orders above ₹1,000.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Returns</h3>
              <p className="text-gray-600">
                7-day return policy on purchases and hassle-free rental returns with prepaid labels.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated customer service team is always here to help you with any queries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600">
              Have questions? We'd love to hear from you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 text-sm">
                123, MG Road<br />
                Bangalore, Karnataka<br />
                560001, India
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm">
                <a href="mailto:hello@shreejyotfashion.com" className="hover:text-pink-600 transition-colors">
                  hello@shreejyotfashion.com
                </a>
                <br />
                <a href="mailto:support@shreejyotfashion.com" className="hover:text-pink-600 transition-colors">
                  support@shreejyotfashion.com
                </a>
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPhone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm">
                <a href="tel:+918012345678" className="hover:text-pink-600 transition-colors">
                  +91 80123 45678
                </a>
                <br />
                <span className="text-xs text-gray-500">Mon-Sat, 10 AM - 7 PM IST</span>
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Browse our latest collections and discover your next favorite outfit
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="bg-white text-pink-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Shop Now
            </Link>
            <Link
              href="/rentals"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-pink-600 transition-all duration-200 font-medium"
            >
              Browse Rentals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
