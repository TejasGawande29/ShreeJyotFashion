'use client';

import { FiRotateCcw, FiPackage, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useEffect } from 'react';

export default function ReturnPolicyPage() {
  // Set page metadata
  useEffect(() => {
    document.title = 'Return & Exchange Policy - Shreejyot Fashion';
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FiRotateCcw className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Return & Exchange Policy</h1>
            <p className="text-xl text-pink-100">
              Easy returns within 7 days of delivery
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiClock className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">7-Day Window</h3>
            <p className="text-sm text-gray-600">Return within 7 days of delivery</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiPackage className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Free Pickup</h3>
            <p className="text-sm text-gray-600">We collect from your doorstep</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiCheckCircle className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Quick Refunds</h3>
            <p className="text-sm text-gray-600">Processed in 5-7 business days</p>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="space-y-8">
            {/* Return Policy Overview */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Policy Overview</h2>
              <div className="text-gray-600 space-y-3">
                <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, we offer a hassle-free return policy.</p>
                <div className="bg-pink-50 border-l-4 border-pink-600 p-4 rounded">
                  <p className="font-semibold text-pink-900 mb-1">7-Day Return Window</p>
                  <p className="text-sm text-pink-800">You can return eligible items within 7 days of delivery for a full refund or exchange.</p>
                </div>
              </div>
            </section>

            {/* Eligibility Criteria */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
              <div className="text-gray-600 space-y-3">
                <p>To be eligible for a return, items must meet the following conditions:</p>
                
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded mb-3">
                  <p className="font-semibold text-green-900 mb-2">✓ Eligible for Return:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-green-800">
                    <li>Item is unused and in original condition</li>
                    <li>Original tags are still attached</li>
                    <li>Item is unwashed and unworn</li>
                    <li>Original packaging is intact</li>
                    <li>Return initiated within 7 days of delivery</li>
                    <li>Item is not on the non-returnable list</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <p className="font-semibold text-red-900 mb-2">✗ Non-Returnable Items:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-red-800">
                    <li>Innerwear, lingerie, and sleepwear</li>
                    <li>Swimwear and beachwear</li>
                    <li>Jewelry and accessories (hygiene reasons)</li>
                    <li>Personalized or customized items</li>
                    <li>Sale items marked "Final Sale"</li>
                    <li>Items without original tags or packaging</li>
                    <li>Items damaged due to misuse</li>
                    <li>Face masks and hygiene products</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How to Return */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Initiate a Return</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>Option 1: Online Return (Recommended)</strong></p>
                <ol className="list-decimal pl-6 space-y-2 bg-gray-50 p-4 rounded">
                  <li>Log in to your account on our website</li>
                  <li>Go to "My Orders" section</li>
                  <li>Select the order and click "Return Item"</li>
                  <li>Choose the item(s) you want to return</li>
                  <li>Select a reason for return from the dropdown</li>
                  <li>Provide additional comments (optional)</li>
                  <li>Choose pickup address and preferred time slot</li>
                  <li>Submit your return request</li>
                  <li>You'll receive a confirmation email with return ID</li>
                  <li>Our courier partner will collect the item from your address</li>
                </ol>

                <p><strong>Option 2: In-Store Return</strong></p>
                <p>Visit any of our retail stores with:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Item to be returned (in original condition with tags)</li>
                  <li>Order confirmation email or invoice</li>
                  <li>Valid ID proof</li>
                </ul>
                <p>Our store staff will inspect the item and process your return immediately.</p>

                <p><strong>Option 3: Contact Customer Support</strong></p>
                <p>Email us at <a href="mailto:returns@shreejyotfashion.com" className="text-pink-600 hover:text-pink-700">returns@shreejyotfashion.com</a> or call +91 80123 45678 with your order details.</p>
              </div>
            </section>

            {/* Pickup Process */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pickup & Return Process</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>Free Doorstep Pickup:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>We provide FREE pickup for all return requests</li>
                  <li>Available time slots: 10 AM - 1 PM, 2 PM - 5 PM, 5 PM - 8 PM</li>
                  <li>Pickup scheduled within 1-2 business days of request</li>
                  <li>You'll receive SMS/email confirmation with pickup details</li>
                </ul>

                <p><strong>Packaging Instructions:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pack the item in its original packaging if available</li>
                  <li>Include all tags, accessories, and freebies received</li>
                  <li>Use a sturdy box or bag to prevent damage during transit</li>
                  <li>Do not seal the package (courier will inspect and seal)</li>
                </ul>

                <p><strong>Handover to Courier:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Courier partner will verify the item at pickup</li>
                  <li>They will provide a pickup receipt - keep this safe</li>
                  <li>If item doesn't meet return criteria, pickup may be refused</li>
                </ul>
              </div>
            </section>

            {/* Refund Process */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process & Timeline</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>Inspection & Approval:</strong></p>
                <p>Once we receive your returned item:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Quality check completed within 2-3 business days</li>
                  <li>Email notification sent once inspection is complete</li>
                  <li>If approved, refund is initiated</li>
                  <li>If rejected, item will be returned to you (reasons provided)</li>
                </ul>

                <p><strong>Refund Timeline:</strong></p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Refund Timeline</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Credit/Debit Card</td>
                        <td className="px-6 py-4 text-sm text-gray-600">5-7 business days</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">UPI/Net Banking/Wallets</td>
                        <td className="px-6 py-4 text-sm text-gray-600">3-5 business days</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Cash on Delivery (COD)</td>
                        <td className="px-6 py-4 text-sm text-gray-600">7-10 business days (bank transfer)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Store Credit (Optional)</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Instant (within 24 hours)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p><strong>Refund Amount:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Full product price refunded</li>
                  <li>Original shipping charges are non-refundable</li>
                  <li>If you used a discount code, refund = amount paid</li>
                  <li>For partial returns, proportional amount refunded</li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <p className="text-sm text-blue-800"><strong>Pro Tip:</strong> Choose Store Credit for instant refund! You'll receive the full amount as store credit within 24 hours, and you can use it anytime with no expiry.</p>
                </div>
              </div>
            </section>

            {/* Exchange Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchange Policy</h2>
              <div className="text-gray-600 space-y-3">
                <p>We offer size and color exchanges for eligible items.</p>

                <p><strong>Exchange Eligibility:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Exchange requested within 7 days of delivery</li>
                  <li>Desired size/color is in stock</li>
                  <li>Item meets all return criteria</li>
                </ul>

                <p><strong>How to Exchange:</strong></p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Initiate return request and select "Exchange" option</li>
                  <li>Choose the size/color you want</li>
                  <li>We'll pick up the original item</li>
                  <li>After quality check, replacement will be shipped</li>
                  <li>Both pickup and delivery are FREE</li>
                </ol>

                <p><strong>Exchange Timeline:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pickup: 1-2 business days from request</li>
                  <li>Quality check: 2-3 business days</li>
                  <li>Replacement dispatch: Within 1 business day of approval</li>
                  <li>Delivery: 3-5 business days</li>
                  <li>Total time: 7-11 business days</li>
                </ul>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
                  <p className="text-sm text-yellow-800"><strong>Note:</strong> If the desired size/color is out of stock, we'll notify you and you can choose a different item or opt for a refund instead.</p>
                </div>
              </div>
            </section>

            {/* Special Cases */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Cases</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>Damaged or Defective Items:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Contact us within 48 hours of delivery</li>
                  <li>Provide photos of the defect/damage</li>
                  <li>Immediate replacement or refund (no questions asked)</li>
                  <li>Return shipping covered by us</li>
                </ul>

                <p><strong>Wrong Item Delivered:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Report within 48 hours with order details and photos</li>
                  <li>We'll arrange pickup of incorrect item</li>
                  <li>Correct item shipped immediately (priority delivery)</li>
                </ul>

                <p><strong>Missing Items:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>If your order is missing items, contact us within 48 hours</li>
                  <li>Missing items will be shipped immediately at no cost</li>
                  <li>Or we'll process a partial refund for missing items</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Returns?</h2>
              <div className="text-gray-600 space-y-3">
                <p>Our customer support team is here to assist you:</p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                  <p><strong>Returns & Exchanges Team</strong></p>
                  <p>Email: <a href="mailto:returns@shreejyotfashion.com" className="text-pink-600 hover:text-pink-700">returns@shreejyotfashion.com</a></p>
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
