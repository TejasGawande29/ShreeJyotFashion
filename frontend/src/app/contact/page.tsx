'use client';

import React, { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiFacebook, FiInstagram, FiTwitter, FiSend } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  // Set page metadata
  useEffect(() => {
    document.title = 'Contact Us - Shreejyot Fashion | Get in Touch';
  }, []);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    // Mock API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Message sent successfully! We\'ll get back to you soon. 📧');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto">
              Have questions? We're here to help! Reach out to us anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="rental">Rental Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="complaint">Complaint</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-600 text-center">
                  We typically respond within 24 hours during business days
                </p>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiPhone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
                    <a href="tel:+918012345678" className="text-pink-600 hover:text-pink-700 transition-colors">
                      +91 80123 45678
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Mon-Sat, 10 AM - 7 PM IST</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                    <a href="mailto:hello@shreejyotfashion.com" className="text-pink-600 hover:text-pink-700 transition-colors block">
                      hello@shreejyotfashion.com
                    </a>
                    <a href="mailto:support@shreejyotfashion.com" className="text-pink-600 hover:text-pink-700 transition-colors block">
                      support@shreejyotfashion.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Office</h4>
                    <p className="text-gray-600 text-sm">
                      123, MG Road<br />
                      Bangalore, Karnataka<br />
                      560001, India
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiClock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Business Hours</h4>
                    <p className="text-gray-600 text-sm">
                      Monday - Saturday<br />
                      10:00 AM - 7:00 PM IST<br />
                      <span className="text-red-600">Closed on Sundays</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              
              <div className="flex gap-3">
                <a
                  href="https://facebook.com/shreejyotfashion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label="Facebook"
                >
                  <FiFacebook className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://instagram.com/shreejyotfashion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-colors"
                  aria-label="Instagram"
                >
                  <FiInstagram className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://twitter.com/shreejyotfashion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors"
                  aria-label="Twitter"
                >
                  <FiTwitter className="w-6 h-6 text-white" />
                </a>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Stay updated with our latest collections, offers, and fashion tips!
              </p>
            </div>

            {/* Quick Help */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Help</h3>
              
              <div className="space-y-2 text-sm">
                <a href="/faq" className="block text-pink-600 hover:text-pink-700 transition-colors">
                  → Frequently Asked Questions
                </a>
                <a href="/shipping-policy" className="block text-pink-600 hover:text-pink-700 transition-colors">
                  → Shipping Information
                </a>
                <a href="/return-policy" className="block text-pink-600 hover:text-pink-700 transition-colors">
                  → Returns & Exchanges
                </a>
                <a href="/rental-policy" className="block text-pink-600 hover:text-pink-700 transition-colors">
                  → Rental Policy
                </a>
                <a href="/size-guide" className="block text-pink-600 hover:text-pink-700 transition-colors">
                  → Size Guide
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section (Placeholder) */}
      <div className="bg-gray-200 h-96 flex items-center justify-center">
        <div className="text-center">
          <FiMapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Google Maps Placeholder</p>
          <p className="text-gray-500 text-sm">123, MG Road, Bangalore, Karnataka 560001</p>
        </div>
      </div>

      {/* FAQ Callout */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Looking for Quick Answers?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Check out our FAQ page for instant answers to common questions about orders, shipping, returns, and more.
          </p>
          <a
            href="/faq"
            className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Visit FAQ
          </a>
        </div>
      </div>
    </div>
  );
}
