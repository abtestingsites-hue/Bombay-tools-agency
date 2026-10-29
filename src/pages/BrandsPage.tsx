import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { DataService } from '@/services/dataService';
import { ShieldCheck, ArrowRight, Tag } from 'lucide-react';

export const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        const brandList = await DataService.getAllBrands();
        setBrands(brandList);
      } catch (err) {
        console.error('Failed to load brands', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBrands();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEOHead
        title="Authorized Brands & Manufacturers | Hardware Store"
        description="We stock certified genuine products from trusted hardware, electrical, and plumbing manufacturers including Bosch, Finolex, Ashirvad, Godrej, Havells, and Crompton."
      />

      <Breadcrumbs items={[{ label: 'Brands' }]} />

      <div className="mt-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Authorized & Stocked Brands
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Genuine products from India's leading industrial and consumer hardware manufacturers.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {brands.map((brandName) => (
            <Link
              key={brandName}
              to={`/brands/${encodeURIComponent(brandName.toLowerCase())}`}
              className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-brand-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-brand-50 text-slate-700 group-hover:text-brand-600 flex items-center justify-center shrink-0 transition-colors">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-base">
                    {brandName}
                  </h3>
                  <span className="text-[11px] text-slate-500 flex items-center mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500 mr-1" />
                    Genuine Spec
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-600 font-semibold">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
