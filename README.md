# Prostore - Modern E-Commerce Platform

A full-stack e-commerce application built with Next.js 16, featuring product browsing, shopping cart, user authentication, and order management.

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

