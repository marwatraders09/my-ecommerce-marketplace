# Noura Market

Noura Market is an original multi-vendor marketplace built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Local Setup

1. Install Node.js 20 or newer.
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and set `DATABASE_URL` and an `AUTH_SECRET` of at least 32 characters.
4. Create/update the local database:

```bash
npm run db:generate
npm run db:migrate
```

5. Load fake development data:

```bash
npm run db:seed
```

Seed accounts all use the development-only password `NouraDev!2026Password`:

- `admin@noura.test`
- `seller@noura.test`
- `brand@noura.test`
- `customer@noura.test`

Never use these credentials outside local development.

## Commands

```bash
npm run dev       # development server
npm run lint      # ESLint
npm run build     # production build
npm run start     # production server
npm run db:validate
npm run db:migrate
npm run db:seed
```

## Architecture

- `src/app`: App Router pages and route handlers
- `src/components`: reusable customer, seller, brand, and admin UI
- `src/lib/auth`: sessions, password hashing, authorization
- `src/lib/catalog`: product queries and search
- `src/lib/services`: domain service boundaries
- `src/lib/validation`: Zod request schemas
- `src/lib/payments`, `src/lib/shipping`, `src/lib/storage`: replaceable provider interfaces
- `prisma/schema.prisma`: PostgreSQL data model
- `prisma/seed.ts`: fake local development data

Critical prices, roles, inventory, coupons, order ownership, refunds, and permissions are checked on the server. Payment, shipping, and object storage providers are intentionally abstracted and require real credentials and implementations before production use.

## Deployment

Set all production environment variables in the hosting provider. Run `npm run db:generate` during the build and apply migrations through the deployment process. Do not commit `.env` files, provider secrets, or development credentials.
