import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shreejyot Fashion API',
      version: '1.0.0',
      description: 'Comprehensive e-commerce API for fashion rental and sales platform',
      contact: {
        name: 'Shreejyot Fashion Team',
        email: 'support@shreejyot.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.shreejyot.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from /api/auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            phone: { type: 'string', example: '+919876543210' },
            role: { type: 'string', enum: ['customer', 'admin', 'staff'] },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Royal Blue Wedding Lehenga' },
            slug: { type: 'string', example: 'royal-blue-wedding-lehenga' },
            sku: { type: 'string', example: 'LEH-001' },
            description: { type: 'string' },
            category_id: { type: 'integer' },
            is_sale: { type: 'boolean' },
            is_rental: { type: 'boolean' },
            is_featured: { type: 'boolean' },
            is_active: { type: 'boolean' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            order_number: { type: 'string', example: 'ORD-20240115-001' },
            total_amount: { type: 'number', example: 15000.00 },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            },
            payment_status: {
              type: 'string',
              enum: ['pending', 'paid', 'failed', 'refunded'],
            },
          },
        },
        Rental: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            order_id: { type: 'integer' },
            product_id: { type: 'integer' },
            rental_start_date: { type: 'string', format: 'date' },
            rental_end_date: { type: 'string', format: 'date' },
            rental_days: { type: 'integer' },
            total_rental_amount: { type: 'number' },
            security_deposit: { type: 'number' },
            rental_status: {
              type: 'string',
              enum: ['pending', 'booked', 'active', 'returned', 'overdue', 'cancelled'],
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Access denied. No token provided.',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'User does not have permission to access this resource',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Access denied. Admins only.',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Resource not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Validation error',
                errors: ['Email is required', 'Password must be at least 8 characters'],
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'User authentication and authorization' },
      { name: 'Products', description: 'Product management' },
      { name: 'Categories', description: 'Category management' },
      { name: 'Cart', description: 'Shopping cart operations' },
      { name: 'Wishlist', description: 'Wishlist operations' },
      { name: 'Orders', description: 'Order management' },
      { name: 'Rentals', description: 'Rental booking and management' },
      { name: 'Payments', description: 'Payment processing' },
      { name: 'Reviews', description: 'Product reviews and ratings' },
      { name: 'Coupons', description: 'Discount coupons' },
      { name: 'Notifications', description: 'User notifications' },
      { name: 'Analytics', description: 'Admin analytics and reports' },
      { name: 'Search', description: 'Product search and filters' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Shreejyot Fashion API Docs',
  }));

  // Swagger JSON
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger docs available at: http://localhost:5000/api-docs');
};

export default swaggerSpec;
