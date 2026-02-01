'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Breadcrumb, type BreadcrumbItem } from '@/components/common/Breadcrumb';
import { ImageGallery } from '@/components/products/ImageGallery';
import { RentalDatePicker } from '@/components/rentals/RentalDatePicker';
import { ProductTabs } from '@/components/products/ProductTabs';
import RentalProductSection from '@/components/rental/RentalProductSection';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addToCart, addRentalToCart } from '@/lib/redux/slices/cartSlice';
import { toggleWishlist } from '@/lib/redux/slices/wishlistSlice';
import { toast, toastMessages } from '@/utils/toast';
import { getPlaceholderImages } from '@/lib/utils/placeholderImages';

// Mock product data generator with full details - generates data for ANY slug
const generateDetailedMockProduct = (slug: string) => {
  // Generate a unique product based on slug
  const categories = ['Men', 'Women', 'Kids'];
  const subcategories = {
    'Men': ['Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Suits', 'Ethnic Wear'],
    'Women': ['Dresses', 'Tops', 'Skirts', 'Ethnic Wear', 'Formal Wear'],
    'Kids': ['Dresses', 'T-Shirts', 'Shorts', 'Sets', 'Ethnic Wear']
  };
  
  // Extract category and subcategory from slug
  const slugParts = slug.split('-');
  let category = 'Men';
  let subcategory = 'Shirts';
  
  if (slug.includes('women')) {
    category = 'Women';
    subcategory = slug.includes('dress') ? 'Dresses' : slug.includes('top') ? 'Tops' : slug.includes('skirt') ? 'Skirts' : slug.includes('ethnic') ? 'Ethnic Wear' : 'Formal Wear';
  } else if (slug.includes('kids')) {
    category = 'Kids';
    subcategory = slug.includes('dress') ? 'Dresses' : slug.includes('tshirt') ? 'T-Shirts' : slug.includes('short') ? 'Shorts' : slug.includes('set') ? 'Sets' : 'Ethnic Wear';
  } else if (slug.includes('men')) {
    category = 'Men';
    subcategory = slug.includes('shirt') ? 'Shirts' : slug.includes('jean') ? 'Jeans' : slug.includes('trouser') ? 'Trousers' : slug.includes('suit') ? 'Suits' : 'Ethnic Wear';
  }
  
  // Determine if rental
  const isRental = slug.includes('sherwani') || slug.includes('designer') || slug.includes('golden');
  
  // Generate product name from slug
  const productName = slugParts
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Generate prices
  const basePrice = isRental ? 12000 + Math.floor(Math.random() * 8000) : 800 + Math.floor(Math.random() * 2200);
  const originalPrice = Math.floor(basePrice * 1.3);
  const rentalPrice = isRental ? Math.floor(basePrice * 0.02) : undefined;
  const securityDeposit = isRental ? Math.floor(basePrice * 0.3) : undefined;
  
  return {
    id: slug,
    slug: slug,
    name: productName,
    brand: 'Shreejyot Fashion',
    shortDescription: `Premium quality ${productName.toLowerCase()} perfect for any occasion`,
    description: `Elevate your wardrobe with our ${productName}. Crafted with attention to detail and quality materials, this piece offers unparalleled comfort and style. Perfect for both formal and casual settings.`,
    longDescription: `
      <h3>Product Details</h3>
      <p>Experience the perfect blend of style and comfort with our ${productName}. Made from high-quality materials, this piece is designed to keep you comfortable throughout the day.</p>
      
      <h3>Key Features:</h3>
      <ul>
        <li>Premium Quality Fabric - Soft, breathable, and comfortable</li>
        <li>Perfect Fit - Designed to suit all body types</li>
        <li>Stylish Design - Modern and timeless</li>
        <li>Durable Construction - Built to last</li>
        <li>Easy Care - Simple maintenance</li>
        ${isRental ? '<li>Available for Rent - Affordable luxury for special occasions</li>' : ''}
      </ul>
      
      <h3>Perfect For:</h3>
      <p>${isRental ? 'Weddings, receptions, engagements, and special occasions' : 'Office, casual outings, parties, or everyday wear'}.</p>
      
      <h3>Styling Tips:</h3>
      <p>Pair with complementary accessories and footwear for a complete look.</p>
    `,
    price: basePrice,
    originalPrice: originalPrice,
    discount: Math.floor(((originalPrice - basePrice) / originalPrice) * 100),
    rentalPrice: rentalPrice,
    securityDeposit: securityDeposit,
    images: getPlaceholderImages(category, subcategory, 4),
    category: category,
    subcategory: subcategory,
    rating: 4.0 + Math.random() * 0.9,
    reviewCount: 20 + Math.floor(Math.random() * 100),
    inStock: true,
    stockCount: isRental ? 3 + Math.floor(Math.random() * 7) : 10 + Math.floor(Math.random() * 90),
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Blue', hex: '#3B82F6' },
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    type: isRental ? ('rental' as const) : ('sale' as const),
    specifications: {
      'Material': isRental ? 'Premium Silk with Embroidery' : '100% Cotton',
      'Pattern': 'Solid',
      'Fit': 'Regular Fit',
      'Occasion': isRental ? 'Wedding, Reception, Engagement' : 'Casual, Formal',
      'Care Instructions': isRental ? 'Dry Clean Only' : 'Machine wash cold',
      'Country of Origin': 'India',
      'SKU': `SJF-${slug.substring(0, 10).toUpperCase()}`,
    },
    features: [
      'Premium quality fabric',
      'Comfortable fit',
      'Durable construction',
      'Stylish design',
      'Easy to maintain',
      'Available in multiple sizes',
    ],
    sizeGuide: {
      'S': 'Chest: 36-38", Length: 27", Shoulder: 16"',
      'M': 'Chest: 38-40", Length: 28", Shoulder: 17"',
      'L': 'Chest: 40-42", Length: 29", Shoulder: 18"',
      'XL': 'Chest: 42-44", Length: 30", Shoulder: 19"',
      'XXL': 'Chest: 44-46", Length: 31", Shoulder: 20"',
    },
    ...(isRental && {
      rentalTerms: [
        'Delivery 2 days before event date',
        'Return within 1 day after end date',
        'ID proof required at delivery',
        'Security deposit refunded within 5-7 business days',
        'Minor stains accepted, dry cleaning included',
        'Damage charges as per actual repair cost',
        'Late return fee: ₹100 per day',
      ],
      unavailableDates: [
        '2025-10-25',
        '2025-11-05',
        '2025-11-15',
      ],
    }),
  };
};

