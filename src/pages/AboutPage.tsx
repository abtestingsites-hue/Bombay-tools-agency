import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Wrench,
  Truck,
  Users,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { useBusiness } from '@/context/BusinessContext';

export const AboutPage: React.FC = () => {
  const { settings } = useBusiness();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEOHead
        title={`About Us | ${settings.shop_name} - Tamil Nadu`}
        description={`Learn more about ${settings.shop_name}, a physical hardware and building materials store in Tamil Nadu supplying electrical, plumbing, tools, and construction materials.`}
      />

      <Breadcrumbs items={[{ label: 'About Us' }]} />

      {/* Hero */}
      <div className="mt-4 mb-12 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-1.5 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Wrench className="w-3.5 h-3.5" />
          <span>Tamil Nadu Hardware Merchant</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
          About {settings.shop_name}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Supplying authentic building materials, power tools, electricals, and plumbing supplies to homeowners, contractors, electricians, and plumbers across Tamil Nadu.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Genuine Brands Only</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We source all cables, pipes, and power tools through official manufacturer distribution channels. Zero counterfeit or uncertified goods.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Contractor & Trade Support</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            From single replacement items to complete project Bill of Quantities (BOQs), we offer reliable commercial quotations and order packing.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Store Pickup & Dispatch</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Inspect materials at our physical counter or schedule direct job-site vehicle delivery across our regional delivery area in Tamil Nadu.
          </p>
        </div>
      </div>

      {/* Story & Transparency */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12 mb-16">
        <div className="max-w-3xl space-y-6">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
            Our Business Model
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-950">
            Physical Counter With Modern Digital Enquiries
          </h2>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              Unlike impersonal e-commerce websites with arbitrary pricing and unknown sellers, {settings.shop_name} operates as a verified physical hardware store in Tamil Nadu.
            </p>
            <p>
              Hardware materials involve precise technical specifications—copper gauge, pipe pressure ratings, thread pitches, and pump head requirements. We leverage direct WhatsApp consultations and telephone enquiries to ensure you receive the exact technical specifications needed for your project.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-navy-950 text-white font-semibold text-xs sm:text-sm hover:bg-navy-900 transition-colors"
            >
              Explore Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
            >
              <MapPin className="w-4 h-4 mr-2 text-brand-600" />
              Visit Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
