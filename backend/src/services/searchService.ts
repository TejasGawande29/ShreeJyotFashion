import elasticsearchClient, {
  PRODUCTS_INDEX,
  isElasticsearchEnabled,
} from '../config/elasticsearch';
import Product from '../models/Product';
import ProductVariant from '../models/ProductVariant';
import ProductImage from '../models/ProductImage';
import Category from '../models/Category';
import Review from '../models/Review';
import { Op } from 'sequelize';
import logger from '../utils/logger';

/**
 * Index a single product to Elasticsearch
 */
export const indexProduct = async (productId: number) => {
  if (!isElasticsearchEnabled()) {
    logger.warn('Elasticsearch not available, skipping indexing');
    return;
  }

  try {
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: ProductVariant,
          as: 'variants',
          attributes: ['id', 'size', 'color', 'stock_quantity', 'is_active'],
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['image_url', 'is_primary'],
        },
      ],
    });

    if (!product) {
      logger.error(`Product ${productId} not found for indexing`);
      return;
    }

    // Get average rating
    const reviewStats = await Review.findOne({
      where: { product_id: productId, is_approved: true, is_deleted: false },
      attributes: [
        [Review.sequelize!.fn('AVG', Review.sequelize!.col('rating')), 'avg_rating'],
        [Review.sequelize!.fn('COUNT', Review.sequelize!.col('id')), 'review_count'],
      ],
      raw: true,
    });

    // Extract available sizes and colors from variants
    const availableSizes = [
      ...new Set(
        product.variants
          ?.filter((v: any) => v.is_active && v.stock_quantity > 0)
          .map((v: any) => v.size) || []
      ),
    ];

    const availableColors = [
      ...new Set(
        product.variants
          ?.filter((v: any) => v.is_active && v.stock_quantity > 0)
          .map((v: any) => v.color) || []
      ),
    ];

    const document = {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      category_id: product.category_id,
      category_name: (product as any).category?.name || '',
      price: 0, // Price will be calculated from variants
      rental_price: 0, // Rental price from variants
      discount_percentage: 0,
      is_rental_available: product.is_rental,
      is_sale_available: product.is_sale,
      is_active: product.is_active,
      average_rating: parseFloat((reviewStats as any)?.avg_rating || '0'),
      review_count: parseInt((reviewStats as any)?.review_count || '0'),
      images: product.images?.map((img: any) => ({
        image_url: img.image_url,
        is_primary: img.is_primary,
      })) || [],
      variants: product.variants?.map((v: any) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        stock_quantity: v.stock_quantity,
        is_active: v.is_active,
      })) || [],
      available_sizes: availableSizes,
      available_colors: availableColors,
      tags: [],
      created_at: product.created_at,
      updated_at: product.updated_at,
    };

    await elasticsearchClient.index({
      index: PRODUCTS_INDEX,
      id: product.id.toString(),
      document,
    });

    logger.info(`Indexed product ${productId} to Elasticsearch`);
  } catch (error: any) {
    logger.error(`Error indexing product ${productId}:`, error.message);
    throw error;
  }
};

/**
 * Bulk index products
 */
