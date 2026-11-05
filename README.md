# Harbor — Product Catalog App

A Nuxt 4 full-stack product catalog with PostgreSQL and GraphQL (GraphQL Yoga).  
Browse products, filter/sort/paginate the catalog, and open product detail pages by slug.

Prices are stored and returned in **paise** (INR × 100) and formatted as rupees in the UI.

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Framework | [Nuxt 4](https://nuxt.com/) + Vue 3 |
| API | [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) at `/api/graphql` |
| Database | PostgreSQL via [`pg`](https://node-postgres.com/) connection pool |
| State | Pinia (`@pinia/nuxt`) — available; catalog filters use the URL |
| Language | TypeScript (strict) |

---

## Features

- Landing page with featured / newest products
- Full catalog with:
  - Search (name + description)
  - Category filter
  - Min / max price filter (₹)
  - Sort: newest, price asc/desc, name A–Z
  - Pagination (default 12 per page, max 50)
- Product detail page by slug (`/products/:slug`) with variant selection
- Shareable catalog filters via URL query params
- Single GraphQL API for list, detail, and categories

---

## Prerequisites

- Node.js 20+ (recommended)
- A running PostgreSQL database with the catalog schema and seed data
- `DATABASE_URL` connection string

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Create a `.env` file in the project root:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME
```

`.env` is gitignored. Do not commit credentials.

### 3. Database expectations

The app expects these tables (names used by the service layer):

| Table | Purpose |
|--------|---------|
| `categories` | `id`, `name`, `slug` |
| `products` | `id`, `name`, `slug`, `description`, `featured`, `category_id`, `created_at` |
| `product_variants` | `id`, `product_id`, `name`, `sku`, `price_paise`, `stock` |
| `product_images` | `id`, `product_id`, `url`, `alt` |

Relations:

- `products.category_id` → `categories.id`
- `product_variants.product_id` → `products.id`
- `product_images.product_id` → `products.id`

### 4. Run locally

```bash
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

### 5. Quick DB sanity check

With the dev server running:

```bash
curl http://localhost:3000/api/db-test
```

Example response:

```json
{
  "database": "product_catalog",
  "product_count": 52
}
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Nuxt dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run generate` | Static generation (if used) |

---

## Project structure

```text
product-checkout-app/
├── app/
│   ├── app.vue                 # App shell + global styles
│   ├── layouts/default.vue     # Default layout (header/footer)
│   ├── pages/
│   │   ├── index.vue           # Landing / featured products
│   │   └── products/
│   │       ├── index.vue       # Catalog (filters + grid)
│   │       └── [slug].vue      # Product detail
│   └── components/
│       ├── AppHeader.vue
│       ├── AppFooter.vue
│       ├── ProductCard.vue
│       └── catalog/
│           ├── CatalogFilters.vue
│           ├── CatalogSort.vue
│           └── CatalogPagination.vue
├── composables/
│   └── useCatalogFilters.ts    # URL ↔ filter state
├── graphql/
│   └── quries.ts               # Client GraphQL documents
├── server/
│   ├── api/
│   │   ├── graphql.ts          # Yoga GraphQL endpoint
│   │   └── db-test.ts          # DB connectivity check
│   ├── graphql/
│   │   ├── schema.ts           # GraphQL typeDefs
│   │   └── resolver.ts         # Query resolvers
│   ├── services/
│   │   └── catelog.service.ts  # Catalog SQL (list + by slug)
│   └── utils/
│       ├── db.ts               # pg Pool
│       └── graphql.ts          # Client helper ($fetch → /api/graphql)
├── types/product.ts            # Legacy / unused mock types
├── data/product.ts             # Legacy mock data (not used by live API)
├── nuxt.config.ts
└── package.json
```

> **Nuxt 4 note:** Pages, layouts, and components live under `app/`.  
> Components use `pathPrefix: false` so names stay `CatalogFilters` / `ProductCard` (not `CatalogCatalogFilters`).

---

## Routes

| Path | Page | Data source |
|------|------|-------------|
| `/` | Landing | `products` (newest, limit 4) |
| `/products` | Catalog | `products` + `categories` |
| `/products/:slug` | Detail | `product(slug)` |

---

## Architecture overview

```text
Browser / SSR (Vue pages)
        │
        │  graphqlRequest(query, variables)
        ▼
  POST /api/graphql   (GraphQL Yoga)
        │
        ├─ schema (typeDefs)     → validates query shape
        ├─ resolvers             → maps Query fields → services / SQL
        └─ catalog service / pg  → PostgreSQL
        │
        ▼
   { data: { ... } }  → useAsyncData → UI
```

Live catalog data always comes from Postgres through GraphQL.  
`data/product.ts` is leftover mock data and is **not** used by the current pages.

---

## GraphQL API

### Endpoint

- **URL:** `POST /api/graphql`
- **Body:** `{ "query": "...", "variables": { ... } }`
- **Success:** `{ "data": { ... } }`
- **Failure:** `{ "errors": [{ "message": "..." }] }` (client helper throws)

### Schema (`server/graphql/schema.ts`)

**Types**

- `Category` — `id`, `name`, `slug`
- `ProductVariant` — `id`, `name`, `sku`, `pricePaise`, `stock`
- `ProductImage` — `id`, `url`, `alt`
- `Product` — product fields + nested `category`, `variants`, `images`
- `ProductPage` — `items`, `total`, `page`, `limit`, `totalPages`

**Queries**

| Query | Arguments | Returns |
|--------|-----------|---------|
| `products` | `search`, `category`, `sort`, `page`, `limit`, `minPrice`, `maxPrice` | `ProductPage!` |
| `product` | `slug: String!` | `Product` (nullable) |
| `categories` | — | `[Category!]!` |

### Resolvers (`server/graphql/resolver.ts`)

| Field | Implementation |
|--------|----------------|
| `products` | `getCatalog(args)` |
| `product` | `getProductBySlug(slug)` — direct SQL by slug |
| `categories` | `SELECT id, name, slug FROM categories ORDER BY name` |

### Client documents (`graphql/quries.ts`)

| Export | Used for |
|--------|----------|
| `PRODUCTS_QUERY` | Landing + catalog list |
| `CATEGORIES_QUERY` | Catalog filter dropdown |
| `PRODUCT_QUERY` | Product detail page |

### Client helper (`server/utils/graphql.ts`)

```ts
graphqlRequest<T>(query, variables) → T   // returns response.data
```

Pages call it inside `useAsyncData` so data works on SSR and client navigations.

### Example: list products

```bash
curl -X POST http://localhost:3000/api/graphql \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query($page: Int, $limit: Int) { products(page: $page, limit: $limit) { total items { id name slug } } }",
    "variables": { "page": 1, "limit": 3 }
  }'
```

### Example: product by slug

```bash
curl -X POST http://localhost:3000/api/graphql \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query($slug: String!) { product(slug: $slug) { id name slug variants { name pricePaise stock } } }",
    "variables": { "slug": "smart-watch" }
  }'
```

---

## How data is loaded from the database

### Connection (`server/utils/db.ts`)

- Reads `process.env.DATABASE_URL`
- Creates a shared `pg.Pool` (max 10 connections)
- Throws at import time if `DATABASE_URL` is missing

### Catalog list — `getCatalog`

1. Normalize pagination (`page ≥ 1`, `1 ≤ limit ≤ 50`)
2. Build parameterized `WHERE`:
   - `search` → `ILIKE` on `name` / `description`
   - `category` → `categories.slug`
   - `minPrice` / `maxPrice` → variant `price_paise` (rupees × 100)
3. Run `COUNT(*)` for totals
4. Select page of products (join categories, compute `min_price` for sorting)
5. For each product, load variants + images (`mapProduct`)
6. Return `{ items, total, page, limit, totalPages }`

**Sort options**

| Value | Order |
|--------|--------|
| `newest` (default) | `created_at DESC` |
| `price-asc` | lowest variant price ascending |
| `price-desc` | lowest variant price descending |
| `name-asc` | product name A–Z |

### Product detail — `getProductBySlug`

1. `SELECT` product + category `WHERE p.slug = $1`
2. If none → `null` (UI shows 404)
3. Else → same `mapProduct` shape as the list (variants + images)

### Categories

Simple ordered select used for the filter sidebar.

---

## Frontend data flow (catalog)

1. `useCatalogFilters()` reads/writes URL query:
   - `search`, `category`, `sort`, `page`, `limit`, `minPrice`, `maxPrice`
2. Page builds GraphQL variables from those filters
3. `useAsyncData('catalog-products', …, { watch: [requestVariables] })` refetches when filters change
4. Categories load once via `CATEGORIES_QUERY`
5. UI renders:
   - `CatalogFilters` / `CatalogSort` / `CatalogPagination`
   - `ProductCard` grid

Changing a filter updates the URL (shareable), then GraphQL refetches.

---

## Money format

| Layer | Unit |
|--------|------|
| Database column | `price_paise` (integer) |
| GraphQL field | `pricePaise` |
| UI | `pricePaise / 100` formatted with `en-IN` + `INR` |

Filter inputs use rupees; the service converts to paise before SQL (`* 100`).

---

## Configuration notes (`nuxt.config.ts`)

- Module: `@pinia/nuxt`
- Components: `{ path: '~/components', pathPrefix: false }`
- TypeScript: `strict: true`
- Devtools enabled

---

## Known limitations / follow-ups

- Catalog list still loads variants/images **per product** (N+1 style). Fine for small pages; consider batch/`json_agg` later.
- Price min/max use separate `EXISTS` checks (different variants can satisfy each bound).
- Filename typos remain: `catelog.service.ts`, `quries.ts`.
- `data/product.ts` and older `types/product.ts` shapes are legacy and unused by the live GraphQL path.
- Checkout / cart is not implemented yet (catalog + detail only).

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| App crashes on boot | Missing `DATABASE_URL` in `.env` |
| Empty catalog / errors in UI | DB down, wrong DB, or empty tables — hit `/api/db-test` |
| Components missing / only page text | Components must live under `app/components/` (Nuxt 4) |
| Product 404 | Slug not in DB, or GraphQL returned `product: null` |
| GraphQL errors in network tab | Check Yoga response `errors` array and server logs |

---

## License

Private project (`"private": true` in `package.json`).
