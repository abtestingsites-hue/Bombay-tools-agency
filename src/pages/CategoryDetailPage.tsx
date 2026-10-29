import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ProductCard } from '@/components/common/ProductCard';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { DataService } from '@/services/dataService';
import { Category, Product } from '@/types';
import { FileSpreadsheet, PackageX } from 'lucide-react';

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const cat = await DataService.getCategoryBySlug(slug);
        setCategory(cat);
        if (cat) {
          const res = await DataService.getProducts({ categorySlug: cat.slug, limit: 50 });
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to load category', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategoryData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
        <div className="h-8 w-64 bg-slate-200 rounded" />
        <div className="h-20 bg-slate-100 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Category Not Found</h1>
        <p className="text-slate-600 mb-6">The category you are looking for does not exist.</p>
        <Link
          to="/categories"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 text-white font-semibold text-sm"
        >
          View All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEOHead
        title={`${category.name} | Hardware & Building Materials`}
        description={category.description || `Browse certified ${category.name} available in Tamil Nadu.`}
      />

      <Breadcrumbs
        items={[
          { label: 'Categories', path: '/categories' },
          { label: category.name },
        ]}
      />

      {/* Category Hero Banner */}
      <div className="mt-4 mb-8 bg-navy-950 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-brand-400 text-xs font-bold uppercase tracking-wider">
            Material Category
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {category.description}
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <WhatsAppButton
              message={`Hello, I want to enquire about ${category.name} supplies.`}
              variant="primary"
              label={`WhatsApp ${category.name} Enquiry`}
            />
            <Link
              to={`/bulk-orders?category=${encodeURIComponent(category.name)}`}
              className="inline-flex items-center px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 text-brand-400" />
              Request Category Quotation
            </Link>
          </div>
        </div>
      </div>

      {/* Products in this category */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-navy-950">
            Available {category.name} ({products.length})
          </h2>
          <Link
            to={`/products?category=${category.slug}`}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Filter & Sort in Catalog
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <PackageX className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No products currently listed</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We stock many items offline that may not yet be published. Contact us on WhatsApp for availability.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

