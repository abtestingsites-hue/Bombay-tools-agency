import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Package } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <SEOHead
        title="Page Not Found (404)"
        description="The requested page could not be located on the hardware store website."
      />
      <span className="text-4xl sm:text-6xl font-black text-brand-600 block mb-2">
        404
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mb-3">
        Page Not Found
      </h1>
      <p className="text-slate-600 text-sm mb-8 leading-relaxed">
        The page you are looking for may have been moved, renamed, or is temporarily unavailable.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-navy-950 text-white font-semibold text-xs sm:text-sm hover:bg-navy-900 transition-colors shadow-sm"
        >
          <Home className="w-4 h-4 mr-2" />
          Go to Homepage
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
        >
          <Package className="w-4 h-4 mr-2 text-brand-600" />
          Browse Products
        </Link>
      </div>
    </div>
  );
};
