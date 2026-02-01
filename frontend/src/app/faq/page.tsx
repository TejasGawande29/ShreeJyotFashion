'use client';

import { useState, useEffect } from 'react';
import { FiChevronDown, FiSearch, FiHelpCircle } from 'react-icons/fi';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  // Shopping
  {
    id: 1,
    category: 'shopping',
    question: 'How do I place an order?',
    answer: 'Browse our collection, select the product you like, choose your size and color, and click "Add to Cart". Once you\'re done shopping, go to your cart, review your items, and proceed to checkout. Fill in your shipping details and payment information to complete your order.',
  },
  {
    id: 2,
    category: 'shopping',
    question: 'Can I modify or cancel my order after placing it?',
    answer: 'You can modify or cancel your order within 1 hour of placing it. After that, the order moves to processing and cannot be changed. Please contact our customer support immediately if you need to make changes.',
  },
  {
    id: 3,
    category: 'shopping',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, MasterCard, American Express), UPI payments, net banking, and popular digital wallets like Paytm, PhonePe, and Google Pay. We also offer Cash on Delivery for orders below ₹5,000.',
  },
  {
    id: 4,
    category: 'shopping',
    question: 'Is it safe to use my credit card on your website?',
    answer: 'Absolutely! We use industry-standard SSL encryption to protect your payment information. We never store your complete card details on our servers. All transactions are processed through secure payment gateways.',
  },
  
  // Rentals
  {
    id: 5,
    category: 'rentals',
    question: 'How does the rental system work?',
    answer: 'Select a product marked "Available for Rent", choose your rental duration (4, 7, or 14 days), place your order, and the product will be delivered to you. After your rental period, schedule a pickup or drop it off at our nearest location. A refundable security deposit is required.',
  },
  {
    id: 6,
    category: 'rentals',
    question: 'What is the security deposit for?',
    answer: 'The security deposit ensures the product is returned in good condition. It\'s fully refundable once we receive and inspect the item. The amount varies based on the product value (typically 30-50% of the retail price).',
  },
  {
    id: 7,
    category: 'rentals',
    question: 'Can I extend my rental period?',
    answer: 'Yes! You can extend your rental up to 24 hours before the return date through your "My Rentals" page. Extension charges will apply based on the daily rental rate. You can extend up to 2 times (maximum 28 days total).',
  },
  {
    id: 8,
    category: 'rentals',
    question: 'What happens if I damage the rented item?',
    answer: 'Minor wear and tear is expected and acceptable. For significant damage, repair costs will be deducted from your security deposit. In case of severe damage or loss, you may be charged the full retail value of the product.',
  },
  {
    id: 9,
    category: 'rentals',
    question: 'Can I buy the rented product?',
    answer: 'Yes! If you fall in love with the rented product, you can purchase it at a discounted price. Contact our support team during your rental period, and we\'ll convert your rental into a purchase with the rental amount adjusted.',
  },

  // Shipping
  {
    id: 10,
    category: 'shipping',
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 5-7 business days. Express delivery (available for select pin codes) takes 2-3 business days. Metro cities usually receive orders faster. You\'ll receive tracking information once your order ships.',
  },
  {
    id: 11,
    category: 'shipping',
    question: 'Do you ship internationally?',
    answer: 'Currently, we only ship within India. We\'re working on international shipping and will update our customers once it\'s available.',
  },
  {
    id: 12,
    category: 'shipping',
    question: 'What are the shipping charges?',
    answer: 'Shipping is FREE on orders above ₹999. For orders below ₹999, we charge ₹99 for standard delivery and ₹199 for express delivery. Rental orders have free both-way shipping.',
  },
  {
    id: 13,
    category: 'shipping',
    question: 'How can I track my order?',
    answer: 'Once your order ships, you\'ll receive a tracking number via email and SMS. You can also track your order in real-time through the "My Orders" section of your account.',
  },

  // Returns
  {
    id: 14,
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 7-day return policy from the date of delivery. Items must be unused, unwashed, with original tags attached. Certain items like innerwear, jewelry, and sale items are non-returnable. Check our detailed Return Policy page for more information.',
  },
  {
    id: 15,
    category: 'returns',
    question: 'How do I return a product?',
    answer: 'Go to "My Orders", select the item you want to return, click "Return Item", choose a reason, and schedule a pickup. Our courier partner will collect the item from your address. You can also drop it off at our store.',
  },
  {
    id: 16,
    category: 'returns',
    question: 'When will I get my refund?',
    answer: 'Refunds are processed within 5-7 business days after we receive and inspect your returned item. The amount will be credited to your original payment method. For COD orders, refund will be credited to your bank account.',
  },
  {
    id: 17,
    category: 'returns',
    question: 'Can I exchange a product?',
    answer: 'Yes! If you need a different size or color, you can exchange within 7 days. Schedule a pickup for the original item, and once we receive it, we\'ll ship the replacement. Size exchange is subject to availability.',
  },

  // Account
  {
    id: 18,
    category: 'account',
    question: 'Do I need an account to shop?',
    answer: 'No, you can checkout as a guest. However, creating an account helps you track orders, save addresses, manage wishlists, view rental history, and get exclusive offers.',
  },
  {
    id: 19,
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'Click on "Login" at the top right, then click "Forgot Password". Enter your registered email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
  },
  {
    id: 20,
    category: 'account',
    question: 'Can I change my email or phone number?',
    answer: 'Yes! Log in to your account, go to "Profile Settings", and update your email or phone number. For email changes, you\'ll need to verify the new email address.',
  },

  // General
  {
    id: 21,
    category: 'general',
    question: 'How do I contact customer support?',
    answer: 'You can reach us via email at support@shreejyotfashion.com, call us at +91 80123 45678 (Mon-Sat, 10 AM - 7 PM), or use the contact form on our Contact Us page. We typically respond within 24 hours.',
  },
  {
    id: 22,
    category: 'general',
    question: 'Do you have a physical store?',
    answer: 'Yes! Our flagship store is located at 123, MG Road, Bangalore, Karnataka 560001. Visit us Monday to Saturday, 10 AM - 7 PM. We also have stores in Mumbai, Delhi, Chennai, and Hyderabad.',
  },
  {
    id: 23,
    category: 'general',
    question: 'How do I use a discount code?',
    answer: 'Add items to your cart, proceed to checkout, and you\'ll see a "Promo Code" field. Enter your discount code and click "Apply". The discount will be reflected in your order total. Only one promo code can be used per order.',
  },
  {
    id: 24,
    category: 'general',
    question: 'Are the product images accurate?',
    answer: 'We strive to display products as accurately as possible. However, colors may vary slightly due to screen settings and lighting during photography. Product descriptions include detailed information to help you make an informed decision.',
  },
];