export const bulkIndexProducts = async (productIds?: number[]) => {
  if (!isElasticsearchEnabled()) {
    logger.warn('Elasticsearch not available, skipping bulk indexing');
    return { indexed: 0, errors: [] };
  }

  try {
    const whereClause = productIds ? { id: { [Op.in]: productIds } } : {};

    const products = await Product.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: ProductVariant,
          as: 'variants',
          attributes: ['id', 'size', 'color', 'stock_quantity', 'is_active'],
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['image_url', 'is_primary'],
        },
      ],
    });

    if (products.length === 0) {
      logger.info('No products to index');
      return { indexed: 0, errors: [] };
    }

    const operations = products.flatMap((product) => {
      const availableSizes = [
        ...new Set(
          product.variants
            ?.filter((v: any) => v.is_active && v.stock_quantity > 0)
            .map((v: any) => v.size) || []
        ),
      ];

      const availableColors = [
        ...new Set(
          product.variants
            ?.filter((v: any) => v.is_active && v.stock_quantity > 0)
            .map((v: any) => v.color) || []
        ),
      ];

      return [
        { index: { _index: PRODUCTS_INDEX, _id: product.id.toString() } },
        {
          id: product.id,
          name: product.name,
          description: product.description,
          sku: product.sku,
          category_id: product.category_id,
          category_name: (product as any).category?.name || '',
          price: 0, // Price from variants
          rental_price: 0, // Rental price from variants
          discount_percentage: 0,
          is_rental_available: product.is_rental,
          is_sale_available: product.is_sale,
          is_active: product.is_active,
          average_rating: 0,
          review_count: 0,
          images: product.images?.map((img: any) => ({
            image_url: img.image_url,
            is_primary: img.is_primary,
          })) || [],
          variants: product.variants?.map((v: any) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            stock_quantity: v.stock_quantity,
            is_active: v.is_active,
          })) || [],
          available_sizes: availableSizes,
          available_colors: availableColors,
          tags: [],
          created_at: product.created_at,
          updated_at: product.updated_at,
        },
      ];
    });

    const bulkResponse = await elasticsearchClient.bulk({
      refresh: true,
      operations,
    });

    const errors = bulkResponse.items
      .filter((item: any) => item.index?.error)
      .map((item: any) => item.index?.error);

    logger.info(`Bulk indexed ${products.length} products (${errors.length} errors)`);

    return {
      indexed: products.length - errors.length,
      errors,
    };
  } catch (error: any) {
    logger.error('Error bulk indexing products:', error.message);
    throw error;
  }
};

/**
 * Delete product from index
 */
export const deleteFromIndex = async (productId: number) => {
  if (!isElasticsearchEnabled()) {
    return;
  }

  try {
    await elasticsearchClient.delete({
      index: PRODUCTS_INDEX,
      id: productId.toString(),
    });
    logger.info(`Deleted product ${productId} from Elasticsearch`);
  } catch (error: any) {
    if (error.meta?.statusCode !== 404) {
      logger.error(`Error deleting product ${productId} from index:`, error.message);
    }
  }
};

/**
 * Search products with filters
 */
