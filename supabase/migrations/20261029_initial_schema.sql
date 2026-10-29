-- Supabase Migration: Initial Schema for Hardware Shop Website
-- Created: 2026-10-29

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category slug and sort order
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    description TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    size TEXT,
    unit TEXT DEFAULT 'piece',
    pack_details TEXT,
    price NUMERIC(12, 2) DEFAULT NULL,
    is_price_visible BOOLEAN DEFAULT false,
    availability_status TEXT DEFAULT 'available_to_order' CHECK (availability_status IN ('in_stock', 'out_of_stock', 'on_order', 'available_to_order')),
    image_urls TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin(to_tsvector('english', name || ' ' || coalesce(brand, '') || ' ' || coalesce(description, '')));

-- 3. Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    enquiry_type TEXT DEFAULT 'general' CHECK (enquiry_type IN ('product', 'bulk', 'general')),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    requested_products TEXT,
    requested_quantity TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'closed')),
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for enquiries
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);

-- 4. Business Settings Table
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_name TEXT NOT NULL DEFAULT 'Bombay Tools Agency',
    tagline TEXT DEFAULT 'Quality Hardware, Tools & Building Materials',
    phone TEXT,
    whatsapp_number TEXT,
    email TEXT,
    address TEXT,
    opening_hours TEXT,
    google_maps_url TEXT DEFAULT 'https://maps.app.goo.gl/zrJSTZ6aXR7ATsrTA?g_st=aw',
    logo_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_slug ON public.faqs(slug);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_is_published ON public.faqs(is_published);

-- Trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enquiries_updated_at
BEFORE UPDATE ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_settings_updated_at
BEFORE UPDATE ON public.business_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Categories RLS
-- Public can read active categories
CREATE POLICY "Public can view active categories"
ON public.categories FOR SELECT
USING (is_active = true OR auth.role() = 'authenticated');

-- Authenticated users (admin) can insert, update, delete categories
CREATE POLICY "Admins have full category access"
ON public.categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Products RLS
-- Public can read active products
CREATE POLICY "Public can view active products"
ON public.products FOR SELECT
USING (is_active = true OR auth.role() = 'authenticated');

-- Authenticated users (admin) can insert, update, delete products
CREATE POLICY "Admins have full product access"
ON public.products FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Enquiries RLS
-- Anyone can insert an enquiry (public submission)
CREATE POLICY "Public can submit enquiries"
ON public.enquiries FOR INSERT
WITH CHECK (
    customer_name IS NOT NULL AND 
    length(customer_name) >= 2 AND 
    phone IS NOT NULL AND 
    length(phone) >= 10
);

-- Only authenticated admins can read, update, delete enquiries
CREATE POLICY "Only admins can view enquiries"
ON public.enquiries FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can update enquiries"
ON public.enquiries FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Only admins can delete enquiries"
ON public.enquiries FOR DELETE
TO authenticated
USING (true);

-- Business Settings RLS
-- Public can read business settings
CREATE POLICY "Public can view business settings"
ON public.business_settings FOR SELECT
USING (true);

-- Only authenticated admins can update business settings
CREATE POLICY "Admins can update business settings"
ON public.business_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- FAQs RLS
-- Public can read published FAQs
CREATE POLICY "Public can view published FAQs"
ON public.faqs FOR SELECT
USING (is_published = true OR auth.role() = 'authenticated');

-- Admins have full access to FAQs
CREATE POLICY "Admins have full FAQ access"
ON public.faqs FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Storage bucket creation for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for products bucket
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Admins can update/delete product images"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

