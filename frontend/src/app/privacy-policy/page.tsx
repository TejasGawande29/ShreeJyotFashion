'use client';

import { FiShield } from 'react-icons/fi';
import { useEffect } from 'react';

export default function PrivacyPolicyPage() {
  // Set page metadata
  useEffect(() => {
    document.title = 'Privacy Policy - Shreejyot Fashion';
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FiShield className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
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
              <a href="#introduction" className="block text-pink-600 hover:text-pink-700 transition-colors">1. Introduction</a>
              <a href="#information" className="block text-pink-600 hover:text-pink-700 transition-colors">2. Information We Collect</a>
              <a href="#usage" className="block text-pink-600 hover:text-pink-700 transition-colors">3. How We Use Your Information</a>
              <a href="#sharing" className="block text-pink-600 hover:text-pink-700 transition-colors">4. Information Sharing</a>
              <a href="#storage" className="block text-pink-600 hover:text-pink-700 transition-colors">5. Data Storage & Security</a>
              <a href="#cookies" className="block text-pink-600 hover:text-pink-700 transition-colors">6. Cookies & Tracking</a>
              <a href="#rights" className="block text-pink-600 hover:text-pink-700 transition-colors">7. Your Rights</a>
              <a href="#children" className="block text-pink-600 hover:text-pink-700 transition-colors">8. Children's Privacy</a>
              <a href="#changes" className="block text-pink-600 hover:text-pink-700 transition-colors">9. Changes to This Policy</a>
              <a href="#contact" className="block text-pink-600 hover:text-pink-700 transition-colors">10. Contact Us</a>
            </nav>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            <section id="introduction">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <div className="text-gray-600 space-y-3">
                <p>At Shreejyot Fashion, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
                <p>By using our website, you consent to the collection and use of information as described in this policy.</p>
              </div>
            </section>

            <section id="information">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>2.1 Personal Information:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Date of birth (optional)</li>
                </ul>
                
                <p><strong>2.2 Order Information:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Purchase and rental history</li>
                  <li>Product preferences and wishlists</li>
                  <li>Communication preferences</li>
                </ul>

                <p><strong>2.3 Technical Information:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address, browser type, device information</li>
                  <li>Pages visited, time spent on pages</li>
                  <li>Referring website, search terms used</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>

                <p><strong>2.4 Communications:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Customer service inquiries and feedback</li>
                  <li>Survey responses and reviews</li>
                  <li>Social media interactions</li>
                </ul>
              </div>
            </section>

            <section id="usage">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <div className="text-gray-600 space-y-3">
                <p>We use the collected information for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Order Processing:</strong> To process and fulfill your purchases and rentals</li>
                  <li><strong>Customer Service:</strong> To respond to your inquiries and provide support</li>
                  <li><strong>Account Management:</strong> To create and manage your account</li>
                  <li><strong>Communication:</strong> To send order confirmations, shipping updates, and service announcements</li>
                  <li><strong>Marketing:</strong> To send promotional offers, newsletters (with your consent)</li>
                  <li><strong>Personalization:</strong> To provide personalized product recommendations</li>
                  <li><strong>Analytics:</strong> To analyze website usage and improve our services</li>
                  <li><strong>Security:</strong> To detect and prevent fraud, unauthorized access, and other illegal activities</li>
                  <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
                </ul>
              </div>
            </section>

            <section id="sharing">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
              <div className="text-gray-600 space-y-3">
                <p>We do not sell your personal information. We may share your information with:</p>
                
                <p><strong>4.1 Service Providers:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment processors (for transaction processing)</li>
                  <li>Shipping and logistics partners (for order delivery)</li>
                  <li>Cloud hosting providers (for data storage)</li>
                  <li>Email service providers (for communications)</li>
                  <li>Analytics providers (for website analytics)</li>
                </ul>

                <p><strong>4.2 Legal Requirements:</strong></p>
                <p>We may disclose information if required by law, court order, or government request, or to protect our rights and safety.</p>

                <p><strong>4.3 Business Transfers:</strong></p>
                <p>If we are involved in a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</p>

                <p><strong>4.4 With Your Consent:</strong></p>
                <p>We may share information for any other purpose with your explicit consent.</p>
              </div>
            </section>

            <section id="storage">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Storage & Security</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>5.1 Storage Location:</strong> Your data is stored on secure servers located in India and may be processed in other countries where our service providers operate.</p>
                
                <p><strong>5.2 Security Measures:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure password hashing and encryption</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Firewall protection and intrusion detection</li>
                </ul>

                <p><strong>5.3 Data Retention:</strong> We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Account information is retained while your account is active and for 3 years after closure.</p>

                <p><strong>5.4 Limitation:</strong> While we implement robust security measures, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.</p>
              </div>
            </section>

            <section id="cookies">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies & Tracking Technologies</h2>
              <div className="text-gray-600 space-y-3">
                <p>We use cookies and similar technologies to enhance your browsing experience.</p>
                
                <p><strong>6.1 Types of Cookies:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for website functionality (shopping cart, login)</li>
                  <li><strong>Performance Cookies:</strong> Collect anonymous usage data to improve our website</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Track your browsing to show relevant ads (with consent)</li>
                </ul>

                <p><strong>6.2 Managing Cookies:</strong> You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality.</p>

                <p><strong>6.3 Third-Party Cookies:</strong> We use Google Analytics, Facebook Pixel, and other third-party tools that may set their own cookies. Please review their privacy policies for more information.</p>
              </div>
            </section>

            <section id="rights">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
              <div className="text-gray-600 space-y-3">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                  <li><strong>Data Portability:</strong> Request your data in a machine-readable format</li>
                  <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                  <li><strong>Objection:</strong> Object to processing for direct marketing purposes</li>
                </ul>
                
                <p>To exercise these rights, contact us at <a href="mailto:privacy@shreejyotfashion.com" className="text-pink-600 hover:text-pink-700">privacy@shreejyotfashion.com</a>. We will respond within 30 days.</p>
              </div>
            </section>

            <section id="children">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <div className="text-gray-600 space-y-3">
                <p>Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.</p>
                <p>If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information from our systems.</p>
              </div>
            </section>

            <section id="changes">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <div className="text-gray-600 space-y-3">
                <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Updating the "Last Updated" date at the top of this page</li>
                  <li>Sending an email notification (for material changes)</li>
                  <li>Displaying a notice on our website</li>
                </ul>
                <p>Your continued use of our services after such changes constitutes acceptance of the updated policy.</p>
              </div>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <div className="text-gray-600 space-y-3">
                <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                  <p><strong>Data Protection Officer</strong></p>
                  <p><strong>Shreejyot Fashion Pvt. Ltd.</strong></p>
                  <p>123, MG Road, Bangalore, Karnataka 560001, India</p>
                  <p>Email: <a href="mailto:privacy@shreejyotfashion.com" className="text-pink-600 hover:text-pink-700">privacy@shreejyotfashion.com</a></p>
                  <p>Phone: <a href="tel:+918012345678" className="text-pink-600 hover:text-pink-700">+91 80123 45678</a></p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
