# Shreejyot Fashion - Customer Website Frontend

> Next.js 14 + TypeScript + Tailwind CSS + Redux Toolkit

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation

1. **Navigate to frontend directory**
   ```powershell
   cd d:\shreejyotFashion\frontend
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Set up environment variables**
   ```powershell
   copy .env.example .env.local
   ```
   
   Then edit `.env.local` with your actual values:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   # ... other variables
   ```

4. **Run development server**
   ```powershell
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   ├── providers.tsx     # Redux & Theme providers
│   │   └── not-found.tsx     # 404 page
│   ├── components/           # React components
│   │   ├── common/           # Reusable components
│   │   ├── home/             # Homepage sections
│   │   ├── products/         # Product components
│   │   ├── cart/             # Cart components
│   │   └── layout/           # Header, Footer, etc.
│   ├── store/                # Redux store
│   │   ├── index.ts          # Store configuration
│   │   └── slices/           # Redux slices
│   ├── types/                # TypeScript types
│   ├── lib/                  # Utilities & helpers
│   ├── hooks/                # Custom React hooks
│   └── styles/               # Global styles
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 Design System

Based on `DESIGN_GUIDELINES.md`:

### Colors
- **Primary**: Purple `#6B46C1`
- **Secondary**: Rose Gold `#D4AF37`
- **Accents**: Teal, Coral, Lavender

### Typography
- **Body**: Inter (sans-serif)
- **Headings**: Playfair Display (serif)

### Components
All components follow the design system defined in `globals.css`:
- Buttons: `.btn-primary`, `.btn-secondary`, `.btn-outline`
- Cards: `.card`
- Badges: `.badge-rental`, `.badge-sale`
- Inputs: `.input`

## 🛠️ Available Scripts

```powershell
# Development
npm run dev          # Start dev server (port 3000)

# Build
npm run build        # Production build
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format with Prettier

# Testing
npm test             # Run tests
npm run test:watch   # Watch mode
```

## 📦 Key Dependencies

### Core
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety

### State Management
- **Redux Toolkit**: Global state
- **React Redux**: React bindings

### Styling
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animations
- **React Icons**: Icon library

### Forms
- **React Hook Form**: Form management
- **Zod**: Schema validation

### UI Components
- **react-hot-toast**: Notifications
- **Swiper**: Carousels
- **react-day-picker**: Date picker (for rentals)

### API
- **Axios**: HTTP client
- **date-fns**: Date utilities

## 🌟 Key Features

### 1. Product Listing
- Grid/List view toggle
- Advanced filters (category, price, size, color)
- Sorting options
- Pagination
- **Rental/Sale toggle** (Unique)

### 2. Product Detail
- Image gallery with zoom
- Size & color selection
- Add to cart
- **Rental date picker** (Unique)
- **Security deposit display** (Unique)
- Reviews & ratings

### 3. Shopping Cart
- Add/remove items
- Quantity controls
- Price calculation
- Coupon codes
- **Mixed cart** (sale + rental items)

### 4. Rental System (Unique Feature)
- Date range picker
- Availability checker
- Rental price calculator
- Security deposit info
- Rental terms display

### 5. User Dashboard
- Order history
- **Active rentals** (Unique)
- **Rental returns** (Unique)
- Profile management
- Wishlist
- Saved addresses

### 6. Authentication
- Email/Password login
- Social login (Google, Facebook)
- JWT token management
- Protected routes

## 🎯 Responsive Design

Mobile-first approach with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components are fully responsive and tested across devices.

## ♿ Accessibility

- WCAG AA compliant
- Keyboard navigation
- Screen reader support
- Focus indicators
- Reduced motion support
- High contrast mode

## 🔒 Security

- XSS protection
- CSRF tokens
- Secure headers
- Environment variable management
- No sensitive data in client code

## 🚀 Deployment

### Build for production
```powershell
npm run build
```

### Deploy to Vercel (Recommended)
```powershell
vercel deploy
```

### Environment Variables
Set the following in your hosting platform:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- (See `.env.example` for full list)

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Design Guidelines](../docs/design/DESIGN_GUIDELINES.md)
- [Wireframes](../docs/wireframes/CUSTOMER_WEBSITE_WIREFRAMES.md)

## 🐛 Troubleshooting

### TypeScript errors
```powershell
npm run type-check
```

### Port already in use
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Clear cache
```powershell
rm -rf .next
rm -rf node_modules
npm install
```

## 📝 Development Guidelines

1. **Component Structure**: Use functional components with hooks
2. **State Management**: Use Redux for global state, local state for UI
3. **Styling**: Use Tailwind classes, avoid custom CSS
4. **TypeScript**: Define types in `src/types/`
5. **API Calls**: Use Axios with interceptors in `src/lib/api.ts`
6. **Code Style**: Follow ESLint + Prettier rules

## 🎨 Brand Guidelines

Follow the established design system:
- Use design tokens from `tailwind.config.ts`
- Maintain consistent spacing (8px grid)
- Use brand colors (Purple & Rose Gold)
- Follow typography hierarchy

## 🔄 Git Workflow

```powershell
# Create feature branch
git checkout -b feature/product-listing

# Make changes and commit
git add .
git commit -m "feat: Add product listing page"

# Push and create PR
git push origin feature/product-listing
```

## 📞 Support

For issues or questions:
- Email: dev@shreejyot.com
- Documentation: See `/docs` folder

---

**Version**: 1.0.0  
**Last Updated**: October 19, 2025  
**Status**: Development
