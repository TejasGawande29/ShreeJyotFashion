# Shreejyot Fashion - E-commerce Platform

> A full-featured e-commerce platform for selling and renting men's, women's, and kids' clothing.

---

## 📋 Project Overview

**Shreejyot Fashion** is a comprehensive e-commerce solution that supports both **traditional sales** and **rental bookings** for clothing items. The platform includes a customer-facing website and a powerful admin panel for complete business management.

### Key Features

#### Customer Features
- 🛍️ Browse and purchase clothing (Men, Women, Kids)
- 👗 Rent clothing with flexible rental periods
- 🔍 Advanced search and filtering
- ⭐ Product reviews and ratings
- 🛒 Shopping cart and wishlist
- 💳 Multiple payment options (Cards, UPI, Net Banking, Wallets, COD)
- 📦 Order tracking
- 🔐 Secure authentication with social login

#### Admin Features
- 📊 Comprehensive dashboard with analytics
- 📦 Product and inventory management
- 🎯 Order and rental management
- 👥 Customer management
- 💰 Payment and refund tracking
- 🎫 Coupon and discount management
- 📈 Sales and rental reports
- ⚙️ System settings and configuration

#### Rental-Specific Features (Unique)
- 📅 Date-based rental booking
- 💵 Security deposit handling
- 🔍 Product inspection and damage tracking
- ⏰ Rental extension capabilities
- 💰 Automated refund processing
- 🚨 Overdue rental tracking

---

## 📁 Project Documentation

This repository contains comprehensive project documentation:

| Document | Description | File |
|----------|-------------|------|
| **Project Roadmap** | Complete development timeline, phases, milestones, and technology stack | [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md) |
| **Project Flow** | System architecture, user flows, admin flows, and feature breakdown | [PROJECT_FLOW.md](./PROJECT_FLOW.md) |
| **Database Schema** | Complete database design with all tables, relationships, and ER diagrams | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) |
| **SQL Schema** | Executable PostgreSQL DDL statements to create the database | [schema.sql](./schema.sql) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  ┌──────────────────────┬─────────────────────────────┐ │
│  │  Customer Website    │      Admin Panel            │ │
│  │  (React/Next.js)     │  (React Dashboard)          │ │
│  └──────────────────────┴─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  API GATEWAY (REST)                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              APPLICATION SERVICES                        │
│  Auth │ Products │ Orders │ Rentals │ Payments │ etc.   │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                            │
│  PostgreSQL │ Redis │ Elasticsearch │ Cloud Storage     │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js / Next.js
- **State Management**: Redux Toolkit / Zustand
- **Styling**: Tailwind CSS / Material-UI
- **Form Handling**: React Hook Form
- **API Client**: Axios / React Query

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js / NestJS
- **Authentication**: JWT + OAuth (Google, Facebook)
- **Validation**: Joi / Yup
- **File Upload**: Multer

### Database
- **Primary**: PostgreSQL 14+
- **Cache**: Redis
- **Search**: Elasticsearch (optional)
- **Storage**: AWS S3 / Cloudinary

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Hosting**: AWS / DigitalOcean / Vercel
- **Monitoring**: Sentry / New Relic

### External Services
- **Payment**: Razorpay / Stripe
- **Email**: SendGrid / NodeMailer
- **SMS**: Twilio / MSG91
- **CDN**: CloudFlare / AWS CloudFront

---

## 📊 Database Overview

### Core Tables (25 Tables)

#### User Management
- `users` - User accounts
- `user_profiles` - Extended user info
- `addresses` - Shipping/billing addresses

#### Product Catalog
- `categories` - Hierarchical categories
- `products` - Product information
- `product_variants` - Size, color, stock
- `product_prices` - Pricing history
- `product_images` - Image gallery

#### Shopping & Orders
- `cart_items` - Shopping cart
- `wishlist_items` - User wishlist
- `orders` - All orders (sale + rental)
- `order_items` - Order line items
- `order_status_log` - Status tracking

#### Rentals (Unique Feature)
- `rentals` - Rental bookings
- `rental_returns` - Return inspections

#### Payments & Discounts
- `payments` - Payment transactions
- `coupons` - Discount codes
- `coupon_usage` - Usage tracking

#### Reviews & Content
- `reviews` - Product reviews
- `review_helpful` - Review votes
- `banners` - Promotional banners
- `notifications` - User notifications

#### System
- `settings` - App configuration
- `email_logs` - Email tracking
- `sms_logs` - SMS tracking

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Redis (for caching)
- Git

### Database Setup

1. **Create PostgreSQL Database**
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE shreejyot_fashion;

# Connect to database
\c shreejyot_fashion
```

2. **Run Schema**
```bash
# Execute the SQL schema file
psql -U postgres -d shreejyot_fashion -f schema.sql
```

3. **Verify Setup**
```bash
# List all tables
psql -U postgres -d shreejyot_fashion -c "\dt"
```

### Backend Setup (Coming Soon)

```bash
# Clone repository
git clone https://github.com/your-repo/shreejyot-fashion.git

# Navigate to backend
cd shreejyot-fashion/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run migrations (if using ORM)
npm run migrate

