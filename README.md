# Hardware & Building Materials Store — Web Platform

Production-ready web platform for a retail and commercial hardware store in Tamil Nadu, India. Built with React, TypeScript (strict mode), Vite, Tailwind CSS, Lucide icons, and Supabase PostgreSQL with Row Level Security (RLS).

---

## 1. Features Overview

### Public Website
- **Homepage (`/`)**: High-impact industrial hero section, categories grid, verified products showcase, contractor/builder procurement CTA, interactive verified Google Maps counter information, and FAQ snippets.
- **Product Catalog (`/products`)**: Instant keyword search, category filtering, brand filtering, sorting (Featured, Name A-Z, Name Z-A, Newest), pagination, and empty/loading states.
- **Product Details (`/products/:slug`)**: Multi-angle image preview, technical parameters table, verified price display (or "Contact for Price" when unpriced), stock availability badge, prefilled WhatsApp enquiry CTA, project quotation button, shareable link copy, and related products.
- **Material Categories (`/categories`, `/categories/:slug`)**: Preconfigured for:
  1. Electrical Materials
  2. Hardware and Fasteners
  3. Plumbing Materials
  4. Construction Materials
  5. Bathware and Sanitaryware
  6. Tools and Accessories
  7. Pumps and Related Equipment
- **Brand Pages (`/brands`, `/brands/:slug`)**: Genuine brand directory (Bosch, Finolex, Ashirvad, Godrej, Havells, Supreme, Jaquar, Crompton, Dr. Fixit).
- **Bulk Orders & Quotations (`/bulk-orders`)**: Comprehensive BOQ submission form with WhatsApp prefilled option and database recording.
- **Help & FAQs (`/faq`, `/faq/:slug`)**: Direct, searchable answers for pricing, availability, delivery, and store operations, linked to relevant pages.
- **Contact & Location (`/contact`)**: Store hours, verified Google Maps link, turn-by-turn navigation, click-to-call, WhatsApp counter chat, and enquiry form.
- **Bilingual Support (English & தமிழ்)**: Instant UI toggle between English and Tamil with browser memory persistence.
- **SEO & Discovery**: Dynamic OpenGraph tags, JSON-LD structured data (`HardwareStore`, `Product`, `BreadcrumbList`, `FAQPage`), `robots.txt`, and `llms.txt`.

### Administrator Portal (`/admin`)
- **Overview**: Real-time stats calculated from live records (active products, total categories, pending enquiries, recent activity).
- **Product Management**: Full CRUD, specifications key-value editor, image URLs, pricing visibility, availability selector (`in_stock`, `out_of_stock`, `on_order`, `available_to_order`), and direct preview.
- **Category Management**: Create, edit, reorder (`sort_order`), deactivate, and deletion safeguard (blocks deletion if products are currently assigned).
- **Enquiry Management**: Filter by status (`new`, `contacted`, `quoted`, `closed`), search, private administrator notes editor, click-to-call, and click-to-WhatsApp.
- **Business Settings**: Live updates to Shop Name, Tagline, Phone, WhatsApp number, Address, Store Hours, and Google Maps URL.
- **FAQ Management**: Publish/unpublish toggle, ordering, SEO slugs, and answer content editor.
- **SEO Audit & Social Preview**: Real-time OpenGraph preview card, detection of thin descriptions, duplicate slug checks, and schema status.

---

## 2. Technology Stack

- **Frontend**: React 18, TypeScript (strict mode), Vite 6, Tailwind CSS 3, React Router v6, Lucide React icons
- **Backend & Data**: Supabase PostgreSQL with Row Level Security (RLS), Supabase Auth, Storage bucket policies, and local offline fallback mode
- **Testing**: Vitest, React Testing Library, JSDOM

---

## 3. Getting Started & Local Setup

### Prerequisites
- Node.js (v18 or higher recommended; v22 tested)
- npm (v9 or higher)

