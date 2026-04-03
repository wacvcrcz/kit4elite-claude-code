# LUXE — Premium E-Commerce Platform

A full-stack e-commerce platform that supports both digital products (downloadable files, licenses, software) and physical products (with stock management and shipping). The design feels premium, unique, and distinctly non-generic with Clash Display headings and a custom dark-first design system.

## Features

- **Digital Products**: Instant downloads, file delivery via secure tokenized URLs, license management
- **Physical Products**: Stock tracking, shipping profiles, order fulfillment
- **Premium Design**: Clash Display + Inter font pairing, dark-first color palette
- **Stripe Payments**: Full Checkout Session flow with webhook verification
- **Admin Dashboard**: CRUD for products, categories, coupons, orders with stats
- **Security**: JWT authentication, bcrypt password hashing, Zod validation

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 with custom design tokens
- **State**: Zustand (auth, cart, products)
- **Animation**: Framer Motion (page transitions, micro-interactions)
- **UI Components**: shadcn/ui base (custom themed)
- **Loading States**: NProgress (route loading bar) + react-content-loader (skeletons)

### Backend
- **Runtime**: Node.js 20 + TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Payments**: Stripe
- **File Storage**: AWS S3 (presigned URLs)
- **Email**: Resend
- **Auth**: JWT (15min access + 7d refresh in httpOnly cookies)

## Project Structure

```
/
├── frontend/              # React frontend (existing)
│   ├── src/
│   │   ├── components/    # UI components (buttons, cards, modals)
│   │   ├── pages/         # Route components
│   │   ├── store/         # Zustand stores (auth, cart, products)
│   │   ├── lib/           # Utilities (API client, helpers)
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── vite.config.ts
│
└── backend/               # Node.js API (this project)
    ├── src/
    │   ├── controllers/   # HTTP request handlers
    │   ├── services/       # Business logic
    │   ├── routes/         # Route definitions
    │   ├── middleware/     # Auth, error handling, validation
    │   ├── lib/            # Utilities (JWT, bcrypt, Stripe, S3)
    │   ├── schema/         # Zod validation schemas
    │   ├── types/          # TypeScript type definitions
    │   ├── config/         # Prisma client
    │   └── utils/          # Error classes, async handlers
    ├── prisma/
    │   └── schema.prisma   # Database schema
    ├── package.json
    └── tsconfig.json
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Stripe account
- AWS account with S3 bucket
- Resend account (for emails)

### Environment Setup

1. **Clone and setup**:
```bash
cd kit4elite-claude-code
npm install
```

2. **Backend environment** (copy and fill):
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
```

Required `.env` variables:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/luxe_ecommerce
JWT_SECRET=your-jwt-secret-min-32-characters
JWT_REFRESH_SECRET=your-jwt-refresh-secret-min-32-characters
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
RESEND_API_KEY=re_...
FRONTEND_URL=http://localhost:5173
```

3. **Database setup**:
```bash
npx prisma migrate dev
npx prisma generate
```

4. **Start backend**:
```bash
npm run db:dev    # Run migrations
npm run dev       # Start server on :3001
```

5. **Frontend** (in separate terminal):
```bash
cd ../frontend
npm install
npm run dev       # Start on :5173
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with credentials |
| POST | `/api/auth/refresh` | Get new access token |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (filtered, paginated) |
| GET | `/api/products/:slug` | Get product by slug |
| POST | `/api/products` | Create product (admin) |
| PATCH | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Soft delete (admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category (admin) |
| PATCH | `/api/categories/:id` | Update category (admin) |
| DELETE | `/api/categories/:id` | Delete category (admin) |

### Coupons
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coupons` | List coupons (admin) |
| POST | `/api/coupons` | Create coupon (admin) |
| POST | `/api/coupons/validate` | Validate coupon for cart |

### Orders & Checkout
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/checkout/session` | Create Stripe Checkout session |
| POST | `/api/stripe/webhook` | Stripe webhook handler |
| GET | `/api/orders/mine` | Get my orders |
| GET | `/api/admin/stats` | Admin stats |

## Database Schema

### Models
- **User**: email, passwordHash, role (ADMIN/CUSTOMER), refreshToken
- **Product**: name, slug, priceCents, type (DIGITAL/PHYSICAL), stock, downloadUrl
- **Category**: name, slug, description, image
- **Coupon**: code, discountType, discountValue, expiresAt, applicableCategories
- **Order**: status, subtotal, discount, total, stripeSessionId
- **OrderItem**: quantity, priceAtPurchase
- **DownloadToken**: token, expiresAt, usedAt (secure download flow)

## Security Features

- **Password hashing**: bcrypt with 12 salt rounds
- **JWT tokens**: 15min access + 7day refresh in httpOnly cookies
- **Zod validation**: All inputs validated
- **Stripe verification**: Webhook signatures verified
- **S3 presigned URLs**: No direct file access, tokenized downloads
- **Rate limiting**: 100 req/min, 10 auth attempts per 15min

## Frontend Features

- **Clash Display** headings for premium feel
- **Dark mode** with system preference detection
- **Responsive** mobile, tablet, desktop
- **Animations**: Framer Motion page transitions, NProgress loading bar
- **Cart**: Persistent storage, coupon application, quantity controls
- **Admin panel**: Dashboard, product/category/coupon/order management

## Building for Production

### Backend build
```bash
cd backend
npm run build
npm start
```

### Frontend build
```bash
cd frontend
npm run build
# Serve dist/ via CDN or nginx
```

## License

MIT

---

Built with ❤️ by Claude Code