# Start development server
npm run dev
```

### Frontend Setup (Coming Soon)

```bash
# Navigate to frontend
cd shreejyot-fashion/frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with API URL

# Start development server
npm run dev
```

---

## 📅 Development Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| **Phase 1**: Planning & Design | 2 weeks | ⏳ Current |
| **Phase 2**: Backend Development | 5 weeks | 📋 Planned |
| **Phase 3**: Admin Panel | 3 weeks | 📋 Planned |
| **Phase 4**: Customer Website | 5 weeks | 📋 Planned |
| **Phase 5**: Testing | 2 weeks | 📋 Planned |
| **Phase 6**: Deployment | 1 week | 📋 Planned |

**Total Estimated Time**: 18 weeks (~4.5 months)

---

## 💡 Key Business Features

### Sale vs Rental

| Feature | Sale | Rental |
|---------|------|--------|
| **Purchase Type** | One-time buy | Time-based rental |
| **Payment** | Product price | Daily rate × days + deposit |
| **Delivery** | Standard shipping | Delivery & return logistics |
| **Stock Management** | Reduces inventory | Allocates (returns later) |
| **Customer Process** | Buy → Deliver → Done | Book → Use → Return → Refund |

### Rental Workflow

1. **Customer browses rental products**
2. **Selects rental dates** (start/end)
3. **System checks availability**
4. **Pays rental amount + security deposit**
5. **Product delivered/picked up**
6. **Customer uses product during rental period**
7. **Option to extend rental**
8. **Customer returns product**
9. **Admin inspects product**
10. **Deposit refunded** (minus damages if any)

---

## 📈 Business Metrics

### Success Indicators
- User registration conversion rate > 15%
- Shopping cart conversion rate > 5%
- Rental booking rate > 10%
- Average order value tracking
- Customer retention rate
- Rental return compliance > 95%

### Performance Targets
- Page load time < 3 seconds
- API response time < 500ms
- 99.9% uptime
- Zero critical security vulnerabilities

---

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt
- **JWT Authentication**: Access + Refresh tokens
- **HTTPS Only**: All communications encrypted
- **SQL Injection Protection**: Parameterized queries
- **XSS Prevention**: Input sanitization
- **CSRF Protection**: CSRF tokens
- **Rate Limiting**: Brute force prevention
- **PCI DSS Compliance**: Secure payments
- **Data Encryption**: AES-256 for sensitive data

---

## 📱 API Structure

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
```

### Products
```
GET    /api/products
GET    /api/products/:id
POST   /api/products (Admin)
PUT    /api/products/:id (Admin)
DELETE /api/products/:id (Admin)
```

### Orders
```
GET    /api/orders
POST   /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/cancel
```

### Rentals (Unique)
```
GET    /api/rentals
POST   /api/rentals/book
POST   /api/rentals/check-availability
PUT    /api/rentals/:id/extend
POST   /api/rentals/:id/return
```

*See [PROJECT_FLOW.md](./PROJECT_FLOW.md) for complete API documentation*

---

## 🎯 Future Enhancements

- 📱 Mobile apps (iOS & Android)
- 🤖 AI-powered recommendations
- 🔮 Virtual try-on (AR/VR)
- 🎁 Loyalty program
- 📦 Subscription rental plans
- 🏪 Multi-vendor marketplace
- 💬 Live chat support
- 📱 Social commerce integration
- 🤝 Influencer partnerships
- 📊 ML-based inventory forecasting

---

## 👥 Team Requirements

- Project Manager: 1
- Backend Developer: 2
- Frontend Developer: 2
- UI/UX Designer: 1
- QA Engineer: 1
- DevOps Engineer: 1 (part-time)

---

## 💰 Estimated Budget

| Component | Cost (INR) |
|-----------|------------|
| Development (18 weeks) | ₹5,00,000 - ₹8,00,000 |
| Design (UI/UX) | ₹50,000 - ₹1,00,000 |
| Infrastructure (1 year) | ₹20,000 - ₹50,000 |
| Third-party Services | ₹20,000 - ₹40,000 |
| Testing & QA | ₹50,000 - ₹1,00,000 |
| **Total** | **₹6,40,000 - ₹10,90,000** |

---

## 📞 Contact

**Project**: Shreejyot Fashion E-commerce Platform  
**Type**: Sales + Rental E-commerce  
**Target**: Men's, Women's, Kids' Clothing  

---

## 📄 License

This project documentation is proprietary and confidential.

---

## 🗓️ Document Info

- **Version**: 1.0
- **Last Updated**: October 19, 2025
- **Status**: Planning Phase
- **Next Steps**: Review documentation → Finalize tech stack → Begin development

---

## 📚 Quick Links

- [Project Roadmap](./PROJECT_ROADMAP.md) - Timeline and milestones
- [Project Flow](./PROJECT_FLOW.md) - Architecture and workflows
- [Database Schema](./DATABASE_SCHEMA.md) - Database design
- [SQL Schema](./schema.sql) - Database creation script

---

**Ready to build the future of fashion e-commerce! 🚀👗👔**
