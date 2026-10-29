import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  Filter,
  PackageX,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { ProductCard } from '@/components/common/ProductCard';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { useBusiness } from '@/context/BusinessContext';
import { useLanguage } from '@/context/LanguageContext';
import { DataService } from '@/services/dataService';
import { Product, Category } from '@/types';

const ITEMS_PER_PAGE = 12;

export const ProductsPage: React.FC = () => {
  const { settings } = useBusiness();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const currentSearch = searchParams.get('search') || '';
  const currentCategorySlug = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSort = (searchParams.get('sort') as any) || 'featured';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Component state
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Local debounced search input
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Load static filter options (categories, brands)
  useEffect(() => {
    async function loadFilters() {
      try {
        const [cats, brands] = await Promise.all([
          DataService.getCategories(),
          DataService.getAllBrands(),
        ]);
        setCategories(cats);
        setAvailableBrands(brands);
      } catch (err) {
        console.error('Failed to load catalog filter data', err);
      }
    }
    loadFilters();
  }, []);

  // Fetch paginated products based on URL params
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const result = await DataService.getProducts({
          categorySlug: currentCategorySlug || undefined,
          brand: currentBrand || undefined,
          search: currentSearch || undefined,
          sortBy: currentSort,
          limit: ITEMS_PER_PAGE,
          offset,
        });

        setProducts(result.data);
        setTotalCount(result.total);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [currentCategorySlug, currentBrand, currentSearch, currentSort, currentPage]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '') {
        updated.delete(key);
      } else {
        updated.set(key, val);
      }
    });
    // Reset to page 1 whenever filters change, unless page itself is explicitly updated
    if (!('page' in newParams)) {
      updated.set('page', '1');
    }
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || null });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const selectedCategoryName = useMemo(() => {
    if (!currentCategorySlug) return null;
    return categories.find((c) => c.slug === currentCategorySlug)?.name || currentCategorySlug;
  }, [categories, currentCategorySlug]);

  const seoTitle = selectedCategoryName
    ? `${selectedCategoryName} | Hardware & Building Materials Catalog`
    : currentBrand
    ? `${currentBrand} Products | Hardware Catalog`
    : `Product Catalog | ${settings.shop_name}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEOHead
        title={seoTitle}
        description="Browse certified electrical cables, plumbing pipes, hardware fasteners, Bosch power tools, Jaquar bathware, and Crompton water pumps. Quotations available on enquiry."
      />

      <Breadcrumbs
        items={[
          { label: 'Products', path: '/products' },
          ...(selectedCategoryName
            ? [{ label: selectedCategoryName }]
            : currentBrand
            ? [{ label: currentBrand }]
            : []),
        ]}
      />

      {/* Header & Search */}
      <div className="mt-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              {selectedCategoryName || currentBrand || t('nav_products')}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Showing {totalCount} verified hardware & building material items
            </p>
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateFilters({ search: null });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Applied filters bar & Sorting */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-sm"
            >
              <Filter className="w-3.5 h-3.5 mr-1 text-brand-600" />
              Filters
            </button>

            {/* Active filter tags */}
            {(currentCategorySlug || currentBrand || currentSearch) && (
              <>
                {currentCategorySlug && (
                  <span className="inline-flex items-center bg-brand-50 text-brand-700 border border-brand-200 text-xs px-2.5 py-1 rounded-full">
                    Category: {selectedCategoryName}
                    <button
                      type="button"
                      onClick={() => updateFilters({ category: null })}
                      className="ml-1.5 hover:text-brand-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {currentBrand && (
                  <span className="inline-flex items-center bg-slate-100 text-slate-700 border border-slate-300 text-xs px-2.5 py-1 rounded-full">
                    Brand: {currentBrand}
                    <button
                      type="button"
                      onClick={() => updateFilters({ brand: null })}
                      className="ml-1.5 hover:text-slate-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {currentSearch && (
                  <span className="inline-flex items-center bg-slate-100 text-slate-700 border border-slate-300 text-xs px-2.5 py-1 rounded-full">
                    Query: "{currentSearch}"
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        updateFilters({ search: null });
                      }}
                      className="ml-1.5 hover:text-slate-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-brand-600 hover:text-brand-800 font-semibold inline-flex items-center"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  {t('reset_filters')}
                </button>
              </>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium">{t('sort_by')}:</span>
            <select
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-xs"
            >
              <option value="featured">{t('sort_featured')}</option>
              <option value="name_asc">{t('sort_name_asc')}</option>
              <option value="name_desc">{t('sort_name_desc')}</option>
              <option value="newest">{t('sort_newest')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Filters Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-brand-600" />
                Filter Products
              </h2>
              {(currentCategorySlug || currentBrand || currentSearch) && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-brand-600 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
                {t('filter_by_category')}
              </h3>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1 text-sm">
                <button
                  type="button"
                  onClick={() => updateFilters({ category: null })}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                    !currentCategorySlug
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{t('all_categories')}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => updateFilters({ category: cat.slug })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      currentCategorySlug === cat.slug
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
                {t('filter_by_brand')}
              </h3>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1 text-sm">
                <button
                  type="button"
                  onClick={() => updateFilters({ brand: null })}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                    !currentBrand
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{t('all_brands')}</span>
                </button>
                {availableBrands.map((brandName) => (
                  <button
                    key={brandName}
                    type="button"
                    onClick={() => updateFilters({ brand: brandName })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      currentBrand.toLowerCase() === brandName.toLowerCase()
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{brandName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {t('no_products_found')}
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Try adjusting your search terms or clearing selected category and brand filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                {t('reset_filters')}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
                    <span className="font-semibold text-slate-900">{totalPages}</span>
                  </p>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => updateFilters({ page: String(currentPage - 1) })}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => updateFilters({ page: String(currentPage + 1) })}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter Dialog */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-navy-950/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 flex items-center text-sm">
                  <Filter className="w-4 h-4 mr-2 text-brand-600" />
                  Filter Catalog
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                  Category
                </h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      updateFilters({ category: null });
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs ${
                      !currentCategorySlug
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        updateFilters({ category: cat.slug });
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs ${
                        currentCategorySlug === cat.slug
                          ? 'bg-brand-50 text-brand-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Brands */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                  Brand
                </h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      updateFilters({ brand: null });
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs ${
                      !currentBrand
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Brands
                  </button>
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => {
                        updateFilters({ brand });
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs ${
                        currentBrand.toLowerCase() === brand.toLowerCase()
                          ? 'bg-brand-50 text-brand-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="mt-6 w-full py-2.5 rounded-lg bg-navy-950 text-white text-xs font-bold shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

