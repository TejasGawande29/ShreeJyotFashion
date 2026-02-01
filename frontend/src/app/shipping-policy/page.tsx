'use client';

import { FiTruck, FiPackage, FiMapPin, FiClock } from 'react-icons/fi';
import { useEffect } from 'react';

export default function ShippingPolicyPage() {
  // Set page metadata
  useEffect(() => {
    document.title = 'Shipping Policy - Shreejyot Fashion';
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FiTruck className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Policy</h1>
            <p className="text-xl text-pink-100">
              Fast, reliable delivery across India
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiPackage className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders above ₹999</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiTruck className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">5-7 Days</h3>
            <p className="text-sm text-gray-600">Standard delivery</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiClock className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">2-3 Days</h3>
            <p className="text-sm text-gray-600">Express delivery</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiMapPin className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Pan-India</h3>
            <p className="text-sm text-gray-600">All serviceable pin codes</p>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="space-y-8">
            {/* Processing Time */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Processing Time</h2>
              <div className="text-gray-600 space-y-3">
                <p>All orders are processed within <strong>1-2 business days</strong> (Monday to Saturday, excluding public holidays). Orders placed after 3:00 PM IST will be processed the next business day.</p>
                <p>You will receive an order confirmation email with your order details immediately after placing your order. Once your order ships, you'll receive a shipping confirmation email with tracking information.</p>
                <div className="bg-pink-50 border-l-4 border-pink-600 p-4 rounded">
                  <p className="text-sm"><strong>Note:</strong> During sale periods and festive seasons, processing may take an additional 1-2 business days due to high order volumes.</p>
                </div>
              </div>
            </section>

            {/* Shipping Methods */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Methods</h2>
              <div className="text-gray-600 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Shipping (₹99)</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Delivery time: 5-7 business days</li>
                    <li>Available for all serviceable pin codes</li>
                    <li><strong>FREE</strong> for orders above ₹999</li>
                    <li>Tracking provided via SMS and email</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Express Shipping (₹199)</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Delivery time: 2-3 business days</li>
                    <li>Available for metro cities and select pin codes</li>
                    <li>Priority handling and expedited delivery</li>
                    <li>Real-time tracking available</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Rental Shipping (FREE)</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Free two-way shipping for all rental orders</li>
                    <li>Delivery within 3-4 business days</li>
                    <li>Prepaid return label included in package</li>
                    <li>Pickup scheduled automatically for return date</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Delivery Timeline by Region */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Timeline by Region</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Standard</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Express</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Metro Cities (Bangalore, Mumbai, Delhi, Chennai, Hyderabad, Kolkata)</td>
                      <td className="px-6 py-4 text-sm text-gray-600">3-4 days</td>
                      <td className="px-6 py-4 text-sm text-gray-600">2-3 days</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Tier 2 Cities (Pune, Ahmedabad, Jaipur, etc.)</td>
                      <td className="px-6 py-4 text-sm text-gray-600">4-5 days</td>
                      <td className="px-6 py-4 text-sm text-gray-600">3-4 days</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Other Cities & Towns</td>
                      <td className="px-6 py-4 text-sm text-gray-600">5-7 days</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Not Available</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Remote Areas</td>
                      <td className="px-6 py-4 text-sm text-gray-600">7-10 days</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Not Available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600 mt-4"><em>Note: Delivery times are estimates and may vary during festive seasons, weather conditions, or unforeseen circumstances.</em></p>
            </section>

            {/* Shipping Charges */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Charges</h2>
              <div className="text-gray-600 space-y-3">
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                  <p className="font-semibold text-green-900 mb-1">🎉 Free Shipping</p>
                  <p className="text-sm text-green-800">Enjoy FREE standard shipping on all orders above ₹999!</p>
                </div>

                <p>For orders below ₹999:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Standard Shipping: ₹99</li>
                  <li>Express Shipping: ₹199 (metro cities only)</li>
                </ul>

                <p><strong>Special Cases:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>All rental orders include FREE both-way shipping</li>
                  <li>Exchanges have FREE shipping (both ways)</li>
                  <li>Returns: Original shipping charges are non-refundable</li>
                </ul>
              </div>
            </section>

            {/* Order Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Tracking</h2>
              <div className="text-gray-600 space-y-3">
                <p>Once your order ships, you will receive:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Shipping confirmation email with tracking number</li>
                  <li>SMS with tracking link</li>
                  <li>Courier partner name and contact information</li>
                </ul>

                <p><strong>How to track your order:</strong></p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Log in to your account on our website</li>
                  <li>Go to "My Orders" section</li>
                  <li>Click on "Track Order" for your specific order</li>
                  <li>View real-time updates on your shipment status</li>
                </ol>

                <p>You can also track directly on the courier partner's website using the tracking number provided.</p>
              </div>
            </section>

            {/* Delivery Issues */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Issues</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>Failed Delivery Attempts:</strong></p>
                <p>If the courier is unable to deliver your order due to incorrect address, recipient unavailable, or refused delivery:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>3 delivery attempts will be made</li>
                  <li>You will be contacted via SMS/email after each attempt</li>
                  <li>If all attempts fail, the order will be returned to us</li>
                  <li>Refund (minus shipping charges) will be processed within 5-7 business days</li>
                </ul>

                <p><strong>Lost or Damaged Shipments:</strong></p>
                <p>If your package is lost in transit or arrives damaged:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Contact us immediately at <a href="mailto:support@shreejyotfashion.com" className="text-pink-600 hover:text-pink-700">support@shreejyotfashion.com</a></li>
                  <li>Provide your order number and photos of damage (if applicable)</li>
                  <li>We will investigate with the courier partner</li>
                  <li>Replacement or full refund will be provided</li>
                </ul>

                <p><strong>Wrong Item Delivered:</strong></p>
                <p>If you receive the wrong item, contact us within 48 hours. We will arrange for pickup of the incorrect item and ship the correct item at no extra cost.</p>
              </div>
            </section>

            {/* International Shipping */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Shipping</h2>
              <div className="text-gray-600 space-y-3">
                <p>Currently, we only ship within India. We are working on expanding our services to international destinations.</p>
                <p>Stay tuned to our website and social media for updates on international shipping availability.</p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
              <div className="text-gray-600 space-y-3">
                <p>For shipping-related queries, contact our customer support:</p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                  <p>Email: <a href="mailto:shipping@shreejyotfashion.com" className="text-pink-600 hover:text-pink-700">shipping@shreejyotfashion.com</a></p>
                  <p>Phone: <a href="tel:+918012345678" className="text-pink-600 hover:text-pink-700">+91 80123 45678</a></p>
                  <p>Hours: Monday to Saturday, 10:00 AM - 7:00 PM IST</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
