# Prostore - Modern E-Commerce Platform

A full-stack e-commerce application built with Next.js 16, featuring product browsing, shopping cart, user authentication, order management, admin dashboard, and more.

## 🚀 Features

- **Product Management**
  - Product listings with detailed views
  - Category filtering and search
  - Product image carousel
  - Stock management
  - Featured products & deals banner
  - Slug-based dynamic routing

- **Shopping Cart**
  - Add/remove items
  - Quantity adjustment
  - Real-time price calculations
  - Persistent cart with session management
  - Cart merging on sign-in

- **User Authentication**
  - Sign up / Sign in / Sign out
  - JWT-based sessions
  - Role-based access control (user / admin)
  - Protected routes via middleware

- **Checkout Process**
  - Shipping address management
  - Payment method selection
  - Order summary & place order
  - Order history per user

- **Reviews**
  - Authenticated users can write reviews
  - Star ratings (1–5)
  - Create or update existing review
  - Average rating calculated automatically

- **Admin Dashboard**
  - Overview with sales charts (Recharts)
  - Product CRUD with image uploads (UploadThing)
  - Order management
  - User management

- **Email**
  - Purchase receipt emails via Resend
  - React Email templates

- **UI/UX**
  - Responsive design (mobile + desktop)
  - Dark / Light mode toggle
  - Toast notifications (Sonner)
  - Loading states & skeletons
  - Shadcn UI + Radix UI components

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| Runtime | React 19 |
| Language | TypeScript 5 |
| Authentication | NextAuth v5 (Auth.js) |
| Database | PostgreSQL (Neon serverless) |
| ORM | Prisma 7 |
| Styling | Tailwind CSS 4 |
| UI Components | Shadcn UI + Radix UI |
| Forms | React Hook Form + Zod 4 |
| Charts | Recharts |
| File Uploads | UploadThing |
| Email | Resend + React Email |
| Icons | Lucide React |
| Notifications | Sonner |
| Theme | next-themes |
| Carousel | Embla Carousel |

---

