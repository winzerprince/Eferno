# Project Setup & Database Configuration

**Date:** November 5, 2025  
**Status:** ✅ Completed

## Overview

This document summarizes the Vite migration, package installation, Tailwind setup, and Supabase database configuration with product data seeding.

## 1. Migration from CRA to Vite

### Changes Made

- Installed Vite and @vitejs/plugin-react
- Created `vite.config.ts` with React plugin configuration
- Moved and updated `index.html` to project root with Vite script tag
- Updated `package.json` scripts to use Vite commands
- Updated `tsconfig.json` for Vite compatibility
- Created `tsconfig.node.json` for Vite config
- Created `src/vite-env.d.ts` for environment variable types

### New Scripts

```json
{
  "dev": "vite",
  "start": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

## 2. Package Installation

### Production Dependencies

- `react-router-dom` - Client-side routing
- `@headlessui/react` - Accessible UI components (popover)
- `@google/generative-ai` - Gemini AI SDK
- `@supabase/supabase-js` - Supabase client
- `react-lazy-load-image-component` - Lazy image loading
- `react-markdown` - Markdown rendering for chat
- `remark-gfm` - GitHub Flavored Markdown support

### Dev Dependencies

- `vite` + `@vitejs/plugin-react` - Build tool
- `tailwindcss` + `postcss` + `autoprefixer` - CSS framework
- `@faker-js/faker` - Fake data generation
- `@types/react-lazy-load-image-component` - TypeScript types

## 3. Tailwind CSS Configuration

### Files Created

- `tailwind.config.js` - Tailwind configuration with dark mode support
- `postcss.config.js` - PostCSS configuration
- Updated `src/index.css` with Tailwind directives

### Dark Mode

Configured with `darkMode: 'class'` for manual toggle support.

### Custom Theme

- Added primary color palette (blue shades)
- Ready for mobile-first responsive design

## 4. Supabase Database Setup

### Products Table Schema

Created via Supabase MCP migration:

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price > 0),
  rating NUMERIC NOT NULL CHECK (rating >= 0 AND rating <= 5),
  description TEXT NOT NULL,
  income_bracket TEXT NOT NULL CHECK (income_bracket IN ('low', 'mid', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes

- `idx_products_category` - Fast category filtering
- `idx_products_price` - Fast price filtering
- `idx_products_income_bracket` - Fast income bracket filtering

### Row Level Security (RLS)

- **Read access**: Public (anon + authenticated)
- **Insert access**: Public (for seeding script)

## 5. Product Data Generation & Seeding

### Seed Script

Created `scripts/seed-products.js` that:

- Generates 1200 fake products (100 per category)
- Uses @faker-js/faker for realistic data
- Targets 3 income brackets (low, mid, high)
- Uses Unsplash for product images
- Inserts in batches of 100 for efficiency

### Categories (12 total)

1. computer
2. phone
3. bag
4. bottle
5. shoes
6. watch
7. laptop
8. headphone
9. jacket
10. sunglasses
11. keyboard
12. mouse

### Pricing Strategy

Prices are in UGX (Uganda Shillings) with ranges based on:
- **Income bracket** (low/mid/high)
- **Category multiplier** (e.g., laptops cost more than bottles)

Example ranges:
- Low income: 50K - 300K UGX (×category multiplier)
- Mid income: 300K - 1M UGX (×category multiplier)
- High income: 1M - 5M UGX (×category multiplier)

### Database Statistics

```
Total products: 1200
Products per category: 100
Average rating: ~3.7-3.9 stars
Price range: 27K - 14.7M UGX
```

### Running the Seed Script

```bash
npm run seed
```

## Next Steps

1. ✅ Vite setup complete
2. ✅ Packages installed
3. ✅ Tailwind configured
4. ✅ Database created and seeded
5. ⏭️ Extract Figma design for UI
6. ⏭️ Build core UI structure
7. ⏭️ Implement Shop tab
8. ⏭️ Implement Chat tab with AI
9. ⏭️ Implement product popover
10. ⏭️ Polish and deploy

## Files Created/Modified

### New Files
- `vite.config.ts`
- `tsconfig.node.json`
- `src/vite-env.d.ts`
- `tailwind.config.js`
- `postcss.config.js`
- `index.html` (moved to root)
- `scripts/seed-products.js`

### Modified Files
- `package.json` (scripts, dependencies)
- `tsconfig.json` (Vite compatibility)
- `src/index.css` (Tailwind directives)
- `.env` (verified all variables)

## Database Migrations

1. `create_products_table` - Initial table with RLS
2. `update_products_rls_policy` - Allow anon inserts for seeding