export const searchProducts = async (params: {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  availability?: 'sale' | 'rental' | 'both';
  minRating?: number;
  inStock?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}) => {
  if (!isElasticsearchEnabled()) {
    // Fallback to database search
    return fallbackDatabaseSearch(params);
  }

  try {
    const {
      query = '',
      category,
      minPrice,
      maxPrice,
      sizes,
      colors,
      availability,
      minRating,
      inStock,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
    } = params;

    const from = (page - 1) * limit;

    // Build Elasticsearch query
    const must: any[] = [{ term: { is_active: true } }];
    const filter: any[] = [];

    // Text search
    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['name^3', 'description', 'category_name^2', 'tags'],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      });
    }

    // Category filter
    if (category) {
      filter.push({
        term: { 'category_name.keyword': category },
      });
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceRange: any = {};
      if (minPrice !== undefined) priceRange.gte = minPrice;
      if (maxPrice !== undefined) priceRange.lte = maxPrice;
      filter.push({ range: { price: priceRange } });
    }

    // Size filter
    if (sizes && sizes.length > 0) {
      filter.push({
        terms: { available_sizes: sizes },
      });
    }

    // Color filter
    if (colors && colors.length > 0) {
      filter.push({
        terms: { available_colors: colors },
      });
    }

    // Availability filter
    if (availability) {
      if (availability === 'sale') {
        filter.push({ term: { is_sale_available: true } });
      } else if (availability === 'rental') {
        filter.push({ term: { is_rental_available: true } });
      }
      // 'both' doesn't need a filter
    }

    // Rating filter
    if (minRating) {
      filter.push({ range: { average_rating: { gte: minRating } } });
    }

    // Stock filter
    if (inStock) {
      filter.push({
        nested: {
          path: 'variants',
          query: {
            bool: {
              must: [
                { term: { 'variants.is_active': true } },
                { range: { 'variants.stock_quantity': { gt: 0 } } },
              ],
            },
          },
        },
      });
    }

    // Sorting
    let sort: any[] = [];
    switch (sortBy) {
      case 'price_asc':
        sort = [{ price: { order: 'asc' } }];
        break;
      case 'price_desc':
        sort = [{ price: { order: 'desc' } }];
        break;
      case 'rating':
        sort = [{ average_rating: { order: 'desc' } }, { review_count: { order: 'desc' } }];
        break;
      case 'newest':
        sort = [{ created_at: { order: 'desc' } }];
        break;
      default:
        sort = query ? ['_score'] : [{ created_at: { order: 'desc' } }];
    }

    // Execute search
    const searchResponse = await elasticsearchClient.search({
      index: PRODUCTS_INDEX,
      from,
      size: limit,
      query: {
        bool: {
          must,
          filter,
        },
      },
      sort,
      aggs: {
        categories: {
          terms: { field: 'category_name.keyword', size: 20 },
        },
        sizes: {
          terms: { field: 'available_sizes', size: 50 },
        },
        colors: {
          terms: { field: 'available_colors', size: 50 },
        },
        price_ranges: {
          range: {
            field: 'price',
            ranges: [
              { to: 1000, key: 'Under ₹1000' },
              { from: 1000, to: 2500, key: '₹1000 - ₹2500' },
              { from: 2500, to: 5000, key: '₹2500 - ₹5000' },
              { from: 5000, to: 10000, key: '₹5000 - ₹10000' },
              { from: 10000, key: 'Above ₹10000' },
            ],
          },
        },
      },
    });

    const hits = searchResponse.hits.hits.map((hit: any) => hit._source);
    const total = (searchResponse.hits.total as any).value;

    return {
      products: hits,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      aggregations: {
        categories: (searchResponse.aggregations?.categories as any)?.buckets || [],
        sizes: (searchResponse.aggregations?.sizes as any)?.buckets || [],
        colors: (searchResponse.aggregations?.colors as any)?.buckets || [],
        priceRanges: (searchResponse.aggregations?.price_ranges as any)?.buckets || [],
      },
    };
  } catch (error: any) {
    logger.error('Error searching products:', error.message);
    throw error;
  }
};

/**
 * Autocomplete suggestions
 */
export const getAutocompleteSuggestions = async (query: string, limit: number = 10) => {
  if (!isElasticsearchEnabled()) {
    // Fallback to database
    const products = await Product.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` },
        is_active: true,
      },
      attributes: ['id', 'name', 'sku'],
      limit,
    });
    return products.map((p) => ({ id: p.id, name: p.name, sku: p.sku }));
  }

  try {
    const searchResponse = await elasticsearchClient.search({
      index: PRODUCTS_INDEX,
      size: limit,
      query: {
        bool: {
          must: [
            {
              match: {
                name: {
                  query,
                  fuzziness: 'AUTO',
                },
              },
            },
            { term: { is_active: true } },
          ],
        },
      },
      _source: ['id', 'name', 'sku', 'category_name', 'price'],
    });

    return searchResponse.hits.hits.map((hit: any) => hit._source);
  } catch (error: any) {
    logger.error('Error getting autocomplete suggestions:', error.message);
    throw error;
  }
};

/**
 * Fallback database search when Elasticsearch is not available
 */
const fallbackDatabaseSearch = async (params: any) => {
  const {
    query = '',
    category,
    minPrice,
    maxPrice,
    availability,
    minRating,
    page = 1,
    limit = 20,
  } = params;

  const offset = (page - 1) * limit;
  const where: any = { is_active: true, is_deleted: false };

  if (query) {
    where.name = { [Op.iLike]: `%${query}%` };
  }

  if (availability === 'sale') {
    where.is_sale = true;
  } else if (availability === 'rental') {
    where.is_rental = true;
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
        ...(category ? { where: { name: category } } : {}),
      },
      {
        model: ProductImage,
        as: 'images',
        attributes: ['image_url', 'is_primary'],
      },
    ],
    limit,
    offset,
    distinct: true,
  });

  return {
    products: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    aggregations: {},
  };
};

export default {
  indexProduct,
  bulkIndexProducts,
  deleteFromIndex,
  searchProducts,
  getAutocompleteSuggestions,
};