## 📋 Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun
- PostgreSQL database ([Neon](https://neon.tech) recommended)
- [UploadThing](https://uploadthing.com) account (for image uploads)
- [Resend](https://resend.com) account (for emails)

---

## 🔧 Installation

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd prostore
    ```

2. **Install dependencies**

    ```bash
    npm install --legacy-peer-deps
    ```

3. **Set up environment variables**

    Create a `.env` file in the root directory:

    ```env
    # App
    NEXT_PUBLIC_APP_NAME="Prostore"
    NEXT_PUBLIC_APP_DESCRIPTION="Modern e-commerce platform"
    NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

    # Database (Neon PostgreSQL)
    DATABASE_URL="your-postgresql-connection-string"

    # Authentication (NextAuth)
    NEXTAUTH_SECRET="your-secret-key-here"
    NEXTAUTH_URL="http://localhost:3000"

    # File Uploads (UploadThing)
    UPLOADTHING_TOKEN="your-uploadthing-token"

    # Email (Resend)
    RESEND_API_KEY="your-resend-api-key"
    SENDER_EMAIL="onboarding@resend.dev"
    ```

    Generate a secret for `NEXTAUTH_SECRET`:

    ```bash
    openssl rand -base64 32
    ```

4. **Set up the database**

    ```bash
    # Generate Prisma client
    npx prisma generate

    # Run migrations
    npx prisma migrate deploy

    # Seed the database (optional)
    npx tsx db/seed.ts
    ```

5. **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
prostore/
├── app/
│   ├── (root)/                 # Customer-facing routes
│   │   ├── page.tsx            # Home page
│   │   ├── cart/               # Shopping cart
│   │   ├── product/[slug]/     # Product detail + reviews
│   │   ├── search/             # Search results
│   │   ├── shipping-address/   # Checkout: shipping
│   │   ├── payment-method/     # Checkout: payment
│   │   ├── place-order/        # Checkout: review & place
│   │   └── order/[id]/         # Order detail
│   ├── (auth)/                 # Auth routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── admin/                  # Admin dashboard
│   │   ├── overview/           # Sales charts & stats
│   │   ├── products/           # Product management
│   │   ├── orders/             # Order management
│   │   └── users/              # User management
│   ├── user/                   # User account
│   │   ├── profile/
│   │   └── orders/
│   └── api/
│       ├── auth/               # NextAuth API
│       └── uploadthing/        # UploadThing API
├── components/
│   ├── ui/                     # Shadcn UI primitives
│   ├── shared/                 # Shared layout components
│   │   ├── header/             # Header, Search, Menu
│   │   ├── product/            # Product cards, ratings
│   │   └── admin/              # Admin-specific components
│   └── product/                # Product images, price
├── lib/
│   ├── actions/                # Server Actions
│   │   ├── product.actions.ts
│   │   ├── cart.actions.ts
│   │   ├── order.actions.ts
│   │   ├── review.actions.ts
│   │   └── user.actions.ts
│   ├── constants/              # App-wide constants
│   ├── validators.ts           # Zod schemas
│   └── utils.ts                # Helper functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/
├── db/
│   ├── prisma.ts               # Prisma client (with extensions)
│   ├── seed.ts                 # Database seeder
│   └── sample-data.ts          # Sample seed data
├── email/                      # React Email templates
├── types/                      # TypeScript type definitions
└── middleware.ts               # Route protection middleware
```

---

## 🗄️ Database Schema

| Model | Description |
|---|---|
| `Product` | Product info, pricing, stock, ratings |
| `User` | User accounts, roles |
| `Cart` | Shopping cart with `CartItem` |
| `Order` | Placed orders with `OrderItem` |
| `Review` | Product reviews with ratings |
| `Session` | NextAuth sessions |
| `Account` | OAuth account linking |

---

## 🔐 Authentication

- **Provider:** Credentials (email + password)
- **Sessions:** JWT strategy
- **Adapter:** Prisma (persists sessions to DB)
- **Password hashing:** bcrypt-ts-edge
- **Route protection:** `middleware.ts` + `auth-guard.ts`
- **Admin access:** role-based (`user` | `admin`)

---

## 📦 Available Scripts

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Run Prettier + ESLint fix
npm run email        # Preview email templates (port 3001)
npx prisma studio    # Visual database browser
npx prisma migrate dev --name <name>  # Create a new migration
npx tsx db/seed.ts   # Seed the database
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy

### Required Production Environment Variables

```env
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_APP_DESCRIPTION=
NEXT_PUBLIC_SERVER_URL=          # Your production URL
DATABASE_URL=                    # Production DB connection string
NEXTAUTH_SECRET=                 # New secret (openssl rand -base64 32)
NEXTAUTH_URL=                    # Your production URL
UPLOADTHING_TOKEN=
RESEND_API_KEY=
SENDER_EMAIL=
```

---

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Auth.js (NextAuth) Documentation](https://authjs.dev)
- [Shadcn UI](https://ui.shadcn.com)
- [UploadThing](https://docs.uploadthing.com)
- [Resend](https://resend.com/docs)
- [Neon](https://neon.tech/docs)

---

## 📄 License

This project is for educational purposes.


## 🚀 Features

- **Product Management**
    - Product listings with detailed views
    - Product images and descriptions
    - Stock management
    - Featured products

- **Shopping Cart**
    - Add/remove items
    - Quantity adjustment
    - Real-time price calculations
    - Persistent cart with session management

- **User Authentication**
    - Sign up / Sign in / Sign out
    - JWT-based sessions
    - Role-based access control
    - Protected routes

- **Checkout Process**
    - Shipping address management
    - Order summary
    - Secure checkout flow

- **UI/UX**
    - Responsive design
    - Dark/Light mode toggle
    - Toast notifications
    - Loading states
    - Shadcn UI components

## 🛠️ Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Runtime:** React 19
- **Authentication:** NextAuth v5
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI + Radix UI
- **Form Management:** React Hook Form + Zod
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Theme:** next-themes

## 📋 Prerequisites

- Node.js 18+
- npm/yarn/pnpm/bun
- PostgreSQL database (Neon recommended)

## 🔧 Installation

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd prostore
    ```

2. **Install dependencies**

    ```bash
    npm install --legacy-peer-deps
    ```

3. **Set up environment variables**

    Create a `.env` file in the root directory:

    ```env
    # App Configuration
    NEXT_PUBLIC_APP_NAME="Prostore"
    NEXT_PUBLIC_APP_DESCRIPTION="Modern e-commerce platform"
    NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

    # Database
    DATABASE_URL="your-postgresql-connection-string"

    # Authentication (NextAuth)
    NEXTAUTH_SECRET="your-secret-key-here"
    NEXTAUTH_URL="http://localhost:3000"
    ```

    Generate a secret for `NEXTAUTH_SECRET`:

    ```bash
    openssl rand -base64 32
    ```

4. **Set up the database**

    ```bash
    # Generate Prisma client
    npx prisma generate

    # Run migrations
    npx prisma migrate deploy

    # Seed the database (optional)
    npx tsx db/seed.ts
    ```

5. **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
prostore/
├── app/                    # Next.js App Router
│   ├── (root)/            # Main app routes
│   │   ├── page.tsx       # Home page
│   │   ├── cart/          # Shopping cart
│   │   ├── product/       # Product pages
│   │   └── shipping-address/ # Checkout flow
│   ├── (auth)/            # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── shared/           # Shared components
│   └── product/          # Product-specific components
├── lib/                  # Utility functions
│   ├── actions/         # Server actions
│   ├── constants/       # App constants
│   └── validator.ts     # Zod schemas
├── prisma/              # Prisma schema & migrations
├── db/                  # Database utilities
├── types/               # TypeScript types
└── middleware.ts        # Next.js middleware
```

## 🗄️ Database Schema

Key models:

- **Product:** Product information, pricing, stock
- **User:** User accounts and authentication
- **Cart:** Shopping cart with items
- **Session:** NextAuth sessions
- **Account:** OAuth account linking

## 🔐 Authentication

The app uses NextAuth v5 with:

- Credentials provider for email/password
- JWT sessions
- Prisma adapter for database persistence
- Session cart merging on sign-in

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
    - `DATABASE_URL`
    - `NEXTAUTH_SECRET` (generate a new one for production)
    - `NEXTAUTH_URL` (your production URL)
    - `NEXT_PUBLIC_*` variables

4. Deploy!

### Environment Variables for Production

- Generate a new `NEXTAUTH_SECRET` for production
- Update `NEXTAUTH_URL` to your production domain
- Update `NEXT_PUBLIC_SERVER_URL` to your production URL
- Ensure `DATABASE_URL` points to your production database

## 🧪 Development Tools

- **Prisma Studio:** `npx prisma studio` - Visual database browser
- **Turbopack:** Fast development builds with Next.js 16
- **TypeScript:** Full type safety

## 📝 Key Features Implementation

### Shopping Cart

- Server-side cart management with Prisma
- Session-based cart for anonymous users
- Automatic cart merging on user sign-in
- Real-time cart updates

### Product Management

- Dynamic product pages with slug-based routing
- Image optimization with Next.js Image
- Stock validation
- Price calculations

### Authentication Flow

- Protected routes with middleware
- Session management
- Password hashing with bcrypt
- Automatic name generation from email

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is for educational purposes.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Shadcn UI](https://ui.shadcn.com)
