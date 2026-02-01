'use client';

import { FiCalendar, FiDollarSign, FiShield, FiAlertCircle, FiRefreshCw, FiClock } from 'react-icons/fi';
import { useEffect } from 'react';

export default function RentalPolicyPage() {
  // Set page metadata
  useEffect(() => {
    document.title = 'Rental Policy - Shreejyot Fashion';
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FiCalendar className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Rental Policy</h1>
            <p className="text-xl text-pink-100">
              Affordable luxury fashion rentals starting at ₹99/day
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiCalendar className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Flexible Duration</h3>
            <p className="text-sm text-gray-600">4, 7, or 14 days rental</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiDollarSign className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">From ₹99/Day</h3>
            <p className="text-sm text-gray-600">Affordable pricing</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiShield className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Refundable Deposit</h3>
            <p className="text-sm text-gray-600">Full refund after return</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiRefreshCw className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Easy Extensions</h3>
            <p className="text-sm text-gray-600">Extend anytime online</p>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="space-y-8">
            {/* How It Works */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How Rentals Work</h2>
              <div className="text-gray-600 space-y-3">
                <p>Renting fashion items from Shreejyot Fashion is easy and convenient:</p>
                <ol className="list-decimal pl-6 space-y-2 bg-gray-50 p-4 rounded">
                  <li><strong>Browse & Select:</strong> Choose from our curated rental collection marked with "Available for Rent"</li>
                  <li><strong>Choose Duration:</strong> Select 4, 7, or 14 days rental period</li>
                  <li><strong>Pay Deposit:</strong> Provide a refundable security deposit along with rental charges</li>
                  <li><strong>Receive Item:</strong> Get your item delivered within 3-4 business days with free shipping</li>
                  <li><strong>Enjoy:</strong> Wear and flaunt your fashionable outfit for the rental period</li>
                  <li><strong>Return:</strong> Schedule a free pickup or drop at our store before the return date</li>
                  <li><strong>Get Refund:</strong> Security deposit refunded within 5-7 days after inspection</li>
                </ol>
              </div>
            </section>

            {/* Rental Durations & Pricing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rental Durations & Pricing</h2>
              <div className="text-gray-600 space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Best For</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pricing</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">4 Days</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Single events, parties, photoshoots</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Starting ₹99/day</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">7 Days</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Weddings, festivals, vacation trips</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Starting ₹89/day (10% off)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">14 Days</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Extended events, try before buying</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Starting ₹79/day (20% off)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                  <p className="text-sm text-green-800"><strong>Save More:</strong> Longer rental periods come with better per-day rates. Choose 14-day rentals for maximum savings!</p>
                </div>

                <p><strong>Pricing Example:</strong></p>
                <div className="bg-gray-50 p-4 rounded space-y-2">
                  <p>Designer Lehenga (Retail Price: ₹15,000)</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>4 Days: ₹599/day × 4 = ₹2,396</li>
                    <li>7 Days: ₹549/day × 7 = ₹3,843</li>
                    <li>14 Days: ₹499/day × 14 = ₹6,986</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Security Deposit */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Deposit</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>Purpose:</strong></p>
                <p>A refundable security deposit is required to ensure the item is returned in good condition. This protects both you and us from damages or loss.</p>

                <p><strong>Deposit Amount:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Items up to ₹5,000: 30% of retail price</li>
                  <li>Items ₹5,001 - ₹15,000: 40% of retail price</li>
                  <li>Items above ₹15,000: 50% of retail price</li>
                </ul>

                <p><strong>Refund Process:</strong></p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Return the item on or before the return date</li>
                  <li>Our team inspects the item within 2-3 business days</li>
                  <li>If approved, full deposit is refunded</li>
                  <li>Refund processed within 5-7 business days to original payment method</li>
                </ol>

                <p><strong>Deposit Deductions:</strong></p>
                <p>Deductions may apply for:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Stains, tears, or damage beyond normal wear</li>
                  <li>Missing accessories, buttons, or embellishments</li>
                  <li>Alterations made to the item</li>
                  <li>Late returns (₹100/day deducted)</li>
                  <li>Dry cleaning required (₹200-500 deducted)</li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <p className="text-sm text-blue-800"><strong>Tip:</strong> Take photos of the item when you receive it and before returning it. This helps if there are any disputes about the condition.</p>
                </div>
              </div>
            </section>

            {/* Rental Period */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rental Period Calculation</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>Start Date:</strong> Your rental period begins on the <strong>delivery date</strong> (not order date).</p>

                <p><strong>End Date:</strong> You must return the item by the specified <strong>return date</strong> shown in your order confirmation.</p>

                <p><strong>Example:</strong></p>
                <div className="bg-gray-50 p-4 rounded space-y-1">
                  <p>• Order placed: January 1st</p>
                  <p>• Delivered: January 4th (Rental starts)</p>
                  <p>• Rental duration: 7 days</p>
                  <p>• Return date: January 11th</p>
                  <p>• Pickup scheduled: January 10th (recommended)</p>
                </div>

                <p><strong>Important Notes:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Return date includes the day itself (before midnight)</li>
                  <li>Schedule pickup 1 day before return date to avoid delays</li>
                  <li>Transit time is not counted against rental period</li>
                  <li>Rental period cannot start on a future date</li>
                </ul>
              </div>
            </section>

            {/* Condition Guidelines */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Item Condition Guidelines</h2>
              <div className="text-gray-600 space-y-3">
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded mb-3">
                  <p className="font-semibold text-green-900 mb-2">✓ Acceptable Wear & Tear:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-green-800">
                    <li>Light wrinkles from wearing</li>
                    <li>Minor thread pulls (if repairable)</li>
                    <li>Slight odor (perfume, body odor)</li>
                    <li>Minimal deodorant marks</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <p className="font-semibold text-red-900 mb-2">✗ Unacceptable Damage:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-red-800">
                    <li>Stains (food, makeup, ink, wine, etc.)</li>
                    <li>Tears, holes, or rips</li>
                    <li>Missing buttons, beads, or embellishments</li>
                    <li>Alterations (hemming, taking in/out, etc.)</li>
                    <li>Burn marks or cigarette odor</li>
                    <li>Bleaching or color fading</li>
                    <li>Pet hair or damage</li>
                  </ul>
                </div>

                <p><strong>Care Instructions:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Handle items with clean hands</li>
                  <li>Avoid eating/drinking while wearing</li>
                  <li>Apply makeup/perfume before wearing</li>
                  <li>Store in a safe, dry place when not in use</li>
                  <li>Do not attempt to clean stains yourself</li>
                  <li>Follow care label instructions</li>
                </ul>
              </div>
            </section>

            {/* Dry Cleaning Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dry Cleaning Policy</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>Do NOT dry clean rental items yourself.</strong> All rentals are professionally cleaned by us after return.</p>

                <p><strong>If Item Requires Cleaning:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Return the item as-is</li>
                  <li>We will dry clean it at our facility</li>
                  <li>Cleaning charges (₹200-500) may be deducted from deposit if item is excessively soiled</li>
                </ul>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
                  <p className="text-sm text-yellow-800"><strong>Warning:</strong> Self-cleaning may damage delicate fabrics and void your deposit refund. Let our professionals handle it!</p>
                </div>
              </div>
            </section>

            {/* Late Returns */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Late Returns & Fees</h2>
              <div className="text-gray-600 space-y-3">
                <p>We understand that sometimes delays happen, but late returns affect other customers who may have reserved the same item.</p>

                <p><strong>Late Return Charges:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Day 1-3: ₹100 per day (deducted from deposit)</li>
                  <li>Day 4-7: ₹200 per day (deducted from deposit)</li>
                  <li>Day 8+: Full retail price charged (deposit forfeited)</li>
                </ul>

                <p><strong>Extended Delays:</strong></p>
                <p>If an item is not returned after 10 days past the return date without communication:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Item is considered lost/stolen</li>
                  <li>Full retail price will be charged</li>
                  <li>Security deposit forfeited</li>
                  <li>Legal action may be taken for theft</li>
                  <li>Account suspended from future rentals</li>
                </ul>

                <div className="bg-pink-50 border-l-4 border-pink-600 p-4 rounded">
                  <p className="text-sm text-pink-800"><strong>Need More Time?</strong> Don't let it become a late return! Extend your rental online up to 24 hours before the return date.</p>
                </div>
              </div>
            </section>

            {/* Extensions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rental Extensions</h2>
              <div className="text-gray-600 space-y-3">
                <p>Need the item for a few more days? No problem!</p>

                <p><strong>How to Extend:</strong></p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Log in to your account</li>
                  <li>Go to "My Rentals"</li>
                  <li>Click "Extend Rental" on the active rental</li>
                  <li>Choose extension duration (minimum 3 days)</li>
                  <li>Pay extension charges</li>
                  <li>New return date confirmed via email/SMS</li>
                </ol>

                <p><strong>Extension Rules:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Request at least 24 hours before return date</li>
                  <li>Extension subject to availability (item may be reserved by another customer)</li>
                  <li>Minimum extension: 3 days</li>
                  <li>Maximum extensions: 2 times per rental</li>
                  <li>Total rental period cannot exceed 28 days</li>
                  <li>Extension charges = original daily rate × extension days</li>
                </ul>

                <p><strong>Cannot Extend?</strong></p>
                <p>If the item is already booked by another customer for the next period:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Extension will not be possible</li>
                  <li>You must return on the original date</li>
                  <li>You can rent again once it becomes available</li>
                </ul>
              </div>
            </section>

            {/* Cancellation */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellation Policy</h2>
              <div className="text-gray-600 space-y-3">
                <p>You can cancel your rental order before it ships:</p>

                <p><strong>Full Refund (100%):</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Cancel within 2 hours of placing order</li>
                  <li>Order has not been dispatched yet</li>
                  <li>Full amount (rental + deposit) refunded</li>
                </ul>

                <p><strong>Partial Refund (75%):</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Cancel 2-24 hours after order placement</li>
                  <li>Order has not been dispatched</li>
                  <li>25% cancellation fee deducted</li>
                </ul>

                <p><strong>No Refund:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Order already dispatched/in transit</li>
                  <li>Item delivered to you</li>
                  <li>You can return after receiving (standard return process)</li>
                </ul>
              </div>
            </section>

            {/* Loss or Theft */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Loss or Theft</h2>
              <div className="text-gray-600 space-y-3">
                <p>If a rented item is lost or stolen during your rental period:</p>

                <p><strong>Immediate Actions:</strong></p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Contact us immediately at +91 80123 45678</li>
                  <li>File a police report (if stolen)</li>
                  <li>Provide FIR copy and details to us</li>
                </ol>

                <p><strong>Charges:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>You will be charged the full retail value of the item</li>
                  <li>Security deposit will be forfeited</li>
                  <li>Additional charges may apply depending on investigation</li>
                </ul>

                <p><strong>Insurance:</strong></p>
                <p>We recommend taking our optional Rental Protection Insurance (₹99-299 per rental) which covers:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Accidental damage</li>
                  <li>Stains and spills</li>
                  <li>Loss (with police report)</li>
                  <li>Theft (with police report)</li>
                </ul>
              </div>
            </section>

            {/* Purchase Option */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rent-to-Own Option</h2>
              <div className="text-gray-600 space-y-3">
                <p>Fell in love with the rented item? You can purchase it!</p>

                <p><strong>How It Works:</strong></p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Contact us during your rental period</li>
                  <li>Express interest in purchasing the item</li>
                  <li>We'll convert your rental to a purchase</li>
                  <li>Rental amount adjusted from purchase price</li>
                  <li>Pay the remaining balance</li>
                  <li>Item is yours to keep!</li>
                  <li>Security deposit refunded immediately</li>
                </ol>

                <p><strong>Pricing:</strong></p>
                <p>Purchase Price = Retail Price - (Rental Amount Paid × 50%)</p>

                <p><strong>Example:</strong></p>
                <div className="bg-gray-50 p-4 rounded space-y-1">
                  <p>Item Retail Price: ₹10,000</p>
                  <p>You paid for 7-day rental: ₹2,100</p>
                  <p>Rental credit (50%): ₹1,050</p>
                  <p><strong>Purchase Price: ₹8,950</strong></p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                  <p className="text-sm text-green-800"><strong>Best Deal:</strong> Use rentals as a "try before you buy" option. If you love it, convert to purchase with rental credit!</p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rental Support</h2>
              <div className="text-gray-600 space-y-3">
                <p>Have questions about rentals? Our dedicated rental team is here to help:</p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                  <p><strong>Rental Support Team</strong></p>
                  <p>Email: <a href="mailto:rentals@shreejyotfashion.com" className="text-pink-600 hover:text-pink-700">rentals@shreejyotfashion.com</a></p>
                  <p>Phone: <a href="tel:+918012345678" className="text-pink-600 hover:text-pink-700">+91 80123 45678</a></p>
                  <p>WhatsApp: <a href="https://wa.me/918012345678" className="text-pink-600 hover:text-pink-700">+91 80123 45678</a></p>
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