### Installation
```bash
# Clone or navigate to the repository
cd "d:\Bombay tools agency"

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 4. Supabase Setup & Database Migrations

### Step 1: Create Supabase Project
1. Create a project at [supabase.com](https://supabase.com).
2. Note your **Project URL** and **anon public API key** under *Project Settings -> API*.

### Step 2: Apply Migrations
1. Open the Supabase **SQL Editor**.
2. Run the migration script located at:
   ```
   supabase/migrations/20261029_initial_schema.sql
   ```
   This creates:
   - Tables: `categories`, `products`, `enquiries`, `business_settings`, `faqs`
   - Constraints, foreign keys, triggers for `updated_at`, and GIN indexes
   - Row Level Security (RLS) policies
   - Storage bucket `products` with public read and authenticated write access

3. Run the initial seed script:
   ```
   supabase/seed.sql
   ```

### Step 3: Configure `.env`
Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

VITE_SHOP_NAME=Bombay Tools Agency
VITE_WHATSAPP_NUMBER=+919876543210
VITE_PHONE_NUMBER=+919876543210
VITE_GOOGLE_MAPS_URL=https://maps.app.goo.gl/zrJSTZ6aXR7ATsrTA?g_st=aw
VITE_SITE_URL=https://example.com
```

> **Offline / Local Fallback**: When Supabase credentials are not provided or in development mode, the application automatically uses safe, realistic seed data with local browser storage persistence. You can test all customer flows and administrator actions immediately.

---

## 5. Administrator Provisioning

### In Supabase:
1. Go to **Authentication -> Users** in your Supabase dashboard.
2. Click **Add User** -> **Create User**.
3. Enter administrator email (e.g. `admin@bombaytoolsagency.com`) and a strong password.
4. Auto-confirm user email.
5. Log in at `/admin/login` on your website.

### In Local / Offline Mode:
- Email: `admin@bombaytoolsagency.com`
- Password: `admin123` (or any password with 6+ characters)

---

## 6. Testing

Run automated unit and component tests:
```bash
# Run Vitest test suite
npm test

# Run TypeScript typecheck & production build
npm run build
```

---

## 7. SEO Launch Checklist

- [x] Unique page titles and meta descriptions on all routes
- [x] Canonical link tags pointing to live URLs
- [x] OpenGraph (`og:title`, `og:description`, `og:image`, `og:url`) and Twitter Cards
- [x] `robots.txt` allowing indexing while disallowing `/admin`
- [x] `llms.txt` semantic markdown discovery summary for AI search engines
- [x] Schema.org `HardwareStore` / `LocalBusiness` JSON-LD structured data with Google Maps link
- [x] Schema.org `Product` JSON-LD structured data on single product pages
- [x] Schema.org `BreadcrumbList` JSON-LD structured data on catalog & product pages
- [x] Schema.org `FAQPage` JSON-LD structured data on FAQ pages
- [x] Verified prices only; "Contact for Price" when price is unconfigured
- [x] Zero fabricated reviews or unverified customer ratings

---

## 8. Deployment Guide

### Deploying Frontend to Vercel or Netlify
1. Connect repository to Vercel or Netlify.
2. Build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WHATSAPP_NUMBER`
   - `VITE_PHONE_NUMBER`
   - `VITE_GOOGLE_MAPS_URL`
   - `VITE_SITE_URL`
4. Set Single-Page App (SPA) redirect rule:
   - For Netlify: add a `public/_redirects` file with `/*  /index.html  200`
   - For Vercel: `vercel.json` with rewrite to `/index.html`

---

## 9. External Accounts & Information Needed for Full Live Launch

1. **Physical Address Verification**: Verify exact building number, street name, and postal PIN code in Tamil Nadu before finalizing invoice templates.
2. **Dedicated WhatsApp Business Account**: Register a dedicated business mobile SIM with WhatsApp Business app to receive customer BOQs and enquiries.
3. **Google Business Profile**: Claim and verify the Google Maps location (`https://maps.app.goo.gl/zrJSTZ6aXR7ATsrTA?g_st=aw`) under the official shop name.
4. **GSTIN Registration**: Ensure 15-digit GSTIN is available for commercial invoicing for construction contractors.
