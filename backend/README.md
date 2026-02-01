# Shreejyot Fashion - Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue.svg)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)

A comprehensive e-commerce backend API for fashion rental and sales platform, built with Node.js, TypeScript, Express, and PostgreSQL.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## ✨ Features

### Core Modules (11/12 Complete - 92%)

#### ✅ 1. Authentication & User Management
- JWT-based authentication with refresh tokens
- Role-based access control (Customer, Admin, Staff)
- User profiles with multiple addresses
- Password reset with email verification
- Secure password hashing (bcrypt)

#### ✅ 2. Product Management
- Complete CRUD operations for products
- Category management with hierarchical structure
- Product variants (size, color, stock tracking)
- Multiple product images with primary designation
- Bulk product upload via CSV
- Stock management and allocation

#### ✅ 3. Cart & Wishlist
- Add/remove items from cart
- Quantity management
- Cart totals calculation
- Wishlist functionality
- Cart persistence

#### ✅ 4. Order Management
- Create orders from cart
- Order status tracking (pending → processing → shipped → delivered)
- Order history for customers
- Admin order management panel
- Shipping address management

#### ✅ 5. Rental System
- Rental booking with date selection
- Availability checking
- Rental extensions
- Return management
- Security deposits handling
- Late fee calculations
- Overdue tracking

#### ✅ 6. Payment Integration
- Razorpay payment gateway integration
- Order creation and signature verification
- Payment capture and refunds
- Payment status tracking
- Transaction history

#### ✅ 7. Reviews & Ratings
- Product reviews (1-5 stars)
- Review moderation (admin approval)
- Verified purchase badges
- Helpful voting system
- Review statistics
- Image uploads with reviews

#### ✅ 8. Coupons & Discounts
- Coupon code validation
- Multiple discount types (percentage, fixed amount)
- Usage limits and expiry dates
- Category-specific coupons
- Minimum purchase requirements
- Usage tracking and analytics

#### ✅ 9. Notifications System
- **Email Notifications**: NodeMailer with 7 HTML templates
  - Order confirmation, Rental confirmation, Payment success
  - Welcome email, Password reset
  - Rental reminders, Custom templates
- **SMS Notifications**: Mock mode ready for Twilio/MSG91 (8 message types)
- **In-App Notifications**: Read/unread tracking, bulk operations (12 types)
- Full integration with auth, orders, payments, rentals

#### ✅ 10. Admin Analytics Dashboard
- Dashboard overview (revenue, orders, customers, rentals)
- Revenue trends (daily/weekly/monthly)
- Sales analytics by category
- Top selling products
- Low stock alerts
- Customer analytics (new vs returning, lifetime value)
- Geographic distribution
- Rental performance metrics
- 12 comprehensive endpoints

#### ✅ 11. Search & Filters
- **Elasticsearch Integration** with graceful fallback to PostgreSQL
- Full-text search with fuzzy matching
- Autocomplete suggestions (edge n-grams)
- Faceted search with aggregations (categories, sizes, colors, price ranges)
- Advanced filters (price, size, color, rating, stock availability)
- Multiple sort options (relevance, price, rating, newest)
- Admin bulk indexing endpoints

#### 🔴 12. Testing & Documentation (In Progress)
- Jest + Supertest setup
- Unit tests for services
- Integration tests for APIs
- Swagger/OpenAPI documentation
- Comprehensive README

---

## 🛠️ Tech Stack

### Core
- **Runtime**: Node.js 18.x
- **Language**: TypeScript 5.x
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 15.x
- **ORM**: Sequelize 6.x

### Authentication & Security
- **JWT**: jsonwebtoken
- **Password Hashing**: bcrypt
- **Security Headers**: helmet
- **Rate Limiting**: express-rate-limit
- **CORS**: cors

### Search & Caching
- **Search Engine**: Elasticsearch 8.x (optional, with fallback)
- **In-Memory**: Node.js native (extensible to Redis)

### Payments & Notifications
- **Payment Gateway**: Razorpay
- **Email**: NodeMailer (SMTP)
- **SMS**: Mock mode (Twilio/MSG91 ready)

### Development Tools
- **Testing**: Jest, Supertest
- **API Docs**: Swagger/OpenAPI
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Logger**: Winston

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Client Layer                      │
│          (Web App / Mobile App / Admin Panel)            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    API Gateway / Routes                  │
│         (Authentication, Rate Limiting, CORS)            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                     Controllers                          │
│     (Request Validation, Response Formatting)            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   Business Logic Layer                   │
│              (Services, Business Rules)                  │
└────────┬────────────────────────────────┬───────────────┘
         │                                │
         ▼                                ▼
