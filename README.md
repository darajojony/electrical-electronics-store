# VoltMart — Electrical & Electronics Store

Bilingual Khmer/English storefront and admin starter using Next.js 15, React 19, TypeScript, Prisma and PostgreSQL.

## Included
- Responsive storefront with language toggle, product discovery and demo cart
- Admin login with bcrypt password verification and signed httpOnly session cookie
- Admin dashboard summary and product/stock listing
- Product create, update and soft-archive API routes
- Category, user, product, order and order-item database models
- Seed script for 7 categories and first Super Admin

## Local setup
Requirements: Node.js 20.9+, PostgreSQL and npm.

1. Clone this repository and run npm install.
2. Copy .env.example to .env and set real values.
3. Generate a random AUTH_SECRET with at least 32 characters. Set ADMIN_PASSWORD to a unique password of at least 12 characters.
4. Create a PostgreSQL database and configure DATABASE_URL.
5. Run npx prisma generate.
6. Run npx prisma migrate dev --name init.
7. Run npm run db:seed.
8. Start with npm run dev and visit http://localhost:3000/admin/login.

## Environment variables
- DATABASE_URL: PostgreSQL connection string
- AUTH_SECRET: random secret (32+ characters)
- ADMIN_EMAIL: initial admin email
- ADMIN_PASSWORD: initial admin password (12+ characters)

Never commit .env, production secrets, or real credentials.

## Admin/API
- POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
- GET /api/products, protected POST /api/products
- Protected PATCH /api/products/:id and DELETE /api/products/:id (soft archive)
- GET /api/categories
- Protected GET /api/admin/summary

## Important limitations before production
- Configure a managed PostgreSQL instance and environment secrets before first run.
- The public homepage still uses sample product data; connect it to GET /api/products for live catalog data.
- Checkout, order creation, payment providers, delivery, image uploads, email/SMS notifications, audit logs, CSRF/rate limiting and staff permission granularity are not yet implemented.
- Initial admin seed requires server-side environment variables and must not be run with placeholder credentials.
- Before public launch, add rate limits, login lockout, CSRF/origin protection, validation library, backups and a security review.
