'use client';

import { FiFileText } from 'react-icons/fi';
import { useEffect } from 'react';

export default function TermsAndConditionsPage() {
  // Set page metadata
  useEffect(() => {
    document.title = 'Terms & Conditions - Shreejyot Fashion';
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FiFileText className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-xl text-pink-100">
              Last updated: January 15, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Table of Contents */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              <a href="#acceptance" className="block text-pink-600 hover:text-pink-700 transition-colors">
                1. Acceptance of Terms
              </a>
              <a href="#eligibility" className="block text-pink-600 hover:text-pink-700 transition-colors">
                2. Eligibility
              </a>
              <a href="#account" className="block text-pink-600 hover:text-pink-700 transition-colors">
                3. Account Registration
              </a>
              <a href="#purchases" className="block text-pink-600 hover:text-pink-700 transition-colors">
                4. Purchases and Payments
              </a>
              <a href="#rentals" className="block text-pink-600 hover:text-pink-700 transition-colors">
                5. Rental Services
              </a>
              <a href="#returns" className="block text-pink-600 hover:text-pink-700 transition-colors">
                6. Returns and Refunds
              </a>
              <a href="#prohibited" className="block text-pink-600 hover:text-pink-700 transition-colors">
                7. Prohibited Conduct
              </a>
              <a href="#intellectual" className="block text-pink-600 hover:text-pink-700 transition-colors">
                8. Intellectual Property
              </a>
              <a href="#liability" className="block text-pink-600 hover:text-pink-700 transition-colors">
                9. Limitation of Liability
              </a>
              <a href="#termination" className="block text-pink-600 hover:text-pink-700 transition-colors">
                10. Termination
              </a>
              <a href="#changes" className="block text-pink-600 hover:text-pink-700 transition-colors">
                11. Changes to Terms
              </a>
              <a href="#governing" className="block text-pink-600 hover:text-pink-700 transition-colors">
                12. Governing Law
              </a>
              <a href="#contact" className="block text-pink-600 hover:text-pink-700 transition-colors">
                13. Contact Information
              </a>
            </nav>
          </div>

          {/* Introduction */}
          <div className="prose max-w-none mb-8">
            <p className="text-gray-600">
              Welcome to Shreejyot Fashion. These Terms and Conditions ("Terms") govern your use of our website{' '}
              <a href="https://shreejyotfashion.com" className="text-pink-600 hover:text-pink-700">
                shreejyotfashion.com
              </a>{' '}
              and the purchase or rental of our products. By accessing or using our website, you agree to be bound by these Terms.
              If you do not agree with any part of these Terms, please do not use our services.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {/* 1. Acceptance of Terms */}
            <section id="acceptance">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  By creating an account, placing an order, or using any of our services, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms and Conditions, along with our Privacy Policy.
                </p>
                <p>
                  These Terms apply to all visitors, users, customers, and others who access or use our website and services.
                </p>
              </div>
            </section>

            {/* 2. Eligibility */}
            <section id="eligibility">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  You must be at least 18 years of age to use our services and make purchases. By using our website, you represent
                  and warrant that you meet this age requirement.
                </p>
                <p>
                  If you are under 18, you may only use our services with the involvement and consent of a parent or legal guardian.
                </p>
                <p>
                  We reserve the right to refuse service to anyone at any time for any reason.
                </p>
              </div>
            </section>

            {/* 3. Account Registration */}
            <section id="account">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>3.1 Account Creation:</strong> To access certain features, you may need to create an account. You agree to
                  provide accurate, current, and complete information during registration.
                </p>
                <p>
                  <strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account
                  credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.
                </p>
                <p>
                  <strong>3.3 Account Termination:</strong> We reserve the right to suspend or terminate your account if we believe
                  you have violated these Terms or engaged in fraudulent activity.
                </p>
              </div>
            </section>

            {/* 4. Purchases and Payments */}
            <section id="purchases">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Purchases and Payments</h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>4.1 Product Availability:</strong> All products are subject to availability. We reserve the right to
                  discontinue any product at any time without notice.
                </p>
                <p>
                  <strong>4.2 Pricing:</strong> Prices are displayed in Indian Rupees (INR) and are subject to change without notice.
                  We strive to display accurate pricing, but errors may occur. If we discover an error, we will notify you and give
                  you the option to cancel.
                </p>
                <p>
                  <strong>4.3 Payment:</strong> We accept various payment methods including credit/debit cards, UPI, net banking,
                  digital wallets, and Cash on Delivery (COD). Payment must be received before order processing.
                </p>
                <p>
                  <strong>4.4 Order Confirmation:</strong> Your receipt of an order confirmation does not signify our acceptance of
                  your order. We reserve the right to refuse or cancel any order for any reason.
                </p>
                <p>
                  <strong>4.5 Taxes:</strong> All applicable taxes (GST, etc.) are included in the displayed price unless otherwise
                  stated.
                </p>
              </div>
            </section>

            {/* 5. Rental Services */}
            <section id="rentals">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Rental Services</h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>5.1 Rental Terms:</strong> Products are rented for the specified duration (4, 7, or 14 days). Rental period
                  begins from the delivery date and ends on the return date.
                </p>
                <p>
                  <strong>5.2 Security Deposit:</strong> A refundable security deposit is required for all rentals. The deposit will
                  be refunded within 5-7 business days after we receive and inspect the returned item.
                </p>
                <p>
                  <strong>5.3 Condition of Items:</strong> You are responsible for maintaining the rented item in good condition.
                  Normal wear and tear is acceptable. Damage, stains, or alterations may result in deductions from your security
                  deposit.
                </p>
                <p>
                  <strong>5.4 Late Returns:</strong> Late returns incur a fee of ₹100 per day. After 3 days of delay without
                  communication, you may be charged the full retail price of the item.
                </p>
                <p>
                  <strong>5.5 Extensions:</strong> Rental extensions must be requested at least 24 hours before the return date and
                  are subject to availability and additional charges.
                </p>
                <p>
                  <strong>5.6 Loss or Theft:</strong> If a rented item is lost or stolen, you must report it immediately and may be
                  charged the full retail value of the product.
                </p>
              </div>
            </section>

            {/* 6. Returns and Refunds */}
            <section id="returns">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Returns and Refunds</h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>6.1 Return Window:</strong> We accept returns within 7 days of delivery for purchased items. Items must be
                  unused, unwashed, and have all original tags attached.
                </p>
                <p>
                  <strong>6.2 Non-Returnable Items:</strong> Certain items are non-returnable, including but not limited to: innerwear,
                  swimwear, jewelry, accessories, personalized items, and sale/clearance items.
                </p>
                <p>
                  <strong>6.3 Refund Process:</strong> Refunds are processed within 5-7 business days after we receive and inspect
                  the returned item. Refunds will be issued to the original payment method.
                </p>
                <p>
                  <strong>6.4 Exchanges:</strong> Size and color exchanges are subject to availability. Original shipping charges are
                  non-refundable.
                </p>
                <p>
                  For complete details, please refer to our <a href="/return-policy" className="text-pink-600 hover:text-pink-700">Return Policy</a>.
                </p>
              </div>
            </section>

            {/* 7. Prohibited Conduct */}
            <section id="prohibited">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prohibited Conduct</h2>
              <div className="text-gray-600 space-y-3">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use our website for any unlawful purpose or in violation of these Terms</li>
                  <li>Attempt to gain unauthorized access to our systems or networks</li>
                  <li>Interfere with or disrupt the operation of our website</li>
                  <li>Upload or transmit viruses, malware, or any harmful code</li>
                  <li>Collect or harvest any personally identifiable information from our website</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Engage in any fraudulent activity, including payment fraud</li>
                  <li>Use automated systems (bots, scripts) to access our website</li>
                  <li>Reproduce, duplicate, or copy any part of our website without permission</li>
                </ul>
              </div>
            </section>

            {/* 8. Intellectual Property */}
            <section id="intellectual">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  All content on our website, including but not limited to text, graphics, logos, images, videos, and software, is the
                  property of Shreejyot Fashion or its content suppliers and is protected by Indian and international copyright laws.
                </p>
                <p>
                  The Shreejyot Fashion name, logo, and all related names, logos, product and service names, designs, and slogans are
                  trademarks of Shreejyot Fashion. You may not use such marks without our prior written permission.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works from, publicly display, or exploit any of our
                  content without our express written consent.
                </p>
              </div>
            </section>

            {/* 9. Limitation of Liability */}
            <section id="liability">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>9.1 Disclaimer:</strong> Our website and services are provided "as is" and "as available" without warranties
                  of any kind, either express or implied. We do not warrant that our website will be uninterrupted, error-free, or free
                  of viruses.
                </p>
                <p>
                  <strong>9.2 Product Quality:</strong> While we strive to accurately represent our products, we do not warrant that
                  product descriptions, colors, or other content are accurate, complete, or error-free.
                </p>
                <p>
                  <strong>9.3 Limitation of Damages:</strong> To the fullest extent permitted by law, Shreejyot Fashion shall not be
                  liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data,
                  or other intangible losses.
                </p>
                <p>
                  <strong>9.4 Maximum Liability:</strong> Our total liability to you for any claims arising out of or related to these
                  Terms or our services shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
                </p>
              </div>
            </section>

            {/* 10. Termination */}
            <section id="termination">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  We reserve the right to suspend or terminate your access to our website and services at any time, without notice,
                  for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any
                  other reason at our sole discretion.
                </p>
                <p>
                  Upon termination, your right to use our services will immediately cease. All provisions of these Terms that by their
                  nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and
                  limitations of liability.
                </p>
              </div>
            </section>

            {/* 11. Changes to Terms */}
            <section id="changes">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify you of any changes by updating the "Last
                  Updated" date at the top of this page.
                </p>
                <p>
                  Your continued use of our website and services after any such changes constitutes your acceptance of the new Terms.
                  We recommend reviewing these Terms periodically for any updates.
                </p>
                <p>
                  If you do not agree to the modified Terms, you must discontinue use of our website and services.
                </p>
              </div>
            </section>

            {/* 12. Governing Law */}
            <section id="governing">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict
                  of law provisions.
                </p>
                <p>
                  Any disputes arising out of or relating to these Terms or our services shall be subject to the exclusive jurisdiction
                  of the courts located in Bangalore, Karnataka, India.
                </p>
                <p>
                  You agree to submit to the personal jurisdiction of such courts and waive any objection based on inconvenient forum.
                </p>
              </div>
            </section>

            {/* 13. Contact Information */}
            <section id="contact">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                  <p><strong>Shreejyot Fashion Pvt. Ltd.</strong></p>
                  <p>123, MG Road, Bangalore, Karnataka 560001, India</p>
                  <p>Email: <a href="mailto:legal@shreejyotfashion.com" className="text-pink-600 hover:text-pink-700">legal@shreejyotfashion.com</a></p>
                  <p>Phone: <a href="tel:+918012345678" className="text-pink-600 hover:text-pink-700">+91 80123 45678</a></p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Related Policies</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/privacy-policy"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiFileText className="w-6 h-6 text-pink-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Privacy Policy</h4>
                <p className="text-sm text-gray-600">How we handle your data</p>
              </div>
            </a>
            <a
              href="/return-policy"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiFileText className="w-6 h-6 text-pink-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Return Policy</h4>
                <p className="text-sm text-gray-600">Returns & exchanges</p>
              </div>
            </a>
            <a
              href="/shipping-policy"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiFileText className="w-6 h-6 text-pink-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Shipping Policy</h4>
                <p className="text-sm text-gray-600">Delivery information</p>
              </div>
            </a>
            <a
              href="/rental-policy"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiFileText className="w-6 h-6 text-pink-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Rental Policy</h4>
                <p className="text-sm text-gray-600">Rental terms & conditions</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
