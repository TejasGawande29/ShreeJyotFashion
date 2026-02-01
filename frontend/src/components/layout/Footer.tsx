import React from 'react';
import Link from 'next/link';
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from 'react-icons/fi';

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Footer structure per wireframe - 4 columns
  const aboutLinks = [
    { label: 'Our Story', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ];

  const customerServiceLinks = [
    { label: 'FAQs', href: '/faq' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Return Policy', href: '/return-policy' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'My Orders', href: '/account/orders' },
  ];

  const quickLinks = [
    { label: 'Shop All', href: '/products' },
    { label: 'Search Products', href: '/search' },
    { label: 'Men', href: '/products?category=men' },
    { label: 'Women', href: '/products?category=women' },
    { label: 'Kids', href: '/products?category=kids' },
    { label: 'Sale', href: '/sale' },
  ];

  const policyLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Rental Policy', href: '/rental-policy' },
    { label: 'Refund Policy', href: '/return-policy' },
  ];

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Newsletter Section */}
      <div className="border-b border-neutral-800">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              Join Our Fashion Community
            </h3>
            <p className="text-neutral-400 mb-6">
              Get exclusive offers, rental deals, and style tips delivered to your inbox
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-colors"
              />
              <button
                type="submit"
                className="btn btn-primary whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer - 4 Columns per wireframe */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About Us */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">About Us</h4>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Customer Service
            </h4>
            <ul className="space-y-3">
              {customerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h5 className="text-white font-semibold text-sm mb-3">Policies</h5>
              <ul className="space-y-2 text-sm">
                {policyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Connect With Us</h4>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  123, MG Road,<br />
                  Bangalore, Karnataka 560001
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-primary-400" />
                <a href="tel:+918012345678" className="hover:text-primary-400 transition-colors">
                  +91 80123 45678
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-primary-400" />
                <a href="mailto:hello@shreejyotfashion.com" className="hover:text-primary-400 transition-colors">
                  hello@shreejyotfashion.com
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h5 className="text-white font-semibold text-sm mb-3">Follow Us</h5>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <FiFacebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <FiInstagram className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <FiTwitter className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <FiYoutube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-neutral-400">
              © {currentYear} Shreejyot Fashion. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400 mr-2">We Accept:</span>
              <div className="flex gap-2">
                {['Visa', 'Mastercard', 'Razorpay', 'UPI'].map((method) => (
                  <div
                    key={method}
                    className="px-3 py-1 bg-neutral-800 rounded text-xs font-semibold text-neutral-300"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