const categories = [
  { id: 'all', label: 'All Questions' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'rentals', label: 'Rentals' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'returns', label: 'Returns & Exchanges' },
  { id: 'account', label: 'My Account' },
  { id: 'general', label: 'General' },
];

export default function FAQPage() {
  // Set page metadata
  useEffect(() => {
    document.title = 'FAQ - Shreejyot Fashion | Frequently Asked Questions';
  }, []);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FiHelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto">
              Find answers to common questions about shopping, rentals, shipping, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <FiChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                      openFAQ === faq.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-4 text-gray-600 border-t">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try different keywords or browse all questions
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-4 text-pink-600 hover:text-pink-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Still Have Questions */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our customer support team is here to help!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-pink-600 px-8 py-3 rounded-lg hover:bg-pink-50 transition-all duration-200 font-medium"
            >
              Contact Us
            </a>
            <a
              href="tel:+918012345678"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-pink-600 transition-all duration-200 font-medium"
            >
              Call: +91 80123 45678
            </a>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Helpful Resources</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/shipping-policy"
              className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Shipping Policy</h4>
              <p className="text-sm text-gray-600">Learn about delivery times and charges</p>
            </a>
            <a
              href="/return-policy"
              className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Return Policy</h4>
              <p className="text-sm text-gray-600">Understand our return and exchange process</p>
            </a>
            <a
              href="/rental-policy"
              className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Rental Policy</h4>
              <p className="text-sm text-gray-600">Everything about renting fashion items</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