// Mock reviews data
const generateMockReviews = (productId: string, count: number) => {
  const reviews = [];
  const names = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Ananya Gupta', 'Rahul Verma', 'Divya Nair'];
  const reviewTexts = {
    5: [
      'Absolutely love this product! The quality is outstanding and exceeded my expectations.',
      'Perfect fit and great quality. Highly recommended!',
      'Best purchase I made this year. Worth every penny!',
    ],
    4: [
      'Very good product, but slightly different from what I expected.',
      'Good quality and comfortable. Minor stitching issues.',
      'Great value for money. Would buy again.',
    ],
    3: [
      'Decent product but could be better. Average quality.',
      'It\'s okay. Nothing special but serves the purpose.',
    ],
  };

  for (let i = 0; i < count; i++) {
    const rating = i < count * 0.7 ? 5 : i < count * 0.9 ? 4 : 3;
    const texts = reviewTexts[rating as keyof typeof reviewTexts];
    
    reviews.push({
      id: `review-${i + 1}`,
      productId,
      userId: `user-${i + 1}`,
      userName: names[i % names.length],
      userAvatar: `/images/avatars/user-${(i % 8) + 1}.jpg`,
      rating,
      title: rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : 'Good',
      text: texts[i % texts.length],
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      verified: Math.random() > 0.2,
      helpful: Math.floor(Math.random() * 50),
      size: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
    });
  }

  return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  
  const dispatch = useAppDispatch();
  
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Rental state
  const [rentalStartDate, setRentalStartDate] = useState<Date | null>(null);
  const [rentalEndDate, setRentalEndDate] = useState<Date | null>(null);
  const [rentalTotalCost, setRentalTotalCost] = useState(0);
  const [isRentalValid, setIsRentalValid] = useState(false);
  const [rentalError, setRentalError] = useState<string>();

  // Get product data
  const product = useMemo(() => generateDetailedMockProduct(slug), [slug]);
  const reviews = useMemo(() => {
    if (!product) return [];
    return generateMockReviews(product.id, product.reviewCount);
  }, [product]);

  // Check if product is in wishlist
  const isInWishlist = useAppSelector((state) => 
    state.wishlist.items.some((item) => item.id === product?.id)
  );

  // Handler for Add to Cart (Sale)
  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor || undefined,
        type: 'sale',
      }));
    }

    toast.success(toastMessages.cart.addSuccess);
  };

  // Handler for Book Rental
  const handleBookRental = () => {
    if (!product || !isRentalValid || !rentalStartDate || !rentalEndDate) {
      toast.error('Please select valid rental dates');
      return;
    }

    const rentalDays = Math.ceil((rentalEndDate.getTime() - rentalStartDate.getTime()) / (1000 * 60 * 60 * 24));

    dispatch(addRentalToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      type: 'rental',
      rentalPrice: product.rentalPrice,
      securityDeposit: product.securityDeposit,
      rentalStartDate: rentalStartDate.toISOString(),
      rentalEndDate: rentalEndDate.toISOString(),
      rentalDays: rentalDays,
      rentalTotalCost: rentalTotalCost,
    }));

    toast.success(toastMessages.rental.addSuccess);
  };

  // Handler for Wishlist Toggle
  const handleToggleWishlist = () => {
    if (!product) return;

    dispatch(toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      type: product.type,
      rentalPrice: product.rentalPrice,
      addedAt: new Date().toISOString(),
    }));

    if (isInWishlist) {
      toast.success(toastMessages.wishlist.removeSuccess);
    } else {
      toast.success(toastMessages.wishlist.addSuccess);
    }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Set default color if available
  useEffect(() => {
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].name);
    }
  }, [product, selectedColor]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  // Breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: product.category, href: `/products?categories=${product.category}` },
    ...(product.subcategory ? [{ label: product.subcategory, href: `/products?categories=${product.category}` }] : []),
    { label: product.name, href: `#` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <ImageGallery 
            images={product.images}
            productName={product.name}
          />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Brand */}
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 font-playfair">{product.name}</h1>
                {product.type === 'rental' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                    RENT
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600">By {product.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            {/* Conditional Rendering: Sale or Rental Section */}
            {product.type === 'rental' ? (
              <RentalProductSection
                productId={product.id}
                productName={product.name}
                productImage={product.images[0]}
                category={product.category}
                dailyRate={product.rentalPrice || 0}
                securityDeposit={product.securityDeposit || 0}
                mrp={product.price}
                selectedSize={selectedSize}
                selectedColor={selectedColor || undefined}
                inStock={product.inStock}
                sizes={product.sizes}
                colors={product.colors}
                onSizeChange={setSelectedSize}
                onColorChange={setSelectedColor}
              />
            ) : (
              <>
                {/* Price */}
                <div className="border-t border-b border-gray-200 py-4">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        <span className="text-lg font-medium text-green-600">({product.discount}% off)</span>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Inclusive of all taxes</p>
                </div>

                {/* Availability */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  {product.price > 1000 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      🚚 Free Shipping
                    </span>
                  )}
                </div>

                {/* Size Selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-900">Select Size</label>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-4 border rounded-lg text-sm font-medium transition-all
                          ${selectedSize === size
                            ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-600'
                            : 'border-gray-300 hover:border-primary-400 text-gray-700'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector (if applicable) */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-900">Select Color</label>
                    <div className="flex items-center space-x-3">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`group relative h-10 w-10 rounded-full border-2 transition-all
                            ${selectedColor === color.name ? 'border-primary-600 ring-2 ring-primary-600 ring-offset-2' : 'border-gray-300 hover:border-gray-400'}`}
                          title={color.name}
                        >
                          <div
                            className="h-full w-full rounded-full"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector (Sale only) */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-900">Quantity</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-lg font-medium text-gray-900 w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="h-10 w-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!selectedSize}
                  >
                    {selectedSize ? '🛒 Add to Cart' : 'Please Select Size'}
                  </button>
                  <button 
                    onClick={handleToggleWishlist}
                    className="w-full border-2 border-primary-600 text-primary-600 py-3 px-6 rounded-lg font-medium hover:bg-primary-50 transition-all"
                  >
                    {isInWishlist ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
                  </button>
                </div>

                {/* Product Details */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                  <ul className="space-y-2">
                    {Object.entries(product.specifications).slice(0, 5).map(([key, value]) => (
                      <li key={key} className="flex text-sm">
                        <span className="text-gray-600 w-32 flex-shrink-0">• {key}:</span>
                        <span className="text-gray-900 font-medium">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Product Tabs Section */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <ProductTabs
            description={product.longDescription}
            specifications={Object.entries(product.specifications).map(([label, value]) => ({
              label,
              value,
            }))}
            features={product.features}
            averageRating={product.rating}
            reviewCount={product.reviewCount}
            reviews={reviews}
            productId={product.id}
            productName={product.name}
          />
        </div>
      </div>
    </div>
  );
}