┌────────────────────┐        ┌───────────────────────────┐
│   PostgreSQL DB    │        │   External Services       │
│  (Primary Data)    │        │  - Razorpay (Payments)    │
│                    │        │  - NodeMailer (Email)     │
│  - Users           │        │  - Elasticsearch (Search) │
│  - Products        │        │  - SMS Gateway            │
│  - Orders          │        └───────────────────────────┘
│  - Rentals         │
│  - Payments        │
│  - Reviews         │
│  - Coupons         │
└────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL**: v15.x or higher ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn**: Package manager
- **Elasticsearch**: v8.x (Optional - for search features) ([Download](https://www.elastic.co/downloads/elasticsearch))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shreejyot-fashion-backend.git
   cd shreejyot-fashion-backend/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Setup database** (see [Database Setup](#database-setup))

6. **Compile TypeScript**
   ```bash
   npm run build
   ```

7. **Start the server**
   ```bash
   npm start
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shreejyot_fashion_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-token-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (NodeMailer - Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM="Shreejyot Fashion <noreply@shreejyot.com>"

# SMS Configuration (Optional)
SMS_PROVIDER=mock
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=SHRJYT

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Elasticsearch (Optional - for search features)
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=
ELASTICSEARCH_PASSWORD=

# Application URLs
PASSWORD_RESET_URL=http://localhost:3000/reset-password
```

### Getting API Keys

**Razorpay:**
1. Sign up at [razorpay.com](https://razorpay.com/)
2. Get API keys from Dashboard → Settings → API Keys

**Gmail App Password:**
1. Enable 2FA on your Google account
2. Generate app password: Google Account → Security → App Passwords

---

## 💾 Database Setup

### 1. Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE shreejyot_fashion_db;

# Exit psql
\q
```

### 2. Run Migrations

The database schema will be automatically created by Sequelize on first run with `sync()`. For production, use proper migrations:

```bash
# Generate migration
npx sequelize-cli migration:generate --name create-initial-schema

# Run migrations
npx sequelize-cli db:migrate
```

### 3. Seed Data (Optional)

```bash
# Create admin user and sample data
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@shreejyot.com`
- Password: `Admin@123`

---

## 🏃 Running the Application

### Development Mode

```bash
# With auto-reload (using nodemon)
npm run dev

# Build and run
npm run build
npm start
```

### Production Mode

```bash
# Build TypeScript
npm run build

# Start server
NODE_ENV=production npm start
```

### Using PM2 (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start dist/server.js --name shreejyot-api

# View logs
pm2 logs shreejyot-api

# Monitor
pm2 monit
```

---

## 📚 API Documentation

### Interactive API Docs

Once the server is running, visit:
- **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

### Quick Reference

**Base URL**: `http://localhost:5000/api`

| Module | Endpoint Base | Auth Required | Documentation |
|--------|---------------|---------------|---------------|
| Authentication | `/api/auth` | Mixed | [AUTH_API.md](./docs/AUTH_API.md) |
| Products | `/api/products` | Mixed | [PRODUCT_API.md](./docs/PRODUCT_API.md) |
| Cart | `/api/cart` | Yes | [CART_API.md](./docs/CART_API.md) |
| Wishlist | `/api/wishlist` | Yes | [WISHLIST_API.md](./docs/WISHLIST_API.md) |
| Orders | `/api/orders` | Yes | [ORDER_API.md](./docs/ORDER_API.md) |
| Rentals | `/api/rentals` | Yes | [RENTAL_API.md](./docs/RENTAL_API.md) |
| Payments | `/api/payments` | Yes | [PAYMENT_API.md](./docs/PAYMENT_API.md) |
| Reviews | `/api/reviews` | Mixed | [REVIEW_API.md](./docs/REVIEW_API.md) |
| Coupons | `/api/coupons` | Mixed | [COUPON_API.md](./docs/COUPON_API.md) |
| Notifications | `/api/notifications` | Yes | [NOTIFICATION_API.md](./docs/NOTIFICATION_API.md) |
| Analytics | `/api/analytics` | Admin | [ANALYTICS_API_DOCS.md](./ANALYTICS_API_DOCS.md) |
| Search | `/api/search` | No | [SEARCH_API_DOCS.md](./SEARCH_API_DOCS.md) |

### Example API Calls

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password@123",
    "phone": "+919876543210"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password@123"
  }'
```

**Search Products:**
```bash
curl "http://localhost:5000/api/search/products?q=lehenga&min_price=5000&max_price=20000"
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts

# Watch mode
npm test -- --watch
```

### Test Structure

```
tests/
├── unit/
│   ├── services/
│   │   ├── authService.test.ts
│   │   ├── productService.test.ts
│   │   └── orderService.test.ts
│   └── utils/
│       └── validators.test.ts
├── integration/
│   ├── auth.test.ts
│   ├── products.test.ts
│   ├── orders.test.ts
│   └── rentals.test.ts
└── setup.ts
```

### Manual Testing Scripts

Pre-built test scripts for manual API testing:

```bash
# Test rentals
node test_rentals.js

# Test analytics
node test_analytics.js

# Test notifications
node test_notifications.js
```

---

## 🚢 Deployment

### Environment Setup

1. **Production Database**: Use managed PostgreSQL (AWS RDS, DigitalOcean, etc.)
2. **Environment Variables**: Set all production values
3. **SSL/TLS**: Enable HTTPS (use nginx as reverse proxy)
4. **Process Manager**: Use PM2 for process management

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create shreejyot-fashion-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret
# ... set all other env vars

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
```

### Deploy to AWS EC2

```bash
# SSH to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Clone and setup
git clone https://github.com/yourusername/shreejyot-fashion-backend.git
cd shreejyot-fashion-backend/backend
npm install
npm run build

# Start with PM2
pm2 start dist/server.js --name shreejyot-api
pm2 startup
pm2 save
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

```bash
# Build image
docker build -t shreejyot-api .

# Run container
docker run -d -p 5000:5000 --env-file .env shreejyot-api
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts
│   │   └── elasticsearch.ts
│   ├── controllers/      # Request handlers
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── orderController.ts
│   │   ├── rentalController.ts
│   │   ├── paymentController.ts
│   │   ├── reviewController.ts
│   │   ├── couponController.ts
│   │   ├── notificationController.ts
│   │   ├── analyticsController.ts
│   │   └── searchController.ts
│   ├── middlewares/      # Custom middlewares
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   └── validators.ts
│   ├── models/           # Sequelize models
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Rental.ts
│   │   ├── Payment.ts
│   │   ├── Review.ts
│   │   ├── Coupon.ts
│   │   ├── Notification.ts
│   │   └── index.ts
│   ├── routes/           # API routes
│   │   ├── authRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── rentalRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   ├── reviewRoutes.ts
│   │   ├── couponRoutes.ts
│   │   ├── notificationRoutes.ts
│   │   ├── analyticsRoutes.ts
│   │   └── searchRoutes.ts
│   ├── services/         # Business logic
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── rentalService.ts
│   │   ├── paymentService.ts
│   │   ├── reviewService.ts
│   │   ├── couponService.ts
│   │   ├── emailService.ts
│   │   ├── smsService.ts
│   │   ├── notificationService.ts
│   │   ├── analyticsService.ts
│   │   └── searchService.ts
│   ├── utils/            # Utility functions
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── tests/                # Test files
│   ├── unit/
│   ├── integration/
│   └── setup.ts
├── dist/                 # Compiled JavaScript (gitignored)
├── coverage/             # Test coverage reports (gitignored)
├── docs/                 # API documentation
├── .env.example          # Environment variables template
├── jest.config.js        # Jest configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies
└── README.md             # This file
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow existing code style
- Run linter before committing: `npm run lint`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👥 Team

**Backend Development**: Shreejyot Fashion Team

---

## 📞 Support

For support, email support@shreejyot.com or open an issue on GitHub.

---

## 🗺️ Roadmap

### Phase 1: Backend Development (92% Complete) ✅
- [x] Authentication & User Management
- [x] Product Management
- [x] Cart & Wishlist
- [x] Order Management
- [x] Rental System
- [x] Payment Integration
- [x] Reviews & Ratings
- [x] Coupons & Discounts
- [x] Notifications System
- [x] Admin Analytics
- [x] Search & Filters
- [ ] Testing & Documentation (In Progress)

### Phase 2: Frontend Development (Upcoming)
- [ ] Customer Web App (Next.js)
- [ ] Admin Dashboard (React)
- [ ] Mobile App (React Native)

### Phase 3: DevOps & Deployment
- [ ] CI/CD Pipeline
- [ ] Docker Containerization
- [ ] Kubernetes Orchestration
- [ ] Monitoring & Logging

### Phase 4: Advanced Features
- [ ] AI-powered Recommendations
- [ ] Real-time Chat Support
- [ ] Voice Search
- [ ] AR Try-On Feature
- [ ] Multi-language Support

---

## 📊 Project Status

**Current Status**: 🟢 Active Development  
**Backend Completion**: 92% (11/12 modules)  
**Last Updated**: January 2024  
**Version**: 1.0.0-beta

---

**Built with ❤️ by Shreejyot Fashion Team**
