// Placeholder images from picsum.photos for different product categories
// Using picsum.photos for reliable placeholder images that don't 404

export const placeholderImages = {
  men: {
    shirts: 'https://picsum.photos/seed/menshirt/600/800',
    suits: 'https://picsum.photos/seed/mensuit/600/800',
    jeans: 'https://picsum.photos/seed/menjeans/600/800',
    kurta: 'https://picsum.photos/seed/menkurta/600/800',
    tshirts: 'https://picsum.photos/seed/mentshirt/600/800',
    trousers: 'https://picsum.photos/seed/mentrousers/600/800',
    ethnic: 'https://picsum.photos/seed/menethnic/600/800',
    default: 'https://picsum.photos/seed/mendefault/600/800',
  },
  women: {
    dresses: 'https://picsum.photos/seed/womendress/600/800',
    tops: 'https://picsum.photos/seed/womentops/600/800',
    skirts: 'https://picsum.photos/seed/womenskirt/600/800',
    sarees: 'https://picsum.photos/seed/womensaree/600/800',
    ethnic: 'https://picsum.photos/seed/womenethnic/600/800',
    gowns: 'https://picsum.photos/seed/womengown/600/800',
    lehenga: 'https://picsum.photos/seed/womenlehenga/600/800',
    default: 'https://picsum.photos/seed/womendefault/600/800',
  },
  kids: {
    dresses: 'https://picsum.photos/seed/kidsdress/600/800',
    tshirts: 'https://picsum.photos/seed/kidstshirt/600/800',
    shorts: 'https://picsum.photos/seed/kidsshorts/600/800',
    sets: 'https://picsum.photos/seed/kidssets/600/800',
    ethnic: 'https://picsum.photos/seed/kidsethnic/600/800',
    default: 'https://picsum.photos/seed/kidsdefault/600/800',
  },
  accessories: {
    bags: 'https://picsum.photos/seed/bags/600/800',
    jewelry: 'https://picsum.photos/seed/jewelry/600/800',
    shoes: 'https://picsum.photos/seed/shoes/600/800',
    footwear: 'https://picsum.photos/seed/footwear/600/800',
    default: 'https://picsum.photos/seed/accessories/600/800',
  },
  default: 'https://picsum.photos/seed/product/600/800',
};

/**
 * Get a placeholder image URL for a product based on category and subcategory
 */
export function getPlaceholderImage(category?: string, subcategory?: string): string {
  if (!category) {
    return placeholderImages.default;
  }
  
  const categoryImages = placeholderImages[category.toLowerCase() as keyof typeof placeholderImages];
  
  if (typeof categoryImages === 'string') {
    return categoryImages;
  }
  
  if (categoryImages && typeof categoryImages === 'object') {
    if (subcategory && subcategory in categoryImages) {
      return categoryImages[subcategory.toLowerCase() as keyof typeof categoryImages] || categoryImages.default;
    }
    return categoryImages.default || placeholderImages.default;
  }
  
  return placeholderImages.default;
}

/**
 * Get multiple placeholder images for product gallery
 */
export function getPlaceholderImages(category?: string, subcategory?: string, count: number = 4): string[] {
  const baseImage = getPlaceholderImage(category, subcategory);
  // Return the same image multiple times since we don't have actual variants
  return Array(count).fill(baseImage);
}

/**
 * Validate if an image URL is a valid remote URL or return placeholder
 */
export function getValidImageUrl(imageUrl?: string, category?: string, subcategory?: string): string {
  if (!imageUrl) {
    return getPlaceholderImage(category, subcategory);
  }
  
  // If it's a local path (starts with /), return placeholder
  if (imageUrl.startsWith('/')) {
    return getPlaceholderImage(category, subcategory);
  }
  
  // If it's a valid URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  return getPlaceholderImage(category, subcategory);
}
