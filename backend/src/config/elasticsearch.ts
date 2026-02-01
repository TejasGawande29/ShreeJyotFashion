import { Client } from '@elastic/elasticsearch';
import logger from '../utils/logger';

// Elasticsearch client configuration
const elasticsearchClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  auth: process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
    ? {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      }
    : undefined,
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: false,
});

// Test connection
export const testElasticsearchConnection = async (): Promise<boolean> => {
  try {
    const health = await elasticsearchClient.cluster.health({});
    logger.info('✅ Elasticsearch connected:', {
      cluster: health.cluster_name,
      status: health.status,
      nodes: health.number_of_nodes,
    });
    return true;
  } catch (error: any) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      logger.warn('⚠️  Elasticsearch not available - search features will be disabled');
      logger.warn('   To enable search, install and run Elasticsearch on port 9200');
      return false;
    }
    logger.error('Elasticsearch connection error:', error.message);
    return false;
  }
};

// Product index name
export const PRODUCTS_INDEX = 'shreejyot_products';

// Check if Elasticsearch is available
let isElasticsearchAvailable = false;

export const initializeElasticsearch = async () => {
  isElasticsearchAvailable = await testElasticsearchConnection();
  
  if (isElasticsearchAvailable) {
    // Create index if it doesn't exist
    const indexExists = await elasticsearchClient.indices.exists({
      index: PRODUCTS_INDEX,
    });

    if (!indexExists) {
      logger.info(`Creating Elasticsearch index: ${PRODUCTS_INDEX}`);
      await createProductIndex();
    }
  }
};

// Create product index with mapping
export const createProductIndex = async () => {
  try {
    await elasticsearchClient.indices.create({
      index: PRODUCTS_INDEX,
      settings: {
        number_of_shards: 1,
        number_of_replicas: 1,
        analysis: {
          analyzer: {
            autocomplete_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'autocomplete_filter'],
            },
            autocomplete_search_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase'],
            },
          },
          filter: {
            autocomplete_filter: {
              type: 'edge_ngram',
              min_gram: 2,
              max_gram: 20,
            },
          },
        },
      },
      mappings: {
        properties: {
          id: { type: 'integer' },
          name: {
            type: 'text',
            analyzer: 'autocomplete_analyzer',
            search_analyzer: 'autocomplete_search_analyzer',
            fields: {
              keyword: { type: 'keyword' },
              standard: { type: 'text' },
            },
          },
          description: {
            type: 'text',
            analyzer: 'standard',
          },
          sku: {
            type: 'keyword',
          },
          category_id: { type: 'integer' },
          category_name: {
            type: 'text',
            fields: {
              keyword: { type: 'keyword' },
            },
          },
          price: { type: 'float' },
          rental_price: { type: 'float' },
          discount_percentage: { type: 'float' },
          is_rental_available: { type: 'boolean' },
          is_sale_available: { type: 'boolean' },
          is_active: { type: 'boolean' },
          average_rating: { type: 'float' },
          review_count: { type: 'integer' },
          images: {
            type: 'nested',
            properties: {
              image_url: { type: 'keyword' },
              is_primary: { type: 'boolean' },
            },
          },
          variants: {
            type: 'nested',
            properties: {
              id: { type: 'integer' },
              size: { type: 'keyword' },
              color: { type: 'keyword' },
              stock_quantity: { type: 'integer' },
              is_active: { type: 'boolean' },
            },
          },
          available_sizes: { type: 'keyword' },
          available_colors: { type: 'keyword' },
          tags: { type: 'keyword' },
          created_at: { type: 'date' },
          updated_at: { type: 'date' },
        },
      },
    } as any);
    logger.info(`✅ Created Elasticsearch index: ${PRODUCTS_INDEX}`);
  } catch (error: any) {
    logger.error('Error creating product index:', error.message);
    throw error;
  }
};

// Delete product index
export const deleteProductIndex = async () => {
  try {
    const exists = await elasticsearchClient.indices.exists({
      index: PRODUCTS_INDEX,
    });

    if (exists) {
      await elasticsearchClient.indices.delete({
        index: PRODUCTS_INDEX,
      });
      logger.info(`Deleted Elasticsearch index: ${PRODUCTS_INDEX}`);
    }
  } catch (error: any) {
    logger.error('Error deleting product index:', error.message);
    throw error;
  }
};

export const isElasticsearchEnabled = () => isElasticsearchAvailable;

export default elasticsearchClient;
