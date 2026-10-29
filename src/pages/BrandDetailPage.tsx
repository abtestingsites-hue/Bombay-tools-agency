import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ProductCard } from '@/components/common/ProductCard';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { DataService } from '@/services/dataService';
import { Product } from '@/types';
import { ShieldCheck, PackageX } from 'lucide-react';

export const BrandDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [brandName, setBrandName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBrandProducts() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const decoded = decodeURIComponent(slug);
        const res = await DataService.getProducts({ brand: decoded, limit: 50 });
        setProducts(res.data);
        if (res.data[0]) {
          setBrandName(res.data[0].brand);
        } else {
          // Capitalize slug for display if no products found
          setBrandName(decoded.charAt(0).toUpperCase() + decoded.slice(1));
        }
      } catch (err) {
        console.error('Failed to load brand products', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBrandProducts();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEOHead
        title={`${brandName} Products & Supplies | Hardware Store`}
        description={`Explore genuine ${brandName} materials, tools, and equipment available in Tamil Nadu with fast quotation and site delivery options.`}
      />

      <Breadcrumbs
        items={[
          { label: 'Brands', path: '/brands' },
          { label: brandName },
        ]}
      />

      {/* Brand Hero */}
      <div className="mt-4 mb-8 bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-brand-600/30 text-brand-300 px-2.5 py-0.5 rounded text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Authorized Quality Brand</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {brandName}
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Genuine manufacturer-certified products, warranties, and specifications.
          </p>
        </div>

        <WhatsAppButton
          message={`Hello, I would like to enquire about ${brandName} products and bulk pricing.`}
          variant="primary"
          label={`WhatsApp ${brandName} Enquiry`}
          className="shrink-0"
        />
      </div>

      {/* Brand Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-navy-950">
            {brandName} Catalog ({products.length})
          </h2>
          <Link
            to={`/products?brand=${encodeURIComponent(brandName)}`}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Open in Filtered Catalog
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-slate-100 rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <PackageX className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No {brandName} products currently listed</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We stock additional {brandName} items offline. Contact our counter directly on WhatsApp for live inventory.
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
