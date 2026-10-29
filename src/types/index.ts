export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'on_order' | 'available_to_order';

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category_id: string;
  description: string;
  specifications: Record<string, string>;
  size: string;
  unit: string;
  pack_details: string;
  price: number | null;
  is_price_visible: boolean;
  availability_status: AvailabilityStatus;
  image_urls: string[];
  keywords: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Computed / joined
  category_name?: string;
  category_slug?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export type EnquiryType = 'product' | 'bulk' | 'general';
export type EnquiryStatus = 'new' | 'contacted' | 'quoted' | 'closed';

export interface Enquiry {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  enquiry_type: EnquiryType;
  product_id?: string | null;
  requested_products?: string;
  requested_quantity?: string;
  message?: string;
  status: EnquiryStatus;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  product_name?: string;
}

export interface BusinessSettings {
  id: string;
  shop_name: string;
  tagline: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  opening_hours: string;
  google_maps_url: string;
  logo_url: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  slug: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type Language = 'en' | 'ta';

