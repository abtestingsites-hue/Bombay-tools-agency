import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { formatINR } from '@/config/business';
import { useLanguage } from '@/context/LanguageContext';
import { WhatsAppButton } from './WhatsAppButton';
import { buildProductEnquiryMessage } from '@/utils/whatsapp';
import { ArrowRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useLanguage();

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const productUrl = `${currentOrigin}/products/${product.slug}`;

  const whatsappMessage = buildProductEnquiryMessage({
    productName: product.name,
    productSlug: product.slug,
    brand: product.brand,
    size: product.size,
    unit: product.unit,
    productUrl,
  });

  const mainImage = product.image_urls[0] || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80';

  const renderStatus = () => {
    switch (product.availability_status) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t('in_stock')}
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {t('out_of_stock')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            {t('available_to_order')}
          </span>
        );
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
      {/* Product Image */}
      <Link to={`/products/${product.slug}`} className="relative aspect-[4/3] bg-slate-100 overflow-hidden block">
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="bg-navy-950/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded">
            {product.brand}
          </span>
          {product.category_name && (
            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded shadow-xs">
              {product.category_name}
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            {renderStatus()}
            {product.size && (
              <span className="text-xs text-slate-500 truncate" title={product.size}>
                {product.size}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors text-sm sm:text-base leading-snug line-clamp-2">
            <Link to={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          <p className="mt-1.5 text-xs text-slate-600 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wide block">Rate</span>
              <span className="text-sm sm:text-base font-bold text-slate-900">
                {product.is_price_visible && product.price
                  ? formatINR(product.price)
                  : t('contact_for_price')}
              </span>
            </div>
            {product.unit && (
              <span className="text-xs text-slate-500">
                per {product.unit}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <WhatsAppButton
              message={whatsappMessage}
              variant="compact"
              label="WhatsApp"
              className="w-full"
            />
            <Link
              to={`/products/${product.slug}`}
              className="inline-flex items-center justify-center text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>{t('view_details')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

