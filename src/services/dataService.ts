import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Product, Category, Enquiry, BusinessSettings, FAQ, EnquiryStatus } from '@/types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_FAQS } from '@/data/mockData';
import { DEFAULT_BUSINESS_SETTINGS } from '@/config/business';

// Local Storage Keys for Mock / Offline Persistence
const STORAGE_KEYS = {
  CATEGORIES: 'hw_store_categories',
  PRODUCTS: 'hw_store_products',
  ENQUIRIES: 'hw_store_enquiries',
  SETTINGS: 'hw_store_business_settings',
  FAQS: 'hw_store_faqs',
};

// Helper to get local data with fallback
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to local storage', err);
  }
}

export interface ProductFilterOptions {
  categorySlug?: string;
  brand?: string;
  search?: string;
  featuredOnly?: boolean;
  sortBy?: 'name_asc' | 'name_desc' | 'newest' | 'featured';
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export const DataService = {
  // ---------------- CATEGORIES ----------------
  async getCategories(includeInactive = false): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const filtered = includeInactive ? categories : categories.filter((c) => c.is_active);
    return filtered.sort((a, b) => a.sort_order - b.sort_order);
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }

    const categories = await this.getCategories(true);
    return categories.find((c) => c.slug === slug) || null;
  },

  async adminCreateCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const now = new Date().toISOString();
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').insert(newCategory).select().single();
      if (error) throw error;
      return data;
    }

    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    categories.push(newCategory);
    setLocal(STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  },

  async adminUpdateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');
    const updated = { ...categories[index]!, ...updates, updated_at: now };
    categories[index] = updated;
    setLocal(STORAGE_KEYS.CATEGORIES, categories);
    return updated;
  },

  async adminDeleteCategory(id: string): Promise<void> {
    // Check if category has active products to prevent accidental deletion
    const products = await this.getProducts({ limit: 1000 });
    const hasProducts = products.data.some((p) => p.category_id === id);
    if (hasProducts) {
      throw new Error('Cannot delete category with associated products. Deactivate it or reassign products first.');
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const filtered = categories.filter((c) => c.id !== id);
    setLocal(STORAGE_KEYS.CATEGORIES, filtered);
  },

  // ---------------- PRODUCTS ----------------
  async getProducts(options: ProductFilterOptions = {}): Promise<PaginatedResult<Product>> {
    const {
      categorySlug,
      brand,
      search,
      featuredOnly,
      sortBy = 'featured',
      limit = 24,
      offset = 0,
    } = options;

    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('products').select('*, categories(name, slug)', { count: 'exact' }).eq('is_active', true);

      if (categorySlug) {
        const cat = await this.getCategoryBySlug(categorySlug);
        if (cat) {
          query = query.eq('category_id', cat.id);
        }
      }
      if (brand) {
        query = query.ilike('brand', brand);
      }
      if (featuredOnly) {
        query = query.eq('is_featured', true);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (sortBy === 'name_asc') query = query.order('name', { ascending: true });
      else if (sortBy === 'name_desc') query = query.order('name', { ascending: false });
      else if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
      else query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });

      query = query.range(offset, offset + limit - 1);
      const { data, count, error } = await query;
      if (error) throw error;

      const formatted = (data || []).map((item) => ({
        ...item,
        category_name: item.categories?.name,
        category_slug: item.categories?.slug,
      }));

      return {
        data: formatted,
        total: count || 0,
        limit,
        offset,
      };
    }

    // Local / Offline fallback
    const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const categories = await this.getCategories(true);
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    let filtered = products.filter((p) => p.is_active);

    if (categorySlug) {
      const targetCat = categories.find((c) => c.slug === categorySlug);
      if (targetCat) {
        filtered = filtered.filter((p) => p.category_id === targetCat.id);
      } else {
        filtered = [];
      }
    }

    if (brand) {
      filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (featuredOnly) {
      filtered = filtered.filter((p) => p.is_featured);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'name_asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      // featured
      filtered.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit).map((p) => {
      const cat = categoryMap.get(p.category_id);
      return {
        ...p,
        category_name: cat?.name,
        category_slug: cat?.slug,
      };
    });

    return {
      data: paginated,
      total,
      limit,
      offset,
    };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;
      return {
        ...data,
        category_name: data.categories?.name,
        category_slug: data.categories?.slug,
      };
    }

    const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const product = products.find((p) => p.slug === slug);
    if (!product) return null;

    const categories = await this.getCategories(true);
    const cat = categories.find((c) => c.id === product.category_id);
    return {
      ...product,
      category_name: cat?.name,
      category_slug: cat?.slug,
    };
  },

  async getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
    const res = await this.getProducts({ limit: 10 });
    return res.data
      .filter((p) => p.id !== productId && p.category_id === categoryId)
      .slice(0, limit);
  },

  async getAllBrands(): Promise<string[]> {
    const res = await this.getProducts({ limit: 1000 });
    const brandsSet = new Set<string>();
    res.data.forEach((p) => {
      if (p.brand && p.brand.trim()) {
        brandsSet.add(p.brand.trim());
      }
    });
    return Array.from(brandsSet).sort();
  },

  async adminCreateProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').insert(newProduct).select().single();
      if (error) throw error;
      return data;
    }

    const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    products.push(newProduct);
    setLocal(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  },

  async adminUpdateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    const updated = { ...products[index]!, ...updates, updated_at: now };
    products[index] = updated;
    setLocal(STORAGE_KEYS.PRODUCTS, products);
    return updated;
  },

  async adminDeleteProduct(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const filtered = products.filter((p) => p.id !== id);
    setLocal(STORAGE_KEYS.PRODUCTS, filtered);
  },

  // ---------------- ENQUIRIES ----------------
  async createEnquiry(
    enquiry: Omit<Enquiry, 'id' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<Enquiry> {
    const now = new Date().toISOString();
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: crypto.randomUUID(),
      status: 'new',
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('enquiries').insert(newEnquiry).select().single();
      if (error) throw error;
      return data;
    }

    const enquiries = getLocal<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    enquiries.unshift(newEnquiry);
    setLocal(STORAGE_KEYS.ENQUIRIES, enquiries);
    return newEnquiry;
  },

  async adminGetEnquiries(filters: { status?: EnquiryStatus; search?: string } = {}): Promise<Enquiry[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.or(`customer_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    let enquiries = getLocal<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    if (filters.status) {
      enquiries = enquiries.filter((e) => e.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      enquiries = enquiries.filter(
        (e) =>
          e.customer_name.toLowerCase().includes(q) ||
          e.phone.includes(q) ||
          (e.message && e.message.toLowerCase().includes(q))
      );
    }
    return enquiries;
  },

  async adminUpdateEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('enquiries')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const enquiries = getLocal<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    const index = enquiries.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Enquiry not found');
    const updated = { ...enquiries[index]!, ...updates, updated_at: now };
    enquiries[index] = updated;
    setLocal(STORAGE_KEYS.ENQUIRIES, enquiries);
    return updated;
  },

  // ---------------- BUSINESS SETTINGS ----------------
  async getBusinessSettings(): Promise<BusinessSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('business_settings').select('*').limit(1).single();
      if (!error && data) return data;
    }

    return getLocal<BusinessSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_BUSINESS_SETTINGS);
  },

  async adminUpdateBusinessSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const now = new Date().toISOString();
    const current = await this.getBusinessSettings();
    const updated = { ...current, ...updates, updated_at: now };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('business_settings')
        .upsert(updated)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    setLocal(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // ---------------- FAQS ----------------
  async getFAQs(options: { category?: string; includeUnpublished?: boolean } = {}): Promise<FAQ[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('faqs').select('*').order('sort_order', { ascending: true });
      if (!options.includeUnpublished) {
        query = query.eq('is_published', true);
      }
      if (options.category) {
        query = query.eq('category', options.category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    const faqs = getLocal<FAQ[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
    let filtered = options.includeUnpublished ? faqs : faqs.filter((f) => f.is_published);
    if (options.category) {
      filtered = filtered.filter((f) => f.category === options.category);
    }
    return filtered.sort((a, b) => a.sort_order - b.sort_order);
  },

  async getFAQBySlug(slug: string): Promise<FAQ | null> {
    const faqs = await this.getFAQs({ includeUnpublished: true });
    return faqs.find((f) => f.slug === slug) || null;
  },

  async adminCreateFAQ(faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>): Promise<FAQ> {
    const now = new Date().toISOString();
    const newFAQ: FAQ = {
      ...faq,
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('faqs').insert(newFAQ).select().single();
      if (error) throw error;
      return data;
    }

    const faqs = getLocal<FAQ[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
    faqs.push(newFAQ);
    setLocal(STORAGE_KEYS.FAQS, faqs);
    return newFAQ;
  },

  async adminUpdateFAQ(id: string, updates: Partial<FAQ>): Promise<FAQ> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('faqs')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const faqs = getLocal<FAQ[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
    const index = faqs.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('FAQ not found');
    const updated = { ...faqs[index]!, ...updates, updated_at: now };
    faqs[index] = updated;
    setLocal(STORAGE_KEYS.FAQS, faqs);
    return updated;
  },

  async adminDeleteFAQ(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    const faqs = getLocal<FAQ[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
    const filtered = faqs.filter((f) => f.id !== id);
    setLocal(STORAGE_KEYS.FAQS, filtered);
  },

  // ---------------- ADMIN STATS ----------------
  async adminGetStats() {
    const productsRes = await this.getProducts({ limit: 1000 });
    const categories = await this.getCategories(true);
    const enquiries = await this.adminGetEnquiries();

    const activeProducts = productsRes.data.filter((p) => p.is_active).length;
    const activeCategories = categories.filter((c) => c.is_active).length;
    const newEnquiries = enquiries.filter((e) => e.status === 'new').length;

    return {
      totalProducts: productsRes.total,
      activeProducts,
      totalCategories: categories.length,
      activeCategories,
      totalEnquiries: enquiries.length,
      newEnquiries,
      recentActivity: enquiries.slice(0, 5),
    };
  },
};

