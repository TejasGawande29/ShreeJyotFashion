'use client';

import { useState, useEffect } from 'react';
import { FiTool, FiInfo } from 'react-icons/fi';

type Category = 'womens' | 'mens' | 'kids' | 'footwear' | 'jewelry';

export default function SizeGuidePage() {
  // Set page metadata
  useEffect(() => {
    document.title = 'Size Guide - Shreejyot Fashion | Find Your Perfect Fit';
  }, []);
  
  const [activeCategory, setActiveCategory] = useState<Category>('womens');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FiTool className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Size Guide</h1>
            <p className="text-xl text-pink-100">
              Find your perfect fit with our comprehensive size charts
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveCategory('womens')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors whitespace-nowrap ${
                activeCategory === 'womens'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Women's Clothing
            </button>
            <button
              onClick={() => setActiveCategory('mens')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors whitespace-nowrap ${
                activeCategory === 'mens'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Men's Clothing
            </button>
            <button
              onClick={() => setActiveCategory('kids')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors whitespace-nowrap ${
                activeCategory === 'kids'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Kids' Clothing
            </button>
            <button
              onClick={() => setActiveCategory('footwear')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors whitespace-nowrap ${
                activeCategory === 'footwear'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Footwear
            </button>
            <button
              onClick={() => setActiveCategory('jewelry')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors whitespace-nowrap ${
                activeCategory === 'jewelry'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Jewelry & Rings
            </button>
          </div>
        </div>

        {/* How to Measure */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8">
          <div className="flex items-start gap-3">
            <FiInfo className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How to Measure Correctly</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use a flexible measuring tape (fabric, not metal)</li>
                <li>• Wear fitted undergarments while measuring</li>
                <li>• Stand straight with relaxed shoulders</li>
                <li>• Take measurements over bare skin (not over clothing)</li>
                <li>• Keep the tape snug but not tight</li>
                <li>• Measure twice to ensure accuracy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Size Charts */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Women's Clothing */}
          {activeCategory === 'womens' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Women's Clothing Size Chart</h2>
                
                {/* Measurement Guide */}
                <div className="mb-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Measurement Guide</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-900">Bust</p>
                      <p>Measure around the fullest part of your bust</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Waist</p>
                      <p>Measure around your natural waistline</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Hip</p>
                      <p>Measure around the fullest part of your hips</p>
                    </div>
                  </div>
                </div>

                {/* Size Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bust (inches)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waist (inches)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hip (inches)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">International</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">XS</td>
                        <td className="px-6 py-4 text-gray-600">30-32</td>
                        <td className="px-6 py-4 text-gray-600">24-26</td>
                        <td className="px-6 py-4 text-gray-600">32-34</td>
                        <td className="px-6 py-4 text-gray-600">UK 6 / US 2</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">S</td>
                        <td className="px-6 py-4 text-gray-600">32-34</td>
                        <td className="px-6 py-4 text-gray-600">26-28</td>
                        <td className="px-6 py-4 text-gray-600">34-36</td>
                        <td className="px-6 py-4 text-gray-600">UK 8 / US 4</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">M</td>
                        <td className="px-6 py-4 text-gray-600">34-36</td>
                        <td className="px-6 py-4 text-gray-600">28-30</td>
                        <td className="px-6 py-4 text-gray-600">36-38</td>
                        <td className="px-6 py-4 text-gray-600">UK 10 / US 6</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">L</td>
                        <td className="px-6 py-4 text-gray-600">36-38</td>
                        <td className="px-6 py-4 text-gray-600">30-32</td>
                        <td className="px-6 py-4 text-gray-600">38-40</td>
                        <td className="px-6 py-4 text-gray-600">UK 12 / US 8</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">XL</td>
                        <td className="px-6 py-4 text-gray-600">38-40</td>
                        <td className="px-6 py-4 text-gray-600">32-34</td>
                        <td className="px-6 py-4 text-gray-600">40-42</td>
                        <td className="px-6 py-4 text-gray-600">UK 14 / US 10</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">XXL</td>
                        <td className="px-6 py-4 text-gray-600">40-42</td>
                        <td className="px-6 py-4 text-gray-600">34-36</td>
                        <td className="px-6 py-4 text-gray-600">42-44</td>
                        <td className="px-6 py-4 text-gray-600">UK 16 / US 12</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">3XL</td>
                        <td className="px-6 py-4 text-gray-600">42-44</td>
                        <td className="px-6 py-4 text-gray-600">36-38</td>
                        <td className="px-6 py-4 text-gray-600">44-46</td>
                        <td className="px-6 py-4 text-gray-600">UK 18 / US 14</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Saree Blouse Chart */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Saree Blouse Size Chart</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bust (inches)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shoulder (inches)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blouse Length (inches)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">32</td>
                          <td className="px-6 py-4 text-gray-600">32</td>
                          <td className="px-6 py-4 text-gray-600">14</td>
                          <td className="px-6 py-4 text-gray-600">14-15</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">34</td>
                          <td className="px-6 py-4 text-gray-600">34</td>
                          <td className="px-6 py-4 text-gray-600">14.5</td>
                          <td className="px-6 py-4 text-gray-600">14-15</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">36</td>
                          <td className="px-6 py-4 text-gray-600">36</td>
                          <td className="px-6 py-4 text-gray-600">15</td>
                          <td className="px-6 py-4 text-gray-600">15-16</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">38</td>
                          <td className="px-6 py-4 text-gray-600">38</td>
                          <td className="px-6 py-4 text-gray-600">15.5</td>
                          <td className="px-6 py-4 text-gray-600">15-16</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">40</td>
                          <td className="px-6 py-4 text-gray-600">40</td>
                          <td className="px-6 py-4 text-gray-600">16</td>
                          <td className="px-6 py-4 text-gray-600">16-17</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">42</td>
                          <td className="px-6 py-4 text-gray-600">42</td>
                          <td className="px-6 py-4 text-gray-600">16.5</td>
                          <td className="px-6 py-4 text-gray-600">16-17</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Men's Clothing */}
          {activeCategory === 'mens' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Men's Clothing Size Chart</h2>
                
                <div className="mb-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Measurement Guide</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-900">Chest</p>
                      <p>Measure around the fullest part of your chest</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Waist</p>
                      <p>Measure around your natural waistline</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sleeve</p>
                      <p>Measure from center back to wrist</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chest (inches)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waist (inches)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sleeve (inches)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">International</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">S</td>
                        <td className="px-6 py-4 text-gray-600">36-38</td>
                        <td className="px-6 py-4 text-gray-600">28-30</td>
                        <td className="px-6 py-4 text-gray-600">32-33</td>
                        <td className="px-6 py-4 text-gray-600">UK 36 / US S</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">M</td>
                        <td className="px-6 py-4 text-gray-600">38-40</td>
                        <td className="px-6 py-4 text-gray-600">30-32</td>
                        <td className="px-6 py-4 text-gray-600">33-34</td>
                        <td className="px-6 py-4 text-gray-600">UK 38 / US M</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">L</td>
                        <td className="px-6 py-4 text-gray-600">40-42</td>
                        <td className="px-6 py-4 text-gray-600">32-34</td>
                        <td className="px-6 py-4 text-gray-600">34-35</td>
                        <td className="px-6 py-4 text-gray-600">UK 40 / US L</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">XL</td>
                        <td className="px-6 py-4 text-gray-600">42-44</td>
                        <td className="px-6 py-4 text-gray-600">34-36</td>
                        <td className="px-6 py-4 text-gray-600">35-36</td>
                        <td className="px-6 py-4 text-gray-600">UK 42 / US XL</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">XXL</td>
                        <td className="px-6 py-4 text-gray-600">44-46</td>
                        <td className="px-6 py-4 text-gray-600">36-38</td>
                        <td className="px-6 py-4 text-gray-600">36-37</td>
                        <td className="px-6 py-4 text-gray-600">UK 44 / US XXL</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">3XL</td>
                        <td className="px-6 py-4 text-gray-600">46-48</td>
                        <td className="px-6 py-4 text-gray-600">38-40</td>
                        <td className="px-6 py-4 text-gray-600">37-38</td>
                        <td className="px-6 py-4 text-gray-600">UK 46 / US 3XL</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Kids' Clothing */}
          {activeCategory === 'kids' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Kids' Clothing Size Chart</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Height (inches)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chest (inches)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waist (inches)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">2-3 Years</td>
                        <td className="px-6 py-4 text-gray-600">35-38</td>
                        <td className="px-6 py-4 text-gray-600">20-21</td>
                        <td className="px-6 py-4 text-gray-600">19-20</td>
                        <td className="px-6 py-4 text-gray-600">2-3Y</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">4-5 Years</td>
                        <td className="px-6 py-4 text-gray-600">39-42</td>
                        <td className="px-6 py-4 text-gray-600">22-23</td>
                        <td className="px-6 py-4 text-gray-600">21-22</td>
                        <td className="px-6 py-4 text-gray-600">4-5Y</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">6-7 Years</td>
                        <td className="px-6 py-4 text-gray-600">43-46</td>
                        <td className="px-6 py-4 text-gray-600">24-25</td>
                        <td className="px-6 py-4 text-gray-600">23-24</td>
                        <td className="px-6 py-4 text-gray-600">6-7Y</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">8-9 Years</td>
                        <td className="px-6 py-4 text-gray-600">47-50</td>
                        <td className="px-6 py-4 text-gray-600">26-27</td>
                        <td className="px-6 py-4 text-gray-600">25-26</td>
                        <td className="px-6 py-4 text-gray-600">8-9Y</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">10-11 Years</td>
                        <td className="px-6 py-4 text-gray-600">51-54</td>
                        <td className="px-6 py-4 text-gray-600">28-29</td>
                        <td className="px-6 py-4 text-gray-600">27-28</td>
                        <td className="px-6 py-4 text-gray-600">10-11Y</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">12-13 Years</td>
                        <td className="px-6 py-4 text-gray-600">55-58</td>
                        <td className="px-6 py-4 text-gray-600">30-31</td>
                        <td className="px-6 py-4 text-gray-600">29-30</td>
                        <td className="px-6 py-4 text-gray-600">12-13Y</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Footwear */}
          {activeCategory === 'footwear' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Footwear Size Chart</h2>
                
                <div className="mb-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">How to Measure Foot Length</h3>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal pl-6">
                    <li>Place a blank paper on a flat surface</li>
                    <li>Stand on the paper with your heel against a wall</li>
                    <li>Mark the longest point of your foot</li>
                    <li>Measure from the wall to the mark in centimeters</li>
                    <li>Use the measurement to find your size below</li>
                  </ol>
                </div>

                {/* Women's Footwear */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Women's Footwear</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">India</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UK</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">US</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">EU</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foot Length (cm)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">4</td>
                          <td className="px-6 py-4 text-gray-600">3</td>
                          <td className="px-6 py-4 text-gray-600">5</td>
                          <td className="px-6 py-4 text-gray-600">36</td>
                          <td className="px-6 py-4 text-gray-600">22.0-22.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">5</td>
                          <td className="px-6 py-4 text-gray-600">4</td>
                          <td className="px-6 py-4 text-gray-600">6</td>
                          <td className="px-6 py-4 text-gray-600">37</td>
                          <td className="px-6 py-4 text-gray-600">22.5-23.0</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">6</td>
                          <td className="px-6 py-4 text-gray-600">5</td>
                          <td className="px-6 py-4 text-gray-600">7</td>
                          <td className="px-6 py-4 text-gray-600">38</td>
                          <td className="px-6 py-4 text-gray-600">23.0-23.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">7</td>
                          <td className="px-6 py-4 text-gray-600">6</td>
                          <td className="px-6 py-4 text-gray-600">8</td>
                          <td className="px-6 py-4 text-gray-600">39</td>
                          <td className="px-6 py-4 text-gray-600">23.5-24.0</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">8</td>
                          <td className="px-6 py-4 text-gray-600">7</td>
                          <td className="px-6 py-4 text-gray-600">9</td>
                          <td className="px-6 py-4 text-gray-600">40</td>
                          <td className="px-6 py-4 text-gray-600">24.0-24.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">9</td>
                          <td className="px-6 py-4 text-gray-600">8</td>
                          <td className="px-6 py-4 text-gray-600">10</td>
                          <td className="px-6 py-4 text-gray-600">41</td>
                          <td className="px-6 py-4 text-gray-600">24.5-25.0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Men's Footwear */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Men's Footwear</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">India</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UK</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">US</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">EU</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foot Length (cm)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">6</td>
                          <td className="px-6 py-4 text-gray-600">6</td>
                          <td className="px-6 py-4 text-gray-600">7</td>
                          <td className="px-6 py-4 text-gray-600">39</td>
                          <td className="px-6 py-4 text-gray-600">24.0-24.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">7</td>
                          <td className="px-6 py-4 text-gray-600">7</td>
                          <td className="px-6 py-4 text-gray-600">8</td>
                          <td className="px-6 py-4 text-gray-600">40</td>
                          <td className="px-6 py-4 text-gray-600">24.5-25.0</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">8</td>
                          <td className="px-6 py-4 text-gray-600">8</td>
                          <td className="px-6 py-4 text-gray-600">9</td>
                          <td className="px-6 py-4 text-gray-600">41-42</td>
                          <td className="px-6 py-4 text-gray-600">25.0-25.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">9</td>
                          <td className="px-6 py-4 text-gray-600">9</td>
                          <td className="px-6 py-4 text-gray-600">10</td>
                          <td className="px-6 py-4 text-gray-600">43</td>
                          <td className="px-6 py-4 text-gray-600">25.5-26.0</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">10</td>
                          <td className="px-6 py-4 text-gray-600">10</td>
                          <td className="px-6 py-4 text-gray-600">11</td>
                          <td className="px-6 py-4 text-gray-600">44</td>
                          <td className="px-6 py-4 text-gray-600">26.0-26.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-900">11</td>
                          <td className="px-6 py-4 text-gray-600">11</td>
                          <td className="px-6 py-4 text-gray-600">12</td>
                          <td className="px-6 py-4 text-gray-600">45</td>
                          <td className="px-6 py-4 text-gray-600">26.5-27.0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Jewelry */}
          {activeCategory === 'jewelry' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ring Size Chart</h2>
                
                <div className="mb-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">How to Measure Ring Size</h3>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal pl-6">
                    <li>Wrap a string or paper around the base of your finger</li>
                    <li>Mark where the string overlaps</li>
                    <li>Measure the length in millimeters</li>
                    <li>Use the circumference to find your size below</li>
                    <li>Or use an existing ring: measure the inner diameter in mm</li>
                  </ol>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">India Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">US Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UK Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inner Diameter (mm)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Circumference (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">10</td>
                        <td className="px-6 py-4 text-gray-600">5</td>
                        <td className="px-6 py-4 text-gray-600">J</td>
                        <td className="px-6 py-4 text-gray-600">15.7</td>
                        <td className="px-6 py-4 text-gray-600">49.3</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">12</td>
                        <td className="px-6 py-4 text-gray-600">6</td>
                        <td className="px-6 py-4 text-gray-600">L</td>
                        <td className="px-6 py-4 text-gray-600">16.5</td>
                        <td className="px-6 py-4 text-gray-600">51.9</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">14</td>
                        <td className="px-6 py-4 text-gray-600">7</td>
                        <td className="px-6 py-4 text-gray-600">N</td>
                        <td className="px-6 py-4 text-gray-600">17.3</td>
                        <td className="px-6 py-4 text-gray-600">54.4</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">16</td>
                        <td className="px-6 py-4 text-gray-600">8</td>
                        <td className="px-6 py-4 text-gray-600">P</td>
                        <td className="px-6 py-4 text-gray-600">18.2</td>
                        <td className="px-6 py-4 text-gray-600">57.0</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">18</td>
                        <td className="px-6 py-4 text-gray-600">9</td>
                        <td className="px-6 py-4 text-gray-600">R</td>
                        <td className="px-6 py-4 text-gray-600">19.0</td>
                        <td className="px-6 py-4 text-gray-600">59.5</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">20</td>
                        <td className="px-6 py-4 text-gray-600">10</td>
                        <td className="px-6 py-4 text-gray-600">T</td>
                        <td className="px-6 py-4 text-gray-600">19.8</td>
                        <td className="px-6 py-4 text-gray-600">62.1</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900">22</td>
                        <td className="px-6 py-4 text-gray-600">11</td>
                        <td className="px-6 py-4 text-gray-600">V</td>
                        <td className="px-6 py-4 text-gray-600">20.6</td>
                        <td className="px-6 py-4 text-gray-600">64.6</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Fit Guide */}
          <div className="mt-12 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fit Guide</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Slim Fit</h3>
                <p className="text-sm text-gray-600">Narrow through the chest and waist with tapered sleeves. For a body-hugging silhouette.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Regular Fit</h3>
                <p className="text-sm text-gray-600">Classic fit with comfortable room through chest and waist. Most popular choice.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Relaxed Fit</h3>
                <p className="text-sm text-gray-600">Loose and comfortable with extra room. Perfect for casual wear and layering.</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8 bg-pink-50 border-l-4 border-pink-600 p-6 rounded-lg">
            <h3 className="font-semibold text-pink-900 mb-2">Need Help Finding Your Size?</h3>
            <p className="text-sm text-pink-800 mb-3">
              Our customer support team is happy to assist you with size recommendations.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/contact"
                className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm"
              >
                Contact Us
              </a>
              <a
                href="tel:+918012345678"
                className="inline-block bg-white text-pink-600 px-6 py-2 rounded-lg border-2 border-pink-600 hover:bg-pink-50 transition-all duration-200 font-medium text-sm"
              >
                Call: +91 80123 45678
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
