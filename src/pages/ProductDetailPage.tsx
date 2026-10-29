import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Share2,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Box,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ProductCard } from '@/components/common/ProductCard';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { useLanguage } from '@/context/LanguageContext';
import { DataService } from '@/services/dataService';
import { Product } from '@/types';
import { formatINR } from '@/config/business';
import { buildProductEnquiryMessage } from '@/utils/whatsapp';
import { generateProductSchema } from '@/utils/seo';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const item = await DataService.getProductBySlug(slug);
        if (item) {
          setProduct(item);
          setSelectedImage(item.image_urls[0] || '');
          const related = await DataService.getRelatedProducts(item.id, item.category_id, 3);
          setRelatedProducts(related);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[4/3] bg-slate-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-slate-200 rounded" />
            <div className="h-4 w-1/2 bg-slate-200 rounded" />
            <div className="h-24 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h1>
        <p className="text-slate-600 mb-6">
          The requested product could not be located or may have been unlisted.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const productSchema = generateProductSchema(product);

  const whatsappMessage = buildProductEnquiryMessage({
    productName: product.name,
    productSlug: product.slug,
    brand: product.brand,
    size: product.size,
    unit: product.unit,
    productUrl: currentUrl,
  });

  const renderAvailabilityBadge = () => {
    switch (product.availability_status) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            {t('in_stock')}
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center text-xs font-semibold text-red-800 bg-red-100 px-3 py-1 rounded-full border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-red-600" />
            {t('out_of_stock')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            {t('available_to_order')}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEOHead
        title={`${product.name} | ${product.brand}`}
        description={product.description.slice(0, 160)}
        ogType="product"
        ogImage={product.image_urls[0]}
        structuredData={productSchema}
      />

      <Breadcrumbs
        items={[
          { label: 'Products', path: '/products' },
          ...(product.category_name && product.category_slug
            ? [{ label: product.category_name, path: `/products?category=${product.category_slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      {/* Main product showcase */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Product Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80'}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnail gallery if multiple images */}
          {product.image_urls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.image_urls.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-brand-600 ring-2 ring-brand-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Genuine brand guarantee */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center space-x-3 text-xs text-slate-700">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Authentic Manufacturer Spec:</strong> Sourced directly through genuine distributor supply lines for {product.brand}.
            </span>
          </div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center space-x-2">
                <Link
                  to={`/brands/${encodeURIComponent(product.brand.toLowerCase())}`}
                  className="bg-navy-950 text-white text-xs font-bold px-3 py-1 rounded-md hover:bg-brand-600 transition-colors"
                >
                  {product.brand}
                </Link>
                {product.category_name && (
                  <span className="text-xs text-slate-500 font-medium">
                    in {product.category_name}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-brand-600 transition-colors"
                title="Copy shareable link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 mr-1" />
                    {t('share_product')}
                  </>
                )}
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight leading-snug">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center space-x-3">
              {renderAvailabilityBadge()}
              {product.unit && (
                <span className="text-xs text-slate-500">
                  Unit: <strong>{product.unit}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Pricing card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
                  Commercial Pricing
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5 block">
                  {product.is_price_visible && product.price !== null
                    ? formatINR(product.price)
                    : t('contact_for_price')}
                </span>
              </div>
              {product.pack_details && (
                <span className="text-xs text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-xs">
                  {product.pack_details}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Bulk trade pricing, GST invoices, and contractor discounts are offered on request.
            </p>
          </div>

          {/* Quick Specifications preview */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {product.size && (
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-start space-x-2">
                <Layers className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Size / Dimension</span>
                  <span className="font-semibold text-slate-900">{product.size}</span>
                </div>
              </div>
            )}
            {product.pack_details && (
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-start space-x-2">
                <Box className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Packaging</span>
                  <span className="font-semibold text-slate-900">{product.pack_details}</span>
                </div>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <WhatsAppButton
              message={whatsappMessage}
              variant="primary"
              label={t('enquire_whatsapp')}
              className="w-full py-3.5 text-base shadow-md"
            />
            <Link
              to={`/bulk-orders?product=${encodeURIComponent(product.name)}`}
              className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold text-sm hover:bg-slate-50 shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 text-brand-600" />
              Add to Bulk Quotation Request
            </Link>
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Product Overview
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <section className="mt-14 pt-10 border-t border-slate-200">
          <h2 className="text-xl font-bold text-navy-950 mb-6">
            Technical Specifications
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <tbody className="divide-y divide-slate-100">
                {Object.entries(product.specifications).map(([key, val], index) => (
                  <tr key={key} className={index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="px-6 py-3.5 font-semibold text-slate-700 w-1/3 text-xs sm:text-sm">
                      {key}
                    </td>
                    <td className="px-6 py-3.5 text-slate-900 text-xs sm:text-sm">
                      {String(val)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-navy-950">
              {t('related_products')}
            </h2>
            <Link
              to={`/products?category=${product.category_slug}`}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center"
            >
              <span>View More in Category</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
